import {LitElement, html, css} from 'lit-element';

import './charts/deaths-by-county.js';
import './charts/state-per-day.js';
import './charts/state-county-cases.js';
import './charts/state-rates.js';

export default class StateView extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
      }
      a {
        scroll-behavior: auto;
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

  render() {
    return html`
    <header>
      <h3>${this.selectedState ? this.selectedState.name : ''}</h3>
    </header>
    <article>
      <state-per-day .stateData=${this.stateData} .selectedState=${this.selectedState}></state-per-day>
      <state-rates .stateData=${this.stateData} .selectedState=${this.selectedState}></state-rates>
      <state-county-cases .countiesData=${this.countiesData} .selectedState=${this.selectedState}></state-county-cases>
      <deaths-by-county .countiesData=${this.countiesData} .selectedState=${this.selectedState}></deaths-by-county>
    </article>
    `;
  }
}

customElements.define('state-view', StateView);
