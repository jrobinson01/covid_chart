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
        type: Object,
      },
      selectedCounty: {
        type: String
      },
      statesData: {
        type: Array,
      }
    }
  }

  constructor() {
    super();
    this.chart = null;
  }

  drawChart(counties, statesData, selectedState, selectedCounty) {
    if (!counties) {
      return;
    }
    let datasets = [];
    let labels = [];

    if (selectedState && !selectedCounty) {
      // draw chart for selectedState
      const filtered = statesData.filter(r => r.state === selectedState.abbreviation).reverse();
      datasets = [
        {
          label: 'recovered',
          borderColor: '#00FF00',
          backgroundColor: '#00FF00',
          data: filtered.map(f => f.recovered)
        },
        {
          label: 'deaths',
          borderColor: '#FF0000',
          backgroundColor: '#FF0000',
          data: filtered.map(f => f.death)
        },
        {
          label: 'currently hospitalized',
          borderColor: '#0000FF',
          backgroundColor: '#0000FF',
          data: filtered.map(f => f.hospitalizedCurrently)
        },
        {
          label: 'positive tests',
          borderColor: '#f7b577',
          backgroundColor: '#f7b577',
          data: filtered.map(f => f.positive)
        },
        {
          label: 'negative tests',
          borderColor: '#c6f777',
          backgroundColor: '#c6f777',
          data: filtered.map(f => f.negative)
        },
        {
          label: 'curently in ICU',
          borderColor: '#d9453b',
          // backgroundColor: '#d9453b',
          data: filtered.map(f => f.inIcuCurrently)
        },
        {
          label: 'curently on Ventilator',
          borderColor: '#bc3bd9',
          // backgroundColor: '#bc3bd9',
          data: filtered.map(f => f.onVentilatorCurrently)
        },


      ];
      labels = filtered.map(f => f.date);
    } else if (selectedState && selectedCounty) {
      // draw chart for selected county
      const filtered = counties.filter(r => r.state === selectedState.name && r.county === selectedCounty);
      datasets = [
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
      labels = filtered.map(f => f.date);
    }
    if (!this.chart) {
      this.chart = new Chart(this.shadowRoot.querySelector('canvas').getContext('2d'), {
        type: 'line',
        data: {
          labels,
          datasets
        }
      });
    } else {
      this.chart.data = {labels, datasets};
      this.chart.update();
    }
  }

  updated() {
    this.drawChart(this.counties, this.statesData, this.selectedState, this.selectedCounty);
    super.updated();
  }

  renderHeader(selectedState, selectedCounty) {
    if (selectedState && selectedCounty) {
      return html`
        <h3>${selectedState.name} : ${selectedCounty}</h3>
        <p>using data from <a href="https://github.com/nytimes/covid-19-data#county-level-data">NY Times</a></p>`;
    } else if (selectedState && !selectedCounty) {
      return html`
        <h3>${selectedState.name}</h3>
        <p>using data from <a href="https://covidtracking.com/api#states-historical-data">covidtracking.com</a></p>`;
    }
  }

  render() {
    return html`
      ${this.renderHeader(this.selectedState, this.selectedCounty)}
      <canvas id="cd-chart"></canvas>
    `;
  }

}

customElements.define('cases-deaths-chart', CasesDeathsChart);
