import React from 'react';
import { connect } from "redux-zero/react";
import {NavHeaderArgentino} from '../_components/NavHeaderArgentino';
import PrintProvider, { NoPrint } from 'react-easy-print';
import TracksDropDown from '../_components/TracksDropDown';
import FormUnits from '../_components/FormUnits';
import ButtonsPayHsip from '../_components/ButtonsPayHsip';
import {NextRacesHsip} from '../_components/NextRacesHsip';
import TabRacesArgentino from '../_components/TabRacesArgentino';
import {MyTicketsHsip} from '../_components/MyTicketsHsip';
import ComponentToPrintSellArgentino from '../_components/ComponentToPrintSellArgentino';
import ComponentToPrintPayArgentino from '../_components/ComponentToPrintPayArgentino';
import {MacuaresHsipDialog} from '../_components/MacuaresHsipDialog';
import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import { getTicketInfo } from '../_helpers/lib'
import actions from '../_actions';
const date = require('date-and-time');

class SellArgentinoPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey : '',
            ticketValue: 0,
            ticketCombinations: 0,
            valueUnits: 1,
            currencyCode: this.props.currencyCode,
            specialKey: null,
            horsesRacesIdAll:[],
            sellform : {
                wagerTypeId: '',
                trackId: null,
                trackName: '',
                raceDate: '',
                horsesRacesIdDirect: [],
                horsesRacesId:[],
            }
        };

    }

    componentDidMount = () =>{ 
        this.props.TicketsActions({action: 'getMyTicketsHSIP'});
        this.props.SellActions({action: 'getAllTracksListHsip'});
        this.props.WagerTypesActions({action: 'getAll'});
        this.props.RacesActions({action: 'getNextRacesHsip'});
        const userProps = this.props.user;
        this.props.TicketOfficesActions({action: 'me', params: {params:userProps}});
        const { sellform } = this.state;
        this.setState({
            sellform : {
                ...sellform,
                errormessage : this.props.errorMessage
            }
        });

    }

    handleChange = (e) => {

        const { name, value } = e.target;
        let { sellform, horsesRacesIdAll, activeKey } = this.state;
        let selectedHorses = sellform.horsesRacesId;
        const { tracks} = this.props;
        let trackId = sellform.trackId;
        let trackName = sellform.trackName;
        let races = [];
        let raceDate = sellform.raceDate;


        if (name == 'tracksId' || 
            name == 'wagerTypeId') {
            sellform.horsesRacesIdDirect = [];
            horsesRacesIdAll = [];
            activeKey = null;
            selectedHorses = [];
        }

        if (name == 'tracksId') {
            localStorage.removeItem('tabActiveKey');
            this.props.updateTracksId(parseInt(value));         
        }

        
        this.setState({
            horsesRacesIdAll,
            activeKey,
            sellform: {
                ...sellform,
                horsesRacesId : selectedHorses,
                [name]: value
            }
        }, () => {
            
            this.calculateTicketValue();    
                    
        });
        
        
    }

    handleChangeInputDirect = (e, wagerType, position, horseRaceId,horseProgramNumber,raceId,raceNumber) => {

        let { sellform } = this.state;
        sellform.horsesRacesIdDirect = [];
        if((!empty(e.target.value))){

            let unitsValue = parseInt(e.target.value);
            if(unitsValue >= 1 && unitsValue <= 500){

                sellform.horsesRacesIdDirect[horseRaceId] = {
                    wagerType: wagerType,
                    position: position,
                    directUnits: unitsValue
                };
                sellform.wagerTypeId = wagerType;
                sellform.units =unitsValue;
                sellform.horsesRacesId=[];
                sellform.horsesRacesId[position] = [];
                sellform.horsesRacesId[position][horseRaceId] = ({position:position,horsesRacesId:horseRaceId,horsesRacesNumber:horseProgramNumber,raceId:raceId,raceNumber:raceNumber});;

            } else {
                sellform.wagerTypeId = '';
                sellform.units = '';
                sellform.horsesRacesId=[];
            }

           

        } else {
            sellform.wagerTypeId = '';
            sellform.units = '';
            sellform.horsesRacesId=[];
        }

        this.setState({
            sellform: {
                ...sellform
            }
        }, () => {
            this.calculateTicketValue();
        });

    }

    calculateTicketValue = () => {
        let { sellform, valueUnits } = this.state;
        const {wagertypes} = this.props;
        //Create clone from Array
        const selectedHorsesAux = [...sellform.horsesRacesId];

       
        let wagerType= wagertypes.find((w) => w.id == sellform.wagerTypeId);
        valueUnits = (!empty(wagerType) && !empty(wagerType.wagerTypesValueUnitsHsipsByWagerTypeId) && !empty(wagerType.wagerTypesValueUnitsHsipsByWagerTypeId.nodes[0]) ) ? wagerType.wagerTypesValueUnitsHsipsByWagerTypeId.nodes[0].valueUnit : 0;

        let ticketInfo = getTicketInfo({
            wagerTypeId: sellform.wagerTypeId,
            selectedHorses: selectedHorsesAux,
            units: !empty(sellform.units) ? sellform.units : 0 ,
            valueUnits: valueUnits
        })

        this.setState({
            ticketValue : ticketInfo.ticketValue,
            ticketCombinations : ticketInfo.ticketCombinations,
            valueUnits
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
        const wagerTypeId = sellform.wagerTypeId; 
        let arr = [];
        const wagerTypeOneHorseSelect = [1,2];

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

            if(wagerTypeOneHorseSelect.includes(wagerTypeId)){
                horsesRacesIdAll[raceId] = [];
                arr=[];
                sellform.horsesRacesId[position] = [];
                sellform.horsesRacesId[position][item] = [];
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
        const racesId = Number.parseInt(e.target.name);
        const { sellform,horsesRacesIdAll } = this.state;
        let arr = [];
        
        if(isChecked){

            if(empty(horsesRacesIdAll[racesId])) {
                horsesRacesIdAll[racesId] = [];
            }

            if(empty(sellform.horsesRacesId[position])) {
                sellform.horsesRacesId[position] = [];
            }

            arrAllItems[racesId][position].forEach(function(element) {
                sellform.horsesRacesId[position][element] = ({position:position,horsesRacesId:element});
                arr.push(Number.parseInt(element));
            });

            horsesRacesIdAll[racesId][position] = arr;

        } else {
            arrAllItems[racesId][position].forEach(function(element) {
                delete sellform.horsesRacesId[position][element];
            });
            delete horsesRacesIdAll[racesId][position];
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

    handleSubmit = (e) => {

        let horsesRacesIdSend = '';
        e.preventDefault();
        const { sellform, ticketCombinations } = this.state;
        const {tracks} = this.props;

        let trackData = !empty(tracks) ? tracks[0] : null;
        sellform.trackName = (!empty(trackData) && !empty(trackData.trackName) ? trackData.trackName : '');

        sellform.trackId = trackData.id;

        let races = (!empty(trackData) && !empty(trackData.racesByTracksId) && !empty(trackData.racesByTracksId.nodes)) ?  trackData.racesByTracksId.nodes :[];
        sellform.raceDate = (!empty(races) && !empty(races[0]) && !empty(races[0].raceDate)  ? date.format(new Date(races[0].raceDate),"YYYY-MM-DD") : '');
        
        if( (parseFloat(sellform.units)>0) &&
            (!empty(sellform.horsesRacesId)) && 
            (!empty(sellform.trackId)) &&
            (!empty(sellform.trackName)) &&
            (!empty(sellform.raceDate)) && 
            (!empty(sellform.wagerTypeId)) && 
            (ticketCombinations > 0) ) {

            sellform.horsesRacesId.forEach(function(element) {

                if(!empty(element)){
                    (Array.isArray(element) ? element : Object.values(element)).forEach(function(element2){
                        if(!empty(element2)){
                            horsesRacesIdSend+='{position:@' + element2.position + '@,horsesRacesId:@'+element2.horsesRacesId+'@,horsesRacesNumber:'+element2.horsesRacesNumber+',racesId:@'+element2.raceId+'@,racesNumber:'+element2.raceNumber+'},';
                        }
                    });
                }

               
            })
            
            let horsesRacesIdSerialized = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
            this.props.SellActions({action: 'sellHsipTicket', params : {sellform: { ...sellform, horsesRacesId: horsesRacesIdSerialized }}}); 
            
            this.setState({
                horsesRacesIdAll:[],
                ticketValue : 0,
                ticketCombinations : 0,
            });

        } else {
            sellform.errormessage = 'Debe seleccionar hipódromo, tipo de apuesta, caballos, combinación valida y colocar la unidad';
            this.setState({
                sellform: {
                    ...sellform,
                }
            }); 
        }
        

    }

    handleSelect = (eventKey) => {
        this.setState({
            horsesRacesIdAll : [],
            activeKey: eventKey 
        });
    }

    onCloseAlert = () =>{
        const { sellform } = this.state;
        this.setState({
            sellform : {
                ...sellform,
                errormessage : null
            }
        });
    }

    getActiveKey(races){

        // cambio solo el hipodromo 
            // existe carrera abierta? 
                // muestra la carrera abierta
            // no:
                // muestra la primera

        let result = localStorage.getItem('tabActiveKey');
        let localActiveKey = localStorage.getItem('tabActiveKey');
        
        if(!empty(this.state.activeKey)){
            
            result = this.state.activeKey;
        
        } else {


            if(empty(localActiveKey) || localActiveKey == 'null'){

                if((!empty(races.find((r) => r.statusId==1)))) {

                    result = races.find((r) => r.statusId==1)["id"];

                } else {

                    result = races[0].id ;

                }

            }

        }

        if(result != null){
            localStorage.setItem('tabActiveKey', result);
        }
        
        return result;
    }

    onClickTrackNextRace = (trackId) =>{
        localStorage.removeItem('tabActiveKey');
        this.props.updateTracksId(trackId);
    }
 
    render() {
        const { sellform} = this.state;
        const { tracks,ticketInfoHsip,payInfoHsip,currentTimestamp,currencyCode } = this.props;
        let races = [];
        let racesPools = [];
        let trackSelected = '';
        let trackNewSelected = {
            id: sellform.trackId,
            trackName: sellform.trackName
        }
        let raceDate = this.state.sellform.raceDate;
        let cock = {};
        let macuare = {};
        let channel,trackType = {};
        let activeKey = this.state.activeKey;

        if(!empty(tracks)){
            trackSelected={0:tracks[0].id,1:tracks[0].trackName,2:tracks[0].turfClass};
            trackNewSelected = {
                id: tracks[0].id,
                trackName: tracks[0].trackName
            }
            
            races = !empty(tracks[0]) && !empty(tracks[0].racesByTracksId) ? tracks[0].racesByTracksId.nodes : null;
            if(empty(raceDate)){
                raceDate = (!empty(races) && !empty(races[0]) && !empty(races[0].raceDate)  ? date.format(new Date(races[0].raceDate),"YYYY-MM-DD") : '')
            } 
            macuare = !empty(tracks[0]) && !empty(tracks[0].macuaresByTracksId) ? tracks[0].macuaresByTracksId.nodes : null;   
            
            racesPools = (!empty(tracks[0].racesPoolsByTracksId)) ? tracks[0].racesPoolsByTracksId.nodes : [] ;
            trackType = tracks[0].trackType;
            if(!empty(races)){
                activeKey = this.getActiveKey(races);
            }
        }
        
        
        return (
            <div id="wrapper">
            <PrintProvider>
            <NoPrint>
            {(!empty(ticketInfoHsip) 
            && !empty(ticketInfoHsip.allTicketsHsips) 
            && !empty(ticketInfoHsip.allTicketsHsips.nodes)  ?
            <ComponentToPrintSellArgentino {...this.props} /> : null)}
            {(!empty(payInfoHsip) ?
            <ComponentToPrintPayArgentino {...this.props} /> : null)}
                <NavHeaderArgentino />
                <div id="page-wrapper-full">
                {(!empty(sellform.errormessage) ? 
                    <Alert variant="warning" onClose={this.onCloseAlert} dismissible >
                    {sellform.errormessage}
                    </Alert>
                    :
                    ''
                )}
                <form ref="form" onSubmit={this.handleSubmit}>
                    <div className="container-fluid">
                        <div className="row d-flex flex-row clearfix">
                            <div className="col-12 col-md-4 col-xl-3 col-sm-4 content-left">
                                
                                <div className="row">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <ButtonsPayHsip specialKey={this.state.specialKey} type='inh' />
                                    </div>
                                    
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <MyTicketsHsip />
                                    </div>

                                    <div className="col-12 col-md-12 col-xl-12">
                                        <NextRacesHsip {...this.props} onClickTrackNextRace={this.onClickTrackNextRace} />
                                    </div>   

                                </div>


                                    
                            </div>
                            <div className="col-12 col-md-8 col-xl-9 col-sm-8 content-center">
                                
                                <div className="row block-sell-form">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <h3>Vender Ticket</h3>
                                    </div>
                                    <div className="col-12 col-md-4 col-xl-4">
                                        <TracksDropDown handleChange={this.handleChange}  trackSelected={this.props.trackSelected} />
                                    </div>
                                    
                                    <div className="col-12 col-md-8 col-xl-4">

                                    {( trackSelected  ? 
                                    
                                        <FormUnits
                                            ticketvalue={this.state.ticketValue}
                                            ticketCombinations={this.state.ticketCombinations}
                                            unitsValue={this.state.valueUnits}
                                            currencyCode={currencyCode}
                                            handleChange={this.handleChange} 
                                            handleSubmit={this.handleSubmit}
                                            value={(!empty(this.state.sellform.units) ? this.state.sellform.units : '')}
                                            />
                                     : ''
                                    )}
                                    </div>

                                    <div className="col-12 col-md-12 col-xl-12">
                                        
                                        {(!empty(macuare) ?                                 
                                        <MacuaresHsipDialog 
                                        racesPools={racesPools} 
                                        races={races} 
                                        trackSelected={trackSelected}
                                        currencyCode={currencyCode}
                                        macuare={macuare}
                                        />
                                        : 
                                        null   
                                        )}

                                    </div>
                                    
                                </div>

                                <div className="row block-races-tabs">
                                    <div className="col-12 col-md-12 col-xl-12">

                                    {(
                                        (races.length > 0 ) ? 
                                        <TabRacesArgentino 
                                        sellform={this.state.sellform}
                                        currentTimestamp={currentTimestamp}
                                        trackSelected={trackSelected}
                                        races={races} 
                                        checkedHorses={this.state.horsesRacesIdAll} 
                                        activeKey={activeKey} 
                                        wagerTypeId={this.state.sellform.wagerTypeId} 
                                        handleSelect={(e) => this.handleSelect(e)}
                                        handleChangeCheckbox={(e, r) => this.handleChangeCheckbox(e, r)} 
                                        handleChangeInputDirect={this.handleChangeInputDirect}
                                        handleSubmit={this.handleSubmit}
                                        /> 
                                        : 
                                    null   
                                        )}

                                    </div>

                                    
                                </div>

                                
                                
                                
                                
                                
                                
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
                </NoPrint>
                </PrintProvider>
            </div>
            
        );
    }
}


const mapStateToProps = ({ 
    loading,
    alldatanointerval,
    alldata,
    ticketInfoHsip,
    payInfoHsip,
    error,
    tickets,
    wagertypes,
    ticketoffice,
    allNextRacesHsip,
    balance
}) => ({
    loading,
    alldatanointerval,
    alldata,
    ticketInfoHsip,
    payInfoHsip,
    error,
    tickets,
    wagertypes,
    ticketoffice,
    allNextRacesHsip,
    balance
});

const connectedSellArgentinoPage = connect(mapStateToProps, actions)(SellArgentinoPage);
export { connectedSellArgentinoPage as SellArgentinoPage };
 