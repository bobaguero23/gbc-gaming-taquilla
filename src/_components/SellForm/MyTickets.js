import React from 'react';
import { connect } from 'redux-zero/react';
import { Table, Row, Col } from 'react-bootstrap';
import empty from 'is-empty';
import actions from '../../_actions';
import { formatNumber } from '../../_helpers/lib';

class MyTickets extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.tickets !== this.props.tickets;
  }

  raceText(races) {
    const raceArray = [];
    const raceText = [];
    for (const race of races) {
      if (!empty(raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber])) {
        raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber].push(race.horsesRaceByHorsesRacesId.programNumber);
      } else {
        raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber] = [race.horsesRaceByHorsesRacesId.programNumber];
      }
    }

    for (const raceNumber in raceArray) {
      const horses = raceArray[raceNumber].toString();
      raceText.push(<span key={raceNumber}>
        {raceNumber}
        )
        {' '}
        <b>{horses}</b>
        {' '}
      </span>);
    }

    return raceText;
  }

  render() {
    const { tickets } = this.props;

    const rowsMyTickets = [];
    const date = require('date-and-time');
    if (empty(tickets)) {
      return (
        <Row>
          <Col xl={12}>
            <h3>Mis apuestas del d&iacute;a</h3>
            <Table striped bordered hover size="sm" responsive>
              <tbody><tr key="ticket-list"><td>No tiene apuestas realizadas el d&iacute;a de hoy, ¿Qué esperas para hacer una?. </td></tr></tbody>
            </Table>
          </Col>
        </Row>
      );
    }

    if (!empty(tickets)) {
      for (let k = 0; k < tickets.length; k++) {
        rowsMyTickets.push(<tr key={tickets[k].confirm}>
          <td>{date.format(new Date(tickets[k].created), 'hh:mm:ss A')}</td>
          <td>{tickets[k].confirm}</td>
          <td>
            {(!empty(tickets[k].ticketsDetailsByTicketsId.nodes) ? tickets[k].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.trackByTracksId.trackName : null)}
            <br />
            {(!empty(tickets[k].ticketsDetailsByTicketsId.nodes) ? this.raceText(tickets[k].ticketsDetailsByTicketsId.nodes) : null)}
          </td>
          <td>
            {tickets[k].wagerTypeByWagerTypeId.name}
            {' '}
            {(!empty(tickets[k].wagerTypeByWagerTypeId) && tickets[k].wagerTypeByWagerTypeId.id == 24 ? (!empty(tickets[k].ticketsStallsByTicketsId.nodes) && (!empty(tickets[k].ticketsStallsByTicketsId.nodes[0])) ? tickets[k].ticketsStallsByTicketsId.nodes[0].stallsTypeByStallsTypesId.stallName : null) : null)}
            {' '}
            /
            {' '}
            {formatNumber(tickets[k].ticketOfficeByTicketOfficesId.currencyCode, tickets[k].amount)}
          </td>
          <td>{tickets[k].ticketsStatusByStatusId.name}</td>
                           </tr>);
        if (k == 9) {
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
              <tr key="ticket-list">
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
    );
  }
}

const mapToProps = ({
  tickets,
}) => ({
  tickets,
});
const connectedMyTickets = connect(mapToProps, actions)(MyTickets);
export { connectedMyTickets as MyTickets };
