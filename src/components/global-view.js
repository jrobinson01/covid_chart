import {LitElement, html, css} from 'lit-element';
import './charts/all-states.js';
import './charts/us-historic.js';

export default class GlobalView extends LitElement {

  static get properties() {
    return {
      statesData: {
        type: Array,
      },
      usData: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    /** @type {Array<import('../lib/data-service').USState>} */
    this.statesData = [];
    this.usData = [];
  }

  render() {
    return html`
      <header>
        <h3>All states</h3>
      </header>
      <article>
        <us-historic .usHistoryData=${this.usData}></us-historic>
        <all-states .statesData=${this.statesData}></all-states>
      </article>
    `;
  }
}

customElements.define('global-view', GlobalView);
