import {LitElement, html, css} from 'lit-element';
import './charts/all-states.js';

export default class GlobalView extends LitElement {

  static get properties() {
    return {
      statesData: {
        type: Array,
      },
    };
  }

  render() {
    return html`
      <header>
        <h3>All states</h3>
      </header>
      <article>
        <all-states .statesData=${this.statesData}></all-states>
      </article>
    `;
  }
}

customElements.define('global-view', GlobalView);
