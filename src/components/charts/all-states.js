import {LitElement, html, css} from 'lit-element';
import {chartStyles, chartColors} from './chart-styles.js';
import {stateFromAbb} from '../../lib/state-abbs.js';

export default class AllStates extends LitElement {
  static get styles() {
    return [chartStyles, css`
      article {
        height: 1200px;
      }
    `];
  }

  static get properties() {
    return {
      statesData: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.chart = null;
    /** @type {Array<import('../../lib/data-service').USState>} */
    this.statesData = [];
  }

  drawChart( states = []) {
    if (states.length === 0) {
      return;
    }
    // find each states latest data.
    // states is already sorted by date, so include the first
    // item found for each state
    // then display sorted by deaths (greater first)
    const perState = states.reduce((acc, v) => {
      if (acc.find(a => a.state === v.state)) {
        return acc;
      }
      acc.push(v);
      return acc;
    }, [])
    .sort((a,b) => parseFloat(b.death) - parseFloat(a.death));
    const labels = perState.map(s => stateFromAbb(s.state));
    const cases = perState.map(s => s.hospitalizedCumulative);
    const deaths = perState.map(s => s.death);
    const tests =  perState.map(s => s.totalTestResults);
    const recovered = perState.map(s => s.recovered);
    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'horizontalBar',
        options: {
          legend: {
            display: true,
          },
          maintainAspectRatio: false,
        },
        data : {
          labels,
          datasets: [
          {
            label:'hospitalized',
            backgroundColor: chartColors.get('warning'),
            data: cases,
          },
          {
            label:'deaths',
            backgroundColor: chartColors.get('danger'),
            data: deaths,
          },
          {
            label:'tests',
            backgroundColor: chartColors.get('neutral'),
            data: tests,
          },
          {
            label:'recovered',
            backgroundColor: chartColors.get('positive'),
            data: recovered,
          },
        ],
        }
      });
    } else {
      this.chart.data = {
        labels,
        datasets: [
        {
          label: 'hospitalized',
          backgroundColor: chartColors.get('warning'),
          data: cases,
        },
        {
          label: 'deaths',
          backgroundColor: chartColors.get('danger'),
          data: deaths,
        },
        {
          label:'tests',
          backgroundColor: chartColors.get('neutral'),
          data: tests,
        },
        {
          label:'recovered',
          backgroundColor: chartColors.get('positive'),
          data: recovered,
        },
      ],
      };
      this.chart.update();
    }
  }

  updated(changedProps) {
    this.drawChart(this.statesData);
    super.updated(changedProps);
  }

  render() {
    return html`
      <header>
        <h4>By state</h4>
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

customElements.define('all-states', AllStates);
