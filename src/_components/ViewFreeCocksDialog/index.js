import React from 'react';
import { connect } from "redux-zero/react";
import {Modal,Badge,Button,Alert} from 'react-bootstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TableFreeCocks from '../TableFreeCocks';

import empty from 'is-empty';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../../_actions';
import { toast } from 'react-toastify';

class ViewFreeCocksDialog extends React.Component {
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
              username: ''
          }
        };    
    }

      handleClose = () =>   {
        this.setState({ show: false });
      }
    
      handleShow = () => {
        let params = !empty(this.props.freecock) && !empty(this.props.freecock[0]) ? {cock_id:parseInt(this.props.freecock[0].id)} : {}; 
        this.props.TicketsActions({action: 'getAllTicketsProcFreeCocksById', params: {params}});  
        this.setState({ 
          show: true
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
    
      if((!empty(dialogform.horsesRacesId)) 
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
              let sellformCopy = { ...dialogform, horsesRacesId: horsesRacesIdSerialized, units: 0, amount: 0 };
              this.props.SellActions({action: 'sellFreeCockTicket', params : { sellform: sellformCopy }}  );
      
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
    
    const { freeCocksTickets,user} = this.props;
    let cocksTickets = freeCocksTickets;
    let rowsMyTickets = [];

     if(empty(cocksTickets)) { 
        return null;
    }

    for(let i=0; i < cocksTickets.length;i++){     
 
        rowsMyTickets.push(
          <tr key={cocksTickets[i].id}>
            <td>
                  {cocksTickets[i].userAlias}/{cocksTickets[i].confirm}
             </td>
            <td>{cocksTickets[i].raceNumber1} - ({cocksTickets[i].programNumber1}) </td>
            <td>{cocksTickets[i].raceNumber2} - ({cocksTickets[i].programNumber2}) </td>
            <td>{cocksTickets[i].raceNumber3} - ({cocksTickets[i].programNumber3}) </td>
            <td>{cocksTickets[i].raceNumber4} - ({cocksTickets[i].programNumber4}) </td>
            <td>{cocksTickets[i].raceNumber5} - ({cocksTickets[i].programNumber5}) </td>
            <td>{cocksTickets[i].raceNumber6} - ({cocksTickets[i].programNumber6}) </td>

            <td>{cocksTickets[i].totalPoints}</td>
        </tr>);
        
    }

    return rowsMyTickets;
  }
    
    
      render() {

        return (
          <div className="row display-b">
          <PrintProvider>
            <NoPrint force>
            {!empty(this.props.freecock) ?  
                  <div className="form-group col-12">
                  <Button className="btn-full" variant="info" onClick={this.handleShow}>
                    {'Ver Pollas Selladas' }
                  </Button>
                </div>
            : null}
    
            <Modal dialogClassName={`center_53`} show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>{'Polla Hípica Gratis'} - {this.props.trackSelected[1]}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div className="table-responsive">
                          <table className="table table-sm cocks-multiple">
                          <thead>
                            <tr>
                              <th>Usuario/Ticket</th>
                              <th>Carrera - (Caballo) 1</th>
                              <th>Carrera - (Caballo) 2</th>
                              <th>Carrera - (Caballo) 3</th>
                              <th>Carrera - (Caballo) 4</th>
                              <th>Carrera - (Caballo) 5</th>
                              <th>Carrera - (Caballo) 6</th>
                              <th>TotalPuntos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.rowsMyTickets()}
                            </tbody>
                          </table>     
                          </div>
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
  freeCocksTickets,
  ticketInfo,
  ticketoffice,
  user
}) => ({
  tracks,
  freeCocksTickets,
  ticketInfo,
  ticketoffice,
  user
});
const connectedViewFreeCocksDialog = connect(mapToProps, actions)(ViewFreeCocksDialog);
export { connectedViewFreeCocksDialog as ViewFreeCocksDialog };
