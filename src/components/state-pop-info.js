import {LitElement, html,css} from 'lit-element';

export default class StatePopInfo extends LitElement {
  static get styles() {
    return css`
      div {
        font-size: 12px;
      }
    `;
  }
  static get properties() {
    return {
      population: {
        type: Object,
      },
      stateData: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.population = {};
    this.stateData = {};
  }

  get covidDeathRate() {
    return (100/ (this.stateData.positive / this.stateData.death)).toFixed(2);
  }

  render() {
    return html`
      <div>Covid deaths: ${this.stateData.death}</div>
      <div>2019 deaths: ${this.population.DEATHS2019}</div>
    `;
  }
}

customElements.define('state-pop-info', StatePopInfo);
