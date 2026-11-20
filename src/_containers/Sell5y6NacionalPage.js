import React from 'react';
import { connect } from "redux-zero/react";
import {NavHeader} from '../_components/NavHeader';
import PrintProvider, { NoPrint } from 'react-easy-print';
import FormUnits from '../_components/FormUnits';
import ButtonsPay5y6 from '../_components/ButtonsPay5y6';
import {Button, Modal} from 'react-bootstrap';
import {MyTicketsINH} from '../_components/MyTicketsINH';
import ComponentToPrintSellINH from '../_components/ComponentToPrintSellINH';
import ComponentToPrintPayINH from '../_components/ComponentToPrintPayINH';
import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import { getTicketInfo } from '../_helpers/lib'
import actions from '../_actions';
import Dialog from 'react-bootstrap-dialog';
import { TracksDropDownINH } from '../_components/TracksDropDownINH';
import {PicksTab} from '../_components/PicksTab';
import ButtonsPayInhNacional from '../_components/ButtonsPayInhNacional';
import { NextRaces } from '../_components/NextRaces';
import SellMenuNacional from '../_components/MenuNacional';
const date = require('date-and-time');


class Sell5y6NacionalPage extends React.Component {

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
                trackId: '',
                wagerTypeId: '',
                horsesRacesIdDirect: [],
                horsesRacesId:[],
            }
        };

    }

    componentDidMount = () =>{
        this.props.TicketsActions({action: 'getMyTicketsINH'});
        this.props.SellActions({action: 'getOnlyTracksINH'});
        this.props.WagerTypesActions({action: 'getAll'});
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
                valueUnits : ticketoffice[0].valueUnitsInh
            })

        }

        if(!empty(tracks)){
            //console.log('tracks:::', tracks);

            if(empty(sellform.trackId)){
                const findOpenTrack = tracks.find((t) => !empty(t.racesPoolsByTracksId.nodes));
                if(!empty(findOpenTrack)){
                    this.setState({
                        sellform: { ...sellform, trackId: findOpenTrack.id }
                    });

                    let trackId = findOpenTrack.id;
                    let trackName = findOpenTrack.trackName;
                    let horsesRacesIdAll = [];
                    let activeKey = null;
                    let selectedHorses = [];

                    localStorage.removeItem('tabActiveKey');
                    
                    let trackData = tracks.find((t) => t.id == trackId);
                    let races = (!empty(trackData)) ?  trackData.racesByTracksId.nodes :[];
                    let racesType = (!empty(trackData)) ? trackData.racesPoolsByTracksId.nodes :[];

                    let wagerType5y6Nacional = racesType.find((r) => r.wagerTypeByWagerTypeId.description === "5 y 6 NACIONAL");

                    let raceDate = (!empty(races) ? date.format(new Date(races[0].raceDate),"YYYY-MM-DD") : '')
                    this.setState({
                        horsesRacesIdAll,
                        activeKey,
                        sellform: {
                            ...sellform,
                            wagerTypeId: Number(wagerType5y6Nacional.wagerTypeByWagerTypeId.id),
                            horsesRacesId : selectedHorses,
                            trackId,
                            trackName,
                            raceDate,
                        }
                    }, () => {
                        this.calculateTicketValue();
                    });
                }
            }

        }
        
    }

    handleChange = (e) => {

        const { name, value } = e.target;
        let { sellform, horsesRacesIdAll, activeKey } = this.state;
        let { tracks} = this.props;
        let selectedHorses = sellform.horsesRacesId;
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
            for(let k in tracks){  
                if(tracks[k].id==value){
                    trackId = tracks[k].id;
                    trackName = tracks[k].trackName;
                }
            }
            let trackData = tracks.find((t) => t.id == value);
            races = (!empty(trackData)) ?  trackData.racesByTracksId.nodes :[];
            raceDate = (!empty(races) ? date.format(new Date(races[0].raceDate),"YYYY-MM-DD") : '')
        }


        this.setState({
            horsesRacesIdAll,
            activeKey,
            sellform: {
                ...sellform,
                horsesRacesId : selectedHorses,
                trackId,
                trackName,
                raceDate,
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

    handleSubmit = (e) => {

        let horsesRacesIdSend = '';
        e.preventDefault();
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

    showModalRetrospectos = () => {
        return (<Modal show={this.state.showRetrospectos} onHide={this.handleClose} size={"lg"}>
                    <Modal.Header closeButton>
                        <Modal.Title>Retrospectos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <iframe border="0" class="iframePdf" src={`/gaceta_hipica/la_rinconada/RETROSPECTOS.pdf?t=${new Date().getTime()}`}></iframe>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>)
    }
    
    showModalRules = (currency_code) => {


        return (<Modal show={this.state.showRules} onHide={this.handleClose} size={"lg"}>
                    <Modal.Header closeButton>
                        <Modal.Title>{currency_code=='VES' ? <>JUEGO DEL “5 y 6 Nacional”</> :  <>JUEGO DEL “5 y 6 Internacional” </> }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {currency_code=='VES' ? 
                        <p>
                        Artículo 158.- El JUEGO DEL ¨5 y 6 NACIONAL” consiste en acertar cinco (5)
                        o seis (6) ejemplares ganadores en las carreras previamente seleccionadas por las
                        Autoridades Hípicas, de acuerdo con las normas establecidas en este Capítulo, debiendo
                        aparecer indicados los números que identifican a esos ejemplares en los boletos
                        emitidos por los puntos de venta autorizadas por la Junta Liquidadora del Instituto
                        Nacional de Hipódromos para el JUEGO DEL ¨ 5 y 6 NACIONAL”.<br/><br/>
                        
                        Artículo 159.- Solamente se considerarán válidas para el JUEGO DEL ¨ 5 y 6
                        NACIONAL”, las seis (6) carreras señaladas como tales en el Programa Oficial<br/><br/>
                        
                        Artículo 160.- Para los efectos del JUEGO DEL ¨ 5 y 6 NACIONAL ¨ todo
                        ejemplar se considerará en carrera de acuerdo con las disposiciones pertinentes
                        contenidas en la presente normativa y en el Reglamento Oficial de Carreras<br/><br/>
                        
                        Artículo 161.- Cuando se inscriban más de dieciséis (16) ejemplares en una carrera
                        válida para el JUEGO DEL ¨ 5 y 6 NACIONAL ¨ los Comisarios deberán establecer
                        llaves complementarias; las cuales se tomarán en cuenta como un solo ejemplar.
                        También en este caso los ejemplares serán distinguidos con una letra distinta así: A, B,
                        C y así sucesivamente.<br/><br/>
                        
                        Artículo 162.- En el caso de que un ejemplar inscrito para intervenir en las carreras
                        válidas para el JUEGO DEL ¨5 y 6 NACIONAL” sea retirado, al boleto que lo tenga
                        anotado o registrado, le corresponderá el ejemplar o la llave válidos para el Juego del
                        “JUEGO DEL ¨5 y 6 NACIONAL ¨ que tome parte en la carrera y le siga en el orden
                        numérico del Programa Oficial salvo que el ejemplar retirado figure en llave con otro u
                        otros ejemplares en cuyo caso continuará jugando la llave anotada. Cuando el ejemplar
                        retirado sea el que aparezca en forma individual en el último lugar del Programa Oficial
                        de las Carreras señaladas para este juego corresponderá al boleto el ejemplar inmediato,
                        comenzando por el número uno (1). Cuando sean retirados todos los integrantes de una
                        llave corresponderá al boleto, el ejemplar o llave que le siga en orden numérico. En
                        caso de que la llave retirada ocupe el último lugar en el orden numérico de una carrera
                        válida para el JUEGO DEL ¨ 5 y 6 NACIONAL ¨ corresponderá al boleto que tenga
                        anotada dicha llave el ejemplar inmediato, comenzando por uno (1).<br/><br/>
                        
                        Artículo 163.- Si un boleto ganador en el JUEGO DEL ¨5 y 6 NACIONAL ¨
                        tuviese indicado tanto el o los ejemplares retirados como el o los ejemplares que
                        correspondan según el Artículo 162 de este Capítulo, el o los boletos ganadores tendrán
                        tantas participaciones en los dividendos como ejemplares acertados.<br/><br/>
                        
                        Artículo 164.- Si de acuerdo con la presente normativa y demás disposiciones que
                        rigen el funcionamiento de la Junta Liquidadora del Instituto Nacional de Hipódromos,
                        fuese anulada una (1) o dos (2) carreras de las válidas para el JUEGO DEL ¨5 y 6
                        NACIONAL ¨, como en ese caso no podrá haber boletos ganadores ni con seis (6) ni
                        con cinco (5) ejemplares, se aplicara lo dispuesto en el Articulo 168 de este Articulo.<br/><br/>
                        
                        Artículo 165.- Cuando por causa de fuerza mayor los Comisarios se vean obligados a
                        suspender una Reunión de Carreras, después de haberse iniciado la jornada válida para
                        el Juego del JUEGO DEL ¨ 5 y 6 NACIONAL ¨ las carreras restantes que faltan serán
                        diferidas para realizarse en la fecha acordada de acuerdo con la aprobación de la Junta
                        Liquidadora del Instituto Nacional de Hipódromos.<br/><br/>
                        
                        UNICO. En caso de no poder realizarse el resto de las carreras suspendidas, conforme al
                        artículo anterior, le será reintegrado al apostador el valor de la jugada.<br/><br/>
                        
                        Artículo 166.- la Junta Liquidadora del Instituto Nacional de Hipódromos o los
                        Comisarios de los Hipódromos Nacionales podrán invalidar para el JUEGO DEL ¨5 y
                        6 NACIONAL ¨ el o los ejemplares que consideran conveniente, en una o más de las
                        carreras válidas para el JUEGO DEL ¨5 y 6 NACIONAL” haciéndolo constar en el
                        Programa Oficial o informándolo oportunamente por los medios de comunicación mas
                        idóneos. Para efectos de las apuestas se aplicara lo contenido en el Artículo 162 del
                        presente reglamento del JUEGO DEL ¨5 y 6 NACIONAL”<br/><br/>
                        
                        Artículo 167.- En caso de empate para el primer lugar, en una o varias de las carreras
                        válidas para el JUEGO DEL ¨ 5 y 6 NACIONAL ¨ los Boletos ganadores que
                        contengan dichos ejemplares empatados, participarán en la distribución del monto a
                        repartir tantas veces como ejemplares tengan marcados.<br/><br/>
                        
                        Artículo 168.- En caso de que no haya boletos acertados con seis (6) o cinco (5)
                        ejemplares ganadores del JUEGO DEL ¨ 5 y 6 NACIONAL ¨, el monto a repartir para
                        los boletos con seis (6) y cinco (5) ejemplares ganadores se acumulará para el siguiente
                        “JUEGO 5 y 6 NACIONAL” que se realiza en el próximo día de carrera en el mismo
                        Hipódromo Nacional donde se efectuó la jugada original.<br/><br/>
                        
                        Articulo 169.- El apostador no tendrá derecho a reclamo alguno después de haberse
                        retirado de la taquilla del punto de venta donde se efectuó la apuesta.<br/><br/>
                        
                        Articulo 170.- No tendrá validez el boleto deteriorado, roto, sucio o enmendado, que
                        no pueda ser fácilmente identificado.<br/><br/>
                        
                        Artículo 171.- Los dividendos correspondientes a los boletos ganadores se pagarán a
                        los respectivos poseedores, en los puntos autorizados por la Junta Liquidadora del
                        Instituto Nacional de Hipódromos y en las oficinas de la operadora respectiva<br/><br/>
                        
                        Artículo 172.- El derecho de presentar al cobro el boleto ganador, caducará a los
                        diez (10) días continuos a la fecha de la Reunión Oficial en que se produjeron los
                        aciertos contenidos en tal boleto<br/><br/>
                        
                        Artículo 173.- Se considerarán ganadores en el JUEGO DEL ¨ 5 y 6 NACIONAL ¨
                        los ejemplares indicados de acuerdo con el Orden Oficial de Llegada de cada carrera.
                        Las modificaciones en el orden de llegada por cualquier causa con fecha posterior al
                        día de la carrera, no alterarán el orden oficial que de acuerdo a la presente normativa, es
                        inalterable a los efectos de los dividendos.<br/><br/>
                        
                        Articulo 174.- Al adquirir boletos para el JUEGO DEL ¨ 5 y 6 NACIONAL ¨” los
                        apostadores se someten a las disposiciones del presente Capítulo. En todo lo que no esté
                        expresamente previsto en él, se aplicará la presente normativa y las disposiciones que
                        dicte la Junta Liquidadora del Instituto Nacional de Hipódromos.</p>
                                            
                    :
                        <p>
                            <b>"5y6 Internacional"</b><br/><br/>
                            * Se paga solo con 6 aciertos<br/><br/>
                            * En caso de no haber cuadros con 6 aciertos se repartirá el 50% del monto destinado a 6,
                            a los cuadros ganadores con 5, quedando acumulado el restante 50% para la próxima semana.
                        </p>                    
                    } 


                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>)
    }
 
    render() {
        const { sellform, currencyCode} = this.state;
        const { tracks, ticketInfoInh,payInfoInh } = this.props;

        //console.log('sellform:::', sellform);

        let valueUnits = 4;
        let races = [];
        let racesPools = [];
        let trackSelected = '';
        let trackNewSelected = {
            id: sellform.trackId,
            trackName: sellform.trackName
        }
        let title = 'Venta Oficial de 5 y 6 Nacional';
        if(!empty(currencyCode) && currencyCode=='USD'){
            title = 'Venta Oficial de 5 y 6 Internacional';
        }

        if(!empty(tracks) && !empty(sellform.trackId))
        {

            for(let i=0;i<tracks.length;i++) {
                if(tracks[i].id == sellform.trackId) {
                    trackSelected={0:tracks[i].id,1:tracks[i].trackName,2:tracks[i].turfClass};
                    races = tracks[i].racesByTracksId.nodes;
                    racesPools = tracks[i].racesPoolsByTracksId.nodes;
                    break;
                }
            } 

        }

        return (
            <div id="wrapper">
            <PrintProvider>
            <NoPrint>
                
            <Dialog className="confirm-dialog" ref={(component) => { this.dialog = component }} />
            {this.showModalRetrospectos()}
            {this.showModalRules(currencyCode)}

            {(!empty(ticketInfoInh)
             && !empty(ticketInfoInh.allTicketsInhs) 
             && !empty(ticketInfoInh.allTicketsInhs.nodes) ?
            <ComponentToPrintSellINH {...this.props} /> : null)}
            {(!empty(payInfoInh) ?
            <ComponentToPrintPayINH {...this.props} /> : null)}
                <NavHeader />
                <div id="page-wrapper-full">
                {(!empty(sellform.errormessage) ? 
                    <Alert variant="warning" onClose={this.onCloseAlert} dismissible >
                    {sellform.errormessage}
                    </Alert>
                    :
                    ''
                )}
                
                    <div className="container-fluid">
                        <div className="row d-flex flex-row clearfix">
                            <div className="col-12 col-md-12 col-xl-12">
                                <SellMenuNacional />
                            </div>
                            <div className="col-12 col-md-3 col-xl-3 col-sm-4 content-left">
                                
                                <div className="row">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <ButtonsPayInhNacional specialKey={this.state.specialKey} type='inh' />
                                    </div>
                                    
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <MyTicketsINH />
                                    </div>

                                    
                                </div>
                                    
                            </div>
                            <div className="col-12 col-md-9 col-xl-9 col-sm-8 content-center">
                                
                                <div className="row block-sell-form" style={{padding: '2em'}}>
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <h3>Vender Ticket</h3>
                                    </div>
                                    <div className="col-12 col-md-6 col-xl-4">
                                        <TracksDropDownINH handleChange={this.handleChange}  tracks={tracks} trackSelected={sellform.trackId}  />
                                    </div>
                                    <div className="col-12 col-md-12 col-xl-12">
                                    {(races.length > 0 ? 
                                    
                                    <div className="content-page-5y6">
                                    
                                        <PicksTab
                                        racesPools={racesPools} 
                                        races={races} 
                                        trackSelected={trackNewSelected}
                                        unitsValue={valueUnits} 
                                        raceDate={this.state.sellform.raceDate} 
                                        currencyCode={currencyCode}
                                        title='5 y 6' />
                                    
                                    </div>    
                                        : 
                                    null   
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
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
    ticketInfoInh,
    payInfoInh,
    error,
    ticketsINH,
    wagertypes,
    ticketoffice,
    allNextRaces,
    balance
}) => ({
    loading,
    tracks,
    alldatanointerval,
    alldata,
    ticketInfoInh,
    payInfoInh,
    error,
    ticketsINH,
    wagertypes,
    ticketoffice,
    allNextRaces,
    balance
});

const connectedSellPage = connect(mapStateToProps, actions)(Sell5y6NacionalPage);
export { connectedSellPage as Sell5y6NacionalPage };
 