import React from 'react';
import { connect } from "redux-zero/react";
import {Table} from 'react-bootstrap';
import empty from 'is-empty';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';
import {Badge } from "react-bootstrap";

class MyTicketsINHFisicas extends React.Component {

  handleRePrint = (e,ticket_id) => {

    //console.log('REPRINT');
    e.preventDefault();
    if(!empty(ticket_id)){
       this.props.SellActions({action: 'getTicketInfoINH', params : {ticketId:ticket_id}});
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

      const { ticketsINH } = this.props;
      let tickets = ticketsINH;

      let statusName =  [];
      statusName[2] = 'TOTALIZADO INH';
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
                    <td>****{(tickets[k].confirm.substring(4,7))}</td>
                    <td>{tickets[k].trackName}<br />   
                    {(!empty(tickets[k]) && !empty(tickets[k].ticketsDetailsInhsByTicketId) && !empty(tickets[k].ticketsDetailsInhsByTicketId.nodes) ? this.raceText(tickets[k].ticketsDetailsInhsByTicketId.nodes): null )}
                    </td>
                    <td>{!empty(tickets[k]) && !empty(tickets[k].wagerTypeByWagerTypeId) ? tickets[k].wagerTypeByWagerTypeId.description : null} / {!empty(tickets[k]) ?formatNumber(tickets[k].currencyCode, tickets[k].ticketAmount) : null}</td>
                    
                  </tr>);
                  if(k==9)
                  {
                    break;
                  }
              }  
            
        
      }

       return (
        <div className="row block-my-tickets"> 
          <h3>Tickets Vendidos de Ganadores</h3>
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
  ticketsINH
}) => ({
  ticketsINH
});
const connectedMyTicketsINH = connect(mapToProps, actions)(MyTicketsINHFisicas);
export { connectedMyTicketsINH as MyTicketsINHFisicas };

