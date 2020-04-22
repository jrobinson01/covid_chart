import {LitElement, html, css} from 'lit-element';

export default class CasesDeathsChart extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;

      }
    `;
  }
  static get properties() {
    return {
      counties: {
        type: Array,
      },
      selectedState: {
        type: String,
      },
      selectedCounty: {
        type: String
      }
    }
  }

  constructor() {
    super();
    this.chart = null;
  }

  drawChart(counties, selectedState, selectedCounty) {
    console.log('drawChart', counties, selectedState, selectedCounty);
    if (!counties) {
      return;
    }
    let filtered = [];
    if(this.chart) {
      this.chart.destroy();
    }
    if (selectedState && !selectedCounty) {
      filtered == counties.reduce((acc, val, index) => {
        const previous = acc[acc.length-1];
        if (!previous) {
          // first
          acc.push(Object.assign({}, val));
          return acc;
        } else {
          if (previous.date === val.date) {
            // same date, add countie's cases and deaths
            previous.cases = parseInt(previous.cases) + parseInt(val.cases);
            previous.deaths = parseInt(previous.deaths) + parseInt(val.deaths);
          } else {
            acc.push(Object.assign({}, val));
          }
          return acc;
        }
      }, []);
    } else if (selectedState && selectedCounty) {
      filtered = counties.filter(r => r.state === selectedState && r.county === selectedCounty);
    }
    const context = this.shadowRoot.querySelector('canvas').getContext('2d');
    console.log('canvas context', context);
    const datasets = [
      {
        label: 'potential cases', // assuming every case infected 3 other people?
        borderColor: '#0000FF',
        data: filtered.map(f => parseInt(f.cases) * 3)
      },
      {
        label: 'cases',
        borderColor: '#CCCCCC',
        data: filtered.map(f => f.cases)
      },
      {
        label: 'deaths',
        borderColor: '#FF0000',
        data: filtered.map(f => f.deaths)
      },
    ];
    this.chart = new Chart(context, {
      type: 'line',
      data: {
        labels: filtered.map(f => f.date),
        datasets
      }
    });
  }

  updated() {
    this.drawChart(this.counties, this.selectedState, this.selectedCounty);
    super.updated();
  }

  render() {
    return html`<canvas id="cd-chart"></canvas>`;
  }

}

customElements.define('cases-deaths-chart', CasesDeathsChart);
