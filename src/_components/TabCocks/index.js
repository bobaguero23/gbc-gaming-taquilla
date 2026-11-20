import React from 'react';
import {Tabs,Tab,Badge} from 'react-bootstrap';
import empty from 'is-empty';
import ResultsTable from '../ResultsTable';
import moment from 'moment';
import Countdown from 'react-countdown';
import {formatNumber} from '../../_helpers/lib';
import config from "config";

class TabCocks extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      activeKey: null,
      amount_usd: config.valueUnitsUSD,
      amount_cop: config.valueUnitsCOP,
      amount_pen: config.valueUnitsPEN,
      amount_ves: config.valueUnitsVES,
      amount_clp: config.valueUnitsCLP,
      amount_ars: config.valueUnitsARS,
      amount_brl: config.valueUnitsBRL,
      amount_uyu: config.valueUnitsUYU,
    };
  }

  componentDidMount(){
    this.setState({ activeKey: this.props.activeKey });
  }

  componentWillReceiveProps(newProps){
    
      this.setState({ activeKey: newProps.activeKey});
    
  }

  horsesNames = (horsesaces) =>{
    let horses_name = [];    
      for(let l=0;l<horsesaces.length;l++){
        horses_name.push(<td>C{horsesaces[l].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber} - ({horsesaces[l].horsesRaceByHorsesRacesId.programNumber}) </td>);
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
    
    const { cocksTickets,user} = this.props;
    let rowsMyTickets = [];

     if(empty(cocksTickets)) { 
        return null;
    }

    for(let i=0; i < cocksTickets.length;i++){     
 
        rowsMyTickets.push(
          <tr key={cocksTickets[i].id}>
            <td>
              <Badge variant={cocksTickets[i].userId == user.id ? 'success' : 'danger' }>
                  {cocksTickets[i].userAlias}/{cocksTickets[i].confirm}
              </Badge>
            </td>
            <td>{cocksTickets[i].raceNumber1} - ({cocksTickets[i].programNumber1}) </td>
            <td>{cocksTickets[i].raceNumber2} - ({cocksTickets[i].programNumber2}) </td>
            <td>{cocksTickets[i].raceNumber3} - ({cocksTickets[i].programNumber3}) </td>
            <td>{cocksTickets[i].raceNumber4} - ({cocksTickets[i].programNumber4}) </td>
            <td>{cocksTickets[i].raceNumber5} - ({cocksTickets[i].programNumber5}) </td>
            <td>{cocksTickets[i].raceNumber6} - ({cocksTickets[i].programNumber6}) </td>
            {!empty(this.props.track) && (this.props.track.id === '9101' || this.props.track.id === '9102')
            ? 
            <>
              <td>{cocksTickets[i].raceNumber7} - ({cocksTickets[i].programNumber7}) </td>
              <td>{cocksTickets[i].raceNumber8} - ({cocksTickets[i].programNumber8}) </td>
            </>
            : null
            }
            <td>{cocksTickets[i].totalPoints}</td>
        </tr>);
        
    }

    return rowsMyTickets;
  }



  render () {
      const {cocks,totalCocksById, user} = this.props;
      const { amount_usd,amount_pen,amount_ves,amount_cop, amount_clp,amount_ars,amount_brl,amount_uyu} = this.state;
      let tabItems = [];
      let currencyCode =  (!empty(user)) ? user.currency_code : '';
      let percentageFirstPlace = 0.7;
      let percentageSecondPlace = 0.2;
      let percentageThirdPlace = 0.1;
      

            if(!empty(cocks)){

              for (let cock of cocks){
                
                if(!empty(cock) && cock.priority===0){

                  let jackPot = 0;
                  if(!empty(cock)){
                    jackPot = cock.jackpot;
                    if(currencyCode=='USD' || currencyCode=='EUR'){
                      jackPot = jackPot;
                    }else if(currencyCode=='PEN'){
                      jackPot = parseFloat(jackPot) * parseFloat(amount_pen);
                    }else if(currencyCode=='COP'){
                      jackPot = parseFloat(jackPot) * parseFloat(amount_cop);
                    }else if(currencyCode=='VES'){
                      jackPot = parseFloat(jackPot) * parseFloat(amount_ves);
                    }else if(currencyCode=='CLP'){
                      jackPot = parseFloat(jackPot) * parseFloat(amount_clp);
                    }else if(currencyCode=='ARS'){
                      jackPot = parseFloat(jackPot) * parseFloat(amount_ars);
                    }else if(currencyCode=='BRL'){
                      jackPot = parseFloat(jackPot) * parseFloat(amount_brl);
                    }else if(currencyCode=='UYU'){
                      jackPot = parseFloat(jackPot) * parseFloat(amount_uyu);
                    }
          
                  }
          
                  let totalToPay = 0;
                  if(!empty(cock) && !empty(cock.totalToPay)){
                    if(currencyCode=='USD' || currencyCode=='EUR'){
                      totalToPay = cock.totalToPay;
                    }else if(currencyCode=='PEN'){
                      totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_pen);
                    }else if(currencyCode=='COP'){
                      totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_cop);
                    }else if(currencyCode=='VES'){
                      totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_ves);
                    }else if(currencyCode=='CLP'){
                      totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_clp);
                    }else if(currencyCode=='ARS'){
                      totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_ars);
                    }else if(currencyCode=='BRL'){
                      totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_brl);
                    }else if(currencyCode=='UYU'){
                      totalToPay = parseFloat(cock.totalToPay) * parseFloat(amount_uyu);
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
                    }else if(currencyCode=='ARS'){
                      accumulated = parseFloat(cock.accumulated) * parseFloat(amount_ars);
                    }else if(currencyCode=='BRL'){
                      accumulated = parseFloat(cock.accumulated) * parseFloat(amount_brl);
                    }else if(currencyCode=='UYU'){
                      accumulated = parseFloat(cock.accumulated) * parseFloat(amount_uyu);
                    }
                    
                  }

                  let totalToPayFirstPlace = 0;
                  if(!empty(cock) && !empty(cock.firstPlace)){
                    if(currencyCode=='USD'){
                      totalToPayFirstPlace = cock.firstPlace;
                    }else if(currencyCode=='PEN'){
                      totalToPayFirstPlace = parseFloat(cock.firstPlace) * parseFloat(amount_pen);
                    }else if(currencyCode=='COP'){
                      totalToPayFirstPlace = parseFloat(cock.firstPlace) * parseFloat(amount_cop);
                    }else if(currencyCode=='VES'){
                      totalToPayFirstPlace = parseFloat(cock.firstPlace) * parseFloat(amount_ves);
                    }else if(currencyCode=='CLP'){
                      totalToPayFirstPlace = parseFloat(cock.firstPlace) * parseFloat(amount_clp);
                    }else if(currencyCode=='ARS'){
                      totalToPayFirstPlace = parseFloat(cock.firstPlace) * parseFloat(amount_ars);
                    }else if(currencyCode=='BRL'){
                      totalToPayFirstPlace = parseFloat(cock.firstPlace) * parseFloat(amount_brl);
                    }else if(currencyCode=='UYU'){
                      totalToPayFirstPlace = parseFloat(cock.firstPlace) * parseFloat(amount_uyu);
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
                    }else if(currencyCode=='ARS'){
                      totalToPaySecondPlace = parseFloat(cock.secondPlace) * parseFloat(amount_ars);
                    }else if(currencyCode=='BRL'){
                      totalToPaySecondPlace = parseFloat(cock.secondPlace) * parseFloat(amount_brl);
                    }else if(currencyCode=='UYU'){
                      totalToPaySecondPlace = parseFloat(cock.secondPlace) * parseFloat(amount_uyu);
                    }
                    
                  }

                  let totalToPayThirdPlace = 0;
                  if(!empty(cock) && !empty(cock.thirdPlace)){
                    if(currencyCode=='USD'){
                      totalToPayThirdPlace = cock.thirdPlace;
                    }else if(currencyCode=='PEN'){
                      totalToPayThirdPlace = parseFloat(cock.thirdPlace) * parseFloat(amount_pen);
                    }else if(currencyCode=='COP'){
                      totalToPayThirdPlace = parseFloat(cock.thirdPlace) * parseFloat(amount_cop);
                    }else if(currencyCode=='VES'){
                      totalToPayThirdPlace = parseFloat(cock.thirdPlace) * parseFloat(amount_ves);
                    }else if(currencyCode=='CLP'){
                      totalToPayThirdPlace = parseFloat(cock.thirdPlace) * parseFloat(amount_clp);
                    }else if(currencyCode=='ARS'){
                      totalToPayThirdPlace = parseFloat(cock.thirdPlace) * parseFloat(amount_ars);
                    }else if(currencyCode=='BRL'){
                      totalToPayThirdPlace = parseFloat(cock.thirdPlace) * parseFloat(amount_brl);
                    }else if(currencyCode=='UYU'){
                      totalToPayThirdPlace = parseFloat(cock.thirdPlace) * parseFloat(amount_uyu);
                    }
                    
                  }

                  let totalToPayFourthPlace = 0;
                  if(!empty(cock) && !empty(cock.fourthPlace)){
                    if(currencyCode=='USD'){
                      totalToPayFourthPlace = cock.fourthPlace;
                    }else if(currencyCode=='PEN'){
                      totalToPayFourthPlace = parseFloat(cock.fourthPlace) * parseFloat(amount_pen);
                    }else if(currencyCode=='COP'){
                      totalToPayFourthPlace = parseFloat(cock.fourthPlace) * parseFloat(amount_cop);
                    }else if(currencyCode=='VES'){
                      totalToPayFourthPlace = parseFloat(cock.fourthPlace) * parseFloat(amount_ves);
                    }else if(currencyCode=='CLP'){
                      totalToPayFourthPlace = parseFloat(cock.fourthPlace) * parseFloat(amount_clp);
                    }else if(currencyCode=='ARS'){
                      totalToPayFourthPlace = parseFloat(cock.fourthPlace) * parseFloat(amount_ars);
                    }else if(currencyCode=='BRL'){
                      totalToPayFourthPlace = parseFloat(cock.fourthPlace) * parseFloat(amount_brl);
                    }else if(currencyCode=='UYU'){
                      totalToPayFourthPlace = parseFloat(cock.fourthPlace) * parseFloat(amount_uyu);
                    }
                    
                  }

                  let totalToPayFifthPlace = 0;
                  if(!empty(cock) && !empty(cock.fifthPlace)){
                    if(currencyCode=='USD'){
                      totalToPayFifthPlace = cock.fifthPlace;
                    }else if(currencyCode=='PEN'){
                      totalToPayFifthPlace = parseFloat(cock.fifthPlace) * parseFloat(amount_pen);
                    }else if(currencyCode=='COP'){
                      totalToPayFifthPlace = parseFloat(cock.fifthPlace) * parseFloat(amount_cop);
                    }else if(currencyCode=='VES'){
                      totalToPayFifthPlace = parseFloat(cock.fifthPlace) * parseFloat(amount_ves);
                    }else if(currencyCode=='CLP'){
                      totalToPayFifthPlace = parseFloat(cock.fifthPlace) * parseFloat(amount_clp);
                    }else if(currencyCode=='ARS'){
                      totalToPayFifthPlace = parseFloat(cock.fifthPlace) * parseFloat(amount_ars);
                    }else if(currencyCode=='BRL'){
                      totalToPayFifthPlace = parseFloat(cock.fifthPlace) * parseFloat(amount_brl);
                    }else if(currencyCode=='UYU'){
                      totalToPayFifthPlace = parseFloat(cock.fifthPlace) * parseFloat(amount_uyu);
                    }
                    
                  }

                  tabItems.push(<Tab eventKey={cock.id} title={cock.trackByTracksId.trackName + " " + moment(cock.raceToday).format('DD/MM/YYYY')} key={cock.id} >
                            <>
                <h2>Pollas Hípicas jugadas: <Badge pill variant={'success'}>{totalCocksById}</Badge></h2>
                <h3>Monto 1er. Lugar: {!empty(cock) 
                                && !empty(cock.totalToPay)
                                && !empty(cock.accumulated)
                                && !empty(cock.secondPlace)
                                ? 
                                  (cock.totalToPay > (cock.accumulated + cock.secondPlace + cock.thirdPlace + cock.fourthPlace + cock.fifthPlace)) ? 
                                  formatNumber(currencyCode,(totalToPay - totalToPaySecondPlace - totalToPayThirdPlace - totalToPayFourthPlace - totalToPayFifthPlace))
                                  :
                                  formatNumber(currencyCode,accumulated)
                                  
                                : !empty(totalToPayFirstPlace) ? formatNumber(currencyCode,totalToPayFirstPlace) : !empty(cock.totalToPay) ? formatNumber(currencyCode,(totalToPay)) : '0' }<br /> 
                                {!empty(cock) 
                                  && !empty(cock.secondPlace)
                                  && (cock.secondPlace > 0) ? 
                                <>Monto 2do. lugar: {formatNumber(currencyCode,totalToPaySecondPlace)}</>
                                    :
                                      null                                
                                    }
                                  <br /> 
                                  {!empty(cock) 
                                  && !empty(cock.thirdPlace)
                                  && (cock.thirdPlace > 0) ? 
                                <>Monto 3er. lugar: {formatNumber(currencyCode,totalToPayThirdPlace)}</>
                                    :
                                      null                                
                                    }
                                  <br /> 
                                  {!empty(cock) 
                                  && !empty(cock.fourthPlace)
                                  && (cock.fourthPlace > 0) ? 
                                <>Monto 4to. lugar: {formatNumber(currencyCode,totalToPayFourthPlace)}</>
                                    :
                                      null                                
                                    }
                                  <br /> 
                                  {!empty(cock) 
                                  && !empty(cock.fifthPlace)
                                  && (cock.fifthPlace > 0) ? 
                                <>Monto 5to. lugar: {formatNumber(currencyCode,totalToPayFifthPlace)}</>
                                    :
                                      null                                
                                    }
                                  <br />
                                  {!empty(cock) 
                                  && !empty(cock.jackpot)
                                  && (cock.jackpot > 0) ? 
                                  <>Monto Acumulado (Jackpot 30 puntos): {formatNumber(currencyCode,jackPot)}</>

                                  :
                                      null                                
                                  }
                                  {!empty(cock) 
                                  && !empty(cock.message)
                                  ? 
                                    <h2>{cock.message}</h2>
                                    :
                                      null                                
                                    }
                            </h3>
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
                                {!empty(this.props.track) && (this.props.track.id === '9101' || this.props.track.id === '9102')
                                ? 
                                <>
                                  <th>Carrera - (Caballo) 7</th>
                                  <th>Carrera - (Caballo) 8</th>
                                </>
                                : null
                                }
                                <th>TotalPuntos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.rowsMyTickets()}
                              </tbody>
                            </table>     
                            </div>
                            </>
                  
                  </Tab>)
                }else if(cock.priority===2){
                  let totalToPayFirstPlace = 0;
                if(!empty(cock) && !empty(cock.totalToPay)){
                  totalToPayFirstPlace = parseFloat(cock.totalToPay*percentageFirstPlace);
                  if(currencyCode=='VES'){
                    totalToPayFirstPlace = totalToPayFirstPlace * parseFloat(amount_ves);
                  }
                  
                }
                
        
                let totalToPaySecondPlace = 0;
                if(!empty(cock) && !empty(cock.totalToPay)){
                  totalToPaySecondPlace = parseFloat(cock.totalToPay*percentageSecondPlace);
                  if(currencyCode=='VES'){
                    totalToPaySecondPlace = totalToPaySecondPlace * parseFloat(amount_ves);
                  }
                  
                }

                let totalToPayThirdPlace = 0;
                if(!empty(cock) && !empty(cock.totalToPay)){
                  totalToPayThirdPlace = parseFloat(cock.totalToPay*percentageThirdPlace);
                  if(currencyCode=='VES'){
                    totalToPayThirdPlace = totalToPayThirdPlace * parseFloat(amount_ves);
                  }
                  
                }

                tabItems.push(<Tab eventKey={cock.id} title={cock.trackByTracksId.trackName + " " + moment(cock.raceToday).format('DD/MM/YYYY')} key={cock.id} >
                          <>
              <h2>Pollas Hípicas jugadas: <Badge pill variant={'success'}>{totalCocksById}</Badge></h2>
              <h3>Monto 1er. Lugar: {!empty(cock) 
                              && !empty(cock.totalToPay)
                              && !empty(totalToPayFirstPlace) ? formatNumber(currencyCode,totalToPayFirstPlace) : '0' }<br /> 
                              {!empty(cock) 
                                && !empty(cock.totalToPay)
                                && !empty(totalToPaySecondPlace) ? 
                               <>Monto 2do. lugar: {formatNumber(currencyCode,totalToPaySecondPlace)}</>
                                  :
                                    '0'                                
                                  }
                                <br /> 
                                {!empty(cock) 
                                && !empty(cock.totalToPay)
                                && !empty(totalToPayThirdPlace) ? 
                               <>Monto 3er. lugar: {formatNumber(currencyCode,totalToPayThirdPlace)}</>
                                  :
                                    '0'                                
                                  }
                                <br />
                                {!empty(cock) 
                                && !empty(cock.message)
                                 ? 
                                  <h2>{cock.message}</h2>
                                  :
                                    null                                
                                  }
                          </h3>
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
                              {!empty(this.props.track) && (this.props.track.id === '9101' || this.props.track.id === '9102')
                              ? 
                              <>
                                <th>Carrera - (Caballo) 7</th>
                                <th>Carrera - (Caballo) 8</th>
                              </>
                              : null
                              }
                              <th>TotalPuntos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.rowsMyTickets()}
                            </tbody>
                          </table>     
                          </div> 
                          </>
                
                    </Tab>)

                }

                

              }
            }


      return (
          <Tabs
          activeKey={this.props.activeKey} 
          onSelect={k => this.props.handleSelect(k)}>
              {tabItems}
          </Tabs>

  )
   }
}

export default TabCocks;

