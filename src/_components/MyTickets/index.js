import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';
import {Badge, Table } from "react-bootstrap";

class MyTickets extends React.Component {

  handleRePrint = (e,ticket_id) => {

    e.preventDefault();
    if(!empty(ticket_id)){
       this.props.SellActions({action: 'getTicketInfo', params : {ticketId:ticket_id}});
    }
    else{
       let errormessage = 'Debe elegir un ticket';
       this.setState({
          errormessage: errormessage
       }); 
    }
  }

  horsesNames = (horsesaces,wager_type_id) =>{
    let horses_name = [];
    let raceArray = [];
    let raceText = [];
    if( wager_type_id==22 || wager_type_id==26 || wager_type_id==25){
      if(horsesaces.length==2){
        horses_name.push(<><strong> Mi selección:{horsesaces[0].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[0].horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </strong> Vs. {horsesaces[1].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[1].horsesRaceByHorsesRacesId.horseByHorsesId.horseName}</>);
      }else{
        for(let l=0;l<horsesaces.length;l++){
          horses_name.push(<> {horsesaces[l].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[l].horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </>);
        }
      }
    }else if(wager_type_id==4 || wager_type_id==5 || wager_type_id==6){
      for(let race of horsesaces){
          if(!empty(raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber])){
            raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber].push(<>Posición: <b>{race.place}</b><span> Caballo: <b>{race.horsesRaceByHorsesRacesId.programNumber} - {race.horsesRaceByHorsesRacesId.horseByHorsesId.horseName}</b> </span> <br /></>);
          }else{
            raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber] = [];
            raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber].push(<>Posición: <b>{race.place}</b> <span> Caballo: <b>{race.horsesRaceByHorsesRacesId.programNumber} - {race.horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </b></span> <br /></>);
          }
          
        }
    
        for (let raceNumber in raceArray) {
          let horses = raceArray[raceNumber];
          horses_name.push(<>Carrera: {raceNumber}) {horses} </>);
        }

  }else{
      for(let race of horsesaces){
        if(!empty(raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber])){
          raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber].push(<span>{race.horsesRaceByHorsesRacesId.programNumber} - {race.horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </span>);
        }else{
          raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber] = [];
          raceArray[race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber].push(<><span>{race.horsesRaceByHorsesRacesId.programNumber} - {race.horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </span></>);
        }
        
      }
  
      for (let raceNumber in raceArray) {
        let horses = raceArray[raceNumber];
        horses_name.push(<>Carrera: {raceNumber}) <b>{horses}</b> </>);
      }
 
    }
    return horses_name;
  }

  render () {

      const { tickets } = this.props;

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
                    <td>{(!empty(tickets[k].ticketsDetailsByTicketsId.nodes) ? tickets[k].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.trackByTracksId.trackName: null )}<br /> { !empty(tickets[k].ticketsDetailsByTicketsId) ? this.horsesNames(tickets[k].ticketsDetailsByTicketsId.nodes,tickets[k].wagerTypeByWagerTypeId.id) : null }
                    </td>
                    <td>{tickets[k].wagerTypeByWagerTypeId.name} {(!empty(tickets[k].wagerTypeByWagerTypeId) && tickets[k].wagerTypeByWagerTypeId.id==24 ? (!empty(tickets[k].ticketsStallsByTicketsId.nodes) && (!empty(tickets[k].ticketsStallsByTicketsId.nodes[0])) ? tickets[k].ticketsStallsByTicketsId.nodes[0].stallsTypeByStallsTypesId.stallName : null ) : null)} / {formatNumber(tickets[k].ticketOfficeByTicketOfficesId.currencyCode, tickets[k].amount)}</td>
                    
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
  tickets
}) => ({
  tickets
});
const connectedMyTickets = connect(mapToProps, actions)(MyTickets);
export { connectedMyTickets as MyTickets };

