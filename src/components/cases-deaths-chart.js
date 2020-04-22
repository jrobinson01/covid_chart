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
    console.log('drawChart', counties, selectedState, selectedCounty);
    if (!counties) {
      return;
    }
    let datasets = [];
    let labels = [];
    // if(this.chart) {
    //   this.chart.destroy();
    // }
    if (selectedState && !selectedCounty) {
      // TODO: use statesData instead...
      // console.log('drawing state', selectedState, counties);
      // filtered = counties.filter(c => c.state === selectedState).reduce((acc, val) => {
      //   const previous = acc[acc.length-1];
      //   if (!previous) {
      //     // first
      //     acc.push(Object.assign({}, val));
      //     return acc;
      //   } else {
      //     if (previous.date === val.date) {
      //       // same date, add county's cases and deaths
      //       previous.cases = parseInt(previous.cases) + parseInt(val.cases);
      //       previous.deaths = parseInt(previous.deaths) + parseInt(val.deaths);
      //     } else {
      //       acc.push(Object.assign({}, val));
      //     }
      //     return acc;
      //   }
      // }, []);
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
    const context = this.shadowRoot.querySelector('canvas').getContext('2d');
    console.log('canvas context', context);

    console.log('datasets', datasets);
    if (!this.chart) {
      this.chart = new Chart(context, {
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

  render() {
    return html`<canvas id="cd-chart"></canvas>`;
  }

}

customElements.define('cases-deaths-chart', CasesDeathsChart);
