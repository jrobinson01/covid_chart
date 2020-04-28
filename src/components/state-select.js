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
    .selected {
      background-color: #666666;
      color: #FFFFFF;
    }
    .selected a {
      color: white;
    }
    .selected a:visited {
      color: white;
    }
    `;
  }

  constructor() {
    super();
    this.states = [];
    this.selected = null;
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
          <a class="row ${s === this.selected ? 'selected' : ''}" href="/state/${ABBREVIATIONS[s]}" @click=${this.linkClick}>${s}</a>
        `)}
      </article>
    </header>
    `;
  }
}

customElements.define('state-select', StateSelect);
