import {LitElement, html, css} from 'lit-element';
import './charts/deaths-by-county.js';
import './charts/state-tests.js';
import './charts/state-per-day.js';

export default class StateView extends LitElement {

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
    this.selectedState = {
      name:'',
    };
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
      <deaths-by-county .countiesData=${this.countiesData} .selectedState=${this.selectedState}></deaths-by-county>
      <state-tests .statePopData=${this.statePopData} .stateData=${this.currentStateData} .selectedState=${this.selectedState}></state-tests>
      <state-per-day .stateData=${this.stateData} .selectedState=${this.selectedState}></state-per-day>
    </article>
    `;
  }
}

customElements.define('state-view', StateView);
