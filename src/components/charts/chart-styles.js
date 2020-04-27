import {css} from 'lit-element';
const chartStyles = css`
  :host {
    display: block;
  }
  footer {
    text-align: right;
    font-size: 11px;
  }
`;

const chartColors = new Map([
  ['positive', '#53eb34'], // green
  ['danger', '#eb5334'], // red
  ['warning', '#eb9834'], // orange
  ['neutral', '#e0cfe6'], // purple-ish gray
]);

export {chartStyles, chartColors};
