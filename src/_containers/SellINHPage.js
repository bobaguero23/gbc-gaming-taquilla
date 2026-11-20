import React from 'react';
import { connect } from "redux-zero/react";
import {NavHeader} from '../_components/NavHeader';
import PrintProvider, { NoPrint } from 'react-easy-print';
import TracksDropDown from '../_components/TracksDropDown';
import WagerTypesDropDown from '../_components/WagerTypesDropDown';
import FormUnits from '../_components/FormUnits';
import ButtonsPayRefund from '../_components/ButtonsPayRefund';
import PicksDialog from '../_components/PicksDialog';
import NextRaces from '../_components/NextRaces';
import TabRaces from '../_components/TabRaces';
import {MyTickets} from '../_components/MyTickets';
import ComponentToPrintSellINH from '../_components/ComponentToPrintSellINH';
import ComponentToPrintPay from '../_components/ComponentToPrintPay';
import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import { getTicketInfo } from '../_helpers/lib'
import actions from '../_actions';

class SellINHPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: null,
            ticketValue: 0,
            ticketCombinations: 0,
            valueUnits: 1,
            currencyCode: 'VES',
            specialKey: null,
            horsesRacesIdAll:[],
            sellform : {
                horsesRacesId:[],
            }
        };

    }

    componentDidMount = () =>{

        this.props.SellActions({action: 'getAllDataINHBySell', params : {}});
        this.props.SellActions({action: 'getAllDataINHBySellNoInterval', params : {}});
        this.props.TicketsActions({action: 'getMyTicketsINH'});
        this.intervalID = setInterval( this.handleInterval, 60000 );

        const { sellform } = this.state;
        this.setState({
            sellform : {
                ...sellform,
                errormessage : this.props.errorMessage
            }
        });

    }

    componentWillUnmount(){
        clearInterval(this.intervalID);
    }

    componentWillReceiveProps = (nextProps) =>{

        //console.log('componentWillReceiveProps',nextProps);

        const { alldatainhnointerval, errorMessage, ticketInfoInh } = nextProps;
        let { sellform, horsesRacesIdAll, activeKey } = this.state;

        if(!empty(ticketInfoInh)) {
            horsesRacesIdAll = [];
            sellform.horsesRacesId = [];
        }

        if(!empty(errorMessage)) {
            horsesRacesIdAll = [];
            activeKey = null;
        }

        if(!empty(alldatainhnointerval)){

            this.setState({
                activeKey,
                horsesRacesIdAll,
                sellform : {
                    ...sellform,
                    errormessage : errorMessage
                },
                valueUnits      : alldatainhnointerval.allTokens.nodes[0].ticketOfficeByTicketOfficesId.valueUnitsInh,
                currencyCode    : alldatainhnointerval.allTokens.nodes[0].ticketOfficeByTicketOfficesId.currencyCode,
                specialKey      : alldatainhnointerval.allTokens.nodes[0].ticketOfficeByTicketOfficesId.specialKey
            })

        }
        
    }

    handleInterval = () => {
        this.props.SellActions({action: 'getAllDataINHBySell', params : {}});
        this.props.TicketsActions({action: 'getMyTicketsINH'});
    }

    handleChange = (e) => {

        const { name, value } = e.target;
        let { sellform, horsesRacesIdAll, activeKey } = this.state;
        let selectedHorses;

        selectedHorses = sellform.horsesRacesId;
        if (name == 'tracksId' || 
            name == 'wagerTypeId') {
            horsesRacesIdAll = [];
            activeKey = null;
            selectedHorses = [];
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

    calculateTicketValue = () => {
        const { sellform, valueUnits } = this.state;
        //Create clone from Array
        const selectedHorsesAux = [...sellform.horsesRacesId];
        let ticketInfoInh = getTicketInfo({
            wagerTypeId: sellform.wagerTypeId,
            selectedHorses: selectedHorsesAux,
            units: !empty(sellform.units) ? sellform.units : 0 ,
            valueUnits: valueUnits
        })

        this.setState({
            ticketValue : ticketInfoInh.ticketValue,
            ticketCombinations : ticketInfoInh.ticketCombinations
        })
        
    }

    handleChangeCheckbox = (e,raceId) => {

        const item = e.target.name;
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

            sellform.horsesRacesId[position][item] = ({position:position,horsesRacesId:item});
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
                
        
        if( (parseFloat(sellform.units)>0) &&
            (!empty(sellform.horsesRacesId)) && 
            (!empty(sellform.tracksId)) && 
            (!empty(sellform.wagerTypeId)) && 
            (ticketCombinations > 0) ) {

            sellform.horsesRacesId.forEach(function(element) {

                if(!empty(element)){
                    (Array.isArray(element) ? element : Object.values(element)).forEach(function(element2){
                        if(!empty(element2)){
                            horsesRacesIdSend+='{position:@' + element2.position + '@,horsesRacesId:@'+element2.horsesRacesId+'@},';
                        }
                    });
                }

               
            })
            
            let horsesRacesIdSerialized = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
            this.props.SellActions({action: 'sellInhTicket', params : {sellform: { ...sellform, horsesRacesId: horsesRacesIdSerialized }}});  

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
 
    render() {
        const { sellform} = this.state;
        const { alldatainh,ticketInfoInh,allOfficedata,payInfo,ticketsinh,alldatainhnointerval } = this.props;
        let races = [];
        let racesPools = [];
        let trackSelected = '';

        if(!empty(alldatainh))
        {
            let tracks = (!empty(alldatainh.allTracks.nodes) ? alldatainh.allTracks.nodes: null);
        
            if(!empty(tracks)){
                for(let i=0;i<tracks.length;i++) {
                    if(tracks[i].id==sellform.tracksId) {
                        trackSelected={0:tracks[i].id,1:tracks[i].trackName};
                        races = tracks[i].racesByTracksId.nodes;
                        racesPools = tracks[i].racesPoolsByTracksId.nodes;
                        break;
                    }
                }
            }
        }

        return (
            <div id="wrapper">
            <PrintProvider>
            <NoPrint>
            {(!empty(ticketInfoInh) ?
            <ComponentToPrintSellINH {...this.props} /> : null)}
            {(!empty(payInfo) ?
            <ComponentToPrintPay {...this.props} /> : null)}
                <NavHeader />
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
                            <div className="col-12 col-md-3 col-xl-3 col-sm-4 content-left">
                                
                                <div className="row">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <ButtonsPayRefund specialKey={this.state.specialKey} />
                                    </div>
                                    
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <MyTickets tickets={ticketsinh}/>
                                    </div>

                                    <div className="col-12 col-md-12 col-xl-12">
                                        <NextRaces alldata={alldatainh}/>
                                    </div>

                                   

                                    

                                </div>


                                    
                            </div>
                            <div className="col-12 col-md-9 col-xl-9 col-sm-8 content-center">
                                
                                <div className="row block-sell-form">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <h3>Vender Ticket</h3>
                                    </div>
                                    <div className="col-4 col-md-4 col-xl-4">
                                        <TracksDropDown handleChange={this.handleChange}  tracks={alldatainh}/>
                                    </div>
                                    <div className="col-4 col-md-4 col-xl-4">
                                        <WagerTypesDropDown handleChange={this.handleChange} alldatanointerval={alldatainhnointerval} type="inh" />
                                    </div>
                                    <div className="col-4 col-md-4 col-xl-4">
                                    {( trackSelected  ? 
                                    
                                        <FormUnits
                                            ticketvalue={this.state.ticketValue}
                                            ticketCombinations={this.state.ticketCombinations}
                                            unitsValue={this.state.valueUnits}
                                            currencyCode={this.state.currencyCode}
                                            handleChange={this.handleChange} 
                                            handleSubmit={this.handleSubmit}
                                            value={(!empty(this.state.sellform.units) ? this.state.sellform.units : '')}
                                            />
                                     : ''
                                    )}
                                    </div>
                                    <div className="col-12 col-md-12 col-xl-12">
                                        {(racesPools.length >0 ? 
                                        <NoPrint force>
                                        <PicksDialog 
                                        racesPools={racesPools} 
                                        races={races} 
                                        trackSelected={trackSelected}
                                        unitsValue={this.state.valueUnits} 
                                        currencyCode={this.state.currencyCode} />
                                        </NoPrint>
                                        : 
                                        null   
                                        )}
                                    </div>
                                </div>

                                <div className="row block-races-tabs">
                                    <div className="col-12 col-md-12 col-xl-12">

                                    {(( (!empty(this.state.sellform.wagerTypeId)) &&
                                        races.length > 0 ) ? 
                                    <TabRaces 
                                    trackSelected={trackSelected}
                                    races={races} 
                                    checkedHorses={this.state.horsesRacesIdAll} 
                                    activeKey={(!empty(this.state.activeKey)) ? this.state.activeKey : races[0].id } 
                                    wagerTypeId={this.state.sellform.wagerTypeId} 
                                    handleSelect={(e) => this.handleSelect(e)}
                                    handleChangeCheckbox={(e, r) => this.handleChangeCheckbox(e, r)} 
                                    handleChangeCheckboxAll={(e, arr) => this.handleChangeCheckboxAll(e, arr)} />    
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
    alldatainhnointerval,
    alldatainh,
    ticketInfoInh,
    payInfo,
    error,
    ticketsinh
}) => ({
    loading,
    alldatainhnointerval,
    alldatainh,
    ticketInfoInh,
    payInfo,
    error,
    ticketsinh
});

const connectedSellINHPage = connect(mapStateToProps, actions)(SellINHPage);
export { connectedSellINHPage as SellINHPage };
 