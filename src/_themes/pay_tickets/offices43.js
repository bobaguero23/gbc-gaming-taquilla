import React from 'react';
import empty from 'is-empty';

class offices43 extends React.Component {
  render () {
      let date = require('date-and-time');
      let min = 10000000000000;
      let max = 99999999999999;
      let rand =  min + (Math.random() * (max-min));
      
       return (
         <div className="row ticket_to_print theme_1">
            <div className="body_ticket">
              <table className="table_ticket">
               <tbody>
               <tr>
                  <td colSpan="3" align="left">
                     <span className="bigBold">27867670-{(!empty(this.props.payInfo.allTickets.nodes[0].confirm) ? this.props.payInfo.allTickets.nodes[0].confirm.toString().substring(0,5): null)}-{(!empty(this.props.payInfo.allTickets.nodes[0].confirm)? this.props.payInfo.allTickets.nodes[0].confirm.toString().substring(5,8) : null)}</span>
                     &nbsp;{(!empty(this.props.payInfo.allTickets.nodes[0].created)? date.format(new Date(this.props.payInfo.allTickets.nodes[0].created),"D MMM YYYY") :null)}
                  </td>
               </tr>
               <tr>
                  <td colSpan="3" align="left">
                     <span className="big">VENE&nbsp;SPORT SBJC0&nbsp;2&nbsp;
                     {(!empty(this.props.payInfo.allTickets.nodes[0].created)? date.format(new Date(this.props.payInfo.allTickets.nodes[0].created),"HH:mm"):null)}
                     </span>
                     <br />
                     <div align="center">PAGUE/CANCELE RECIBO</div>
                  </td>
               </tr>
               <tr>
			            <td colSpan="3">
				          PAGOS			
			            </td>
               </tr>
               <tr>
                <td colSpan="3" align="right">
                <span className="big">Bs. {(!empty(this.props.payInfo.allTickets.nodes[0].totalToPay)? this.props.payInfo.allTickets.nodes[0].totalToPay :null)}      
                </span>
                <br /> 
                
                </td>
              </tr>
               </tbody>
            </table> 
         </div>
         </div>
  )
   }
}


export default offices43;