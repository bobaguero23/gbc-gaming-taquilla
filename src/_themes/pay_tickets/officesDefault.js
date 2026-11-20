import React from 'react';
import empty from 'is-empty';

class officesDefault extends React.Component {
  render () {
      let Barcode = require('react-barcode');
      let date = require('date-and-time');
      let min = 10000000000000;
      let max = 99999999999999;
      let rand =  min + (Math.random() * (max-min));
      
       return (
         <div className="row ticket_to_print theme_1">
          <div className="body_ticket">
            <table className="table_ticket" width="230px">
               <tbody>
               <tr>
                  <td colSpan="3" align="left">
                     <span className="big">Serial:{(!empty(this.props.payInfo.allTickets.nodes[0].confirm) ? this.props.payInfo.allTickets.nodes[0].confirm: null)}</span>
                     &nbsp;{(!empty(this.props.payInfo.allTickets.nodes[0].created)? date.format(new Date(this.props.payInfo.allTickets.nodes[0].created),"D MMM YYYY") :null)}
                  </td>
               </tr>
               <tr>
                  <td colSpan="3" align="left">
                     {this.props.payInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId.name} 
                     &nbsp;{(!empty(this.props.payInfo.allTickets.nodes[0].created)? date.format(new Date(this.props.payInfo.allTickets.nodes[0].created),"HH:mm"):null)}
                     <br />
                     <div align="left">PAGUE/CANCELE RECIBO</div>
                  </td>
               </tr>
               <tr>
			            <td colSpan="3" >
				          MONTO A PAGAR			
			            </td>
               </tr>
               <tr>
                <td colSpan="3" align="left">
                <h1>{!empty(this.props.payInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId) ? this.props.payInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId.currencyCode : null} {(!empty(this.props.payInfo.allTickets.nodes[0].totalToPay)? this.props.payInfo.allTickets.nodes[0].totalToPay :null)} </h1> 
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


export default officesDefault;