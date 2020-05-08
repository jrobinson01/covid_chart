import {LitElement, html, css} from 'lit-element';
import {navigator} from 'lit-element-router';

export default class AppLink extends navigator(LitElement) {

  static get styles() {
    return css`
      a {
        color:var(--link-color, #FFFFFF);
        text-decoration: none;
      }
      a:visited {
        color: var(--link-color, #FFFFFF);
      }
    `;
  }
  static get properties() {
    return {
      href: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.href = '';
  }

  linkClick(event) {
    event.preventDefault();
    this.navigate(this.href);
  }

  render() {
    return html`
      <a href='${this.href}' @click='${this.linkClick}'>
        <slot></slot>
      </a>
    `;
  }
}

customElements.define('app-link', AppLink);
