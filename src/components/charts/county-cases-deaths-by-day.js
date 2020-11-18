import {LitElement, html, css} from 'lit-element';
import { chartColors, chartStyles } from './chart-styles';

export default class CountyCasesDeathsByDay extends LitElement {
  static get styles() {
    return [chartStyles, css`
      input {
        width: 100%;
      }
    `];
  }
  static get properties() {
    return {
      counties:{
        type: Array,
      },
      selectedCounty: {
        type: Object
      },
      minIndex: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.chart = null;
    this.county = [];
    this.selectedCounty = {};
    this.minIndex = 0;
  }

  onRangeChange(event) {
    this.minIndex = event.currentTarget.value;
  }

  drawChart(county = []) {
    const filtered = county.slice(this.minIndex);
    const labels = filtered.map(c => c.date);
    const datasets = [
      {
        label: 'deaths',
        borderColor: chartColors.get('danger'),
        fill: false,
        data: filtered.map((c, index, self) => {
          const value = index > 0 ? parseFloat(c.deaths) - parseFloat(self[index-1].deaths) : 0;
          return value > 0 ? value : 0;
        }),
      },
      {
        label: 'cases',
        borderColor: chartColors.get('warning'),
        fill: false,
        data: filtered.map((c, index, self) => {
          const value = index > 0 ? parseFloat(c.cases) - parseFloat(self[index-1].cases) : 0;
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
      });
      this.chart.update(0);
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
        <input type="range" min=0 max=${this.county.length} value=${this.minIndex} @input=${event => this.onRangeChange(event)}></input>
      </article>
      <footer>
      <p>data from <a href="https://github.com/nytimes/covid-19-data#county-level-data">The New York Times</a></p>
      </footer>
    `;
  }

}

customElements.define('county-cases-deaths-by-day', CountyCasesDeathsByDay);
