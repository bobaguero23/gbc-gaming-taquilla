import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';
import {Badge, Table } from "react-bootstrap";

class MyTicketsCocks extends React.Component {

  handleRePrint = (e,ticket_id) => {
    e.preventDefault();
    if(!empty(ticket_id)){
       this.props.SellActions({action: 'getTicketHeaderCock', params : {ticketId:ticket_id}});
    }
    else{
       let errormessage = 'Debe elegir un ticket';
       this.setState({
          errormessage: errormessage
       }); 
    }
  }


  render () {

      const { ticketsCocks } = this.props;
      let tickets = ticketsCocks;

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

              for(let k=0;k<tickets.length;k++)
              {
                rowsMyTickets.push(<tr key={tickets[k].confirm}>
                    <td><span style={{cursor: 'pointer'}}><Badge pill variant={'danger'} onClick={(e) => {this.handleRePrint(e,tickets[k].id)}}>Reimprimir</Badge></span> 
                    <br />{date.format(new Date(tickets[k].created),"hh:mm:ss A")}
                    <br />{(!empty(tickets[k]) ? `****${tickets[k].confirm.substring(5,8)}` : null)}</td>
                    <td>{(!empty(tickets[k].trackByTracksId) ? tickets[k].trackByTracksId.trackName: null )}<br /> 
                    </td>
                    <td>{tickets[k].playInText}</td>
                    
                  </tr>);
                  if(k==9)
                  {
                    break;
                  }
              }  
            
        
      }

       return (
        <div className="row block-my-tickets"> 
          <h3>Tickets Vendidos</h3>
          <Table className="table table-sm my-tickets" responsive>
          <thead>
            <tr>
              <th>Datos</th>
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
  ticketsCocks
}) => ({
  ticketsCocks
});
const connectedMyTickets = connect(mapToProps, actions)(MyTicketsCocks);
export { connectedMyTickets as MyTicketsCocks };

