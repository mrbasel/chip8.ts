
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cpu-info')
export class CpuInfo extends LitElement {
  static styles = css`
    table, td { 
      border: 1px solid #333;
    }
    td {
      padding: 0.5rem 2rem;
    }
    
    .title {
      text-align: center;
    }
  `;

  @property()
  pc: string = '0';

  @property()
  I: string = '0';

  @property()
  registers: string[] = [];

  render() {
    return html`
      <table>
        <tbody>
        <tr>
          <td colspan='3'>PC</td>
          <td>0x${this.pc}</td>
        </tr>
        <tr>
          <td colspan='3'>I</td>
          <td>0x${this.I}</td>
        </tr>
        <tr class='title'>
          <td colspan='4'>Registers</td>
        </tr>
  ${Array.from({ length: 8 }, (_, i) => i)
        .map((i) => html`
        <tr>
          <td>V${i.toString().toUpperCase()}</td>
          <td>0</td>
          <td>V${(i + 1).toString().toUpperCase()}</td>
          <td>0</td>
        </tr>`
        )}
        </tbody>
    </table>
`;
  }
}
