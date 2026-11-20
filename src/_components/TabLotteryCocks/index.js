import React from 'react';
import {Tabs,Tab,Badge} from 'react-bootstrap';
import empty from 'is-empty';
import moment from 'moment';
import {formatNumber} from '../../_helpers/lib';
import config from "config";

class TabLotteryCocks extends React.Component {
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
    
    const { lotteryCocksTickets,user} = this.props;
    let rowsMyTickets = [];

     if(empty(lotteryCocksTickets)) { 
        return null;
    }

    for(let i=0; i < lotteryCocksTickets.length;i++){     
 
        rowsMyTickets.push(
          <tr key={lotteryCocksTickets[i].id}>
            <td>
              <Badge variant={lotteryCocksTickets[i].userId == user.id ? 'success' : 'danger' }>
                  {lotteryCocksTickets[i].userAlias}/{lotteryCocksTickets[i].confirm}
              </Badge>
            </td>
            <td>{lotteryCocksTickets[i].number1} </td>
            <td>{lotteryCocksTickets[i].number2} </td>
            <td>{lotteryCocksTickets[i].number3} </td>
            <td>{lotteryCocksTickets[i].number4} </td>
            <td>{lotteryCocksTickets[i].number5} </td>
            <td>{lotteryCocksTickets[i].number6} </td>

            <td>{lotteryCocksTickets[i].totalPoints}</td>
        </tr>);
        
    }

