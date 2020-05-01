import {LitElement, html, css} from 'lit-element';
import {navigator} from 'lit-element-router';

import './charts/deaths-by-county.js';
import './charts/state-tests.js';
import './charts/state-per-day.js';

export default class StateView extends navigator(LitElement) {

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
      populationData: {
        type: Array,
      },
      statesData: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    /** @type {import('../covid-charts-app').SelectedState} */
    this.selectedState = {
      name:'',
    };
    /** @type {Array<import('../lib/data-service').County>} */
    this.countiesData = [];
    this.populationData = [];
    this.statesData = [];
  }

  get statePopData() {
    return this.populationData && this.selectedState && this.selectedState.name &&
    this.populationData.find(p => p.STNAME === this.selectedState.name && p.CTYNAME === this.selectedState.name);
  }

  get currentStateData() {
    const data = this.selectedState && this.selectedState.abbreviation && this.statesData.find(s => s.state === this.selectedState.abbreviation);
    return data || {};
  }

  get stateData() {
    return this.selectedState && this.selectedState.abbreviation && this.statesData.filter(s => s.state === this.selectedState.abbreviation).reverse();
  }

  onCountySelected(event) {
    this.navigate(`/state/${this.selectedState.abbreviation}/county/${event.detail.fips}`);
  }


  render() {
    return html`
    <header>
      <h3>${this.selectedState ? this.selectedState.name : ''}</h3>
    </header>
    <article>
      <deaths-by-county .countiesData=${this.countiesData} .selectedState=${this.selectedState} @county-selected=${this.onCountySelected}></deaths-by-county>
      <state-tests .statePopData=${this.statePopData} .stateData=${this.currentStateData} .selectedState=${this.selectedState}></state-tests>
      <state-per-day .stateData=${this.stateData} .selectedState=${this.selectedState}></state-per-day>
    </article>
    `;
  }
}

customElements.define('state-view', StateView);
