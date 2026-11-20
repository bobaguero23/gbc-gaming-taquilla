import React from 'react';
import { connect } from "redux-zero/react";
import {NavHeader} from '../_components/NavHeader';
import PrintProvider, { NoPrint } from 'react-easy-print';
import TracksDropDown from '../_components/TracksDropDown';
import WagerTypesDropDown from '../_components/WagerTypesDropDown';
import FormUnits from '../_components/FormUnits';
import ButtonsPayRefund from '../_components/ButtonsPayRefund';
import PicksDialog from '../_components/PicksDialog';
import {MacuaresDialog} from '../_components/MacuaresDialog';
import {CocksDialog} from '../_components/CocksDialog';
import {NextRaces} from '../_components/NextRaces';
import TabRaces from '../_components/TabRaces';
import {MyTickets} from '../_components/MyTickets';
import ComponentToPrintSell from '../_components/ComponentToPrintSell';
import ComponentToPrintPay from '../_components/ComponentToPrintPay';
import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import { getTicketInfo, formatNumber } from '../_helpers/lib'
import actions from '../_actions';
import {MarksDialog} from '../_components/MarksDialog';
import {StallsDialog} from '../_components/StallsDialog';
import { toast } from 'react-toastify';
import Dialog from 'react-bootstrap-dialog';