    return rowsMyTickets;
  }



  render () {
      const {lotteryCocks,totalCocksById, user} = this.props;
      const { amount_usd,amount_pen,amount_ves,amount_cop, amount_clp,amount_ars,amount_brl,amount_uyu} = this.state;
      let tabItems = [];
      let currencyCode =  (!empty(user)) ? user.currency_code : '';
            
            if(!empty(lotteryCocks)){

              for (let cock of lotteryCocks){   
                let totalToPay = 0;
                if(!empty(cock) && !empty(cock.totalToPay)){
                    totalToPay = cock.totalToPay;
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
                if(!empty(cock) 
                && !empty(cock.firstPlace) 
                && cock.firstPlace>0){
                  totalToPayFirstPlace = cock.firstPlace*totalToPay;
                  if(currencyCode=='USD'){
                    totalToPayFirstPlace = totalToPayFirstPlace;
                  }else if(currencyCode=='PEN'){
                    totalToPayFirstPlace = parseFloat(totalToPayFirstPlace) * parseFloat(amount_pen);
                  }else if(currencyCode=='COP'){
                    totalToPayFirstPlace = parseFloat(totalToPayFirstPlace) * parseFloat(amount_cop);
                  }else if(currencyCode=='VES'){
                    totalToPayFirstPlace = parseFloat(totalToPayFirstPlace) * parseFloat(amount_ves);
                  }else if(currencyCode=='CLP'){
                    totalToPayFirstPlace = parseFloat(totalToPayFirstPlace) * parseFloat(amount_clp);
                  }else if(currencyCode=='ARS'){
                    totalToPayFirstPlace = parseFloat(totalToPayFirstPlace) * parseFloat(amount_ars);
                  }else if(currencyCode=='BRL'){
                    totalToPayFirstPlace = parseFloat(totalToPayFirstPlace) * parseFloat(amount_brl);
                  }else if(currencyCode=='UYU'){
                    totalToPayFirstPlace = parseFloat(totalToPayFirstPlace) * parseFloat(amount_uyu);
                  }
                  
                }
                
        
                let totalToPaySecondPlace = 0;
                if(!empty(cock) 
                && !empty(cock.secondPlace)
                && cock.secondPlace>0){
                  totalToPaySecondPlace = cock.secondPlace*totalToPay;
                  if(currencyCode=='USD'){
                    totalToPaySecondPlace = totalToPaySecondPlace;
                  }else if(currencyCode=='PEN'){
                    totalToPaySecondPlace = parseFloat(totalToPaySecondPlace) * parseFloat(amount_pen);
                  }else if(currencyCode=='COP'){
                    totalToPaySecondPlace = parseFloat(totalToPaySecondPlace) * parseFloat(amount_cop);
                  }else if(currencyCode=='VES'){
                    totalToPaySecondPlace = parseFloat(totalToPaySecondPlace) * parseFloat(amount_ves);
                  }else if(currencyCode=='CLP'){
                    totalToPaySecondPlace = parseFloat(totalToPaySecondPlace) * parseFloat(amount_clp);
                  }else if(currencyCode=='ARS'){
                    totalToPaySecondPlace = parseFloat(totalToPaySecondPlace) * parseFloat(amount_ars);
                  }else if(currencyCode=='BRL'){
                    totalToPaySecondPlace = parseFloat(totalToPaySecondPlace) * parseFloat(amount_brl);
                  }else if(currencyCode=='UYU'){
                    totalToPaySecondPlace = parseFloat(totalToPaySecondPlace) * parseFloat(amount_uyu);
                  }
                  
                }

                let totalToPayThirdPlace = 0;
                if(!empty(cock) 
                && !empty(cock.thirdPlace)
                && cock.thirdPlace>0){
                  totalToPayThirdPlace = cock.thirdPlace*totalToPay;
                  if(currencyCode=='USD'){
                    totalToPayThirdPlace = totalToPayThirdPlace;
                  }else if(currencyCode=='PEN'){
                    totalToPayThirdPlace = parseFloat(totalToPayThirdPlace) * parseFloat(amount_pen);
                  }else if(currencyCode=='COP'){
                    totalToPayThirdPlace = parseFloat(totalToPayThirdPlace) * parseFloat(amount_cop);
                  }else if(currencyCode=='VES'){
                    totalToPayThirdPlace = parseFloat(totalToPayThirdPlace) * parseFloat(amount_ves);
                  }else if(currencyCode=='CLP'){
                    totalToPayThirdPlace = parseFloat(totalToPayThirdPlace) * parseFloat(amount_clp);
                  }else if(currencyCode=='ARS'){
                    totalToPayThirdPlace = parseFloat(totalToPayThirdPlace) * parseFloat(amount_ars);
                  }else if(currencyCode=='BRL'){
                    totalToPayThirdPlace = parseFloat(totalToPayThirdPlace) * parseFloat(amount_brl);
                  }else if(currencyCode=='UYU'){
                    totalToPayThirdPlace = parseFloat(totalToPayThirdPlace) * parseFloat(amount_uyu);
                  }
                  
                }

                tabItems.push(<Tab eventKey={cock.id} title={cock.lotteryCockName + " " + moment(cock.lotteryToday).format('DD/MM/YYYY')} key={cock.id} >
                          <>
              <h2>Pollas de Animalitos jugadas: <Badge pill variant={'success'}>{totalCocksById}</Badge></h2>
              <h3>Monto 1er. Lugar: {!empty(cock) 
                              && !empty(totalToPayFirstPlace)
                              ? 
                                formatNumber(currencyCode,totalToPayFirstPlace) 
                               : '0' }<br /> 
                              {!empty(cock) 
                                && !empty(totalToPaySecondPlace)
                                && (totalToPaySecondPlace > 0) ? 
                               <>Monto segundo lugar: {formatNumber(currencyCode,totalToPaySecondPlace)}</>
                                  :
                                    null                                
                                  }

                          </h3>
                          <div className="table-responsive">
                          <table className="table table-sm lotteryCocks-multiple">
                          <thead>
                            <tr>
                              <th>Usuario/Ticket</th>
                              <th>Animalito 1</th>
                              <th>Animalito 2</th>
                              <th>Animalito 3</th>
                              <th>Animalito 4</th>
                              <th>Animalito 5</th>
                              <th>Animalito 6</th>
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


      return (
          <Tabs
          activeKey={this.props.activeKey} 
          onSelect={k => this.props.handleSelect(k)}>
              {tabItems}
          </Tabs>

  )
   }
}

export default TabLotteryCocks;

