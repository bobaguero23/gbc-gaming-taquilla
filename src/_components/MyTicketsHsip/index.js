import React from 'react';
import { connect } from "redux-zero/react";
import {Table} from 'react-bootstrap';
import empty from 'is-empty';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';
import {Badge } from "react-bootstrap";

class MyTicketsHsip extends React.Component {

  handleRePrint = (e,ticket_id) => {

    //console.log('REPRINT');
    e.preventDefault();
    if(!empty(ticket_id)){
       this.props.SellActions({action: 'getTicketInfoHSIP', params : {ticketId:ticket_id}});
    }
    else{
       let errormessage = 'Debe elegir un ticket';
       this.setState({
          errormessage: errormessage
       }); 
    }
  }

  raceText(races){
    let raceArray = [];
    let raceText = [];
    for(let race of races){
      if(!empty(raceArray[race.raceNumber])){
        raceArray[race.raceNumber].push(race.horseNumber);
      }else{
        raceArray[race.raceNumber] = [race.horseNumber];
      }
      
    }

    for (let raceNumber in raceArray) {
      let horses = raceArray[raceNumber].toString();
      raceText.push(<>{raceNumber}) <b>{horses}</b> </>);
    }

    return raceText;

  }
  
  render () {

      const { ticketsHSIP } = this.props;
      let tickets = ticketsHSIP;

      let statusName =  [];
      statusName[2] = 'TOTALIZADO';
      statusName[3] = 'PAGADO';
      statusName[10] = 'PERDEDOR';
      statusName[11] = 'ENVIADO A BILLETERA';
      let rowsMyTickets = [];
      let date = require('date-and-time');
      if(empty(tickets)) {
        return (
          <div className="row block-my-tickets"> 
          <h3>Mis apuestas del d&iacute;a</h3>
          <Table className="table table-sm my-tickets" responsive>
          <tbody><tr><td>No tiene apuestas realizadas el d&iacute;a de hoy, ¿Qué esperas para hacer una?. </td></tr></tbody>
          </Table>
          </div>);
      }


      if(!empty(tickets)) {

              for(let k=0;k<tickets.length;k++){
                rowsMyTickets.push(<tr key={tickets[k].confirm}>
                    <td>{statusName[tickets[k].status]} <span style={{cursor: 'pointer'}}><Badge pill variant={'danger'} onClick={(e) => {this.handleRePrint(e,tickets[k].id)}}>Reimprimir</Badge></span></td>
                    <td>{date.format(new Date(tickets[k].createdAt),"hh:mm:ss A")}</td>
                    <td>{tickets[k].confirm}-{tickets[k].idTransactionHsip}</td>
                    <td>{tickets[k].trackName}<br />   
                    {(!empty(tickets[k].ticketsHsipDetailsByTicketId.nodes) ? this.raceText(tickets[k].ticketsHsipDetailsByTicketId.nodes): null )}
                    </td>
                    <td>{tickets[k].wagerTypeByWagerTypeId.description} / {formatNumber(tickets[k].currencyCode, tickets[k].ticketAmount)}</td>
                    
                  </tr>);
                  if(k==9)
                  {
                    break;
                  }
              }  
            
        
      }

       return (
        <div className="row block-my-tickets"> 
          <h3>Mis apuestas</h3>
          <Table className="table table-sm my-tickets" responsive>
          <thead>
            <tr>
              <th>Reimprimir</th>
              <th>Fecha</th>
              <th># Ticket</th>
              <th>Hipódromo</th>
              <th>Apuesta</th>
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
  ticketsHSIP
}) => ({
  ticketsHSIP
});
const connectedMyTicketsHsip = connect(mapToProps, actions)(MyTicketsHsip);
export { connectedMyTicketsHsip as MyTicketsHsip };

