import {LitElement, html, css} from 'lit-element';
import {outlet} from 'lit-element-router';

export default class GlobalView extends outlet(LitElement) {
  render() {
    return html`GLOBAL`;
  }
}

customElements.define('global-view', GlobalView);
