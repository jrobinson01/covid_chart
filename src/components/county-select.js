import {LitElement, html, css} from 'lit-element';

export default class CountySelect extends LitElement {
  static get properties() {
    return {
      counties: Array,
    }
  }

  constructor() {
    super();
    this.counties = [];
  }

  onSelection(state) {
    this.dispatchEvent(new CustomEvent('selection', {detail: state}));
  }


  render() {
    return html`
    <label for="county">Select a county</label>
    <select name="county" @change=${event => this.onSelection(event.currentTarget.value)}>
      ${this.counties.map(c => html`<option .value=${c} .label=${c}>${c}</option>`)}
    </select>`;
  }
}

customElements.define('county-select', CountySelect);
