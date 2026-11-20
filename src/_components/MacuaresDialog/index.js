import React from 'react';
import { connect } from "redux-zero/react";
import {Modal,Badge,Button,Alert} from 'react-bootstrap';
import { ValidatorForm } from 'react-form-validator-core';
import FormUnits from '../FormUnits';

import empty from 'is-empty';
import { getTicketInfoPicks } from '../../_helpers/lib';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../../_actions';
import { toast } from 'react-toastify';
import {formatNumber} from '../../_helpers/lib';
import TableMacuares from '../TableMacuares';

class MacuaresDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketValue: 0,
            ticketCombinations: 0,
            turfClass: this.props.trackSelected[2],
            amount_max_usd: 500,
            amount_max_ves: 150000000,
            amount_max_pen: 1750,
            amount_max_cop: 1750000,
            amount_min_usd: 1,
            amount_min_ves: 300000,
            amount_min_pen: 4,
            amount_min_cop: 4500,
            show: false,
            horsesRacesIdAll:[],
            horsesRacesSelected:[],
            dialogform : {
              wagerTypeId: 28,
              tracksId:this.props.trackSelected[0],
              amount: 0,
              horsesRacesId:[],
              amount_to_pay: 0
          }
        };    
    }

      handleClose = () =>   {
        this.setState({ show: false });
      }
    
      handleShow = () => {
        this.setState({ 
            ticketValue: 0,
            ticketCombinations: 0,
            turfClass: this.props.trackSelected[2],
            show: true,
            horsesRacesIdAll:[],
            horsesRacesSelected:[],
            dialogform : {
              wagerTypeId: 28,
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

  handleSubmitMacuares = (e) => {
    e.preventDefault();
    let horsesRacesIdSend = '';
    const { dialogform } = this.state;
    const { account } = this.props

    let amount = dialogform.amount;
    
    if((this.props.currencyCode == 'USD' && parseFloat(amount) > this.state.amount_max_usd) 
    || (this.props.currencyCode == 'VES' && parseFloat(amount) > this.state.amount_max_ves)
    || (this.props.currencyCode == 'PEN' && parseFloat(amount) > this.state.amount_max_pen)
    || (this.props.currencyCode == 'COP' && parseFloat(amount) > this.state.amount_max_cop)
    ){
      toast.warn('El monto de la apuesta es mayor al máximo por ticket, debe realizarla por un monto menor',{position: toast.POSITION.TOP_CENTER});
    }else if((this.props.currencyCode == 'USD' && parseFloat(amount) < this.state.amount_min_usd) 
    || (this.props.currencyCode == 'VES' && parseFloat(amount) < this.state.amount_min_ves)
    || (this.props.currencyCode == 'PEN' && parseFloat(amount) > this.state.amount_min_pen)
    || (this.props.currencyCode == 'COP' && parseFloat(amount) > this.state.amount_min_cop)
    ){
      toast.warn('El monto de la apuesta es menor al mínimo por ticket, debe realizarla por un monto mayor',{position: toast.POSITION.TOP_CENTER});
    } else{
      
      if((parseFloat(amount)>0) 
      && (!empty(dialogform.horsesRacesId)) 
      && (!empty(dialogform.tracksId)) 
      && (!empty(dialogform.wagerTypeId)))
      {

          let macuare1 = 0;
          let macuare2 = 0;
          let macuare3 = 0;
          let macuare4 = 0;
          let macuare5 = 0;
          let macuare6 = 0;

              dialogform.horsesRacesId.forEach(function(element) {
                  if(!empty(element)){
                      (Array.isArray(element) ? element : Object.values(element)).forEach(function(element2){
                          if(!empty(element2)){
                              if(element2.position==1){macuare1++;}
                              if(element2.position==2){macuare2++;}
                              if(element2.position==3){macuare3++;}
                              if(element2.position==4){macuare4++;}
                              if(element2.position==5){macuare5++;}
                              if(element2.position==6){macuare6++;}
                              horsesRacesIdSend+='{position:@' + element2.position + '@,horsesRacesId:@'+element2.horsesRacesId+'@},';
                          }
                      })
                  }
                })
          if((macuare1 == 1) && (macuare2 == 1) && (macuare3 == 1) && (macuare4 == 1) && (macuare5 == 1) && (macuare6 == 1)){
              
              let horsesRacesIdSerialized = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
              let sellformCopy = { ...dialogform, horsesRacesId: horsesRacesIdSerialized, units: amount, amount: amount };
              this.props.SellActions({action: 'sellMacuareTicket', params : { sellform: sellformCopy }}  );
      
              this.setState({ 
                ticketValue: 0,
                ticketCombinations: 0,
                turfClass: this.props.trackSelected[2],
                show: false,
                horsesRacesIdAll:[],
                horsesRacesSelected:[],
                dialogform : {
                  wagerTypeId: 28,
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
            toast.warn('Debe seleccionar hipódromo, tipo de apuesta, caballos y colocar el monto',{position: toast.POSITION.TOP_CENTER});
            this.setState({
                dialogform: {
                    ...dialogform
                }
            }); 
        }

    }
  }

  onChangeInput = (multiplier,e) => {
    const { name, value } = e.target;

    let amount_to_pay = this.state.dialogform.amount_to_pay;

    if(name=="amount"){

      amount_to_pay = ((value * multiplier));
    }

    this.setState({ 
        dialogform: {
            ...this.state.dialogform,
            [name]: value,
            amount_to_pay: amount_to_pay
        }
    });
    

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
    const { macuaresTickets, user,macuare} = this.props;
    let rowsMyTickets = [];
    let ticketsPoints = [];
    let currency_code =  (!empty(user)) ? user.currency_code : '';
    
    let multiplier = (!empty(macuare) && !empty(macuare[0]) ? macuare[0].multiplier: 0);
    
  if(!empty(macuaresTickets)) {

    for(let k=0;k<macuaresTickets.length;k++){ 
      if(!empty(macuaresTickets[k].ticketsDetailsByTicketsId) && 
      !empty(macuaresTickets[k].ticketsDetailsByTicketsId.nodes) && 
      (macuaresTickets[k].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.trackByTracksId.id == this.props.trackSelected[0]) ){

        if(currency_code == macuaresTickets[k].ticketOfficeByTicketOfficesId.currencyCode){
          ticketsPoints.push({
            index:k,
            ticketsId:macuaresTickets[k].id,
            totalPoints:macuaresTickets[k].ticketsMacuaresByTicketsId.nodes[0].totalPoints,
  
          });
        }
        
      }
    }

    ticketsPoints.sort(this.compare);
    
    for(let k=0;k<ticketsPoints.length;k++){     
        let i = ticketsPoints[k].index;
        if(!empty(macuaresTickets[i].ticketsDetailsByTicketsId) && 
        !empty(macuaresTickets[i].ticketsDetailsByTicketsId.nodes) && 
        (macuaresTickets[i].ticketsDetailsByTicketsId.nodes[0].horsesRaceByHorsesRacesId.trackByTracksId.id == this.props.trackSelected[0]) ){
          rowsMyTickets.push(<tr key={macuaresTickets[i].confirm}>
            <td><Badge variant={macuaresTickets[i].userByUsersId.userAlias == user.user_alias ? 'success' : 'danger' }>{macuaresTickets[i].userByUsersId.userAlias}</Badge></td>
            <td>{this.horsesNames(macuaresTickets[i].ticketsDetailsByTicketsId.nodes,macuaresTickets[i].wagerTypeByWagerTypeId.id)}</td>
            <td className="montoWin">{formatNumber(macuaresTickets[i].ticketOfficeByTicketOfficesId.currencyCode,macuaresTickets[i].amount)}</td>
            <td className="montoWin">{formatNumber(macuaresTickets[i].ticketOfficeByTicketOfficesId.currencyCode,(macuaresTickets[i].amount*multiplier))}</td>
          </tr>);
        }
    }
  }

  return rowsMyTickets;

  }
    
    
      render() {

        const { amount_max_usd,amount_max_ves,amount_max_pen,amount_min_usd,amount_min_ves,amount_min_pen,amount_min_cop,amount_max_cop} = this.state;

        let currencyCode = this.props.currencyCode;
        let labelMaxValue = '';
        if(currencyCode == 'USD'){
          labelMaxValue=`USD ${amount_max_usd}`;
        }else if(currencyCode == 'VES'){
          labelMaxValue=`VES ${amount_max_ves}`;
        }else if(currencyCode == 'PEN'){
          labelMaxValue=`PEN ${amount_max_pen}`;
        }else if(currencyCode == 'COP'){
          labelMaxValue=`COP ${amount_max_cop}`;
        }
  
        let labelMinValue = '';
        if(currencyCode == 'USD'){
          labelMinValue=`USD ${amount_min_usd}`;
        }else if(currencyCode == 'VES'){
          labelMinValue=`VES ${amount_min_ves}`;
        }else if(currencyCode == 'PEN'){
          labelMinValue=`PEN ${amount_min_pen}`;
        }else if(currencyCode == 'COP'){
          labelMinValue=`COP ${amount_min_cop}`;
        }
  
        

        return (
          <div className="row display-b">
          <PrintProvider>
            <NoPrint force>
            {!empty(this.props.macuare) ? 
                    <div className="form-group col-12 col-lg-4 col-md-6 p-0 mr-10">
                    <Button className="btn-full" variant="danger" onClick={this.handleShow}>
                      {'Macuare' }
                    </Button>
                  </div>          
            : null}
    
            <Modal show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>{'Macuare'} - {this.props.trackSelected[1]}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
            <ValidatorForm ref="formPickDialog" onSubmit={this.handleSubmitMacuares}> 
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                              <TableMacuares
                                racesPools={this.props.racesPools}
                                races={this.props.races}
                                handleChangeCheckbox={this.handleChangeCheckbox}
                                handleChangeCheckboxAll={this.handleChangeCheckboxAll}
                                checkedHorses={this.state.horsesRacesIdAll}
                                currencyCode={this.props.currencyCode}
                                handleSubmitMacuares={this.handleSubmitMacuares}
                                macuare={this.props.macuare}
                                onChangeInput={this.onChangeInput}
                                totalToPay={this.state.dialogform.amount_to_pay}
                                />     
                                    
                        </div>
                    </div>
                </div>
          </ValidatorForm>
              <br />
              <h3>REGLAS DEL MACUARE</h3>
              <ul className="list-group list-group-flush">
              <li className="list-group-item">El monto mínimo a jugar por ticket es: {labelMinValue}</li>
              <li className="list-group-item">El monto máximo a jugar por ticket es: {labelMaxValue}</li>
              <li className="list-group-item">Regla 1: Si en una carrera corren 5 ejemplares o menos para que el macuare sea ganador, el caballo en dicha carrera debe llegar en la primera posición.</li>
              <li className="list-group-item">Regla 2: Si en una carrera corren 6 ó 7 ejemplares para que el macuare sea ganador, el caballo en dicha carrera debe llegar en la primera posición o segunda posición.</li>
              <li className="list-group-item">Regla 3: Si en una carrera corren 8 ejemplares o más para que el macuare sea ganador, el caballo en dicha carrera debe llegar en la primera posición, segunda posición o tercera posición.</li>
              <li className="list-group-item">Los Macuares tienen una hora tope de jugada, después de la hora de cierre no será válida la jugada.</li>
              <li className="list-group-item">En los Macuares no son válidas las llaves, por lo que, cada caballo va jugando por separado.</li>
              <li className="list-group-item">Una vez efectuada sus combinaciones no se hace reintegro de saldos ni mucho menos se anulan las jugadas.</li>
              <li className="list-group-item">Cuando un Caballo esté retirado y está en sus combinaciones se tomará el número siguiente, si el número siguiente igualmente está retirado se tomará el siguiente y así sucesivamente hasta llegar a un ejemplar activo.</li>
              <li className="list-group-item">El costo a ganar es la cantidad jugada definido por el multiplicador definido en cada macuare.</li>
              <li className="list-group-item">El macuare se considera ganador si en todas las carreras cumple se cumple con las Reglas 1,2 y 3.</li>
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
  macuaresTickets,
  ticketInfo,
  ticketoffice,
  user
}) => ({
  tracks,
  macuaresTickets,
  ticketInfo,
  ticketoffice,
  user
});
const connectedMacuaresDialog = connect(mapToProps, actions)(MacuaresDialog);
export { connectedMacuaresDialog as MacuaresDialog };
