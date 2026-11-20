import React from 'react';
import { connect } from "redux-zero/react";
import {Modal,Badge,Button} from 'react-bootstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TableCocks from '../TableCocks';

import empty from 'is-empty';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../../_actions';
import { toast } from 'react-toastify';

class CocksDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketValue: 0,
            ticketCombinations: 0,
            turfClass: this.props.trackSelected[2],
            show: false,
            horsesRacesIdAll:[],
            horsesRacesSelected:[],
            amount_usd: 1,
            dialogform : {
              wagerTypeId: 27,
              tracksId:this.props.trackSelected[0],
              horsesRacesId:[],
          }
        };    
    }

      handleClose = () =>   {
        this.setState({ show: false });
      }
    
      handleShow = () => {
        let params = {tracksId:this.props.trackSelected[0]};
        this.setState({ 
            ticketValue: 0,
            ticketCombinations: 0,
            turfClass: this.props.trackSelected[2],
            show: true,
            horsesRacesIdAll:[],
            horsesRacesSelected:[],
            dialogform : {
              wagerTypeId: 27,
              tracksId:this.props.trackSelected[0],
              horsesRacesId:[],
          }
        
        });
      }

      handleChange = (e) => {
        const { name, value } = e.target;
        const { dialogform } = this.state;
        this.setState({
            dialogform: {
                ...dialogform,
                [name]: value
            }
        }, () => {
          this.calculateTicketValue();
      });
        
    }

  handleChangeCheckbox = (e) => {
    
    const item = e.target.name;
    const isChecked = e.target.checked;
    const id = e.target.id;
    let arrId = id.split("-"); 
    let position = arrId[0];
    let programNumber = arrId[1];
    const { dialogform,horsesRacesIdAll } = this.state;

    let arr = horsesRacesIdAll;
    
    if(isChecked){
       
        delete dialogform.horsesRacesId[position];
        delete horsesRacesIdAll[position];
        dialogform.horsesRacesId[position] = [];
        horsesRacesIdAll[position] = item;
        dialogform.horsesRacesId[position][item] = ({position:position,horsesRacesId:item, programNumber:programNumber});
    }
    else{
        delete dialogform.horsesRacesId[position][item];
        delete arr[arr.indexOf(Number.parseInt(item))];
    }
    this.setState({
        horsesRacesIdAll:horsesRacesIdAll,
        dialogform: {
            ...dialogform
        }
    });
    
}

  handleSubmitCocks = (amount,e) => {
    e.preventDefault();
    let horsesRacesIdSend = '';
    const { dialogform } = this.state;
    
      if((parseFloat(amount)>0) 
      && (!empty(dialogform.horsesRacesId)) 
      && (!empty(dialogform.tracksId)) 
      && (!empty(dialogform.wagerTypeId)))
      {

          let cock1 = 0;
          let cock2 = 0;
          let cock3 = 0;
          let cock4 = 0;
          let cock5 = 0;
          let cock6 = 0;

              dialogform.horsesRacesId.forEach(function(element) {
                  if(!empty(element)){
                      (Array.isArray(element) ? element : Object.values(element)).forEach(function(element2){
                          if(!empty(element2)){
                              if(element2.position==1){cock1++;}
                              if(element2.position==2){cock2++;}
                              if(element2.position==3){cock3++;}
                              if(element2.position==4){cock4++;}
                              if(element2.position==5){cock5++;}
                              if(element2.position==6){cock6++;}
                              horsesRacesIdSend+='{position:@' + element2.position + '@,horsesRacesId:@'+element2.horsesRacesId+'@},';
                          }
                      })
                  }
                })
          if((cock1 == 1) && (cock2 == 1) && (cock3 == 1) && (cock4 == 1) && (cock5 == 1) && (cock6 == 1)){
              
              let horsesRacesIdSerialized = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
              let sellformCopy = { ...dialogform, horsesRacesId: horsesRacesIdSerialized, units: amount, amount: amount };
              this.props.SellActions({action: 'sellCockTicket', params : { sellform: sellformCopy }}  );
      
              this.setState({ 
                ticketValue: 0,
                ticketCombinations: 0,
                turfClass: this.props.trackSelected[2],
                show: false,
                horsesRacesIdAll:[],
                horsesRacesSelected:[],
                dialogform : {
                  wagerTypeId: 27,
                  tracksId:this.props.trackSelected[0],
                  horsesRacesId:[],
              }
            
            });
            
            }
            else
            {
                toast.warn('Debe seleccionar un caballo por carrera.',{position: toast.POSITION.TOP_CENTER});
                this.setState({
                    dialogform: {
                        ...dialogform
                    }
                }); 
            }
        }
        else
        {
            toast.warn('Debe seleccionar hipódromo, tipo de apuesta, caballos y colocar la unidad',{position: toast.POSITION.TOP_CENTER});
            this.setState({
                dialogform: {
                    ...dialogform
                }
            }); 
        }

  }

  horsesNames = (horsesaces,wager_type_id) =>{
    let horses_name = [];    
      for(let l=0;l<horsesaces.length;l++){
        horses_name.push(<>C{horsesaces[l].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber} - ({horsesaces[l].horsesRaceByHorsesRacesId.programNumber}) / </>);
      }  

    return horses_name;
  }

  compare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const totalPointsA = a.totalPoints;
    const totalPointsB = b.totalPoints;
  
    let comparison = 0;
    if (totalPointsA > totalPointsB) {
      comparison = 1;
    } else if (totalPointsA < totalPointsB) {
      comparison = -1;
    }
    return comparison * -1;
  }

  rowsMyTickets = () =>{
    const { cocksTickets, user} = this.props;
    let rowsMyTickets = [];
    let ticketsPoints = [];
    let currency_code =  (!empty(user)) ? user.currency_code : '';
    
  if(!empty(cocksTickets)) {

    for(let k=0;k<cocksTickets.length;k++){ 
      if(!empty(cocksTickets[k].ticketsDetailsByTicketsId) && 
      !empty(cocksTickets[k].ticketsDetailsByTicketsId.nodes) && 
      (cocksTickets[k].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.trackByTracksId.id == this.props.trackSelected[0]) ){

          ticketsPoints.push({
            index:k,
            ticketsId:cocksTickets[k].id,
            totalPoints:cocksTickets[k].ticketsCocksByTicketsId.nodes[0].totalPoints,
  
          });
        
      }
    }

    ticketsPoints.sort(this.compare);
    
    for(let k=0;k<ticketsPoints.length;k++){     
        let i = ticketsPoints[k].index;
        if(!empty(cocksTickets[i].ticketsDetailsByTicketsId) && 
        !empty(cocksTickets[i].ticketsDetailsByTicketsId.nodes) && 
        (cocksTickets[i].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.trackByTracksId.id == this.props.trackSelected[0]) ){
          rowsMyTickets.push(<tr key={cocksTickets[i].confirm}>
            <td><Badge variant={cocksTickets[i].userByUsersId.userAlias == user.user_alias ? 'success' : 'danger' }>{cocksTickets[i].userByUsersId.userAlias}</Badge></td>
            <td>{this.horsesNames(cocksTickets[i].ticketsDetailsByTicketsId.nodes,cocksTickets[i].wagerTypeByWagerTypeId.id)}</td>
            <td>{cocksTickets[i].ticketsCocksByTicketsId.nodes[0].totalPoints}</td>
          </tr>);
        }
    }
  }

  return rowsMyTickets;

  }
    
    
      render() {
        const { turfClass, dialogform,amount_usd} = this.state;
        
        const {errorMessage,cocksTickets, ticketoffice, currencyCode} = this.props;

        
        let cockInfo = (!empty(ticketoffice) && !empty(ticketoffice[0]) && !empty(ticketoffice[0].centerByCentersId) && !empty(ticketoffice[0].centerByCentersId.centersCurrencyConfigurationsByCentersId) && !empty(ticketoffice[0].centerByCentersId.centersCurrencyConfigurationsByCentersId.nodes) ) ? ticketoffice[0].centerByCentersId.centersCurrencyConfigurationsByCentersId.nodes[0] : {};

        let jackPot = 0;
        if(!empty(cockInfo)){
          jackPot = cockInfo.cockAccumulated;
          if(currencyCode=='USD'){
            jackPot = jackPot;
          }

        }

        let totalToPay = 0;
        if(!empty(this.props.cock) && !empty(this.props.cock[0].totalToPay)){
          if(currencyCode=='USD'){
            totalToPay = this.props.cock[0].totalToPay;
          }
          
        }

        let accumulated = 0;
        if(!empty(this.props.cock) && !empty(this.props.cock[0].accumulated)){
          if(currencyCode=='USD'){
            accumulated = this.props.cock[0].accumulated;
          }
          
        }

        let totalToPaySecondPlace = 0;
        if(!empty(this.props.cock) && !empty(this.props.cock[0].secondPlace)){
          if(currencyCode=='USD'){
            totalToPaySecondPlace = this.props.cock[0].secondPlace;
          }
          
        }

        return (
          <div className="row display-b">
          <PrintProvider>
            <NoPrint force>
            {!empty(this.props.cock) ? 
                    <div className="form-group col-12">
                    <Button className="btn-full" variant="info" onClick={this.handleShow}>
                      {'Polla Hípica' }
                    </Button>
                  </div>          
            : null}
    
            <Modal dialogClassName={`center_53`} show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>{'Polla Hípica'} - {this.props.trackSelected[1]}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
            <ValidatorForm ref="formPickDialog" onSubmit={this.handleSubmitCocks}> 
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                              <TableCocks
                                racesPools={this.props.racesPools}
                                races={this.props.races}
                                handleChangeCheckbox={this.handleChangeCheckbox}
                                handleChangeCheckboxAll={this.handleChangeCheckboxAll}
                                checkedHorses={this.state.horsesRacesIdAll}
                                currencyCode={this.props.currencyCode}
                                handleSubmitCocks={this.handleSubmitCocks}
                                cock={this.props.cock}
                                />         
                        </div>
                    </div>
                </div>
          </ValidatorForm>
              <br />
              <h3>REGLAS DE LA POLLA</h3>
              <ul className="list-group list-group-flush">
              <li className="list-group-item">PUNTUACIÓN: <br />
              1er Lugar = 5 Ptos <br />
              2do Lugar = 3 Ptos <br />
              3er Lugar = 1 Pto </li>
              <li className="list-group-item">En caso de empate para el 1er Lugar ambos obtienen 5 ptos pero no se otorga puntuación al 3ero.</li>
              <li className="list-group-item">En caso de empate para el 2do Lugar ambos obtienen 3 ptos pero no se otorga puntuación al 3ero.</li>
              <li className="list-group-item">En caso de empate para el 3er Lugar ambos obtienen 1 pto.</li>
              <li className="list-group-item">Primer lugar: Se considera ganador del monto a repartir para el primer lugar, al usuario que acumule la mayor cantidad de puntos al finalizar la última carrera válida para la Polla Hípica. Si existen varios usuarios con la misma puntuación máxima, el monto a repartir por el primer lugar se distribuirá en partes iguales entre ellos.</li>
              <li className="list-group-item">Segundo lugar: Se considera ganador del monto a repartir para el segundo lugar, al usuario que acumule la segunda mayor cantidad de puntos al finalizar la última carrera válida para la Polla Hípica. Si existen varios usuarios con la misma segunda mayor puntuación, el monto a repartir por el segundo lugar se distribuirá en partes iguales entre ellos.</li>
              <li className="list-group-item">No está contemplado premiación para los usuarios que acumulen la tercera mayor cantidad de puntos al finalizar la última carrera válida para la Polla Hípica, es decir NO hay premiación para el 3er. lugar.</li>
              <li className="list-group-item">La Polla Hípica contempla premios sólo para el Primer Lugar (Polla Hípica con la Puntuación máxima) y Segundo Lugar (Polla Hípica con la segunda Puntuación máxima).</li>
              <li className="list-group-item">Las Pollas tienen una hora tope de jugada, después de la hora de cierre no será válida la jugada.</li>
              <li className="list-group-item">Una vez efectuada sus combinaciones no se hace reintegro de saldos ni mucho menos se anulan las jugadas.</li>
              <li className="list-group-item">Cuando un Caballo esté retirado y está en sus combinaciones se tomará el número siguiente, si el número siguiente igualmente está retirado se tomará el siguiente y así sucesivamente hasta llegar a un ejemplar activo.</li>
              <li className="list-group-item">Monto Acumulado Jackpot 30 puntos: En caso de que la puntuación de la polla sea 30 puntos al monto a repartir se le suma el monto acumulado.</li>
              <li className="list-group-item">En las pollas hípicas no son válidas las llaves, por lo que, cada caballo va jugando por separado.</li>
              </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleClose}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
            </NoPrint>
            </PrintProvider>
          </div>
        );
      }
    
    
}

const mapToProps = ({
  tracks,
  cocksTickets,
  ticketInfo,
  ticketoffice,
  user
}) => ({
  tracks,
  cocksTickets,
  ticketInfo,
  ticketoffice,
  user
});
const connectedPicksDialog = connect(mapToProps, actions)(CocksDialog);
export { connectedPicksDialog as CocksDialog };
