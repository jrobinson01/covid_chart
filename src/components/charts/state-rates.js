import {LitElement, html, css} from 'lit-element';
import {chartStyles, chartColors} from './chart-styles.js';
import {sma} from '../../lib/chart-helpers.js';


export default class StateRates extends LitElement {
  static get styles() {
    return [chartStyles, css`
      #chart-range {
        width: 100%;
      }
    `];
  }
  static get properties() {
    return {
      selectedState: {
        type: Object,
      },
      stateData: {
        type: Object,
      },
      minIndex: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.chart = null;
    this.selectedState = {};
    this.stateData = [];
    this.minIndex = 0;
    this.deathRateLag = 14;
  }

  // TODO: use  positive tests percentage of total?
  drawChart(selectedState, stateData) {
    if (!selectedState || !stateData) {
      return;
    }
    const filtered = stateData.slice(this.minIndex);
    const labels = filtered.map(s => s.date);

    const deathSMA = sma(filtered.map((s, index) => {
      const past = stateData[this.minIndex + index - this.deathRateLag];
      if (past) {
        const p = 100/(past.positiveIncrease/s.deathIncrease);
        return p > 0 && !isNaN(p) ? p : 0;
      }
      return 0;
    }), 7);
    const ppSMA = sma(filtered.map(s => {
      const p = 100/(s.totalTestResultsIncrease/s.positiveIncrease);
      return p > 0 && !isNaN(p) ? p : 0;
    }), 7);

    const datasets = [
      {
        label: 'death rate',
        data: deathSMA,
        borderColor: chartColors.get('danger'),
        fill: false,
        spanGaps: true,
      },
      {
        label: 'positive percentage',
        data: ppSMA,
        borderColor: chartColors.get('neutral2'),
        fill: false,
        spanGaps: true,
      },
    ]

    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'line',
        data: {
          labels,
          datasets
        }
      });
    } else {
      this.chart.data.labels = labels;
      this.chart.data.datasets.forEach(d => {
        const newData = datasets.find(ds => ds.label === d.label);
        if (newData) {
          d.data = newData.data;
        }
      })
      this.chart.update(0);
    }
  }

  updated() {
    this.drawChart(this.selectedState, this.stateData);
  }

  onRangeChange(event) {
    this.minIndex = Number(event.currentTarget.value);
  }

  render() {
    return html`
      <header>
        <h4>Daily death rate and positivity rate (7 day moving average)</h4>
        <p> * death rates typically lag behind positive cases. The rate calculated here is done by comparing the current day's deaths, to the positive test count from the day 2 weeks prior.</p>
      </header>
      <article>
        <canvas></canvas>
        <input id="chart-range" type="range" min=0 max=${this.stateData.length} value=${this.minIndex} @input=${event => this.onRangeChange(event)}></input>
      </article>
      <footer>
        <p>data from <a href="https://covidtracking.com/api#states-historical-data">covidtracking.com</a></p>
      </footer>
    `;
  }
}

customElements.define('state-rates', StateRates);
