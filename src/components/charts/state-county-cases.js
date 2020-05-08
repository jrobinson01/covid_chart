import {LitElement, html, css} from 'lit-element';
import {chartStyles, chartColors} from './chart-styles.js';

function getRandomColor() {
  const letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default class StateCountyCases extends LitElement {
  static get styles() {
    return [chartStyles, css`
      article {
        height: 800px;
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
    // TODO: use a horizontal bar chart
    // take last 2 weeks worth of data per county
    // use total increase over two weeks
    // sort by highest increase
    // ...
    if (counties.length === 0 || !selectedState) {
      return;
    }
    const data = counties.filter(c => c.state === selectedState.name);
    const datasets = data.reduce((acc, v) => {
      const existingCounty = acc.find(a => a.county === v.county);
      if (!existingCounty) {
        acc.push({
          county: v.county,
          data: [v.cases],
        })
      } else {
        existingCounty.data.push(v.cases)
      }
      return acc;
    }, []).map(d => {
      // take only last 14 days
      const days = d.data.slice(d.data.length-14);// TODO: make this configurable with a dropdown - 4 weeks, 2 weeks, 1 week, 3 days, 1 day
      const dif = parseFloat(days[days.length-1]) - parseFloat(days[0]);
      d.data = [dif];
      return d;
    }).filter(d => d.data[0] > 0)// remove counties with 0 increase
    .sort((a,b) => {// sort by highest increase first
      return b.data[0] - a.data[0];
    });
    // build labels
    const labels = datasets.map(d => d.county);
    const cases = datasets.map(d => d.data[0]);
    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'horizontalBar',
        options: {
          maintainAspectRatio: false,
          legend: {
            display: true,
          },
        },
        data : {
          labels,
          datasets: [
            {
              label: 'Increase in cases (14 days)',
              data: cases,
              backgroundColor: chartColors.get('warning')
            }
          ],
        }
      });
    } else {
      this.chart.data = {
        labels,
        datasets: [
          {
            label: 'cases',
            data: cases,
            backgroundColor: chartColors.get('warning')
          }
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
        <h4>Case increase per county over last two weeks</h4>
        <p>* counties with 0 reported cases ommitted</p>
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

customElements.define('state-county-cases', StateCountyCases);
