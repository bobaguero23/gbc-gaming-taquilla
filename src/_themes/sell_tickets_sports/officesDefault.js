import React from 'react';
import empty from 'is-empty';
import {getAppConfig} from "../../_helpers/lib";
import {translateType,translateDescription,convertOddToAmerican} from '../../_helpers/libSport';
// Styles


class officesDefault extends React.Component {

   sportNames = (eventDetails) =>{
      let sport_name = [];
      let date = require('date-and-time');
      let statusName =  [];
      statusName[1] = 'PENDIENTE';
      statusName[2] = 'GANADOR';
      statusName[3] = 'SUSPENDIDO';
      statusName[10] = 'PERDEDOR';
      statusName[6] = 'SUSPENDIDO';


      for(let eventDetail of eventDetails){
        sport_name.push(
        <>
          <p>{eventDetail.events.event_name}<br />
          {date.format(new Date(eventDetail.events.event_date),"DD/MM/YYYY hh:mm:ss A") }<br />
          {translateType(eventDetail.ticket_details.event_type)}{' '}
          {translateDescription(eventDetail.ticket_details.event_type,eventDetail.events.event_home,eventDetail.events.event_away,eventDetail.ticket_details.factor,eventDetail.ticket_details.market_type,eventDetail.ticket_details.factor_extra,eventDetail.ticket_details.market_type_detail)}{' '}
          <br />
         Logro:{convertOddToAmerican(eventDetail.ticket_details.odd)}{' '}
          </p>
        </>
        )
        
      }

      return sport_name;

  }

  render () {
      const appConfig = getAppConfig();
      let date = require('date-and-time');
      let ticketHtml = '';

      let headerTicket = (<><tr>
         <td colSpan="3" align="left" >
            {appConfig.logoPrint && <img src={appConfig.logoPrint} style={{width:'150px', height:'auto', marginBottom:'10px', marginLeft:'-20px'}}></img>}
         </td>
      </tr>
      <tr>
         <td colSpan="3" align="left">
            <div className="small">{(!empty(this.props.ticketInfoSport[0])? this.props.ticketInfoSport[0].ticket.name:null)} </div>
            <div className="small mb-20">Fecha: {(!empty(this.props.ticketInfoSport[0])? date.format(new Date(this.props.ticketInfoSport[0].ticket.created),"DD MM YYYY HH:mm") :null)}</div>

            <div className="big">Serial: <b>{(!empty(this.props.ticketInfoSport[0]) ? this.props.ticketInfoSport[0].ticket.confirm: null)}</b></div>
            <div className="big">Tipo de Apuesta: <b>{(!empty(this.props.ticketInfoSport[0]) ? this.props.ticketInfoSport[0].ticket.ticket_type: null)}</b></div>            
         </td>
      </tr>
      </>)

      let footerTicket = (<>
         <tr>
            <td colSpan="3">
               <div className="big"> Riesgo: <b>{!empty(this.props.ticketInfoSport[0]) ? this.props.ticketInfoSport[0].currencyName : null} {(!empty(this.props.ticketInfoSport[0]) && (!empty(this.props.ticketInfoSport[0].ticket.amount))?(Number(this.props.ticketInfoSport[0].ticket.amount)):null)}</b>
               </div>
               <div className="big"> Total a Pagar: <b>{!empty(this.props.ticketInfoSport[0]) ? this.props.ticketInfoSport[0].currencyName : null} {(!empty(this.props.ticketInfoSport[0]) && (!empty(this.props.ticketInfoSport[0].ticket.total_to_pay))?(Number(this.props.ticketInfoSport[0].ticket.total_to_pay)):null)}</b>
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
            <tr>
               <td colSpan="3"> 
                 {!empty(this.props.ticketInfoSport[0]) && 
                 !empty(this.props.ticketInfoSport[0].ticketDetails) 
                            ? this.sportNames(
                                 this.props.ticketInfoSport[0].ticketDetails
                              )
                  : null}{" "}
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