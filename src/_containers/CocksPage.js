import React from 'react';
import { connect } from "redux-zero/react";
import TabCocks from '../_components/TabCocks';
import TableCocksMultiple from '../_components/TableCocksMultiple';
import { getTicketInfoCock } from '../_helpers/lib';
import {NavHeader} from '../_components/NavHeader';

import empty from 'is-empty';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../_actions';
import AuthActions from '../_actions/AuthActions';
import { toast } from 'react-toastify';
import {formatNumber} from '../_helpers/lib';
import { redirectByCentersTicketOfficesId } from '../_helpers/lib';
import Dialog from 'react-bootstrap-dialog';
import ComponentToPrintSellCock from '../_components/ComponentToPrintSellCock';
import ComponentToPrintPayCock from '../_components/ComponentToPrintPayCock';
import ButtonsPayRefundCock from '../_components/ButtonsPayRefundCock';
import {MyTicketsCocks} from '../_components/MyTicketsCocks';

class CocksPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey           : '',
            ticketValue: 0,
            ticketCombinations: 0,
            show: false,
            horsesRacesIdAll:[],
            horsesRacesSelected:[],
            valueUnits: 0,
            sellform : {
              wagerTypeId: 35,
              horsesRacesId:[],
          }
        };    
    }

      handleClose = () =>   {
        this.setState({ show: false });
      }
    
      componentWillMount = () => {
        let userData = AuthActions.meData();
        let currency_code =  (!empty(userData)) ? userData.currency_code : '';
        let params = {currency_code:currency_code};
        this.props.WagerTypesActions({action: 'getAllCocks', params: {params}});
        this.props.WagerTypesActions({action: 'getCockActiveElInmejorable', params: {params}});  
        this.props.TicketsActions({action: 'getMyHeaderCocksTicketsInterval'});
        let centers_id =  (!empty(userData)) ? userData.centers_id : '';
        let ticket_offices_id =  (!empty(userData)) ? userData.ticket_offices_id : '';
        
        redirectByCentersTicketOfficesId(centers_id,ticket_offices_id,currency_code);
        const { sellform } = this.state;
        this.setState({
          sellform : {
              ...sellform,
              errormessage : this.props.errorMessage
          }
      });
       
      }

      componentWillReceiveProps(nextProps){
        const { cock, ticketInfo } = this.props;
        
        if(nextProps.cock != cock && !empty(nextProps.cock) || (nextProps.ticketInfo!=ticketInfo)){
          let params = {cock_id:parseInt(nextProps.cock.id)}
          
          this.props.TicketsActions({action: 'getAllTicketsProcCocksById', params: {params}});  
          this.props.WagerTypesActions({action: 'getAllCocks', params: {params}});
          this.setState({
            activeKey:nextProps.cock.id,
            horsesRacesIdAll:[],
            valueUnits: nextProps.cock.amount,
            dialogform : {
              wagerTypeId: 35,
              horsesRacesId:[],
              units: nextProps.cock.amount
           }
        });
        }

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
      const { sellform,horsesRacesIdAll } = this.state;
  
      let arr = horsesRacesIdAll;
      
      if(isChecked){
         
          delete sellform.horsesRacesId[position];
          delete horsesRacesIdAll[position];
          sellform.horsesRacesId[position] = [];
          horsesRacesIdAll[position] = item;
          sellform.horsesRacesId[position][item] = ({position:position,horsesRacesId:item, programNumber:programNumber});
      }
      else{
          delete sellform.horsesRacesId[position][item];
          delete arr[arr.indexOf(Number.parseInt(item))];
      }
      this.setState({
          horsesRacesIdAll:horsesRacesIdAll,
          sellform: {
              ...sellform
          }
      });
      
  }

  handleChangeMultipleCheckbox = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    const position = e.target.id;
    const { sellform,horsesRacesIdAll } = this.state;
    let arr = horsesRacesIdAll;
    
    if(isChecked){
        if(empty(sellform.horsesRacesId[position]))
        {
          sellform.horsesRacesId[position] = [];
        }
        if(!empty(horsesRacesIdAll))
        {
            arr = horsesRacesIdAll;
        }
        sellform.horsesRacesId[position][item] = ({position:position,horsesRacesId:item});
        arr.push(Number.parseInt(item));
    }
    else{
        delete sellform.horsesRacesId[position][item];
        delete arr[arr.indexOf(Number.parseInt(item))];
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
  calculateTicketValue() {
    const { sellform } = this.state;
    //Create clone from Array
    const selectedHorsesAux = [...sellform.horsesRacesId];
    let ticketInfo = getTicketInfoCock({
        trackId:this.props.cock.trackByTracksId.id,
        selectedHorses: selectedHorsesAux,
        units: 1 ,
        valueUnits: this.state.valueUnits
    })

    this.setState({
        ticketValue : ticketInfo.ticketValue,
        ticketCombinations : ticketInfo.ticketCombinations
    })
    
  }

  handleSelect = (eventKey) => {
    let params = {cock_id:eventKey}
    const {cocks} = this.props;
    let currentCock = cocks.filter(cock => (cock.id == eventKey));
    params.cock = currentCock;
    this.props.TicketsActions({action: 'getAllTicketsProcCocksById', params: {params}});  
    this.props.WagerTypesActions({action: 'getCockActiveElInmejorable', params: {params}});  
    this.setState({
      activeKey:eventKey
  });
  }

  confirmSubmit = (trackId,amount,costByCock,combinations,e) => {
    let {cock} = this.props;
    e.preventDefault();
    let trackText = (!empty(cock.trackByTracksId) ? `${cock.trackByTracksId.trackName}` : null); 
    let userData = AuthActions.meData();
    let currencyCode =  (!empty(userData)) ? userData.currency_code : '';
    let amountText = (!empty(amount) ? `Valor de la jugada: ${formatNumber(currencyCode,amount)}` : null); 
    let combinationsText = (!empty(amount) ? `Total de Combinaciones: ${combinations}` : null); 
    let costByCockText = (!empty(amount) ? `Costo Por Polla: ${formatNumber(currencyCode,costByCock)}` : null); 


    let bodyHtml = (<div align="center">Resumen de la jugada de Pollas:
    <br /> 
    <h2>{trackText}</h2>
    <br />
    {combinationsText}
    <br />
    {costByCockText}
    <br />
    <h2>{amountText}</h2>
    <br />
    </div>); 
    if(!empty(combinationsText) 
    && !empty(trackText)
    && !empty(amountText)
    ){
        this.dialog.show({
          title: 'Confirmar',
          body: bodyHtml,
          actions: [
              Dialog.CancelAction(),
              Dialog.OKAction(() => {
                  this.handleSubmitCocks(amount)
              })
          ],
      })
    }else{
        toast.warn('Debe seleccionar al menos una polla válida',{position: toast.POSITION.TOP_CENTER}); 
    }
    
  }

  handleSubmitCocks = (amount) => {
    let horsesRacesIdSend = ''; 
    const { sellform } = this.state;

    const { cock } = this.props;

    sellform.tracksId = cock.trackByTracksId;
    sellform.cockId = cock.id;
    sellform.combinations = this.state.ticketCombinations;

    
      if((parseFloat(amount)>0) 
      && (!empty(sellform.horsesRacesId)) 
      && (!empty(sellform.tracksId)) 
      && (!empty(sellform.wagerTypeId)))
      {

          let cock1 = 0;
          let cock2 = 0;
          let cock3 = 0;
          let cock4 = 0;
          let cock5 = 0;
          let cock6 = 0;
          let cock7 = 0;
          let cock8 = 0;

          sellform.horsesRacesId.forEach(function(element) {
                  if(!empty(element)){
                      (Array.isArray(element) ? element : Object.values(element)).forEach(function(element2){
                          if(!empty(element2)){
                              if(element2.position==1){cock1++;}
                              if(element2.position==2){cock2++;}
                              if(element2.position==3){cock3++;}
                              if(element2.position==4){cock4++;}
                              if(element2.position==5){cock5++;}
                              if(element2.position==6){cock6++;}
                              if(element2.position==7){cock7++;}
                              if(element2.position==8){cock8++;}
                              horsesRacesIdSend+='{position:@' + element2.position + '@,horsesRacesId:@'+element2.horsesRacesId+'@},';
                          }
                      })
                  }
                })
            if(((cock1 >= 1) && (cock2 >= 1) && (cock3 >= 1) && (cock4 >= 1) && (cock5 >= 1) && (cock6 >= 1) && sellform.tracksId!='9101' && sellform.tracksId!='9102') 
                  || ((cock1 >= 1) && (cock2 >= 1) && (cock3 >= 1) && (cock4 >= 1) && (cock5 >= 1) && (cock6 >= 1) && (cock7 >= 1) && (cock8 >= 1) && (sellform.tracksId==='9101' || sellform.tracksId==='9102')) ){
              
            let horsesRacesIdSerialized = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
            let sellformCopy = { ...sellform, horsesRacesId: horsesRacesIdSerialized, units: cock.amount, amount: cock.amount };
              this.props.SellActions({action: 'sellCockTicket', params : { sellform: sellformCopy }}  );
      
              this.setState({ 
                ticketValue: 0,
                ticketCombinations: 0,
                show: false,
                horsesRacesIdAll:[],
                horsesRacesSelected:[],
                sellform : {
                  wagerTypeId: 35,
                  tracksId:sellform.tracksId,
                  horsesRacesId:[],
              }
            
            });
            
            }
            else
            {
                toast.warn('Debe seleccionar al menos un caballo por carrera.',{position: toast.POSITION.TOP_CENTER});
                this.setState({
                  sellform: {
                        ...sellform
                    }
                }); 
            }
        }
        else
        {
            toast.warn('Debe seleccionar hipódromo, tipo de apuesta, caballos y colocar la unidad',{position: toast.POSITION.TOP_CENTER});
            this.setState({
              sellform: {
                    ...sellform
                }
            }); 
        }

  }

  horsesNames = (horsesaces,wager_type_id) =>{
    let horses_name = [];    
      for(let l=0;l<horsesaces.length;l++){
        horses_name.push(<td>C{horsesaces[l].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber} - ({horsesaces[l].horsesRaceByHorsesRacesId.programNumber})</td>);
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

      render() {
        let userData = AuthActions.meData();
        const { sellform,amount_usd,amount_pen,amount_ves,amount_cop, amount_clp} = this.state;
        let {activeKey} = this.state;
        const {cocks,cocksTickets,user,cock,ticketoffice,account,totalCocksById,ticketInfo,payInfoCock} = this.props;

        if(empty(activeKey) && !empty(cock)){
          activeKey = cock.id;
        }

        let currencyCode =  (!empty(userData)) ? userData.currency_code : ''; 

        let cockInfo = (!empty(ticketoffice) && !empty(ticketoffice[0]) && !empty(ticketoffice[0].centerByCentersId) && !empty(ticketoffice[0].centerByCentersId.centersCurrencyConfigurationsByCentersId) && !empty(ticketoffice[0].centerByCentersId.centersCurrencyConfigurationsByCentersId.nodes) ) ? ticketoffice[0].centerByCentersId.centersCurrencyConfigurationsByCentersId.nodes[0] : {};

        let jackPot = 0;
        if(!empty(cockInfo)){
          jackPot = cockInfo.cockAccumulated;
          if(currencyCode=='USD'){
            jackPot = jackPot;
          }else if(currencyCode=='PEN'){
            jackPot = parseFloat(jackPot) * parseFloat(amount_pen);
          }else if(currencyCode=='COP'){
            jackPot = parseFloat(jackPot) * parseFloat(amount_cop);
          }else if(currencyCode=='VES'){
            jackPot = parseFloat(jackPot) * parseFloat(amount_ves);
          }else if(currencyCode=='CLP'){
            jackPot = parseFloat(jackPot) * parseFloat(amount_clp);
          }

        }

        let totalToPay = 0;
        if(!empty(cock) && !empty(cock.totalToPay)){
          if(currencyCode=='USD'){
            totalToPay = cock.totalToPay;
          }else if(currencyCode=='PEN'){
            totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_pen);
          }else if(currencyCode=='COP'){
            totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_cop);
          }else if(currencyCode=='VES'){
            totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_ves);
          }else if(currencyCode=='CLP'){
            totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_clp);
          }
          
        }

        let accumulated = 0;
        if(!empty(cock) && !empty(cock.accumulated)){
          if(currencyCode=='USD'){
            accumulated = cock.accumulated;
          }else if(currencyCode=='PEN'){
            accumulated = parseFloat(cock.accumulated) * parseFloat(amount_pen);
          }else if(currencyCode=='COP'){
            accumulated = parseFloat(cock.accumulated) * parseFloat(amount_cop);
          }else if(currencyCode=='VES'){
            accumulated = parseFloat(cock.accumulated) * parseFloat(amount_ves);
          }else if(currencyCode=='CLP'){
            accumulated = parseFloat(cock.accumulated) * parseFloat(amount_clp);
          }
          
        } 

        let totalToPaySecondPlace = 0;
        if(!empty(cock) && !empty(cock.secondPlace)){
          if(currencyCode=='USD'){
            totalToPaySecondPlace = cock.secondPlace;
          }else if(currencyCode=='PEN'){
            totalToPaySecondPlace = parseFloat(cock.secondPlace) * parseFloat(amount_pen);
          }else if(currencyCode=='COP'){
            totalToPaySecondPlace = parseFloat(cock.secondPlace) * parseFloat(amount_cop);
          }else if(currencyCode=='VES'){
            totalToPaySecondPlace = parseFloat(cock.secondPlace) * parseFloat(amount_ves);
          }else if(currencyCode=='CLP'){
            totalToPaySecondPlace = parseFloat(cock.secondPlace) * parseFloat(amount_clp);
          }
          
        }



        return (
<div id="wrapper">
            <PrintProvider>
            <NoPrint>
                <Dialog className="confirm-dialog" ref={(component) => { this.dialog = component }} />
            {(!empty(ticketInfo) ?
            <ComponentToPrintSellCock {...this.props} /> : null)}
            {(!empty(payInfoCock) ?
            <ComponentToPrintPayCock {...this.props} /> : null)}
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
                                        <ButtonsPayRefundCock specialKey={this.state.specialKey} />
                                    </div>
                                    
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <MyTicketsCocks />
                                    </div>

                                </div>


                                    
                            </div>
                            <div className="col-12 col-md-9 col-xl-9 col-sm-8 content-center">
                                
                                <div className="row block-sell-form">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <h3>Vender Ticket</h3>
                                    </div>
                                    <div className="col-12 col-md-12 col-xl-12">
                                    {!empty(cock) &&!empty(cock.trackByTracksId) ?
                                    <TableCocksMultiple
                                      racesPools={cock.trackByTracksId.racesPoolsByTracksId.nodes}
                                      races={cock.trackByTracksId.racesByTracksId.nodes}
                                      track={cock.trackByTracksId}
                                      handleChangeCheckbox={this.handleChangeMultipleCheckbox}
                                      checkedHorses={this.state.horsesRacesIdAll}
                                      currencyCode={currencyCode}
                                      handleSubmitCocks={this.handleSubmitCocks}
                                      cock={cock}
                                      confirmSubmit={this.confirmSubmit}
                                      account={account} 
                                      ticketValue={this.state.ticketValue}
                                      ticketCombinations={this.state.ticketCombinations}
                                      />         
                                      : null }

                                    </div>
                                </div>

                                <div className="row block-races-tabs">
                                    <div className="col-12 col-xl-12 block-races-tabs max-height-600">
                                    {!empty(cock) &&!empty(cock.trackByTracksId) ?
                                    <TabCocks 
                                        cocks={cocks} 
                                        activeKey={activeKey} 
                                        cocksTickets={cocksTickets}
                                        totalCocksById={totalCocksById}
                                        handleSelect={this.handleSelect}
                                        user={user}
                                        track={cock.trackByTracksId}
                                        />
                                        : null }
                                      <br />
                                      <h3>REGLAS DE LA POLLA</h3>
                                      <ul className="list-group list-group-flush">
                                      <li className="list-group-item">PUNTUACIÓN: <br />
                                      1er Lugar = 5 Ptos <br />
                                      2do Lugar = 3 Ptos <br />
                                      3er Lugar = 1 Pto </li>
                                      <li className="list-group-item">En caso de empate para el 1er Lugar ambos obtienen 5 ptos pero no se otorga puntuación al 3ero.</li>
                                      <li className="list-group-item">En caso de empate para el 2do Lugar ambos obtienen 3 ptos pero no se otorga puntuación al 3ero.</li>
                                      <li className="list-group-item">En caso de empate para el 3er Lugar ambos obtienen 1 pto.</li>
                                      <li className="list-group-item">Primer lugar: Se considera ganador del monto a repartir para el primer lugar, al usuario que acumule la mayor cantidad de puntos al finalizar la última carrera válida para la Polla Hípica. Si existen varios usuarios con la misma puntuación máxima, el monto a repartir por el primer lugar se distribuirá en partes iguales entre ellos.</li>
                                      <li className="list-group-item">Segundo lugar: Se considera ganador del monto a repartir para el segundo lugar, al usuario que acumule la segunda mayor cantidad de puntos al finalizar la última carrera válida para la Polla Hípica. Si existen varios usuarios con la misma segunda mayor puntuación, el monto a repartir por el segundo lugar se distribuirá en partes iguales entre ellos.</li>
                                      <li className="list-group-item">No está contemplado premiación para los usuarios que acumulen la tercera mayor cantidad de puntos al finalizar la última carrera válida para la Polla Hípica, es decir NO hay premiación para el 3er. lugar.</li>
                                      <li className="list-group-item">La Polla Hípica contempla premios sólo para el Primer Lugar (Polla Hípica con la Puntuación máxima) y Segundo Lugar (Polla Hípica con la segunda Puntuación máxima).</li>
                                      <li className="list-group-item">Las Pollas tienen una hora tope de jugada, después de la hora de cierre no será válida la jugada.</li>
                                      <li className="list-group-item">Una vez efectuada sus combinaciones no se hace reintegro de saldos ni mucho menos se anulan las jugadas.</li>
                                      <li className="list-group-item">Cuando un Caballo esté retirado y está en sus combinaciones se tomará el número siguiente, si el número siguiente igualmente está retirado se tomará el siguiente y así sucesivamente hasta llegar a un ejemplar activo.</li>
                                      <li className="list-group-item">Monto Acumulado Jackpot 30 puntos: En caso de que la puntuación de la polla sea 30 puntos al monto a repartir se le suma el monto acumulado.</li>
                                      <li className="list-group-item">En las pollas hípicas no son válidas las llaves, por lo que, cada caballo va jugando por separado.</li>
                                      <li className="list-group-item">Si suspenden 3 carreras o más de las 6 involucradas se devuelven todas las pollas hípicas.</li>
                                      <li className="list-group-item">La polla hípica se pagará si se realizan al menos 4 carreras de las involucradas en la polla hípica.</li>
                                      </ul>
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

const mapToProps = ({
  tracks,
  cocksTickets,
  totalCocksById,
  ticketInfo,
  ticketoffice,
  user,
  account,
  cocks,
  cock,
  payInfoCock
}) => ({
  tracks,
  cocksTickets,
  totalCocksById,
  ticketInfo,
  ticketoffice,
  user,
  account,
  cocks,
  cock,
  payInfoCock
});
const connectedCocksPage = connect(mapToProps, actions)(CocksPage);
export { connectedCocksPage as CocksPage };
