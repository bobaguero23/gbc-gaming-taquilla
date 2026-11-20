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
                     <span className="big">Serial:{(!empty(this.props.payInfoInh.allTicketsInhs.nodes[0].confirm) ? this.props.payInfoInh.allTicketsInhs.nodes[0].confirm: null)}</span>
                     &nbsp;{(!empty(this.props.payInfoInh.allTicketsInhs.nodes[0].createdAt)? date.format(new Date(this.props.payInfoInh.allTicketsInhs.nodes[0].createdAt),"D MMM YYYY") :null)}
                  </td>
               </tr>
               <tr>
                  <td colSpan="3" align="left">
                     {this.props.payInfoInh.allTicketsInhs.nodes[0].ticketOfficeByTicketOfficeId.name} 
                     &nbsp;{(!empty(this.props.payInfoInh.allTicketsInhs.nodes[0].createdAt)? date.format(new Date(this.props.payInfoInh.allTicketsInhs.nodes[0].createdAt),"HH:mm"):null)}
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
                <h1>{!empty(this.props.payInfoInh.allTicketsInhs.nodes[0].ticketOfficeByTicketOfficeId) ? this.props.payInfoInh.allTicketsInhs.nodes[0].ticketOfficeByTicketOfficeId.currencyCode : null} {(!empty(this.props.payInfoInh.allTicketsInhs.nodes[0].ticketTotalToPay)? this.props.payInfoInh.allTicketsInhs.nodes[0].ticketTotalToPay :null)} </h1> 
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