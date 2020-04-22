import {LitElement, html, css} from 'lit-element';

export default class StateSelect extends LitElement {
  static get properties() {
    return {
      states: Array,
    }
  }

  constructor() {
    super();
    this.states = [];
  }

  onSelection(state) {
    this.dispatchEvent(new CustomEvent('selection', {detail: state}));
  }


  render() {
    return html`<select @change=${event => this.onSelection(event.currentTarget.value)}>
      ${this.states.map(s => html`<option value=${s} label=${s}></option>`)}
    </select>`;
  }
}

customElements.define('state-select', StateSelect);
