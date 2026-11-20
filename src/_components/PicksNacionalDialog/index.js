import React from 'react';
import { connect } from "redux-zero/react";
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import { ValidatorForm } from 'react-form-validator-core';
import NavRacesPoolsNacional from '../NavRacesPoolsNacional';
import FormUnitsNacional from '../FormUnitsNacional';

import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import { getTicketInfoPicksINH } from '../../_helpers/lib';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../../_actions';
import AuthActions from '../../_actions/AuthActions';
import { toast } from 'react-toastify';
const date = require('date-and-time');

class PicksNacionalDialog extends React.Component {
    constructor(props) {
        
        super(props);
        this.state = {
            ticketValue: 0,
            ticketCombinations: 0,
            valueUnits: 0,
            show: false,
            horsesRacesIdAll:[],
            horsesRacesSelected:[],
            sellform : {
              raceDate : this.props.raceDate,
              trackId : this.props.trackSelected.id,
              trackName : this.props.trackSelected.trackName,
              horsesRacesId:[],
            }
        };
    
    }

      handleClose = () => {
        this.setState({ show: false });
      }
    
      handleShow = () => {
        const { sellform } = this.state;
        let params ={};
        this.props.WagerTypesActions({action: 'getAllPicksINH', params: {params}});
        this.setState({ 
          horsesRacesIdAll:[],
            horsesRacesSelected:[],
          sellform : {
            ...sellform,
            raceDate : this.props.raceDate,
            trackId : this.props.trackSelected.id,
            trackName : this.props.trackSelected.trackName
          },
          show: true });
        
      }

      handleChange = (e) => {
        const { name, value } = e.target;
        const { sellform } = this.state;
        this.setState({
            sellform: {
                ...sellform,
                [name]: parseInt(value)
            }
        }, () => {
          this.calculateTicketValue();
      });
        
    }

    calculateTicketValue() {
      const { sellform, valueUnits } = this.state;
      //Create clone from Array
      const selectedHorsesAux = [...sellform.horsesRacesId];

      let ticketInfo = getTicketInfoPicksINH({
          wagerTypeId: sellform.wagerTypeId,
          selectedHorses: selectedHorsesAux,
          units: !empty(sellform.units) ? sellform.units : 0 ,
          valueUnits: valueUnits
      })

      this.setState({
          ticketValue : ticketInfo.ticketValue,
          ticketCombinations : ticketInfo.ticketCombinations
      })
      
  }

  handleChangeCheckbox = (e,race) => {
    //console.log('handleChangeCheckbox::::::::',race);
    let raceId = race.id;
    let values = e.target.name;
    let arrSplit = values.split('-');
    let item = arrSplit[0];
    let horseRaceNumber = arrSplit[1];
    const isChecked = e.target.checked;
    const position = e.target.id;
    const { sellform,horsesRacesIdAll } = this.state;
    let arr = [];

    
    if(isChecked){
        
        if(empty(horsesRacesIdAll[raceId])) {
            horsesRacesIdAll[raceId] = [];
        }
        
        if(!empty(horsesRacesIdAll[raceId][position])) {
            arr = horsesRacesIdAll[raceId][position];
        }

        if(empty(sellform.horsesRacesId[position])) {
            sellform.horsesRacesId[position] = [];
        }

        sellform.horsesRacesId[position][item] = ({position:position,horsesRacesId:item,horsesRacesNumber:horseRaceNumber,raceId:race.id,raceNumber:race.raceNumber});
        arr.push(Number.parseInt(item));
        horsesRacesIdAll[raceId][position] = arr;

    } else {
        
        delete sellform.horsesRacesId[position][item];
        delete horsesRacesIdAll[raceId][position][horsesRacesIdAll[raceId][position].indexOf(Number.parseInt(item))];
    }

    this.setState({
        ...horsesRacesIdAll,
        sellform: {
            ...sellform
        }
    }, () => {
        
        this.calculateTicketValue();
    });
    
}


