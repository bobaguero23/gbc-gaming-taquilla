import React from 'react';
import empty from 'is-empty';
import {getAppConfig} from "../../_helpers/lib";
// Styles


class officesDefault extends React.Component {

 horsesNames = (horsesaces,wager_type_id) => {
      let horses_name = [];
      let raceArray = [];
      let raceText = [];
      if( wager_type_id==22 || wager_type_id==26 || wager_type_id==25){
        if(horsesaces.length==2){
          horses_name.push(<><br /><strong> Mi selección:{horsesaces[0].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[0].horsesRaceByHorsesRacesId.horseByHorsesId.horseName} </strong> <br />Vs. Marca: {horsesaces[1].horsesRaceByHorsesRacesId.programNumber}) {horsesaces[1].horsesRaceByHorsesRacesId.horseByHorsesId.horseName}</>);
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

    racesNames = (ticketsDetails) => {
      let raceText = [];

      for(let t of ticketsDetails){
         if (!raceText.includes(t.raceNumber)){
            raceText.push(t.raceNumber);
         }
         
      }

      return `Carrera(s) ${raceText.toString()}`;
    }

    programNumberDescriptionINH = (ticketsDetails,wagerTypeId) => {
      let programNumber = [];
      if(wagerTypeId==1 || wagerTypeId==2){
         let c1 = [];
         ticketsDetails.forEach(element => {
             if(element.place==1){
               c1.push(element.horsesRaceByHorseRaceId.programNumber);
             }
         });
         programNumber.push(<>C:{c1.toString()}</>
         );
       }

       if(wagerTypeId==4 || wagerTypeId==5 || wagerTypeId==6){
        let x = 0;
        let programNumber1 = "";
        let place2,
          place1 = 0;
        let symbol = "";
        ticketsDetails.forEach(element => {
          if (x == 1) {
            place2 = element.place;
            if (place2 == place1) {
              symbol = "+";
            } else {
              symbol = " / ";
            }
            programNumber1 += symbol + element.horsesRaceByHorseRaceId.programNumber;
            place1 = element.place;
          } else {
            programNumber1 += element.horsesRaceByHorseRaceId.programNumber;
            place1 = element.place;
          }
          x = 1;
        });
        programNumber.push(<>{programNumber1}</>);

       }

       if(wagerTypeId==11){
        let c1 = [];
        let ca1 = '';
        let c2 = [];
        let ca2 = '';
        let c3 = [];
        let ca3 = '';
        ticketsDetails.forEach(element => {
            if(element.place==1){
              c1.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca1)){
                ca1= element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==2){
              c2.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca2)){
                ca2 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==3){
              c3.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca3)){
                ca3 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
        });
        programNumber.push(<>{ca1}):{c1.toString()}<br />
        {ca2}):{c2.toString()}<br />
        {ca3}):{c3.toString()}<br /></>
        );
      }

      if(wagerTypeId==12){
        let c1 = [];
        let ca1 = '';
        let c2 = [];
        let ca2 = '';
        let c3 = [];
        let ca3 = '';
        let c4 = [];
        let ca4 = '';
        
        ticketsDetails.forEach(element => {
            if(element.place==1){
              c1.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca1)){
                ca1= element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==2){
              c2.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca2)){
                ca2 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==3){
              c3.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca3)){
                ca3 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==4){
              c4.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca4)){
                ca4 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
        });
        programNumber.push(<>{ca1}):{c1.toString()}<br />
        {ca2}):{c2.toString()}<br />
        {ca3}):{c3.toString()}<br />
        {ca4}):{c4.toString()}<br /></>
        );
      }
      
       if(wagerTypeId==14){
        let c1 = [];
        let c2 = [];
        let c3 = [];
        let c4 = [];
        let c5 = [];
        let c6 = [];
        ticketsDetails.forEach(element => {
            if(element.place==1){
                c1.push(element.horsesRaceByHorseRaceId.programNumber);
            }
            if(element.place==2){
              c2.push(element.horsesRaceByHorseRaceId.programNumber);
            }
            if(element.place==3){
              c3.push(element.horsesRaceByHorseRaceId.programNumber);
            }
            if(element.place==4){
              c4.push(element.horsesRaceByHorseRaceId.programNumber);
            }
            if(element.place==5){
              c5.push(element.horsesRaceByHorseRaceId.programNumber);
              
            }
            if(element.place==6){
              c6.push(element.horsesRaceByHorseRaceId.programNumber);
              
            }
            if(element.place==7){
              c7.push(element.horsesRaceByHorseRaceId.programNumber);
              
            }
        });
        programNumber.push(<>V1:{c1.toString()}<br />
        V2:{c2.toString()}<br />
        V3:{c3.toString()}<br />
        V4:{c4.toString()}<br />
        V5:{c5.toString()}<br />
        V6:{c6.toString()}<br /></>
        );
      }

      if(wagerTypeId==29){
        let c1 = [];
        let c2 = [];
        let c3 = [];
        let c4 = [];
        let c5 = [];
        let c6 = [];
        let c7 = [];
        let ca1 = '';
        let ca2 = '';
        let ca3 = '';
        let ca4 = '';
        let ca5 = '';
        let ca6 = '';
        let ca7 = '';

        ticketsDetails.forEach(element => {
            if(element.place==1){
              c1.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca1)){
                ca1 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==2){
              c2.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca2)){
                ca2 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
              
            }
            if(element.place==3){
              c3.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca3)){
                ca3 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==4){
              c4.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca4)){
                ca4 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==5){
              c5.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca5)){
                ca5 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==6){
              c6.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca6)){
                ca6 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
            if(element.place==7){
              c7.push(element.horsesRaceByHorseRaceId.programNumber);
              if(empty(ca7)){
                ca7 = element.horsesRaceByHorseRaceId.raceByRacesId.raceNumber;
              }
            }
        });
        programNumber.push(<>{ca1}):{c1.toString()}<br />
        {ca2}):{c2.toString()}<br />
        {ca3}):{c3.toString()}<br />
        {ca4}):{c4.toString()}<br />
        {ca5}):{c5.toString()}<br />
        {ca6}):{c6.toString()}<br />
        {ca7}):{c7.toString()}<br /></>
        );
      }
      
      return programNumber;
    }
  
  render () {
      let Barcode = require('react-barcode');
      const appConfig = getAppConfig();
      let date = require('date-and-time');
      let ticketHtml = '';
      let confirm = (!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].confirm) ? this.props.ticketInfoInh.allTicketsInhs.nodes[0].confirm.split("-")[0] : null);

      let ticket_inh = (!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].idTransactionInh) ? this.props.ticketInfoInh.allTicketsInhs.nodes[0].idTransactionInh : null);

      let headerTicket = (<><tr>
         <td colSpan="3" align="left" >
            {appConfig.logoPrint && <img src={appConfig.logoPrint} style={{width:'150px', height:'auto', marginBottom:'10px', marginLeft:'-20px'}}></img>}
         </td>
      </tr>
      <tr>
         <td colSpan="3" align="left">
            <div className="small">{this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketOfficeByTicketOfficeId.name} </div>
            <div className="small mb-20">Fecha Ticket: {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].createdAt)? date.format(new Date(this.props.ticketInfoInh.allTicketsInhs.nodes[0].createdAt),"DD MM YYYY HH:mm") :null)}</div>

            <div className="big">Serial: {confirm}</div>
            <div className="big">Ticket INH: {ticket_inh}</div>
            <div className="big">
            {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].trackName) 
            ? this.props.ticketInfoInh.allTicketsInhs.nodes[0].trackName
               :null)} {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].raceDate)? this.props.ticketInfoInh.allTicketsInhs.nodes[0].raceDate :null)}</div> 
         </td>
      </tr>
      </>)

      let footerTicket = (<>
         <tr>
            <td colSpan="3">
               <div className="big">Unidades: {((!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketUnits))?(Number(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketUnits)):null)}
               </div>
               <div className="big"> Monto de Apuesta : {!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].currencyCode) ? this.props.ticketInfoInh.allTicketsInhs.nodes[0].currencyCode : null} {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketAmount) ? this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketAmount : '')}
               </div>
               <div className="small mt-20">Ticket caduca a los 8 dias.</div>
            </td>
         </tr>
      </>)

      if(this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.id == 22){
         ticketHtml = (<div className="row ticket_to_print theme_1">
                  <div className="body_ticket">
                  <table className="table_ticket" width="230px">
                     <tbody>
                     {headerTicket}
                     
                     <tr>
                        <td colSpan="3"> 
                           <div className="big"> Carrera: {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber)
                              ? this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber 
                              :null)}
                           </div>
                           

                          <div className="big">
                           Marca : {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsByTicketsId.nodes)? 
                           this.horsesNames(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsByTicketsId.nodes,this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.id):null)}
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
                     Apuesta: {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.description)? this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.description :null)}
                  </div>
                  <div className="big"> Carrera: {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsInhsByTicketId.nodes[0].horsesRaceByHorseRaceId.raceByRacesId.raceNumber)
                              ? this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsInhsByTicketId.nodes[0].horsesRaceByHorseRaceId.raceByRacesId.raceNumber 
                              :null)}
                   </div>
                  
                  <div className="big">
                     {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsInhsByTicketId.nodes)? this.programNumberDescriptionINH(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsInhsByTicketId.nodes,this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.id):null)}
                     &nbsp;
                     {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.name)
                     ? 
                     ( (this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.name == 'WIN' || 
                        this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.name == 'PLACE' || 
                        this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.name == 'SHOW')
                     
                     ? ` - ${this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsDetailsInhsByTicketId.nodes[0].horsesRaceByHorseRaceId.horseByHorsesId.horseName}` : null):null)}
                     {(!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId) && this.props.ticketInfoInh.allTicketsInhs.nodes[0].wagerTypeByWagerTypeId.id==24 ? (!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsStallsByTicketsId.nodes) && (!empty(this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsStallsByTicketsId.nodes[0])) ? `Puesto: ${this.props.ticketInfoInh.allTicketsInhs.nodes[0].ticketsStallsByTicketsId.nodes[0].stallsTypeByStallsTypesId.stallName}` : null ) : null)}
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