import {LitElement, html, css} from 'lit-element';
import {chartStyles, chartColors} from './chart-styles.js';

export default class StatePerDay extends LitElement {
  static get styles() {
    return [chartStyles, css`
      input {
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
      }
    };
  }

  constructor() {
    super();
    this.chart = null;
    this.selectedState = {};
    this.stateData = {};
    this.minIndex = 0;
  }

  // TODO: use  positive tests percentage of total?
  drawChart(selectedState, stateData) {
    if (!selectedState || !stateData) {
      return;
    }
    const filtered = stateData.slice(this.minIndex);
    const deathsPerDay = filtered.map(s => s.deathIncrease > 0 ? s.deathIncrease : 0);
    const positiveTestsPerDay = filtered.map(s => s.positiveIncrease > 0 ? s.positiveIncrease : 0);
    const hospitalized = filtered.map(s => s.hospitalizedIncrease > 0 ? s.hospitalizedIncrease : 0);
    const labels = filtered.map(s => s.date);
    const totalTestsPerDay = filtered.map(s => s.totalTestResultsIncrease > 0 ? s.totalTestResultsIncrease : 0);
    const positivePercent = filtered.map(s => {
      const p = 100/(s.totalTestResultsIncrease/s.positiveIncrease);
      return p > 0 ? p : 0;
    });
    const datasets = [
      {
        label:'Deaths per day',
        data: deathsPerDay,
        borderColor: chartColors.get('danger'),
        fill: false,
      },
      {
        label: 'Positive tests per day',
        data: positiveTestsPerDay,
        borderColor: chartColors.get('neutral'),
        fill: false,
      },
      {
        label: 'hospitalized per day',
        data: hospitalized,
        borderColor: chartColors.get('warning'),
        fill: false,
      },
      {
        label: 'total tests per day',
        data: totalTestsPerDay,
        borderColor: chartColors.get('positive'),
        fill: false,
      },
      {
        label: 'positive percentage',
        data: positivePercent,
        borderColor: chartColors.get('neutral2'),
        fill: false,
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
      // this.chart.data = {
      //   labels,
      //   datasets
      // };
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
    this.minIndex = event.currentTarget.value;
  }

  render() {
    return html`
      <header>
        <h4>Daily cases & deaths</h4>
      </header>
      <article>
        <canvas></canvas>
        <input type="range" min=0 max=${this.stateData.length} value=${this.minIndex} @input=${event => this.onRangeChange(event)}></input>
      </article>
      <footer>
        <p>data from <a href="https://covidtracking.com/api#states-historical-data">covidtracking.com</a></p>
      </footer>
    `;
  }
}

customElements.define('state-per-day', StatePerDay);
