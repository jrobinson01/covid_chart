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
    const hospPerDay = stateData.map(s => s.hospitalizedCurrently);
    const labels = stateData.map(s => s.date);
    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label:'Deaths',
              data: deathsPerDay,
              backgroundColor: chartColors.get('danger'),
            },
            {
              label: 'Hopitalized',
              data: hospPerDay,
              backgroundColor: chartColors.get('warning'),
            }
          ]
        }
      });
    } else {
      this.chart.data = {
        labels,
        datasets: [
          {
            label: 'Deaths',
            data: deathsPerDay,
            backgroundColor: chartColors.get('danger'),
          },
          {
            label: 'Hospitalized',
            data: hospPerDay,
            backgroundColor: chartColors.get('warning'),
          }
        ]
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
