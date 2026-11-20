import React from 'react';
import empty from 'is-empty';
import {getAppConfig} from "../../_helpers/lib";
// Styles


class officesDefault extends React.Component {
  
  render () {
      let Barcode = require('react-barcode');
      const appConfig = getAppConfig();
      let date = require('date-and-time');
      let ticketHtml = '';

      

      let headerTicket = (<><tr>
         <td colSpan="3" align="left" >
            {appConfig.logoPrint && <img src={appConfig.logoPrint} style={{width:'80px', height:'auto', marginBottom:'10px', marginLeft:'-20px'}}></img>}
         </td>
      </tr>
      <tr>
         <td colSpan="3" align="left">
            <div className="small">{this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].ticketOfficeByTicketOfficesId.name} </div>
            <div className="small mb-20">Fecha: {(!empty(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].created)? date.format(new Date(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].created),"DD MM YYYY HH:mm") :null)}</div>

            <div className="big">Serial: <b>{(!empty(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].confirm) ? this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].confirm: null)}</b></div>
            <div className="big"><b>
            {(!empty(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].trackByTracksId) 
            ? this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].trackByTracksId.trackName
               :null)}</b></div> 
         </td>
      </tr>
      </>)

      let footerTicket = (<>
         <tr>
            <td colSpan="3">
               <div className="big">Combinaciones: {(!empty(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].numberCombinations) ? this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].numberCombinations : null)}
               </div>
               <div className="big"> Monto de Apuesta: {!empty(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].ticketOfficeByTicketOfficesId) ? this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].ticketOfficeByTicketOfficesId.currencyCode : null} {(!empty(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].amount) ?(Number(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].amount)):null)}
               </div>
               <div className="small mt-20">Ticket caduca a los 8 dias.</div>
            </td>
         </tr>
      </>)

      let ticketApuesta = [];
      let apuestaHtml = [];
      if (!empty(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].playInText)){
         ticketApuesta = this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].playInText.split('/');
         for (let i = 0; i < ticketApuesta.length; i++) {
            apuestaHtml.push(<>{ticketApuesta[i]}<br /></>)
         }
      }


      ticketHtml = (<div className="row ticket_to_print theme_1">
                  <div className="body_ticket">
                  <table className="table_ticket" width="230px">
                     <tbody>
                     {headerTicket}
                     
                     <tr>
                        <td colSpan="3"> 
                           <div className="big"> Polla Hípica: <br />{(!empty(this.props.ticketInfo.allHeaderTicketsCocks.nodes[0].playInText)
                              ? apuestaHtml
                              :null)}
                           </div>
                        </td>
                     </tr>
                     {footerTicket}
                     </tbody>
                  </table> 
                  
                  </div>
               </div>);
      

       return ticketHtml
   }
}


export default officesDefault;