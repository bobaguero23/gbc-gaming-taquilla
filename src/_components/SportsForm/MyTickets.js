import React from 'react';
import { connect } from "redux-zero/react";
import {Badge, Table} from 'react-bootstrap';
import empty from 'is-empty';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';

class MyTickets extends React.Component {
  
  handleRePrintSport = (e,ticket_id) => {

    //console.log('REPRINT');
    e.preventDefault();
    if(!empty(ticket_id)){
       this.props.SellActions({action: 'getTicketInfoSport', params : {ticketId:ticket_id}});
    }
    else{
       let errormessage = 'Debe elegir un ticket';
       this.setState({
          errormessage: errormessage
       }); 
    }
  }

  render () {

      const { ticketssports } = this.props;
      
      let rowsMyTickets = [];
      let date = require('date-and-time');
      if(empty(ticketssports)) {
        return (
          <div className="row block-my-tickets"> 
          <h3>Tickets vendidos en el d&iacute;a</h3>
          <Table className="table table-sm my-tickets" responsive>
          <tbody><tr><td>No tiene apuestas vendidas el d&iacute;a de hoy.</td></tr></tbody>
          </Table>
          </div>);
      }


      if(!empty(ticketssports)) {

              for(let k=0;k<ticketssports.length;k++){
                rowsMyTickets.push(<tr key={ticketssports[k].ticket.confirm}>
                    <td><span style={{cursor: 'pointer'}}><Badge pill variant={'danger'} onClick={(e) => {this.handleRePrintSport(e,ticketssports[k].ticket.id)}}>Reimprimir</Badge></span> 
                    <br />{date.format(new Date(ticketssports[k].ticket.created),"hh:mm:ss A")}</td>
                    <td>{ticketssports[k].ticket.confirm}</td>
                    <td>{formatNumber(ticketssports[k].currencyName,ticketssports[k].ticket.amount)}</td>
                    <td>{formatNumber(ticketssports[k].currencyName,ticketssports[k].ticket.total_to_pay)}</td>
                    <td>{ticketssports[k].status}</td>
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
              <th>Fecha</th>
              <th># Ticket</th>
              <th>Riesgo</th>
              <th>Total a Pagar</th>
              <th>Estatus</th>
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
  ticketssports
}) => ({
  ticketssports
});
const connectedMyTickets = connect(mapToProps, actions)(MyTickets);
export { connectedMyTickets as MyTickets };

