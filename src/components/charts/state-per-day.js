import {LitElement, html} from 'lit-element';
import {chartStyles, chartColors} from './chart-styles.js';

export default class StatePerDay extends LitElement {
  static get styles() {
    return chartStyles;
  }
  static get properties() {
    return {
      selectedState: {
        type: Object,
      },
      stateData: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.chart = null;
    this.selectedState = {};
    this.stateData = {};
  }

  drawChart(selectedState, stateData) {
    if (!selectedState || !stateData) {
      return;
    }
    const deathsPerDay = stateData.map(s => s.deathIncrease);
    const positiveTestsPerDay = stateData.map(s => s.positiveIncrease);
    const labels = stateData.map(s => s.date);
    const datasets = [
      {
        label:'Deaths per day',
        data: deathsPerDay,
        borderColor: chartColors.get('danger'),
      },
      {
        label: 'Positive tests per day',
        data: positiveTestsPerDay,
        borderColor: chartColors.get('warning'),
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
      this.chart.data = {
        labels,
        datasets
      };
      this.chart.update();
    }
  }

  updated() {
    this.drawChart(this.selectedState, this.stateData);
  }

  render() {
    return html`
      <header>
        <h4>Daily cases & deaths</h4>
      </header>
      <article>
        <canvas></canvas>
      </article>
      <footer>
        <p>data from <a href="https://covidtracking.com/api#states-historical-data">covidtracking.com</a></p>
      </footer>
    `;
  }
}

customElements.define('state-per-day', StatePerDay);
