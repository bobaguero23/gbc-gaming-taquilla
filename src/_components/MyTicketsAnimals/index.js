import React from 'react';
import { connect } from "redux-zero/react";
import {Table} from 'react-bootstrap';
import empty from 'is-empty';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';
import {Badge } from "react-bootstrap";

class MyTicketsAnimals extends React.Component {

  handleRePrint = (e,ticket_id) => {

    //console.log('REPRINT');
    e.preventDefault();
    if(!empty(ticket_id)){
       this.props.SellActions({action: 'getTicketInfoAnimals', params : {ticketId:ticket_id}});
    }
    else{
       let errormessage = 'Debe elegir un ticket';
       this.setState({
          errormessage: errormessage
       }); 
    }
  }
  
  render () {

      const { ticketsAnimals } = this.props;
      let tickets = ticketsAnimals;

      let statusName =  [];
      statusName[1] = 'VENDIDO';
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
                let numbersText = '';
                tickets[k].ticketsAnimalsDetailsByTicketsId.nodes.forEach((n) => {
                  numbersText+= `${n.lotteryNumber}-`;
                });

                numbersText = numbersText.substring(0,numbersText.length-1);

                rowsMyTickets.push(<tr key={tickets[k].confirm}>
                    <td>{statusName[tickets[k].statusId]} <span style={{cursor: 'pointer'}}><Badge pill variant={'danger'} onClick={(e) => {this.handleRePrint(e,tickets[k].id)}}>Reimprimir</Badge></span></td>
                    <td>{date.format(new Date(tickets[k].created),"hh:mm:ss A")}</td>
                    <td>{tickets[k].confirm}</td>
                    <td>{tickets[k].ticketsAnimalsCocksByTicketsAnimalsId.nodes[0].userAlias}
                    </td>
                    <td>{numbersText}</td>
                    
                  </tr>);
                  if(k==9)
                  {
                    break;
                  }
              }  
            
        
      }

       return (
        <div className="row block-my-tickets"> 
          <h3>Tickets vendidos</h3>
          <Table className="table table-sm my-tickets" responsive>
          <thead>
            <tr>
              <th>Reimprimir</th>
              <th>Fecha</th>
              <th># Ticket</th>
              <th>Usuario</th>
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
  ticketsAnimals
}) => ({
  ticketsAnimals
});
const connectedMyTicketsINH = connect(mapToProps, actions)(MyTicketsAnimals);
export { connectedMyTicketsINH as MyTicketsAnimals };

