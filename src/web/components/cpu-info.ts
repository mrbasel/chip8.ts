
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cpu-info')
export class CpuInfo extends LitElement {
  static styles = css`
    td {
      border: 1px solid #333;
      padding: 0.5rem 2rem;
      min-width: 25px;
      max-width: 50px;
    }
    
    .title {
      text-align: center;
    }
  `;

  @property()
  pc: string = '0';

  @property()
  I: string = '0';

  @property({ type: Array })
  registers: number[] = Array.from({ length: 16 }, () => 0);

  @property({ type: Array })
  stack: number[] = [];

  render() {
    return html`
      <table>
        <tbody>
        <tr>
          <td>PC</td>
          <td colspan='4'>0x${this.pc}</td>
        </tr>
        <tr>
          <td>I</td>
          <td colspan='4'>0x${this.I}</td>
        </tr>
          <td>Stack</td>
          <td colspan='3'>[]</td>
        <tr>
        </tr>
        <tr class='title'>
          <td colspan='4'>Registers</td>
        </tr>
  ${this.registers
        .reduce((acc, v, i) => {
          if (i % 2 === 0) {
            acc.push([v]);
          } else {
            acc[acc.length - 1].push(v);
          }
          return acc;
        }, [] as number[][])
        .map((v, i) => html`
        <tr>
          <td>V${(i * 2).toString(16).toUpperCase()}</td>
          <td>${v[0].toString(16).toUpperCase()}</td>
          <td>V${(i * 2 + 1).toString(16).toUpperCase()}</td>
          <td>${v[1].toString(16).toUpperCase()}</td>
        </tr>`
        )}
        </tbody>
    </table>
`;
  }
}
