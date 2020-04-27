import {LitElement, html, css} from 'lit-element';
import {outlet} from 'lit-element-router';

export default class AppViews extends outlet(LitElement) {
  render() {
    return html`
      <slot></slot>
    `;
  }
}
customElements.define('app-views', AppViews);
