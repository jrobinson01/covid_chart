import {LitElement, html, css} from 'lit-element';
import { chartColors, chartStyles } from './chart-styles';

export default class CountyCasesDeathsByDay extends LitElement {
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
        backgroundColor: chartColors.get('danger'),
        data: county.map((c, index, self) => {
          const value = index > 0 ? parseFloat(c.deaths) - parseFloat(self[index-1].deaths) : c.deaths;
          return value > 0 ? value : 0;
        }),
      },
      {
        label: 'cases',
        backgroundColor: chartColors.get('warning'),
        data: county.map((c, index, self) => {
          const value = index > 0 ? parseFloat(c.cases) - parseFloat(self[index-1].cases) : c.cases;
          return value > 0 ? value : 0;
        }),
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
        <h4>Cases and deaths (increase from previous day)</h4>
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

customElements.define('county-cases-deaths-by-day', CountyCasesDeathsByDay);
