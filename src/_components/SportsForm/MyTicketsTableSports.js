import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';
import {translateType,translateDescription} from '../../_helpers/libSport';
import {Badge,Table} from 'react-bootstrap';

class MyTicketsTableSports extends React.Component {

  sportNames = (eventDetails) =>{
      const { showOdds,convertOddToAmerican } = this.props;
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
          <p>{eventDetail.eventByEventId.eventName} {!empty(eventDetail.eventByEventId.resultsSportsByEventId) && !empty(eventDetail.eventByEventId.resultsSportsByEventId.nodes) ? <strong> {' '}Resultado: {eventDetail.eventByEventId.resultsSportsByEventId.nodes[0].resultHome}- {eventDetail.eventByEventId.resultsSportsByEventId.nodes[0].resultAway}</strong> : null}<br />
          {date.format(new Date(eventDetail.eventByEventId.eventDate),"DD/MM/YYYY hh:mm:ss A") }<br />
          {translateType(eventDetail.eventType)}{' '}
          {translateDescription(eventDetail.eventType,eventDetail.eventByEventId.eventHome,eventDetail.eventByEventId.eventAway,eventDetail.factor,eventDetail.marketType,eventDetail.factorExtra,eventDetail.marketTypeDetail)}{' '}
         <Badge variant={'success'}>{showOdds == 'D' ? eventDetail.odd : convertOddToAmerican(eventDetail.odd)} </Badge>{' '}
          {statusName[eventDetail.status]}</p>
        </>
        )
        
      }

      return sport_name;

  }

  render () {

      const { lastTicketsSports, ticketStatus } = this.props;
      let lastTickets = lastTicketsSports;

      let rowsMyTickets = [];
      let date = require('date-and-time');


      if(!empty(lastTickets) && !empty(ticketStatus)){
          lastTickets = lastTickets.filter((t) => ticketStatus.includes(t.ticketsStatusByStatusId.id))
      }

      if(empty(lastTickets)) {
        return (
          <div className="row block-my-lastTickets"> 
          <table className="table table-sm">
          <tbody><tr><td className="empty-table">No tiene apuestas realizadas. </td></tr></tbody></table>
          </div>);
      }


      if(!empty(lastTickets)) {

              const estatusTickets = [];
              estatusTickets['ENVIADO A BILLETERA DEL CLIENTE'] = 'success';
              estatusTickets['VENDIDO'] = 'light';
              estatusTickets['PERDEDOR'] = 'danger';

              for(let k=0;k<lastTickets.length;k++){
                let balance = (lastTickets[k].amount - lastTickets[k].totalToPay)*-1;
                rowsMyTickets.push(<tr key={lastTickets[k].confirm}>
                    <td>{date.format(new Date(lastTickets[k].created),"DD/MM/YYYY hh:mm:ss A")}</td>
                    <td>{lastTickets[k].confirm}</td>
                    <td>{this.sportNames(lastTickets[k].ticketsSportsDetailsByTicketId.nodes)} </td>
                    <td>{formatNumber(lastTickets[k].ticketOfficeByTicketOfficesId.currencyCode, lastTickets[k].amount)}</td>
                    <td>{formatNumber(lastTickets[k].ticketOfficeByTicketOfficesId.currencyCode, lastTickets[k].totalToPay)}</td>
                    <td><Badge variant={'light'}>{formatNumber(lastTickets[k].ticketOfficeByTicketOfficesId.currencyCode,balance)}</Badge></td>
                    <td>
                        <Badge variant={(!empty(estatusTickets[lastTickets[k].ticketsStatusByStatusId.name])) ? estatusTickets[lastTickets[k].ticketsStatusByStatusId.name] : 'danger' }>
                        {lastTickets[k].ticketsStatusByStatusId.name}
                        </Badge>
                    </td>
                  </tr>);
              }  
            
        
      }

       return (
        <div className="row block-my-lastTickets"> 
          <Table responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th># Ticket</th>
              <th>Apuesta</th>
              <th>Riesgo</th>
              <th>Total a Pagar</th>
              <th>Ganancia</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {rowsMyTickets}
            </tbody>
          </Table>     
        </div>
      )
   }
}

const mapToProps = ({
  lastTicketsSports
}) => ({
  lastTicketsSports
});
const connectedMyTicketsTable = connect(mapToProps, actions)(MyTicketsTableSports);
export { connectedMyTicketsTable as MyTicketsTableSports };

