import {LitElement, html, css} from 'lit-element';
import { chartColors, chartStyles } from './chart-styles';
import {sma} from '../../lib/chart-helpers.js';

export default class UsRates extends LitElement {
  static get styles() {
    return [chartStyles, css`
      input {
        width: 100%;
      }
    `];
  }
  static get properties() {
    return {
      usHistoryData: {
        type: Array,
      },
      minIndex: {
        type: Number,
      }
    };
  }

  constructor() {
    super();
    this.chart = null;
    this.usHistoryData = [];
    this.minIndex = 0;
    this.deathRateLag = 14;
  }

  drawChart(usHistoryData = []) {
    const usData = usHistoryData.slice().reverse();
    const filtered = usData.slice(this.minIndex);
    const labels = filtered.map(c => {
      const day = c.date.substring(6);
      const month = c.date.substring(4,6);
      const year = c.date.substring(0,4);
      const date = new Date(`${month}-${day}-${year}`);
      return date.toLocaleDateString();
    });
    const datasets = [
      {
        label: '* death rate per day',
        borderColor: chartColors.get('danger'),
        fill: false,
        data: sma(filtered.map((c, index) => {
          const past = usData[this.minIndex + index - this.deathRateLag];
          if (past) {
            const p = 100 / (past.positiveIncrease/c.deathIncrease);
            return p > 0 ? p : 0;
          }
          return 0;
        }), 7),
        pointRadius: 0,
        spanGaps: true,
      },
      {
        label: 'positive percent per day',
        borderColor: chartColors.get('neutral2'),
        fill: false,
        data: sma(filtered.map(c => 100/(c.totalTestResultsIncrease/c.positiveIncrease)), 7),
        pointRadius: 0,
        spanGaps: true,
      }
    ];
    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'line',
        data: {
          labels,
          datasets
        }
      })
    } else {
      // have to manually update datasets so that filters aren't reset
      this.chart.data.datasets.forEach(d => {
        const newData = datasets.find(nd => nd.label === d.label);
        if (newData) {
          d.data = newData.data;
        }
      });
      this.chart.data.labels = labels;
      this.chart.update(0);
    }
  }

  updated(changed) {
    this.drawChart(this.usHistoryData);
    super.updated(changed);
  }

  onSliderChange(event) {
    this.minIndex = Number(event.currentTarget.value);
  }

  render() {
    return html`
      <header>
        <h4>US positivity and * death rates per day (7 day moving average)</h4>
        <p> * death rates typically lag behind positive cases. The rate calculated here is done by comparing the current day's deaths, to the positive test count from the day 2 weeks prior. This is not guaranteed to be accurate.</p>
      </header>
      <article>
        <canvas></canvas>
        <input type="range" min="0" max=${this.usHistoryData.length} value=${this.minIndex} @input=${event => this.onSliderChange(event)}></input>
      </article>
      <footer>
      <p>data from <a href="https://covidtracking.com/">covidtracking.com</a></p>
      </footer>
    `;
  }

}

customElements.define('us-rates', UsRates);
