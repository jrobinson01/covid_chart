import {LitElement, html, css} from 'lit-element';
import {chartStyles, chartColors} from './chart-styles.js';
// unused
// function getRandomColor() {
//   const letters = '0123456789ABCDEF'.split('');
//   let color = '#';
//   for (let i = 0; i < 6; i++ ) {
//       color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

export default class DeathsByCounty extends LitElement {
  static get styles() {
    return [chartStyles, css`
      article {
        height: 1200px;
      }
    `];
  }

  static get properties() {
    return {
      selectedState: {
        type: Object,
      },
      countiesData: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.chart = null;
    /** @type {import('../../covid-charts-app').SelectedState} */
    this.selectedState = {};
    /** @type {Array<import('../../lib/data-service').County>} */
    this.countiesData = [];
  }

  /**
   * @description draw/redraw the chart
   * @param {import('../../covid-charts-app').SelectedState} selectedState
   * @param {Array<import('../../lib/data-service').County>} counties
   */
  drawChart(selectedState, counties = []) {
    if (counties.length === 0 || !selectedState) {
      return;
    }
    const currentDate = counties[counties.length-1].date;
    const data = counties.filter(c =>
      c.state === selectedState.name && c.date === currentDate && parseFloat(c.cases) > 0);
    const labels = data.map(c => c.county);
    const deaths = data.map(c => c.deaths);
    const cases = data.map(c => c.cases);
    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'horizontalBar',
        options: {
          legend: {
            display: true,
          },
          maintainAspectRatio: false
        },
        data : {
          labels,
          datasets: [
          {
            label:'cases',
            backgroundColor: chartColors.get('warning'),
            data: cases,
          },
          {
            label:'deaths',
            backgroundColor: chartColors.get('danger'),
            data: deaths,
          },
        ],
        }
      });
    } else {
      this.chart.data = {
        labels,
        datasets: [
        {
          label: 'cases',
          backgroundColor: chartColors.get('warning'),
          data: cases,
        },
        {
          label: 'deaths',
          backgroundColor: chartColors.get('danger'),
          data: deaths,
        },
      ],
      };
      this.chart.update();
    }
  }

  updated(changed) {
    this.drawChart(this.selectedState, this.countiesData);
    super.updated(changed);
  }

  render() {
    return html`
      <header>
        <h4>By county</h4>
      </header>
      <article>
        <canvas></canvas>
      </article>
      <footer>
        <p>* counties with 0 reported cases ommitted</p>
        <p>data from <a href="https://github.com/nytimes/covid-19-data#county-level-data">The New York Times</a></p>
      </footer>
    `;
  }

}

customElements.define('deaths-by-county', DeathsByCounty);
