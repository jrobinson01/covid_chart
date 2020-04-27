import {LitElement, html, css} from 'lit-element';
import {navigator} from 'lit-element-router';
import {ABBREVIATIONS, stateFromAbb} from '../lib/state-abbs.js';

export default class CountySelect extends navigator(LitElement) {

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .row {
        padding: 10px;
        background-color: #CCCCCC;
      }
    `
  }

  static get properties() {
    return {
      counties:{
        type: Array,
      },
      selectedState: {
        type: String,
      },
    }
  }

  constructor() {
    super();
    this.counties = [];
  }

  linkClick(event) {
    event.preventDefault();
    console.log('navigating ', event.currentTarget.href, this.navigate);
    this.navigate(event.currentTarget.href);
  }

  render() {
    return html`
      <header>
        <h4>Select a county</h4>
      </header>
      <article>
        ${this.counties.map(c => html`
          <div class="row">
            <a href="/states/${ABBREVIATIONS[this.selectedState.name]}/county/${c.fips}" @click=${this.linkClick}>${c.county}</a>
          </div>
        `)}
      </article>
    `
  }
}

customElements.define('county-select', CountySelect);
