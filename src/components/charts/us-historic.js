import {LitElement, html, css} from 'lit-element';
import { chartColors, chartStyles } from './chart-styles';

export default class UsHistoric extends LitElement {
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
  }

  drawChart(usHistoryData = []) {
    const filtered = usHistoryData.slice().reverse().slice(this.minIndex);
    const labels = filtered.map(c => {
      const day = c.date.substring(6);
      const month = c.date.substring(4,6);
      const year = c.date.substring(0,4);
      const date = new Date(`${month}-${day}-${year}`);
      return date.toLocaleDateString();
    });
    const datasets = [
      {
        label: 'deaths per day',
        borderColor: chartColors.get('danger'),
        fill: false,
        data: filtered.map(c => c.deathIncrease),
        pointRadius: 0,
      },
      {
        label: 'positive tests per day',
        borderColor: chartColors.get('neutral'),
        fill: false,
        data: filtered.map(c => c.positiveIncrease),
        pointRadius: 0,
      },
      {
        label: 'hospitalized per day',
        borderColor: chartColors.get('warning'),
        fill: false,
        data: filtered.map(c => c.hospitalizedIncrease),
        pointRadius: 0,
      },
      {
        label: 'total tests per day',
        borderColor: chartColors.get('positive'),
        fill: false,
        data: filtered.map(c => c.totalTestResultsIncrease),
        pointRadius: 0,
      },
      {
        label: 'positive percent per day',
        borderColor: chartColors.get('neutral2'),
        fill: false,
        data: filtered.map(c => 100/(c.totalTestResultsIncrease/c.positiveIncrease)),
        pointRadius: 0,
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

  get deathRate() {
    const last = this.usHistoryData[0];
    if (last) {
      return (100 / (parseFloat(last.positive) / parseFloat(last.death))).toFixed(2);
    }
    return 0;
  }

  onSliderChange(event) {
    this.minIndex = event.currentTarget.value;
  }

  render() {
    return html`
      <header>
        <h4>US Cases and deaths per day</h4>
      </header>
      <article>
        case fatality rate: <strong>${this.deathRate}%</strong>
        <canvas></canvas>
        <input type="range" min="0" max=${this.usHistoryData.length} value=${this.minIndex} @input=${event => this.onSliderChange(event)}></input>
      </article>
      <footer>
      <p>data from <a href="https://covidtracking.com/">covidtracking.com</a></p>
      </footer>
    `;
  }

}

customElements.define('us-historic', UsHistoric);
