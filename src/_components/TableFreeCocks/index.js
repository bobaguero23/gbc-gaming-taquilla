import React from 'react';
import {Form} from 'react-bootstrap';
import empty from 'is-empty';
import {Button} from 'react-bootstrap';
import {formatNumber} from '../../_helpers/lib';

class TableCocks extends React.Component {
  constructor(props, context) { 
    super(props, context);
    this.state = {
      countRows : 0,
      amount_usd: 1
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
            type="radio" 
            inline 
            label={<span className={`horse-${horsesrace.programNumber}`}>&nbsp;&nbsp; {horsesrace.programNumber}&nbsp;&nbsp;</span>} 
            id={`${position}-${horsesrace.programNumber}`} 
            name={horsesrace.id} 
            value={horsesrace.id} 
            onChange={this.props.handleChangeCheckbox} 
            checked={!empty(this.props.checkedHorses[position]) ? this.props.checkedHorses[position].includes(Number.parseInt(horsesrace.id)) : false}
            />
            </>
         : 
            null)
    );
  }

  render () {
      const {racesPools,races,currencyCode} = this.props;
      const { amount_usd} = this.state;
      
      let horsesRacesSelected = {};
      let raceList = [];
      let newRaces = [];
      var countRows = 0;
      let racesPoolsCocks = [];
      let cock = this.props.cock;
      let amount = 0;
      let openRaces = true;
      
      

      if(!empty(racesPools)){
          racesPoolsCocks = racesPools.filter(race => race.wagerTypeByWagerTypeId.id ==27);
          if(!empty(racesPoolsCocks) && !empty(cock)){
            raceList = racesPoolsCocks[0].raceList;

            if(currencyCode=='USD'){
              amount = cock[0].amount;
            }

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
                        { openRaces ? 
                        <div className="pd-2 talign-center">
                        <input type="text" id="username" name="username" className="form-control form-control-sm" placeholder="Usuario"  onChange={this.props.handleChange} /> 
                        <Button type="button" onClick={(e) => this.props.handleSubmitCocks(amount,e)}> Jugar Gratis</Button>   
                        </div>
                        : null
                        }
          </div>
          

  )
   }
}

export default TableCocks;

