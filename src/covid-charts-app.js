import {LitElement, html, css} from 'lit-element';
import {machine, state} from 'fn-machine';
import './components/state-select.js';
import './components/county-select.js';
import './components/cases-deaths-chart.js';

// map state names to abbreviations
const ABBREVIATIONS = {
  Alaska: 'AK',
  Alabama: 'AL',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
  'District of Columbia': 'DC',
}

const STATES = {
  INITIAL: 'initial',
  LOADING_CSVS: 'loading-csvs',
  READY: 'ready',
  VIEW_BY_STATE:'view-by-state',
  VIEW_BY_COUNTY: 'view-by-county',
};

// shared transitions
function selectState(detail, context) {
  return {
    state: STATES.VIEW_BY_STATE,
    context: {...context, ...{selectedState: {name: detail.state, abbreviation: ABBREVIATIONS[detail.state]}, selectedCounty: undefined}}
  }
}

function selectCounty(detail, context) {
  return {
    state: STATES.VIEW_BY_COUNTY,
    context: {...context, ...{selectedCounty: detail.county}}
  };
}

export default class CovidChartsApp extends LitElement {

  static get properties() {
    return {
      currentState:{
        type: String,
      },
      context: {
        type: Object
      }
    }
  }

  constructor() {
    super();
    this.context = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.initMachine();
    const currentState = this.appMachine('load');
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
        this.loadCsvData();
      }),
      state(STATES.READY, {
        selectState
      }),
      state(STATES.VIEW_BY_STATE, {
        selectState,
        selectCounty,
      }),
      state(STATES.VIEW_BY_COUNTY, {
        selectState,
        selectCounty,
      })
    ], STATES.INITIAL, this.context, (newState) => {
      console.log('state changed', newState);
      this.currentState = newState.state;
      this.context = newState.context;
    })
  }

  onStateSelected(state) {
    this.appMachine('selectState', {state});
  }

  onCountySelected(county) {
    this.appMachine('selectCounty', {county});
  }

  async loadCsvData() {
    const counties = await d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv');
    const pops = await d3.csv('data/populations-by-county-est2019.csv');
    // only states but has way more data
    const statesData = await d3.csv('https://covidtracking.com/api/v1/states/daily.csv');

    // precalculate unique state names
    const stateNames = counties
    .map(r => r.state)
    .reduce((acc, val, index, self) => {
      if (self.indexOf(val) < index) {
        return acc;
      }
      acc.push(val);
      return acc;
    }, []).sort();
    // and counties by state
    const stateCounties = counties.reduce((acc, val, index, self) => {
      if (!acc[val.state]) {
        acc[val.state] = [];
      }
      if (!acc[val.state].includes(val.county)) {
        acc[val.state].push(val.county);
      }
      return acc;
    }, {});

    this.appMachine('loaded', {counties, pops, states:stateNames, stateCounties, statesData});
  }

  render() {
    if (this.currentState === STATES.LOADING_CSVS || this.currentState === STATES.INITIAL) {
      return html`loading...`;
    }
    return html`
      <state-select .states=${this.context.states} @selection=${event => this.onStateSelected(event.detail)}></state-select>
      <county-select .counties=${ this.context.selectedState ? this.context.stateCounties[this.context.selectedState.name] : []} @selection=${event => this.onCountySelected(event.detail)}></county-select>
      <cases-deaths-chart .statesData=${this.context.statesData} .counties=${this.context.counties} .selectedState=${this.context.selectedState} .selectedCounty=${this.context.selectedCounty}></cases-deaths-chart>
    `;
  }
}

customElements.define('covid-charts-app', CovidChartsApp);
