import React from 'react';
import {Form,Badge} from 'react-bootstrap';
import empty from 'is-empty';
import {Button} from 'react-bootstrap';
import {formatNumber} from '../../_helpers/lib';

class TableCocksMultiple extends React.Component {
  constructor(props, context) { 
    super(props, context);
    this.state = {
      countRows : 0,
    };
    this.arrAllItems = [];
  }

  allItems(horsesRaces,position)
  {
    let arrAux=[];
    if(!empty(horsesRaces))
    {
        if(empty(this.arrAllItems[position]))
        {
          this.arrAllItems[position] = [];
        }
        
        horsesRaces.forEach(function(element) {
          (element.statusId==1  ?
              arrAux.push({id: element.id,programNumber: element.programNumber})
            : null );
        })
        this.arrAllItems[position] = arrAux;
    }
  }

  rowsHorsesRaces = (horsesRaces,position) => {
    
    this.allItems(horsesRaces,position);

    return horsesRaces.map((horsesrace) =>
          (horsesrace.statusId==1  ?
            <>
            &nbsp;
            <Form.Check key={horsesrace.id} 
            type="checkbox" 
            inline 
            label={<span className={`horse-${horsesrace.programNumber}`}>&nbsp;&nbsp; {horsesrace.programNumber}&nbsp;&nbsp;</span>} 
            id={position}
            name={horsesrace.id} 
            value={horsesrace.id} 
            onChange={this.props.handleChangeCheckbox} 
            checked={this.props.checkedHorses.includes(Number.parseInt(horsesrace.id))}
            />
            </>
         : 
            null)
    );
  }

  render () {
      const {racesPools,races,currencyCode,track,ticketCombinations} = this.props;
      
      let raceList = [];
      let newRaces = [];
      var countRows = 0;
      let racesPoolsCocks = [];
      let cock = this.props.cock;
      let amount = 0;
      let costByCock = 0;
      let openRaces = true;

      costByCock = cock.amount;
      amount = cock.amount * ticketCombinations;
      

      if(!empty(racesPools)){
          racesPoolsCocks = racesPools.filter(race => race.wagerTypeByWagerTypeId.id ==27);
          if(!empty(racesPoolsCocks) && !empty(cock)){
            raceList = racesPoolsCocks[0].raceList;
          }
      }

      if(!empty(racesPools) && !empty(raceList)){ 
        
          races.map(function (race){
            
            if(raceList.includes(race.raceNumber.toString())){
                if(race.statusId==2){
                  openRaces=false;
                }
                newRaces[race.raceNumber] = race.horsesRacesByRacesId.nodes;
            }
          });
      }


      return (
          <div>
              {(!empty(newRaces) && openRaces && !empty(track) ?
              <h2 className="cock-h2">{track.trackName}</h2>
              : null)}
              {(!empty(newRaces) && openRaces ?
                

                newRaces.map(function (horserace,index) 
                {
                  countRows=countRows+1;
                
                return (
                
                <div className="cocks-horses" key={index}>
                    <label>Caballos disponibles en Carrera: {index} )  </label> 
                    <br />
                    {this.rowsHorsesRaces(horserace,countRows)}                       
                </div>)}
                ,this) : <p>No hay carreras disponibles</p>)}
                        <div className="talign-center cocks-horses">
                          <p> <label>Costo por polla: {formatNumber(currencyCode, costByCock)}</label>
                          <br />
                          <label>Combinaciones: {ticketCombinations} </label></p>
                        </div>
                        { openRaces &&
                         parseFloat(amount) > 0 ?
                        <div className="pd-2 talign-center">
                        <Button type="button" onClick={(e) => this.props.confirmSubmit(track.id,amount,costByCock,ticketCombinations,e)}> Sellar por: {formatNumber(currencyCode, amount)}</Button>    
                        </div>
                        : null}
                      
          </div>
          

  )
   }
}

export default TableCocksMultiple;

