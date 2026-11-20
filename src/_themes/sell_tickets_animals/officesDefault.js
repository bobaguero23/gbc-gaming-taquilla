import React from 'react';
import empty from 'is-empty';
import {getAppConfig} from "../../_helpers/lib";
// Styles


class officesDefault extends React.Component {

  render () {
      const appConfig = getAppConfig();
      let date = require('date-and-time');
      let ticketHtml = '';
      let confirm = (!empty(this.props.ticketInfoAnimal.allTicketsAnimals.nodes[0].confirm) ? this.props.ticketInfoAnimal.allTicketsAnimals.nodes[0].confirm.split("-")[0] : null);

      let numbersText = '';
          this.props.ticketInfoAnimal.allTicketsAnimals.nodes[0].ticketsAnimalsDetailsByTicketsId.nodes.forEach((n) => {
          numbersText+= `${n.lotteryNumber}-`;
      });

      numbersText = numbersText.substring(0,numbersText.length-1);

      let headerTicket = (<><tr>
         <td colSpan="3" align="left" >
            {appConfig.logoPrint && <img src={appConfig.logoPrint} style={{width:'150px', height:'auto', marginBottom:'10px', marginLeft:'-20px'}}></img>}
         </td>
      </tr>
      <tr>
        <td colSpan="3">
            <p>Polla El Arca</p>
         </td>
      </tr>
      <tr>
         <td colSpan="3" align="left">
            <div className="small">{this.props.ticketInfoAnimal.allTicketsAnimals.nodes[0].ticketOfficeByTicketOfficesId.name} </div>
            <div className="small mb-20">Fecha Ticket: {(!empty(this.props.ticketInfoAnimal.allTicketsAnimals.nodes[0].created)? date.format(new Date(this.props.ticketInfoAnimal.allTicketsAnimals.nodes[0].created),"DD MM YYYY HH:mm") :null)}</div>

            <div className="big">Serial: <b>{confirm}</b></div>
            <div className="big"><b>
            Números seleccionados: 
            <br />
            {numbersText}
            </b></div> 
         </td>
      </tr>
      </>)

      let footerTicket = (<>
         <tr>
            <td colSpan="3">
               <div className="big">Alias: {((!empty(this.props.ticketInfoAnimal.allTicketsAnimals.nodes[0].ticketsAnimalsCocksByTicketsAnimalsId))? this.props.ticketInfoAnimal.allTicketsAnimals.nodes[0].ticketsAnimalsCocksByTicketsAnimalsId.nodes[0].userAlias:null)}
               </div>
               <div className="small mt-20">Ticket caduca a los 8 dias.</div>
            </td>
         </tr>
      </>)

         ticketHtml = (<div className="row ticket_to_print theme_1">
         <div className="body_ticket">
         <table className="table_ticket" width="230px">
            <tbody>
            {headerTicket}
            {footerTicket}
            </tbody>
         </table> 
         </div>
      </div>);
      

       return ticketHtml
   }
}


export default officesDefault;