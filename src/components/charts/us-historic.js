import {LitElement, html, css} from 'lit-element';
import { chartColors, chartStyles } from './chart-styles';

export default class UsHistoric extends LitElement {
  static get styles() {
    return [chartStyles];
  }
  static get properties() {
    return {
      usHistoryData: {
        type: Array,
      }
    };
  }

  constructor() {
    super();
    this.chart = null;
    this.usHistoryData = [];
  }

  drawChart(usHistoryData = []) {
    const labels = usHistoryData.map(c => c.date).reverse();
    const datasets = [
      {
        label: 'deaths per day',
        backgroundColor: chartColors.get('danger'),
        data: usHistoryData.map(c => c.deathIncrease).reverse(),
      },
      {
        label: 'positive tests per day',
        backgroundColor: chartColors.get('warning'),
        data: usHistoryData.map(c => c.positiveIncrease).reverse(),
      }
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
    this.drawChart(this.usHistoryData);
    super.updated(changed);
  }

  get deathRate() {
    const last = this.usHistoryData[0];
    if (last) {
      return (100 / (parseFloat(last.positive) / parseFloat(last.death))).toFixed(2);
    }
    return 0;
  }

  render() {
    return html`
      <header>
        <h4>US Cases and deaths per day</h4>
      </header>
      <article>
        <p>death rate</p>
        ${this.deathRate}%
        <canvas></canvas>
      </article>
      <footer>
      <p>data from <a href="https://covidtracking.com/">covidtracking.com</a></p>
      </footer>
    `;
  }

}

customElements.define('us-historic', UsHistoric);
