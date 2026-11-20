import React from 'react';

class DetailsTicket extends React.Component {

  render () {
       return (
<div className="row mt-1">
    <table className="table table-sm m-0 p-0">
        <thead>
            <tr>
                <th width="81" scope="col">Jugada</th>
                <th width="83" scope="col">Ejemplares</th>
                <th width="49" align="right" scope="col">Monto</th>
                <th width="27" scope="col">&nbsp;</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>W</td>
                <td>1</td>
                <td align="right">200</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td>W/P</td>
                <td>1-2</td>
                <td align="right">50</td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <td>W</td>
                <td>1</td>
                <td align="right">200</td>
                <td>&nbsp;</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colSpan="4">Items: 30 / Monto: $5.000,00</td>
            </tr>
        </tfoot>
    </table>  
</div>
  )
   }
}

export default DetailsTicket;