  handleChangeCheckboxAll = (e,arrAllItems) => {
    const isChecked = e.target.checked;
    const position = e.target.id;
    const { sellform,horsesRacesIdAll } = this.state;
    let arr = [];
    

    if(!empty(horsesRacesIdAll))
      {
          arr = horsesRacesIdAll;
      }

    if(isChecked){
      if(empty(sellform.horsesRacesId[position]))
      {
        sellform.horsesRacesId[position] = [];
      }
          arrAllItems[position].forEach(function(element) {
          sellform.horsesRacesId[position][element] = ({position:position,horsesRacesId:element});
          arr[Number.parseInt(element)] = (Number.parseInt(element));
        });
    }
    else{
        arrAllItems[position].forEach(function(element) {
            delete sellform.horsesRacesId[position][element];
            delete arr[arr.indexOf(Number.parseInt(element))];
          });
          
    }
    this.setState({
        horsesRacesIdAll:arr,
        sellform: {
            ...sellform
        }
    }, () => {
      this.calculateTicketValue();
  });
    
  }

  handleSelect = (eventKey) => {
    const {races, wagertypesINH } = this.props;
    let { sellform, valueUnits } = this.state;
    eventKey = eventKey.split(".");
    let racesSelected = eventKey[0].split(",");
    let arrayHorsesSelected=[];
    let wagerTypeId = eventKey[1]; 

    let wagerType= wagertypesINH.find((w) => w.id == wagerTypeId);
    valueUnits = wagerType.wagerTypesValueUnitsByWagerTypeId.nodes[0].valueUnit

    racesSelected.forEach(function(raceNumber) {
      races.forEach(function(race) {
          if(raceNumber==race.raceNumber)
          {
            arrayHorsesSelected[raceNumber] = race.horsesRacesByRacesId.nodes; 
          }
        },this);
    },this);
        this.setState({
            valueUnits,
            horsesRacesSelected: arrayHorsesSelected,
            horsesRacesIdAll:[],
            sellform: {
              ...sellform,
              wagerTypeId: wagerTypeId,
              tracksId:this.props.trackSelected.id,
              horsesRacesId:[],
          }
        }, () => {
          this.calculateTicketValue();
        });
  }

            
  handleSubmitPicks = (e) => {
    e.preventDefault();
    let horsesRacesIdSend = '';
    const { sellform } = this.state;
    const { tracks } = this.props;

      if((parseInt(sellform.units)>0) 
      && (!empty(sellform.horsesRacesId)) 
      && (parseInt(sellform.trackId) > 0) 
      && (!empty(sellform.wagerTypeId)))
      {
        let track = (!empty(tracks) ? tracks.filter(t => t.id ==sellform.trackId) : null);
        let races = (!empty(track)) ?  track[0].racesByTracksId.nodes :[];
        sellform.raceDate = (!empty(races) ? date.format(new Date(races[0].raceDate),"YYYY-MM-DD") : '')

        let horsesRacesIdAction = Array.from(sellform.horsesRacesId);
            
        horsesRacesIdAction.forEach(function(element) {

            if(!empty(element)){
                (Array.isArray(element) ? element : Object.values(element)).forEach(function(element2){
                    if(!empty(element2)){
                        horsesRacesIdSend+='{position:@' + element2.position + '@,horsesRacesId:@'+element2.horsesRacesId+'@,horsesRacesNumber:'+element2.horsesRacesNumber+',racesId:@'+element2.raceId+'@,racesNumber:'+element2.raceNumber+'},';
                    }
                });
            }
            
        })
          
          let horsesRacesIdSerialized = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
          this.props.SellActions({action: 'sellInhTicket', params : { sellform: { ...sellform, horsesRacesId: horsesRacesIdSerialized } }}  );
  
          this.setState({
              show:false,
              horsesRacesIdAll:[],
              ticketValue : 0,
              ticketCombinations : 0,
              horsesRacesSelected:[],
              sellform : {
                raceDate: this.props.raceDate,
                tracksId:this.props.trackSelected.id,
                horsesRacesId:[],
            }
          });
        }
        else
        {
            sellform.errormessage = 'Debe seleccionar hipódromo, tipo de apuesta, caballos y colocar la unidad';
            this.setState({
                sellform: {
                    ...sellform
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
      let user = this.props.user;
      var rLength = this.props.racesPools.length;
      let type = this.props.type;


      if(this.props.racesPools.length > 0 ){
        currentWagerTypeName = (type == 'inh' ? this.props.racesPools[0].wagerTypeByWagerTypeId.description : this.props.racesPools[0].wagerTypeByWagerTypeId.name);
        currentWagerTypeId = this.props.racesPools[0].wagerTypeByWagerTypeId.id;
        this.props.racesPools.forEach(function(race, index) {
                let wtype = (type == 'inh' ? race.wagerTypeByWagerTypeId.description : race.wagerTypeByWagerTypeId.name);
                if(currentWagerTypeName!=wtype){
                  let obj = {id:race.id,wagerName:currentWagerTypeName,races:raceList,wagerTypeId:currentWagerTypeId};
                  if(currentWagerTypeId!=27 && currentWagerTypeId!=28){ // SACAR POLLA HIPICA Y MACUARE

                    // Habilitar solo 5y6 para USD
                    if(user.currency_code == 'USD' && currentWagerTypeId == 14){
                      newRacesPools.push(obj);
                    } else {
                      if(user.currency_code == 'VES'){
                        newRacesPools.push(obj);
                      }
                      
                    }
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
                    if(!empty(race.raceList))
                    {
                      
                      raceList[i] = race.raceList;
                      i=i+1;
                    }
                  }
                }

                currentWagerTypeName = (type =='inh' ? race.wagerTypeByWagerTypeId.description : race.wagerTypeByWagerTypeId.name);
                currentWagerTypeId = race.wagerTypeByWagerTypeId.id;
            if (index == rLength - 1) {
              
                  if(race.raceByRacesId.statusId=="1"){
                    if(!empty(race.raceList))
                    {
                      if(raceList.indexOf(race.raceList) < 0 ){
                        raceList[i] = race.raceList;
                        i=i+1;
                      }
                    }
                  }
                  let obj = {id:race.id,wagerName:currentWagerTypeName,races:raceList,wagerTypeId:currentWagerTypeId};
                  if(currentWagerTypeId!=27 && currentWagerTypeId!=28 ){ // SACAR POLLA HIPICA

                    // Habilitar solo 5y6 para USD
                    if(user.currency_code == 'USD' && currentWagerTypeId == 14){
                      newRacesPools.push(obj);
                    } else {
                      if(user.currency_code == 'VES'){
                        newRacesPools.push(obj);
                      }
                      
                    }

                    
                  }
                }
        });
      }

      return newRacesPools;
    }
    
      render() {
        
        const { turfClass, sellform} = this.state;
        
        const {errorMessage, raceDate } = this.props;
        

        return (
          <div className="fl">
          <PrintProvider>
            <NoPrint force>
            <div className="form-group col-12 col-lg-12 col-md-12 p-0 mr-10">
              <Button className="btn-full" variant="info" onClick={this.handleShow}>
                {this.props.title}
              </Button>
            </div>
    
            <Modal show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>{`${this.props.title}- ${this.props.trackSelected.trackName}  ${raceDate}`}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
            <ValidatorForm ref="formPickDialog" onSubmit={this.handleSubmitPicks}> 
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                              <NavRacesPoolsNacional 
                              racesPools={this.racePoolsByWagerType()} 
                              horsesRacesSelected={this.state.horsesRacesSelected}
                              handleSelect={this.handleSelect}
                              handleChangeCheckbox={(e, r) => this.handleChangeCheckbox(e, r)} 
                              handleChangeCheckboxAll={(e, arr) => this.handleChangeCheckboxAll(e, arr)}
                              checkedHorses={this.state.horsesRacesIdAll}
                              wagerTypeId={this.state.sellform.wagerTypeId}
                              type='inh' 
                              /> 
                              <FormUnitsNacional
                              ticketvalue={this.state.ticketValue}
                              ticketCombinations={this.state.ticketCombinations}
                              unitsValue={this.state.valueUnits}
                              handleChange={this.handleChange} 
                              handleSubmit={this.handleSubmitPicks}
                              value={(!empty(this.state.sellform.units) ? this.state.sellform.units : '')}
                              />             
                        </div>
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

const mapToProps = ({
  user,
  tracks,
  ticketInfo,
  wagertypesINH
}) => ({
  user,
  tracks,
  ticketInfo,
  wagertypesINH
});
const connectedPicksDialog = connect(mapToProps, actions)(PicksNacionalDialog);
export { connectedPicksDialog as PicksNacionalDialog };
