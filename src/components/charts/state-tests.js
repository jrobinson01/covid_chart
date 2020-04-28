import {LitElement, html} from 'lit-element';
import {chartStyles, chartColors} from './chart-styles.js';
import {format} from 'date-fns';

export default class StateTests extends LitElement {

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
      statePopData: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.chart = null;
    this.stateData = {};
    this.selectedState = null;
    this.statePopData = {};
  }

  drawChart(stateData, statePopData) {
    if (!stateData || !statePopData) {
      return;
    }
    const totalPopulation = parseFloat(statePopData.POPESTIMATE2019);
    const positive = parseFloat(stateData.positive);
    const negative = parseFloat(stateData.negative);
    const untested = totalPopulation - parseFloat(stateData.totalTestResults);
    const labels = [`Untested`, `Positive`, `Negative`];
    const values = [untested, positive, negative];
    const colors = [chartColors.get('neutral'), chartColors.get('danger'), chartColors.get('positive')];

    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
            }
          ]
        }
      })
    } else {
      this.chart.data = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
          }
        ]
      }
      this.chart.update();
    }
  }

  updated(changed) {
    this.drawChart(this.stateData, this.statePopData);
    super.updated(changed);
  }

  render() {
    return html`
      <header>
        <h4>Tests as of ${this.stateData.dateChecked ? format(new Date(this.stateData.dateChecked), 'PPpp') : ''}</h4>
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

customElements.define('state-tests', StateTests);
