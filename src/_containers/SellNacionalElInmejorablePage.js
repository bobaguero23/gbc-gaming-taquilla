import React from 'react';
import { connect } from "redux-zero/react";
import {NavHeaderNacional} from '../_components/NavHeaderNacional';
import PrintProvider, { NoPrint } from 'react-easy-print';
import TracksDropDown from '../_components/TracksDropDown';
import FormUnits from '../_components/FormUnits';
import ButtonsPayRefundInhElInmejorable from '../_components/ButtonsPayRefundInhElInmejorable';
import {NextRaces} from '../_components/NextRaces';
import TabRacesNacionalElInmejorable from '../_components/TabRacesNacionalElInmejorable';
import {MyTicketsINHFisicas} from '../_components/MyTicketsINHFisicas';
import ComponentToPrintSellINH from '../_components/ComponentToPrintSellINH';
import ComponentToPrintPayINH from '../_components/ComponentToPrintPayINH';
import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import { getTicketInfo } from '../_helpers/lib'
import actions from '../_actions';
const date = require('date-and-time');

class SellNacionalElInmejorablePage extends React.Component {

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
                trackId: this.props.trackSelected,
                trackName: '',
                raceDate: '',
                horsesRacesIdDirect: [],
                horsesRacesId:[],
            }
        };

    }

    componentDidMount = () =>{ 
        this.props.TicketsActions({action: 'getMyTicketsINH'});
        this.props.SellActions({action: 'getAllTracksListInh'});
        this.props.WagerTypesActions({action: 'getAll'});
        this.props.RacesActions({action: 'getNextRacesNacionales'});
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
            if(unitsValue >= 1 && unitsValue <= 50000){

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
        valueUnits = (!empty(wagerType) && !empty(wagerType.wagerTypesValueUnitsByWagerTypeId) && !empty(wagerType.wagerTypesValueUnitsByWagerTypeId.nodes[0]) ) ? wagerType.wagerTypesValueUnitsByWagerTypeId.nodes[0].valueUnit : 0;

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

        let trackData = tracks.find((t) => t.id == sellform.trackId);
        sellform.trackName = (!empty(trackData) && !empty(trackData.trackName) ? trackData.trackName : '');

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
            this.props.SellActions({action: 'sellInhElInmejorableTicket', params : {sellform: { ...sellform, horsesRacesId: horsesRacesIdSerialized }}}); 
            
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
        const { sellform, currencyCode,valueUnits} = this.state;
        const { tracks,ticketInfoInh,allOfficedata,payInfoInh,currentTimestamp,balance } = this.props;
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

            for(let i=0;i<tracks.length;i++) {
                if(tracks[i].id==this.props.trackSelected) {
                    trackSelected={0:tracks[i].id,1:tracks[i].trackName,2:tracks[i].turfClass};
                    trackNewSelected = {
                        id: tracks[i].id,
                        trackName: tracks[i].trackName
                    }
                    
                    races = !empty(tracks[i]) && !empty(tracks[i].racesByTracksId) ? tracks[i].racesByTracksId.nodes : null;
                    if(empty(raceDate)){
                       raceDate = (!empty(races) && !empty(races[0]) && !empty(races[0].raceDate)  ? date.format(new Date(races[0].raceDate),"YYYY-MM-DD") : '')
                    }    
                    
                    racesPools = (!empty(tracks[i].racesPoolsByTracksId)) ? tracks[i].racesPoolsByTracksId.nodes : [] ;
                    trackType = tracks[i].trackType;
                    break;
                }
            }


            if(!empty(races)){

                activeKey = this.getActiveKey(races);
            }
            

        }
        
        
        return (
            <div id="wrapper">
            <PrintProvider>
            <NoPrint>
            {(!empty(ticketInfoInh) 
            && !empty(ticketInfoInh.allTicketsInhs) 
            && !empty(ticketInfoInh.allTicketsInhs.nodes)  ?
            <ComponentToPrintSellINH {...this.props} /> : null)}
            {(!empty(payInfoInh) ?
            <ComponentToPrintPayINH {...this.props} /> : null)}
                <NavHeaderNacional />
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
                                        <ButtonsPayRefundInhElInmejorable specialKey={this.state.specialKey} type='inh' />
                                    </div>
                                    
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <MyTicketsINHFisicas />
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
                                    
                                    {/* <div className="col-12 col-md-6 col-xl-4">
                                        <WagerTypesDropDown handleChange={this.handleChange} wagerTypeId={this.state.sellform.wagerTypeId} type="inh" />
                                    </div> */}

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
                                    
                                </div>

                                <div className="row block-races-tabs">
                                    <div className="col-12 col-md-12 col-xl-12">

                                    {(
                                        (races.length > 0 ) ? 
                                        <TabRacesNacionalElInmejorable 
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
    ticketInfoInh,
    payInfoInh,
    error,
    tickets,
    wagertypes,
    ticketoffice,
    allNextRaces,
    balance
}) => ({
    loading,
    alldatanointerval,
    alldata,
    ticketInfoInh,
    payInfoInh,
    error,
    tickets,
    wagertypes,
    ticketoffice,
    allNextRaces,
    balance
});

const connectedSellNacionalPage = connect(mapStateToProps, actions)(SellNacionalElInmejorablePage);
export { connectedSellNacionalPage as SellNacionalElInmejorablePage };
 