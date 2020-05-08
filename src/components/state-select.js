import {LitElement, html, css} from 'lit-element';
import {navigator} from 'lit-element-router';
import {ABBREVIATIONS} from '../lib/state-abbs.js';

export default class StateSelect extends navigator(LitElement) {

  static get properties() {
    return {
      states: {
        type: Array
      },
      stateCounties: {
        type: Object,
      },
      selectedState: {
        type: String,
      },
      selectedCounty: {
        type: String,
      }
    }
  }

  static get styles() {
    return css`
    :host {
      display: block;
    }
    a {
      text-decoration: none;
      color: black;
    }
    a:visited {
      color: black;
    }
    .row {
      display: block;
      padding: 10px;
      background-color: #CCCCCC;
      border-bottom: 2px solid white;
    }
    .county-row {
      font-size: 12px;
      display: block;
      padding: 10px;
      background-color: #FFFFFF;
      border-bottom: 2px solid #CCCCCC;
      padding-left: 24px;
    }
    .selected {
      background-color: #666666;
      color: #FFFFFF;
    }
    a.selected {
      color: white;
    }
    a:visited.selected {
      color: white;
    }
    a.selected-county {
      color: white;
    }
    a:visited.selected-county {
      color: white;
    }
    .selected-county {
      background-color: #666666;
      color: white;
    }
    `;
  }

  constructor() {
    super();
    /** @type {!Array<string>} */
    this.states = [];
    /** @type {string?} */
    this.selectedState = null;
    this.selectedCounty = null;
    this.stateCounties = {};
  }

  linkClick(event) {
    event.preventDefault();
    console.log('navigate', event.currentTarget.href);
    this.navigate(event.currentTarget.href);
  }

  getCountiesForState(state) {
    return this.stateCounties[state];
  }

  render() {
    return html`
    <header>
      <h3>Select a state</h3>
      <article>
      ${this.states.map(s => html`
          <a class="row ${s === this.selectedState ? 'selected' : ''}" href="/state/${ABBREVIATIONS[s]}" @click=${this.linkClick}>${s}</a>
          ${s === this.selectedState ? html`
            ${this.getCountiesForState(this.selectedState).map(c => html`
            <a class="county-row ${c.county === this.selectedCounty ? 'selected-county': ''}"
              href="/state/${ABBREVIATIONS[this.selectedState]}/county/${c.fips}"
              @click=${this.linkClick}>
              ${c.county}
            </a>`
            )}` : ''}
        `)}
      </article>
    </header>
    `;
  }
}

customElements.define('state-select', StateSelect);
