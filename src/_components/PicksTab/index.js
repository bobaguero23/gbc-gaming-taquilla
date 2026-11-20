import React from 'react';
import { connect } from "redux-zero/react";
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import { ValidatorForm } from 'react-form-validator-core';
import RacesPools5y6 from '../RacesPools5y6';
import FormUnits from '../FormUnits';
import {ScratchesByRaces}  from '../ScratchesByRaces'

import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import { getTicketInfoPicksINH } from '../../_helpers/lib';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../../_actions';
import AuthActions from '../../_actions/AuthActions';
import { toast } from 'react-toastify';
import config from "config";

class PicksTab extends React.Component {
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
              units:1
            }
        };
    
    }
    
     componentDidMount(){
        this.handleSelect5y6();
      }

      componentDidUpdate(prevProps){
        if (this.props.trackSelected.id !== prevProps.trackSelected.id) {
          this.handleSelect5y6();
        }
      }

      handleChange = (e) => {
        const { name, value } = e.target;
        const { sellform } = this.state;
        this.setState({
            sellform: {
                ...sellform,
                [name]: value
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
      });

      this.setState({
          ticketValue : ticketInfo.ticketValue,
          ticketCombinations : ticketInfo.ticketCombinations
      })
      
  }

  handleChangeCheckbox = (e,race) => {

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
    const {races, wagertypes } = this.props;
    let { sellform, valueUnits } = this.state;
    eventKey = eventKey.split(".");
    let racesSelected = eventKey[0].split(",");
    let arrayHorsesSelected=[];
    let wagerTypeId = eventKey[1];
    let closeRace = false;

    let wagerType= wagertypes.find((w) => w.wagerTypeIdPublic == wagerTypeId);
    valueUnits = wagerType.wagerTypesValueUnitsByWagerTypeId.nodes[0].valueUnit

    racesSelected.forEach(function(raceNumber) {
      races.forEach(function(race) {
          if(raceNumber==race.raceNumber){
            if(!closeRace){
              if(race.statusId==2){
                closeRace=true;
                }            
             }
            arrayHorsesSelected[raceNumber] = race.horsesRacesByRacesId.nodes; 
          }
        },this);
    },this);

      if(closeRace){
        arrayHorsesSelected = [];
      }
        this.setState({
            valueUnits,
            horsesRacesSelected: arrayHorsesSelected,
            horsesRacesIdAll:[],
            sellform: {
              ...sellform,
              wagerTypeId: wagerTypeId,
              tracksId:this.props.trackSelected.id,
              horsesRacesId:[],
              units:1
          }
        }, () => {
          this.calculateTicketValue();
        });
  }

  handleSelect5y6 = () => {
    const {races, wagertypes, racesPools,currencyCode} = this.props;
    let { sellform, valueUnits } = this.state;
    let arrayHorsesSelected=[];
    let wagerTypeId = 14;
    let closeRace = false;


    //let wagerType= wagertypes.find((w) => w.wagerTypeIdPublic == wagerTypeId);
    
    if(currencyCode=='VES'){
        valueUnits = config.value5y6VES;
    }
    if(currencyCode=='USD'){
        valueUnits = 0.3;
    }
      

    let racesPools5y6 = racesPools.find((r) => r.wagerTypeId == 14);

    let racesSelected = (!empty(racesPools5y6) ? racesPools5y6.raceList : []);

    racesSelected.forEach(function(raceNumber) {
      races.forEach(function(race) {
          if(raceNumber==race.raceNumber){
            if(!closeRace){
              if(race.statusId==2){
                closeRace=true;
                }            
             }
            arrayHorsesSelected[raceNumber] = race.horsesRacesByRacesId.nodes; 
          }
        },this);
    },this);

        if(closeRace){
          arrayHorsesSelected = [];
        }
        this.setState({
            valueUnits,
            horsesRacesSelected: arrayHorsesSelected,
            horsesRacesIdAll:[],
            sellform: {
              ...sellform,
              wagerTypeId: wagerTypeId,
              tracksId:this.props.trackSelected.id,
              horsesRacesId:[],
              units:1
          }
        }, () => {
          this.calculateTicketValue();
        });
  }

            
  handleSubmitPicks = (e) => {
    e.preventDefault();
    let horsesRacesIdSend = '';
    const { sellform,ticketValue } = this.state;
      
    if((parseInt(sellform.units)>0) 
      && (!empty(sellform.horsesRacesId)) 
      && (parseInt(sellform.trackId) > 0) 
      && (!empty(sellform.wagerTypeId))){
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
          //console.log('sellform::::::::::::::::',sellform);
          this.props.SellActions({action: 'sellInhTicket', params : { sellform: { ...sellform, horsesRacesId: horsesRacesIdSerialized } }}  );

          this.setState({
            horsesRacesIdAll:[],
            horsesRacesSelected:[],
            ticketValue : 0,
            ticketCombinations : 0,
            sellform : {
                raceDate : this.props.raceDate,
                trackId : this.props.trackSelected.id,
                trackName : this.props.trackSelected.trackName,
                horsesRacesId:[],
                units:1
            }
          }, () => {
            this.handleSelect5y6()
          });
  
          
        } else {
            toast.warn('Debe seleccionar hipódromo, tipo de apuesta, caballos y colocar la unidad',{position: toast.POSITION.TOP_CENTER});
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
                    if(user.currencyCode == 'USD' && currentWagerTypeId == 14){
                      newRacesPools.push(obj);
                    } else {
                      if(user.currencyCode == 'VES'){
                        newRacesPools.push(obj);
                      }
                      
                    }
                  }
                  i=0;
                  raceList=[];
                  if(race.raceByRacesId.statusId=="2"){
                  raceList[i] = race.raceList;
                  i=i+1;
                  }
                }
                else{
                  if(race.raceByRacesId.statusId=="2"){
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
              
                  if(race.raceByRacesId.statusId=="2"){
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
                    if(user.currencyCode == 'USD' && currentWagerTypeId == 14){
                      newRacesPools.push(obj);
                    } else {
                      if(user.currencyCode == 'VES'){
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
        
        const {errorMessage } = this.props;
        

        return (
          <div className="row display-b">
          <PrintProvider>
            <NoPrint force>
            <ValidatorForm ref="formPickDialog" onSubmit={this.handleSubmitPicks}> 
                <div className="row">
                    <div className="col-lg-12 col-md-12 content-tab">
                        <h1>{`${this.props.title}- ${this.props.trackSelected.trackName}  ${this.props.raceDate}`}</h1>

                        <hr/>
                        <ScratchesByRaces horsesRacesSelected={this.state.horsesRacesSelected} />
                        <hr/>

                        <h2>{`Carreras`}</h2>
                        <div className="form-group">
                              {(this.state.horsesRacesSelected.length > 0) ? 
                              <>
                                <RacesPools5y6 
                                racesPools={this.racePoolsByWagerType()} 
                                horsesRacesSelected={this.state.horsesRacesSelected}
                                handleSelect={this.handleSelect}
                                handleChangeCheckbox={(e, r) => this.handleChangeCheckbox(e, r)} 
                                handleChangeCheckboxAll={(e, arr) => this.handleChangeCheckboxAll(e, arr)}
                                checkedHorses={this.state.horsesRacesIdAll}
                                wagerTypeId={this.state.sellform.wagerTypeId}
                                type='inh' 
                                /> 
                                <FormUnits
                                ticketvalue={this.state.ticketValue}
                                ticketCombinations={this.state.ticketCombinations}
                                unitsValue={this.state.valueUnits}
                                handleChange={this.handleChange} 
                                handleSubmit={this.handleSubmitPicks}
                                currencyCode={this.props.currencyCode}
                                value={(!empty(this.state.sellform.units) ? this.state.sellform.units : '')}
                                />
                              </>
                              : 
                              <p>No hay carreras disponibles para sellar 5 y 6</p>
                              }
                        </div>
                    </div>
                </div>
          </ValidatorForm>
    
            </NoPrint>
            </PrintProvider>
          </div>
        );
      }
    
    
}

const mapToProps = ({
  account,
  user,
  tracks,
  ticketInfo,
  wagertypes
}) => ({
  account,
  user,
  tracks,
  ticketInfo,
  wagertypes
});
const connectedPicksTab = connect(mapToProps, actions)(PicksTab);
export { connectedPicksTab as PicksTab };
