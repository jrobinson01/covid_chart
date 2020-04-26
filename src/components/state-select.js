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
      height: 100vh;
      overflow-y:scroll;
    }
    a {
      text-decoration: none;
      color: black;
    }
    a:visited {
      color: black;
    }
    .row {
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
