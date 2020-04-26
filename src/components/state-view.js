import {LitElement, html, css} from 'lit-element';
import {outlet} from 'lit-element-router';

export default class StateView extends outlet(LitElement) {

}

customElements.define('state-view', StateView);
