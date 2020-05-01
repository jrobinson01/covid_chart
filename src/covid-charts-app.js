import {LitElement, html, css} from 'lit-element';
import {router} from 'lit-element-router';
import {machine, state} from 'fn-machine';
import StateSelect from './components/state-select.js';
import './components/global-view.js';
import './components/app-views.js';
import './components/state-view.js';
import './components/county-view.js';
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
  * @property {import('./lib/data-service').County} selectedCounty
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

function home(detail, context) {
  return {
    state: STATES.READY,
    context: {...context, ...{selectedCounty:null, selectedState: null}}
  }
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
    } else if (this.route === 'home') {
      this.appMachine('home');
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
        home,
      }, () => {
        // check route and params for county
        if (this.route === 'county') {
          const fips = this.params.fips;
          const county = (this.context.counties || []).find(c => c.fips === fips);
          if (county) {
            this.appMachine('selectCounty', {county: county});
          }

        }
      }),
      state(STATES.COUNTY_SELECTED, {
        selectState,
        selectCounty,
        home,
      })
    ], STATES.INITIAL, this.context, (newState) => {
      console.log('state changed:', newState);
      this.currentState = newState.state;
      this.context = newState.context;
      this.setPageTitle(this.currentState, this.context);
    });
  }

  setPageTitle(currentState, context) {
    // set the page title
    const titleEl = document.head.querySelector('title');
    if (currentState === STATES.STATE_SELECTED) {
      titleEl.innerText = `Covid Charts: ${this.context.selectedState.name}`;
    } else if (currentState === STATES.COUNTY_SELECTED) {
      titleEl.innerText = `Covid Charts: ${this.context.selectedState.name} : ${this.context.selectedCounty.county}`;
    } else {
      titleEl.innerText = 'Covid Charts';
    }
  }

  async loadData() {
    const data = await loadCsvData();
    this.appMachine('loaded', data);
  }

  get selectedCountyData() {
    if (!this.context.selectedState || !this.context.selectedCounty) {
      return [];
    }
    return this.context.counties.filter(c => c.state === this.context.selectedState.name && c.county === this.context.selectedCounty.county);
  }

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
        <county-view route="county"
        .selectedCounty=${this.context.selectedCounty}
        .countiesData=${this.selectedCountyData}
        .selectedState=${this.context.selectedState}></county-view>
      </app-views>
    </article>
    <footer>Covid charts is an <a href="https://github.com/jrobinson01/covid_chart">open-source project.</a></footer>
    `;
  }
}

customElements.define('covid-charts-app', CovidChartsApp);