class SellHipicaWinPage extends React.Component {

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
                horsesRacesIdDirect: [],
                horsesRacesId:[],
            }
        };

    }

    componentDidMount = () =>{
        this.props.TicketsActions({action: 'getMyTicketsInterval'});
        this.props.SellActions({action: 'getAllTracks'});
        this.props.WagerTypesActions({action: 'getAll'});
        this.props.RacesActions({action: 'getNextRaces'});
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

    componentWillReceiveProps = (nextProps) =>{

        const { tracks } = this.props;
        const { errorMessage, ticketInfo, ticketoffice } = nextProps;
        let { sellform, horsesRacesIdAll, activeKey } = this.state;

        if(JSON.stringify(nextProps.tracks) != JSON.stringify(tracks)){
            this.props.RacesActions({action: 'getNextRaces'});
        }

        if(!empty(ticketInfo)) {
            horsesRacesIdAll = [];
            sellform.horsesRacesId = [];
        }

        if(!empty(errorMessage)) {
            horsesRacesIdAll = [];
            activeKey = null;
        }

        if(!empty(ticketoffice)){

            this.setState({
                valueUnits : ticketoffice[0].valueUnits
            })

        }
        
    }

    handleChange = (e) => {

        const { name, value } = e.target;
        let { sellform, horsesRacesIdAll, activeKey } = this.state;
        let selectedHorses = sellform.horsesRacesId;

        if (name == 'tracksId' || 
            name == 'wagerTypeId') {
            sellform.horsesRacesIdDirect = [];
            horsesRacesIdAll = [];
            activeKey = null;
            selectedHorses = [];
        }

        if (name == 'tracksId') {
            localStorage.removeItem('tabActiveKey');
            this.props.updateTracksId(value);
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

    handleChangeInputDirect = (e, wagerType, position, horseRaceId) => {

        let { sellform } = this.state;
        sellform.horsesRacesIdDirect = [];
        if((!empty(e.target.value))){

            let unitsValue = parseFloat(e.target.value);
            if(unitsValue >= 0.1 && unitsValue <= 3000){

                sellform.horsesRacesIdDirect[horseRaceId] = {
                    wagerType: wagerType,
                    position: position,
                    directUnits: unitsValue
                };
                sellform.wagerTypeId = wagerType;
                sellform.units =unitsValue;
                sellform.horsesRacesId=[];
                sellform.horsesRacesId[position] = [];
                sellform.horsesRacesId[position][horseRaceId] = ({position:position,horsesRacesId:horseRaceId});

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
        const { sellform, valueUnits } = this.state;
        //Create clone from Array
        const selectedHorsesAux = [...sellform.horsesRacesId];
        let ticketInfo = getTicketInfo({
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

    confirmSubmit = (races,racesIdActive,e) => {
        e.preventDefault();
        let { sellform, ticketCombinations,ticketValue, currencyCode } = this.state;
        let {wagertypes, tracks} = this.props;
        let currencyCodeFinal =  (!empty(currencyCode)) ? currencyCode : '';


        let wagertype = (!empty(wagertypes) ? wagertypes.filter(w => w.id ==sellform.wagerTypeId) : null);
        let wagertypeText = (!empty(wagertype) ? `${wagertype[0].name}` : null); 

        let track = (!empty(tracks) ? tracks.filter(t => t.id ==this.props.trackSelected) : null);
        let trackText = (!empty(track) ? `${track[0].trackName}` : null); 

        let amountText = (!empty(ticketValue) ? `Valor de ticket: ${formatNumber(currencyCodeFinal,ticketValue)}` : null); 

        let horses = Array.from(sellform.horsesRacesId);

        let race = (!empty(races) ? races.filter(r => r.id == racesIdActive) : null);
        let raceText = (!empty(race) ? `Carrera Nro. ${race[0].raceNumber}` : null); 
        let raceHorses = (!empty(race) ? race[0].horsesRacesByRacesId.nodes : null); 

        let horsesText = [];
        for(let horse of horses){
            if(!empty(horse)){
                for(let h of horse){
                    if(!empty(h)){
                        let horseRaceFilter = raceHorses.filter(rh => rh.id ==h.horsesRacesId);
                        let horseText = (!empty(horseRaceFilter) ? (<tr><td>{h.position}</td><td><span className={`horse-${horseRaceFilter[0].programNumber}`}>{horseRaceFilter[0].programNumber}</span></td><td>{horseRaceFilter[0].horseByHorsesId.horseName}</td></tr>) : null); 
                        horsesText.push(horseText);
                    }
                }
            }
            
        }

        let tableHorses = (<table><thead><tr><th>Posición</th><th>Nro.</th><th>Caballo</th></tr></thead><tbody>{horsesText}</tbody></table>)

    
        let bodyHtml = (<div align="center">Resumen de la jugada:
        <br /> 
        {trackText}
        {' '}
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
                      this.handleSubmit()
                  })
              ],
          })
        }else{
            toast.warn('Debe seleccionar hipódromo, tipo de apuesta, caballos, combinación valida y colocar la unidad',{position: toast.POSITION.TOP_CENTER}); 
        }
        
    }

    handleSubmit = () => {

        let horsesRacesIdSend = '';
        const { sellform, ticketCombinations } = this.state;
        sellform.tracksId = this.props.trackSelected;

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
            this.props.SellActions({action: 'sellTicket', params : {sellform: { ...sellform, horsesRacesId: horsesRacesIdSerialized }}});  

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
        const { tracks,ticketInfo,allOfficedata,payInfo,currentTimestamp,balance,currencyCode } = this.props;
        console.log('currencyCodecurrencyCode',currencyCode);
        
        let races = [];
        let racesPools = [];
        let trackSelected = '';
        let cock = {};
        let macuare = {};
        let channel,trackType = {};
        let activeKey = this.state.activeKey;
 
        if(!empty(tracks)){

            trackSelected={0:tracks[0].id,1:tracks[0].trackName,2:tracks[0].turfClass};
            races = !empty(tracks[0]) && !empty(tracks[0].racesByTracksId) ? tracks[0].racesByTracksId.nodes : null;
            racesPools = !empty(tracks[0]) && !empty(tracks[0].racesPoolsByTracksId) ? tracks[0].racesPoolsByTracksId.nodes : null;
            cock = !empty(tracks[0]) && !empty(tracks[0].cocksByTracksId) ? tracks[0].cocksByTracksId.nodes : null;
            macuare = !empty(tracks[0]) && !empty(tracks[0].macuaresByTracksId) ? tracks[0].macuaresByTracksId.nodes : null;
            channel = tracks[0].racingAmericanasChannelId;
            trackType = tracks[0].trackType;

            if(!empty(races)){

                activeKey = this.getActiveKey(races);
            }
            

        }
        
        
        return (
            <div id="wrapper">
            <PrintProvider>
            <NoPrint>
                <Dialog className="confirm-dialog" ref={(component) => { this.dialog = component }} />
            {(!empty(ticketInfo) ?
            <ComponentToPrintSell {...this.props} /> : null)}
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
                                        <MyTickets />
                                    </div>

                                    <div className="col-12 col-md-12 col-xl-12">
                                        <NextRaces {...this.props} onClickTrackNextRace={this.onClickTrackNextRace} />
                                    </div>   

                                </div>


                                    
                            </div>
                            <div className="col-12 col-md-9 col-xl-9 col-sm-8 content-center">
                                
                                <div className="row block-sell-form">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <h3>Vender Ticket</h3>
                                    </div>
                                    <div className="col-12 col-md-6 col-xl-4">
                                        <TracksDropDown handleChange={this.handleChange}  trackSelected={this.props.trackSelected} />
                                    </div>
                                    <div className="col-12 col-md-6 col-xl-4">
                                        <WagerTypesDropDown handleChange={this.handleChange} wagerTypeId={this.state.sellform.wagerTypeId}  />
                                    </div>
                                    <div className="col-12 col-md-6 col-xl-4 md-mt-10">
                                    {( trackSelected  ? 
                                    
                                        <FormUnits
                                            ticketvalue={this.state.ticketValue}
                                            ticketCombinations={this.state.ticketCombinations}
                                            unitsValue={this.state.valueUnits}
                                            currencyCode={currencyCode}
                                            handleChange={this.handleChange} 
                                            handleSubmit={this.handleSubmit}
                                            confirmSubmit={this.confirmSubmit}
                                            activeKey={activeKey} 
                                            races={races}
                                            value={(!empty(this.state.sellform.units) ? this.state.sellform.units : '')}
                                            />
                                     : ''
                                    )}
                                    </div>
                                    <div className="col-12 col-md-12 col-xl-12">
                                        {(racesPools.length >0 && !empty(trackSelected)  && (trackSelected[2]=='A' || trackSelected[2]=='B') ?                                 
                                        <PicksDialog 
                                        racesPools={racesPools} 
                                        races={races} 
                                        trackSelected={trackSelected}
                                        unitsValue={this.state.valueUnits} 
                                        activeKey={activeKey} 
                                        tracks={tracks}
                                        currencyCode={currencyCode} />
                                        : 
                                        null   
                                        )}
                                        {((races.length > 0) && trackSelected[2]=='A' ? 
                                        <> 
                                        <MarksDialog trackSelected={trackSelected} racesMarks={races} activeKey={activeKey} currencyCode={currencyCode}  />
                                        <StallsDialog trackSelected={trackSelected} racesStalls={races} activeKey={activeKey} currencyCode={currencyCode} />
                                        </>
                                        : 
                                        null   
                                        )}
                                        {(racesPools.length >0 ?                                 
                                        <MacuaresDialog 
                                        racesPools={racesPools} 
                                        races={races} 
                                        trackSelected={trackSelected}
                                        currencyCode={currencyCode}
                                        macuare={macuare}
                                        />
                                        : 
                                        null   
                                        )}

                                        {racesPools.length >0 ?                               
                                        <CocksDialog
                                        racesPools={racesPools} 
                                        races={races} 
                                        trackSelected={trackSelected}
                                        currencyCode={currencyCode}
                                        cock={cock}
                                        />
                                        :
                                            null
                                        }

                                    </div>
                                </div>

                                <div className="row block-races-tabs">
                                    <div className="col-12 col-md-12 col-xl-12">

                                    {(
                                        (races.length > 0 ) ? 
                                        <TabRaces 
                                        sellform={this.state.sellform}
                                        currentTimestamp={currentTimestamp}
                                        trackSelected={trackSelected}
                                        races={races} 
                                        checkedHorses={this.state.horsesRacesIdAll} 
                                        activeKey={activeKey} 
                                        wagerTypeId={this.state.sellform.wagerTypeId} 
                                        handleSelect={(e) => this.handleSelect(e)}
                                        handleChangeCheckbox={(e, r) => this.handleChangeCheckbox(e, r)} 
                                        handleChangeCheckboxAll={(e, arr) => this.handleChangeCheckboxAll(e, arr)} 
                                        handleChangeInputDirect={this.handleChangeInputDirect}
                                        handleSubmit={this.handleSubmit}
                                        confirmSubmit={this.confirmSubmit}
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
    tracks,
    alldatanointerval,
    alldata,
    ticketInfo,
    payInfo,
    error,
    tickets,
    wagertypes,
    ticketoffice,
    allNextRaces,
    balance
}) => ({
    loading,
    tracks,
    alldatanointerval,
    alldata,
    ticketInfo,
    payInfo,
    error,
    tickets,
    wagertypes,
    ticketoffice,
    allNextRaces,
    balance
});

const connectedSellPage = connect(mapStateToProps, actions)(SellHipicaWinPage);
export { connectedSellPage as SellHipicaWinPage };
 