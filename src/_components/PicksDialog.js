import React from 'react';
import { connect } from "redux-zero/react";
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import { ValidatorForm } from 'react-form-validator-core';
import NavRacesPools from '../_components/NavRacesPools';
import FormUnits from '../_components/FormUnits';
import SellActions from "../_actions/SellActions";
import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import { getTicketInfoPicks, formatNumber } from '../_helpers/lib';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../_actions';
import { toast } from 'react-toastify';
import Dialog from 'react-bootstrap-dialog';

class PicksDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketValue: 0,
            ticketCombinations: 0,
            valueUnits: this.props.unitsValue,
            show: false,
            allHorsesRaces: [],
            horsesRacesIdAll: [],
            horsesRacesSelected: [],
            dialogform : {
              tracksId:this.props.trackSelected[0],
              horsesRacesId:[],
          }
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitPicks = this.handleSubmitPicks.bind(this);
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChangeCheckboxAll = this.handleChangeCheckboxAll.bind(this);
    
    }

      handleClose() {
        this.setState({ show: false });
      }
    
      handleShow() {
        //this.props.dispatch(addPicksBegin());
        let allHorsesRaces = [];
        const { races } = this.props;
        for(let race of races){
          for (let horse of race.horsesRacesByRacesId.nodes){
            allHorsesRaces.push({id:horse.id, horse_name: horse.horseByHorsesId.horseName,race: race.raceNumber,program_number:horse.programNumber });
          }
        }
        this.setState({ show: true, allHorsesRaces });

      }

      handleChange(e) {
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

    calculateTicketValue() {
      const { dialogform } = this.state;
      //Create clone from Array
      const selectedHorsesAux = [...dialogform.horsesRacesId];
      let ticketInfo = getTicketInfoPicks({
          wagerTypeId: dialogform.wagerTypeId,
          selectedHorses: selectedHorsesAux,
          units: !empty(dialogform.units) ? dialogform.units : 0 ,
          valueUnits: this.props.unitsValue
      })

      this.setState({
          ticketValue : ticketInfo.ticketValue,
          ticketCombinations : ticketInfo.ticketCombinations
      })
      
  }

  confirmSubmit = (races,racesIdActive,e) => {
    e.preventDefault();
    let { dialogform, ticketCombinations,ticketValue, currencyCode,allHorsesRaces } = this.state;
    let {wagertypes, trackSelected} = this.props;
    let currencyCodeFinal =  (!empty(currencyCode)) ? currencyCode : '';

    let wagertype = (!empty(this.props.racesPools) ? this.props.racesPools.filter(w => w.wagerTypeByWagerTypeId.id ==dialogform.wagerTypeId) : null);
    let wagertypeText = (!empty(wagertype) ? `${wagertype[0].wagerTypeByWagerTypeId.name}` : null); 

    let trackText = (!empty(trackSelected) ? `${trackSelected[1]}` : null); 

    let amountText = (!empty(ticketValue) ? `Valor de ticket: ${formatNumber(currencyCodeFinal,ticketValue)}` : null); 

    
    let horses = Array.from(dialogform.horsesRacesId);

    let race = (!empty(races) ? races.filter(r => r.id == racesIdActive) : null);
    let raceText = (!empty(race) ? `Pick comienza en carrera Nro. ${race[0].raceNumber}` : null); 
    

    let horsesText = [];
    
    dialogform.horsesRacesId.forEach(function(horseRacesSelected) {
      if(!empty(horseRacesSelected)){
          (Array.isArray(horseRacesSelected) ? horseRacesSelected : Object.values(horseRacesSelected)).forEach(function(horsesrace){
              if(!empty(horsesrace)){
                  let horse = (!empty(allHorsesRaces) ? allHorsesRaces.filter(x => x.id == horsesrace.horsesRacesId) : null);
                  let horseText = (!empty(horse) ? (<tr><td>{horse[0].race}</td><td><span className={`horse-${horse[0].program_number}`}>{horse[0].program_number}</span></td><td>{horse[0].horse_name}</td></tr>) : null); 
                   horsesText.push(horseText);
              }
          })
      }
    })

    let tableHorses = (<table><thead><tr><th>Carrera</th><th>Nro.</th><th>Caballo</th></tr></thead><tbody>{horsesText}</tbody></table>)


    let bodyHtml = (<div align="center">Resumen de la jugada:
    <br /> 
    {trackText}
    {' '}
    <br />
    {raceText}
    {' '}
    {wagertypeText}
    <br />
    {tableHorses}
    <br />
    {amountText}
    <br />
    </div>); 

    if(!empty(wagertypeText) 
    && !empty(trackText)
    && !empty(amountText)
    ){
        this.dialog.show({
          title: 'Confirmar',
          body: bodyHtml,
          actions: [
              Dialog.CancelAction(),
              Dialog.OKAction(() => {
                  this.handleSubmitPicks()
              })
          ],
      })
    }else{
        toast.warn('Debe seleccionar hipódromo, tipo de apuesta, caballos, combinación valida y colocar la unidad',{position: toast.POSITION.TOP_CENTER}); 
    }
    
  }

    handleChangeCheckbox(e) {
      const item = e.target.name;
      const isChecked = e.target.checked;
      const position = e.target.id;
      const { dialogform,horsesRacesIdAll } = this.state;
      let arr = horsesRacesIdAll;
      
      if(isChecked){
          if(empty(dialogform.horsesRacesId[position]))
          {
            dialogform.horsesRacesId[position] = [];
          }
          if(!empty(horsesRacesIdAll))
          {
              arr = horsesRacesIdAll;
          }
          dialogform.horsesRacesId[position][item] = ({position:position,horsesRacesId:item});
          arr.push(Number.parseInt(item));
      }
      else{
          delete dialogform.horsesRacesId[position][item];
          delete arr[arr.indexOf(Number.parseInt(item))];
      }
      this.setState({
          horsesRacesIdAll:arr,
          dialogform: {
              ...dialogform
          }
      }, () => {
        this.calculateTicketValue();
      });
      
  }

  handleChangeCheckboxAll(e,arrAllItems) {
    const isChecked = e.target.checked;
    const position = e.target.id;
    const { dialogform,horsesRacesIdAll } = this.state;
    let arr = [];
    

    if(!empty(horsesRacesIdAll))
      {
          arr = horsesRacesIdAll;
      }

    if(isChecked){
      if(empty(dialogform.horsesRacesId[position]))
      {
        dialogform.horsesRacesId[position] = [];
      }
          arrAllItems[position].forEach(function(element) {
          dialogform.horsesRacesId[position][element] = ({position:position,horsesRacesId:element});
          arr[Number.parseInt(element)] = (Number.parseInt(element));
        });
    }
    else{
        arrAllItems[position].forEach(function(element) {
            delete dialogform.horsesRacesId[position][element];
            delete arr[arr.indexOf(Number.parseInt(element))];
          });
          
    }
    this.setState({
        horsesRacesIdAll:arr,
        dialogform: {
            ...dialogform
        }
    }, () => {
      this.calculateTicketValue();
  });
    
  }

  handleSelect(eventKey) {
    const {races} = this.props;
    const { dialogform } = this.state;
    eventKey = eventKey.split(".");
    let racesSelected = eventKey[0].split(",");
    let arrayHorsesSelected=[];
    let wagerTypeId = eventKey[1];

    
    racesSelected.forEach(function(raceNumber) {
      races.forEach(function(race) {
          if(raceNumber==race.raceNumber)
          {
            arrayHorsesSelected[raceNumber] = race.horsesRacesByRacesId.nodes; 
          }
        },this);
    },this);
        this.setState({
          horsesRacesIdAll:[],
          horsesRacesSelected: arrayHorsesSelected,
          dialogform: {
            ...dialogform,
            wagerTypeId: wagerTypeId,
            horsesRacesId:[],
          },
          
        });
        
  }

  handleSubmitPicks() {
    let horsesRacesIdSend = '';
    const { dialogform } = this.state;
            
    if((parseInt(dialogform.units)>0) && (!empty(dialogform.horsesRacesId)) && (!empty(dialogform.tracksId)) && (!empty(dialogform.wagerTypeId)))
    {
        dialogform.horsesRacesId.forEach(function(element) {
            if(!empty(element)){
                (Array.isArray(element) ? element : Object.values(element)).forEach(function(element2){
                    if(!empty(element2)){
                        horsesRacesIdSend+='{position:@' + element2.position + '@,horsesRacesId:@'+element2.horsesRacesId+'@},';
                    }
                })
            }
          })
        
        let horsesRacesIdSerialized = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
        //this.props.dispatch(sellTicket(dialogform));
        this.props.SellActions({action: 'sellTicket', params : {sellform: { ...dialogform, horsesRacesId: horsesRacesIdSerialized }}});
        this.setState({
            show:false,
            horsesRacesIdAll:[],
            ticketValue : 0,
            ticketCombinations : 0,
            dialogform : {
              tracksId:this.props.trackSelected[0],
              horsesRacesId:[],
          }
        });
    }
    else
    {
        dialogform.errormessage = 'Debe seleccionar hipódromo, tipo de apuesta, caballos y colocar la unidad';
        this.setState({
            dialogform: {
                ...dialogform
            }
        }); 
    }
    
    

  }

    racePoolsByWagerType(){
      let newRacesPools=[];
      let raceList=[];
      let currentWagerTypeName='';
      let currentWagerTypeId=0;
      let i=0;
      var rLength = this.props.racesPools.length;
      if(this.props.racesPools.length > 0 ){
        currentWagerTypeName = this.props.racesPools[0].wagerTypeByWagerTypeId.name;
        currentWagerTypeId = this.props.racesPools[0].wagerTypeByWagerTypeId.id;
        this.props.racesPools.forEach(function(race, index) {
              if(currentWagerTypeName!=race.wagerTypeByWagerTypeId.name){
                let obj = {id:race.id,wagerName:currentWagerTypeName,races:raceList,wagerTypeId:currentWagerTypeId};
                if(currentWagerTypeId!=27 && currentWagerTypeId!=28 && currentWagerTypeId!=14){ // SACAR POLLA HIPICA Y MACUARE
                  newRacesPools.push(obj);
                }
                
                i=0;
                raceList=[];
                if(race.raceByRacesId.statusId=="1"){
                  raceList[i] = race.raceList;
                  i=i+1;
                }
              }
              else{
                if(race.raceByRacesId.statusId=="1"){
                  if(!empty(race.raceList)){
                    raceList[i] = race.raceList;
                    i=i+1;
                  }
               }
              }
              currentWagerTypeName = race.wagerTypeByWagerTypeId.name;
              currentWagerTypeId = race.wagerTypeByWagerTypeId.id;
           if (index == rLength - 1) {
            
                if(race.raceByRacesId.statusId=="1"){
                  if(!empty(race.raceList)){
                    if(raceList.indexOf(race.raceList) < 0 ){
                      raceList[i] = race.raceList;
                      i=i+1;
                    }
                  }
                }
                let obj = {id:race.id,wagerName:currentWagerTypeName,races:raceList,wagerTypeId:currentWagerTypeId};
                if(currentWagerTypeId!=27 && currentWagerTypeId!=28 && currentWagerTypeId!=14){
                  newRacesPools.push(obj);
                }
              }
          
        });
      }
      return newRacesPools;
    }
    
      render() {
        const { dialogform} = this.state;
        
        const { ticketInfo,errorMessage,trackSelected } = this.props;
        

        return (
          <div className="fl">
          <PrintProvider>
            <NoPrint force>
            <Dialog className="confirm-dialog" ref={(component) => { this.dialog = component }} />
            <div className="form-group col-12 col-lg-4 col-md-6 p-0 mr-10">
              <Button variant="info" onClick={this.handleShow}>
                Picks
              </Button>
            </div>
    
            <Modal show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>Picks de {trackSelected[1]}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              {(!empty(dialogform.errormessage) ? 
                    <Alert variant="alert" dismissible>
                    {sellform.errormessage}
                    </Alert>
                    :
                    ''
                    )}
              {(!empty(errorMessage) ? 
                    <Alert variant="alert" dismissible>
                    {errorMessage}
                    </Alert>
                    :
                    ''
                    )}

            <ValidatorForm ref="formPickDialog" onSubmit={this.handleSubmitPicks}> 
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                        {this.props.trackSelected[1]}
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                              <NavRacesPools 
                              racesPools={this.racePoolsByWagerType()} 
                              horsesRacesSelected={this.state.horsesRacesSelected}
                              handleSelect={this.handleSelect}
                              handleChangeCheckbox={this.handleChangeCheckbox}
                              handleChangeCheckboxAll={this.handleChangeCheckboxAll}
                              checkedHorses={this.state.horsesRacesIdAll} 
                              /> 
                              <FormUnits
                              ticketvalue={this.state.ticketValue}
                              ticketCombinations={this.state.ticketCombinations}
                              unitsValue={this.state.valueUnits}
                              handleChange={this.handleChange} 
                              handleSubmit={this.handleSubmitPicks}
                              confirmSubmit={this.confirmSubmit}
                              value={(!empty(this.state.dialogform.units) ? this.state.dialogform.units : '')}
                              currencyCode={this.props.currencyCode}
                              races={this.props.races}
                              activeKey={this.props.activeKey}
                              />             
                        </div>
                    </div>
                </div>
                <div className="row">                                        
                    <div className="col-lg-12 col-md-1">
                        <button className="btn btn-info" type="submit">Aceptar</button>
                    </div>
                </div>
          </ValidatorForm>
    
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


const mapStateToProps = ({ 
  alldata,
  ticketInfo,
  errorMessage
}) => ({
  alldata,
  ticketInfo,
  errorMessage
});

// Export the class
export default connect(mapStateToProps, actions)(PicksDialog);
