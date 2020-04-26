import {LitElement, html, css} from 'lit-element';

export default class GlobalView extends LitElement {
  render() {
    return html`GLOBAL`;
  }
}

customElements.define('global-view', GlobalView);
