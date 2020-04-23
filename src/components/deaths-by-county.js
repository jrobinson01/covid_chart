import {LitElement, html, css} from 'lit-element';

function getRandomColor() {
  const letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default class DeathsByCounty extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
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
    this.selectedState = {};
  }

  drawChart(selectedState, counties = []) {
    if (counties.length === 0 || !selectedState) {
      return;
    }
    const currentDate = counties[counties.length-1].date;
    const data = counties.filter(c => c.state === selectedState.name && c.date === currentDate);
    const labels = data.map(c => c.county);
    const values = data.map(c => c.deaths);
    const colors = data.map(c => getRandomColor());
    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'bar',
        options: {
          legend: {
            display: false,
          },
        },
        data : {
          labels,
          datasets: [{
            backgroundColor: '#CC0000',
            data: values,
          }],
        }
      });
    } else {
      this.chart.data = {
        labels,
        datasets: [{
          backgroundColor: '#CC0000',
          data: values,
        }],
      };
      this.chart.update();
    }

  }


  updated() {
    this.drawChart(this.selectedState, this.countiesData);
    super.updated();
  }


  render() {
    return html`
      <h3>Current Total Deaths by County for ${this.selectedState ? this.selectedState.name: ''}</h3>
      <canvas></canvas>
    `;
  }

}

customElements.define('deaths-by-county', DeathsByCounty);
