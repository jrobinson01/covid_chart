import {LitElement, html, css} from 'lit-element';
import {router} from 'lit-element-router';
import {machine, state} from 'fn-machine';
import './components/state-select.js';
import './components/global-view.js';
import './components/app-views.js';
import './components/state-view.js';
import './components/app-link.js';
import {loadCsvData} from './lib/data-service.js';

import {ABBREVIATIONS, stateFromAbb} from './lib/state-abbs.js';

/**
 * @typedef {Object} SelectedState
 * @property {string=} name
 * @property {string=} abbreviation
 */

 /**
  * @typedef {Object} Context
  * @property {SelectedState} selectedState
  * @property {Array<import('./lib/data-service').Population>} pops
  * @property {Array<import('./lib/data-service').County>} counties
  * @property {string} selectedCounty
  * @property {Array<string>} states
  * @property {Array<import('./lib/data-service').USState>} statesData
  * @property {Object<string, Object>} stateCounties
  */

const STATES = {
  INITIAL: 'initial',
  LOADING_CSVS: 'loading-csvs',
  READY: 'ready',
  STATE_SELECTED:'state-selected',
  COUNTY_SELECTED: 'county-selected',
};

// shared transitions
function selectState(detail, context) {
  return {
    state: STATES.STATE_SELECTED,
    context: {...context, ...{selectedState: {name: detail.state, abbreviation: ABBREVIATIONS[detail.state]}, selectedCounty: null}}
  }
}

function selectCounty(detail, context) {
  return {
    state: STATES.COUNTY_SELECTED,
    context: {...context, ...{selectedCounty: detail.county}}
  };
}

