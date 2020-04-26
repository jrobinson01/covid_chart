import {LitElement, html, css} from 'lit-element';
import {navigator} from 'lit-element-router';
import {ABBREVIATIONS} from '../lib/state-abbs.js';

export default class StateSelect extends navigator(LitElement) {

  static get properties() {
    return {
      states: {
        type: Array
      },
      selected: {
        type: String,
      },
    }
  }

  static get styles() {
    return css`
    :host {
      display: block;
    }
    .row {
      padding: 10px;
      background-color: #CCCCCC;
    }
    .selected {
      background-color: green;
    }
    `;
  }

  constructor() {
    super();
    this.states = [];
  }

  linkClick(event) {
    event.preventDefault();
    this.navigate(event.currentTarget.href);
  }

  render() {
    return html`
    <header>
      <h3>Select a state</h3>
      <article>
      ${this.states.map(s => html`
        <div class="row ${s === this.selected ? 'selected' : ''}">
          <a href="/state/${ABBREVIATIONS[s]}" @click=${this.linkClick}>${s}</a>
        </div>
        `)}
      </article>
    </header>
    `;
  }
}

customElements.define('state-select', StateSelect);
