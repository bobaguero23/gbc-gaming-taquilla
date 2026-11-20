import React from 'react';
import empty from 'is-empty';
import {wagerTypeDescription} from  "../../_helpers/lib";
import {programNumberDescription} from  "../../_helpers/lib";
import {labelCountWager} from  "../../_helpers/lib";
import {getAppConfig} from "../../_helpers/lib";
// Styles


class officesDefault extends React.Component {

 horsesNames = (horsesaces,wager_type_id) => {
      let horses_name = [];
      let raceArray = [];
      let raceText = [];
      if( wager_type_id==22 || wager_type_id==26 || wager_type_id==25){
        if(horsesaces.length==2){
          horses_name.push(<><br /><strong> Mi selección:{horsesaces[0].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[0].horsesRaceByHorsesRacesId.horseByHorsesId.horseName} <br /></strong> Vs. Marca: {horsesaces[1].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[1].horsesRaceByHorsesRacesId.horseByHorsesId.horseName}</>);
        }else{
          for(let l=0;l<horsesaces.length;l++){
            horses_name.push(<> Caballo: {horsesaces[l].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[l].horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </>);
          }
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
      let Barcode = require('react-barcode');
      const appConfig = getAppConfig();
      let date = require('date-and-time');
      let ticketHtml = '';

      let headerTicket = (<><tr>
         <td colSpan="3" align="left" >
            {appConfig.logoPrint && <img src={appConfig.logoPrint} style={{width:'80px', height:'auto', marginBottom:'10px', marginLeft:'-20px'}}></img>}
         </td>
      </tr>
      <tr>
         <td colSpan="3" align="left">
            <div className="small">{this.props.ticketInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId.name} </div>
            <div className="small mb-20">Fecha: {(!empty(this.props.ticketInfo.allTickets.nodes[0].created)? date.format(new Date(this.props.ticketInfo.allTickets.nodes[0].created),"DD MM YYYY HH:mm") :null)}</div>

            <div className="big">Serial: {(!empty(this.props.ticketInfo.allTickets.nodes[0].confirm) ? this.props.ticketInfo.allTickets.nodes[0].confirm: null)}</div>
            <div className="big">
            {(!empty(this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.trackByTracksId.trackName) 
            ? this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.trackByTracksId.trackName
               :null)}</div> 
         </td>
      </tr>
      </>)

      let footerTicket = (<>
         <tr>
            <td colSpan="3">
               <div className="big">Unidades: {(!empty(this.props.ticketInfo.allTickets.nodes[0].amount) && (!empty(this.props.ticketInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId.valueUnits))?(Number(this.props.ticketInfo.allTickets.nodes[0].amount)/Number(this.props.ticketInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId.valueUnits)):null)}
               </div>
               <div className="big"> Monto de Apuesta: {!empty(this.props.ticketInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId) ? this.props.ticketInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId.currencyCode : null} {(!empty(this.props.ticketInfo.allTickets.nodes[0].amount) && (!empty(this.props.ticketInfo.allTickets.nodes[0].ticketOfficeByTicketOfficesId.valueUnits))?(Number(this.props.ticketInfo.allTickets.nodes[0].amount)):null)}
               </div>
               <div className="small mt-20">Ticket caduca a los 8 dias.</div>
            </td>
         </tr>
      </>)

      if(this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.id == 22){
         ticketHtml = (<div className="row ticket_to_print theme_1">
                  <div className="body_ticket">
                  <table className="table_ticket" width="230px">
                     <tbody>
                     {headerTicket}
                     
                     <tr>
                        <td colSpan="3"> 
                           <div className="big"> Carrera: {(!empty(this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber)
                              ? this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber 
                              :null)}
                           </div>
                           

                          <div className="big">
                           Marca : {(!empty(this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes)? 
                           this.horsesNames(this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes,this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.id):null)}
                           </div>

                        </td>
                     </tr>
                     {footerTicket}
                     </tbody>
                  </table> 
                  
                  </div>
               </div>);
      }else{
         ticketHtml = (<div className="row ticket_to_print theme_1">
         <div className="body_ticket">
         <table className="table_ticket" width="230px">
            <tbody>
            {headerTicket}
            <tr>
               <td colSpan="3"> 

                  <div className="big"> 
                     Carrera: {(!empty(this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber)
                     ? this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber 
                     :null)}
                  </div>

                  <div className="big">
                     Apuesta: {(!empty(this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.name)? this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.name :null)}
                  </div>
                  
                  <div className="big">
                     {(!empty(this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes)? programNumberDescription(this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes):null)}
                     &nbsp;
                     {(!empty(this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.name)
                     ? 
                     ( (this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.name == 'WIN' || 
                        this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.name == 'PLACE' || 
                        this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.name == 'SHOW' ||
                        this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.name == 'TABLA FIJA' || 
                        this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.name == 'PUESTOS') 
                     
                     ? ` - ${this.props.ticketInfo.allTickets.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.horseByHorsesId.horseName}` : null):null)}
                     {(!empty(this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId) && this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.id==24 ? (!empty(this.props.ticketInfo.allTickets.nodes[0].ticketsStallsByTicketsId.nodes) && (!empty(this.props.ticketInfo.allTickets.nodes[0].ticketsStallsByTicketsId.nodes[0])) ? <><br />Puesto: {this.props.ticketInfo.allTickets.nodes[0].ticketsStallsByTicketsId.nodes[0].stallsTypeByStallsTypesId.stallName}</> : null ) : null)}
                     {(!empty(this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId) && this.props.ticketInfo.allTickets.nodes[0].wagerTypeByWagerTypeId.id==21 ?  <><br />Tablas jugadas: {this.props.ticketInfo.allTickets.nodes[0].units}</> : null)}
                   </div>
                  </td>
            </tr>
            {footerTicket}
            </tbody>
         </table> 
         </div>
      </div>);
      }

       return ticketHtml
   }
}


export default officesDefault;