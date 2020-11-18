import {LitElement, html, css} from 'lit-element';
import { chartColors, chartStyles } from './chart-styles';

export default class CountyCasesDeaths extends LitElement {
  static get styles() {
    return [chartStyles];
  }
  static get properties() {
    return {
      counties:{
        type: Array,
      },
      selectedCounty: {
        type: Object
      },
    };
  }

  constructor() {
    super();
    this.chart = null;
    this.county = [];
    this.selectedCounty = {};
  }

  drawChart(county = []) {
    const labels = county.map(c => c.date);
    const datasets = [
      {
        label: 'deaths',
        borderColor: chartColors.get('danger'),
        fill: false,
        data: county.map(c => c.deaths),
      },
      {
        label: 'cases',
        borderColor: chartColors.get('warning'),
        fill: false,
        data: county.map(c => c.cases),
      },
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
      this.chart.data = {
        labels,
        datasets
      };
      this.chart.update();
    }
  }

  updated(changed) {
    this.drawChart(this.county);
    super.updated(changed);
  }

  render() {
    return html`
      <header>
        <h4>Cases and deaths (cumulative)</h4>
      </header>
      <article>
        <canvas></canvas>
      </article>
      <footer>
      <p>data from <a href="https://github.com/nytimes/covid-19-data#county-level-data">The New York Times</a></p>
      </footer>
    `;
  }

}

customElements.define('county-cases-deaths', CountyCasesDeaths);
