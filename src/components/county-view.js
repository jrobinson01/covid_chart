import {LitElement, html, css} from 'lit-element';
import './charts/county-cases-deaths.js';
import './charts/county-cases-deaths-by-day.js';
export default class CountyView extends LitElement {

  static get styles() {
    return css`
      :host {
        display: block;
        --link-color: #000000;
      }
    `;
  }

  static get properties() {
    return {
      selectedCounty: {
        type: Object,
      },
      countiesData: {
        type: Array,
      },
      selectedState: {
        type: Object,
      }
    };
  }

  constructor() {
    super();
    this.selectedCounty = {};
    this.countiesData = [];
    this.selectedState = {};
  }

  get selectedCountyData() {
    return this.selectedCounty ? this.countiesData.filter(c => c.county === this.selectedCounty.county) : [];
  }

  render() {
    return html`
      <header>
      <h3>${this.selectedState? html`<app-link href="/state/${this.selectedState.abbreviation}">${this.selectedState.name}</app-link>` : ''} : ${this.selectedCounty ? this.selectedCounty.county : ''}</h3>
    </header>
    <article>
      <county-cases-deaths .county=${this.selectedCountyData} .selectedCounty=${this.selectedCounty}></county-cases-deaths>
      <county-cases-deaths-by-day .county=${this.selectedCountyData} .selectedCounty=${this.selectedCounty}></county-cases-deaths-by-day>
    </article>
    `;
  }
}

customElements.define('county-view', CountyView);
