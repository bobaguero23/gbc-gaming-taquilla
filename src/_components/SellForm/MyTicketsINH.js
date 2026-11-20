import React from 'react';
import { connect } from "redux-zero/react";
import {Button, Modal, Nav, Table, Row, Col} from 'react-bootstrap';
import empty from 'is-empty';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';

class MyTicketsINH extends React.Component {

  shouldComponentUpdate(nextProps){
    return nextProps.ticketsINH !== this.props.ticketsINH;
  }

  raceText(races){
    let raceArray = [];
    let raceText = [];
    for(let race of races){
      if(!empty(raceArray[race.horsesRaceByHorseRaceId.raceByRacesId.raceNumber])){
        raceArray[race.horsesRaceByHorseRaceId.raceByRacesId.raceNumber].push(race.horsesRaceByHorseRaceId.programNumber);
      }else{
        raceArray[race.horsesRaceByHorseRaceId.raceByRacesId.raceNumber] = [race.horsesRaceByHorseRaceId.programNumber];
      }
      
    }

    for (let raceNumber in raceArray) {
      let horses = raceArray[raceNumber].toString();
      raceText.push(<span key={raceNumber}>{raceNumber}) <b>{horses}</b> </span>);
    }

    return raceText;

  }
  
  render () {

      const { ticketsINH } = this.props;
      let statusName =  [];
      statusName[2] = 'TOTALIZADO INH';
      statusName[3] = 'PAGADO';
      statusName[10] = 'PERDEDOR';
      statusName[11] = 'ENVIADO A BILLETERA';

      let rowsMyTickets = [];
      let date = require('date-and-time');
      if(empty(ticketsINH)) {
        return (
            <Row>
                <Col xl={12}>
                    <h3>Mis apuestas del d&iacute;a</h3>
                    <Table striped bordered hover size="sm" responsive>
                     <tbody><tr key={'ticket-list'}><td>No tiene apuestas realizadas el d&iacute;a de hoy, ¿Qué esperas para hacer una?. </td></tr></tbody>
                    </Table>
                </Col>
             </Row>);
      }


      if(!empty(ticketsINH)) {

              for(let k=0;k<ticketsINH.length;k++){
                rowsMyTickets.push(<tr key={ticketsINH[k].confirm}>
                    <td>{date.format(new Date(ticketsINH[k].createdAt),"hh:mm:ss A")}</td>
                    <td>{ticketsINH[k].confirm}-{ticketsINH[k].idTransactionInh}</td>
                    <td>{(!empty(ticketsINH[k].trackName) ? ticketsINH[k].trackName: null )}<br />
                    {(!empty(ticketsINH[k].ticketsDetailsInhsByTicketId.nodes) ? this.raceText(ticketsINH[k].ticketsDetailsInhsByTicketId.nodes): null )}
                    </td>
                    <td>{ticketsINH[k].wagerTypeByWagerTypeId.description} / {formatNumber(ticketsINH[k].currencyCode, ticketsINH[k].ticketAmount)}</td>
                    <td>{statusName[ticketsINH[k].status]}</td>
                  </tr>);
                  if(k==9)
                  {
                    break;
                  }
              }  
            
        
      }

       return (
        <Row>
            <Col xl={12}>

            <h3>Mis apuestas</h3>
            <Table striped bordered hover size="sm" responsive>
            <thead>
                <tr key={'ticket-list'}>
                    <th>Fecha</th>
                    <th># Ticket</th>
                    <th>Hipódromo</th>
                    <th>Apuesta</th>
                    <th>Estatus</th>
                </tr>
            </thead>
            <tbody>
              {rowsMyTickets}
            </tbody>
            </Table>  

            </Col>
        </Row>
      )
   }
}

const mapToProps = ({
  ticketsINH
}) => ({
  ticketsINH
});
const connectedMyTicketsINH = connect(mapToProps, actions)(MyTicketsINH);
export { connectedMyTicketsINH as MyTicketsINH };

