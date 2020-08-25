import {LitElement, html,css} from 'lit-element';

export default class StatePopInfo extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: space-between;
        width: 40%;
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

  get covidDeathRate() {
    return (100/ (this.stateData.positive / this.stateData.death)).toFixed(2);
  }

  render() {
    return html`
    <div>
      <div>Covid case fatality rate: <strong>${this.covidDeathRate}%</strong></div>
      <div>Covid deaths: <strong>${this.stateData.death}</strong></div>
    </div>
    <div>
      <div>2019 death rate: <strong>${parseFloat(this.population.RDEATH2019).toFixed(2)}%</strong></div>
      <div>2019 deaths: <strong>${this.population.DEATHS2019}</strong></div>
    </div>
    `;
  }
}

customElements.define('state-pop-info', StatePopInfo);