export default class CovidChartsApp extends router(LitElement) {

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 1fr 3fr;
        grid-template-areas:
        "header header"
        "sidebar content"
        "footer footer"
      }
      header {
        grid-area: header;
        padding: 12px;
        background-color: #666666;
        color: #FFFFFF;
      }

      .sidebar {
        height: 100vh;
        overflow-y: scroll;
        grid-area: sidebar;
      }

      article {
        grid-area: content;
      }

      footer {
        padding: 12px;
        background-color: #666666;
        color: #FFFFFF;
        grid-area: footer;
        display: block;
      }
    `;
  }

  static get properties() {
    return {
      currentState:{
        type: String,
      },
      context: {
        type: Object
      },
      route: {
        type: String,
      },
      params: {
        type: Object,
      },
      query: {
        type: Object,
      },
    }
  }

  static get routes() {
    return [
      {
        name: 'home',
        pattern: '',
      },
      {
        name:'state',
        pattern: 'state/:abb',
      },
      {
        name:'county',
        pattern: 'state/:abb/county/:fips'
      }
    ]
  }

  constructor() {
    super();
    this.route = '';
    this.params = {};
    this.query = {};
    /** @type {!Context} */
    this.context = {
      counties: [],
      pops: [],
      selectedCounty: null,
      selectedState: null,
      stateCounties: {},
      states: [],
      statesData: []
    };
    // set Chart defaults
    Chart.defaults.global.defaultFontFamily = 'Roboto, Arial, sans-serif';
    this.initMachine();
    const currentState = this.appMachine('load');
    this.currentState = currentState.state;
    this.context = currentState.context;
  }

  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    if (this.route === 'state') {
      // select state name via abbreviation
      const abb = this.params.abb;
      const state = stateFromAbb(abb);
      this.appMachine('selectState', {state});
    } else if (this.route === 'county') {
      // select county via fips
      const fips = this.params.fips;
      const county = (this.context.counties || []).find(c => c.fips === fips);
      this.appMachine('selectCounty', {county});
    }
  }

  initMachine() {
    this.appMachine = machine([
      state(STATES.INITIAL, {
        load() {
          return {
            state: STATES.LOADING_CSVS,
            context: {}
          }
        }
      }),
      state(STATES.LOADING_CSVS, {
        loaded(detail, context) {
          return {
            state: STATES.READY,
            context: {...detail, ...context}
          }
        }
      }, () => {
        this.loadData();
      }),
      state(STATES.READY, {
        selectState
      }, () => {
        // check route and params for state
        if (this.route === 'state' || this.route === 'county') {
          const abb = this.params.abb;
          const state = stateFromAbb(abb);
          this.appMachine('selectState', {state});
        }
      }),
      state(STATES.STATE_SELECTED, {
        selectState,
        selectCounty,
      }, () => {
        // check route and params for county
        if (this.route === 'county') {
          const fips = this.params.fips;
          const county = (this.context.counties || []).find(c => c.fips === fips);
          if (county) {
            this.appMachine('selectCounty', {county: county.county});
          }

        }
      }),
      state(STATES.COUNTY_SELECTED, {
        selectState,
        selectCounty,
      })
    ], STATES.INITIAL, this.context, (newState) => {
      console.log('state changed:', newState);
      this.currentState = newState.state;
      this.context = newState.context;
    })
  }

  async loadData() {
    const data = await loadCsvData();
    this.appMachine('loaded', data);
  }

  // async loadPopulationData() {
  //   try {
  //     const pops = localStorage.getItem('population-data');
  //     if (pops) {
  //       return Promise.resolve(JSON.parse(pops));
  //     } else {
  //       // load and store in localStorage
  //       const pops = await d3.csv('/data/populations-by-county-est2019_min.csv');
  //       localStorage.setItem('population-data',JSON.stringify(pops));
  //       return pops;
  //     }
  //   } catch(e) {
  //     console.error('error with localStorage', e);
  //     // incognito most likely. just load it.
  //     return await d3.csv('/data/populations-by-county-est2019_min.csv');
  //   }
  // }

  // async loadCsvData() {
  //   const counties = await d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv');
  //   // population data
  //   const pops = await this.loadPopulationData();//await d3.csv('data/populations-by-county-est2019.csv');
  //   // only states, but has way more data
  //   const statesData = await d3.csv('https://covidtracking.com/api/v1/states/daily.csv');
  //   // precalculate unique state names
  //   const stateNames = counties
  //   .map(r => r.state)
  //   .reduce((acc, val, index, self) => {
  //     if (self.indexOf(val) < index) {
  //       return acc;
  //     }
  //     acc.push(val);
  //     return acc;
  //   }, []).sort();
  //   // and counties by state
  //   const stateCounties = counties.reduce((acc, val, index, self) => {
  //     if (!acc[val.state]) {
  //       acc[val.state] = [];
  //     }
  //     if (!acc[val.state].find(c => c.county === val.county)) {
  //       acc[val.state].push(val);
  //     }
  //     return acc;
  //   }, {});

  //   this.appMachine('loaded', {counties, states:stateNames, stateCounties, statesData, pops});
  // }

  render() {
    if (this.currentState === STATES.LOADING_CSVS || this.currentState === STATES.INITIAL) {
      return html`loading...`;
    }

    return html`
    <header><app-link href="/">US state by state Covid-19 Charts</app-link></header>
    <div class="sidebar">
      <state-select
        .states=${this.context.states}
        .selected=${this.context.selectedState && this.context.selectedState.name}>
      </state-select>
    </div>
    <article>
      <app-views active-route=${this.route}>
        <global-view route="home" .statesData=${this.context.statesData}></global-view>
        <state-view
          route="state"
          .selectedState=${this.context.selectedState}
          .countiesData=${this.context.counties}
          .statesData=${this.context.statesData}
          .populationData=${this.context.pops}>
        </state-view>
        <county-view route="county"></county-view>
      </app-views>
    </article>
    <footer>Covid charts is an <a href="https://github.com/jrobinson01/covid_chart">open-source project.</a></footer>
    `;
  }
}

customElements.define('covid-charts-app', CovidChartsApp);
