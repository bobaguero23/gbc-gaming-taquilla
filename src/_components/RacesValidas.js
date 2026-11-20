import React from 'react';
import {Nav,NavDropdown,Form} from 'react-bootstrap';
import empty from 'is-empty';


class RacesValidas extends React.Component {
  constructor(props, context) { 
    super(props, context);
    this.state = {
      countRows : 0,
      ticketValue: 0,
      ticketCombinations: 0,
      valueUnits: this.props.unitsValue,
      show: false,
      horsesRacesIdAll:[],
      horsesRacesSelected:[],
      dialogform : {
        horsesRacesId:[],
      }
    };
    this.arrAllItems = [];
    
  }

 

  allItems(race,horsesRaces,position)
  {
    let arrAux=[];
    if(!empty(horsesRaces))
    {
        if(empty(this.arrAllItems[position]))
        {
          this.arrAllItems[position] = [];
        }
        
        horsesRaces.forEach(function(element) {
          ((element.horsesRacesStatusId==1 && element.raceNumber == race)  ?
              arrAux.push(element.id)
            : null );
        })
        this.arrAllItems[position] = arrAux;
    }
  }

  rowsHorsesRaces(race,horsesRaces,position)
  {
    this.allItems(race,horsesRaces,position);

    return horsesRaces.map((horsesrace) =>
          ((horsesrace.horsesRacesStatusId==1 && horsesrace.raceNumber == race )  ?
            <Form.Check key={horsesrace.horsesRacesId} 
            type="checkbox" 
            inline 
            label={`${horsesrace.programNumber}`} 
            id={position} 
            name={horsesrace.horsesRacesId} 
            onChange={this.props.handleChangeCheckbox} 
            checked={this.props.checkedHorses.includes(Number.parseInt(horsesrace.horsesRacesId))}
            />
         : 
            null)
    );
  }


  render () {
      //console.log('NAV RACES POOLS',this.props);
      var countRows = 0;
      let horsesRaces = [];
      let races = [];
      let racesLabel = [];
      if(!empty(this.props.races) &&
        !empty(this.props.races.procRacesInhValidas) &&
        !empty(this.props.races.procRacesInhValidas.nodes)){
        races = this.props.races.procRacesInhValidas.nodes;
        horsesRaces = this.props.races.procRacesInhValidas.nodes;
        races.map(function (race) {
          racesLabel[race.racesId] = race.raceNumber;
        })
      }

      //console.log('RACES FILTRADAS',racesLabel);
      
      return (
          <div>
              {(!empty(racesLabel) ?

              racesLabel.map(function (race,index) 
                {
                  countRows=countRows+1;
                
                return (<div key={race}>
                    <label>Caballos disponibles en Carrera:{race}</label> 
                    <br />
                    {this.rowsHorsesRaces(race,horsesRaces,countRows)} 
                    <Form.Check key={index} 
                    type="checkbox" 
                    inline 
                    label="Todos" 
                    id={countRows} 
                    name="all" 
                    onChange={(e) => this.props.handleChangeCheckboxAll(e, this.arrAllItems)} 
                    />
                </div>)}
                ,this) : null)}
          </div>

  )
   }
}

export default RacesValidas;

