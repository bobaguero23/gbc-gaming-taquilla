import React from 'react';
import {Nav,NavDropdown,Form} from 'react-bootstrap';
import empty from 'is-empty';

class RacesPools5y6 extends React.Component {
  constructor(props, context) { 
    super(props, context);
    this.state = {
      countRows : 0
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
              arrAux.push(element.id)
            : null );
        })
        this.arrAllItems[position] = arrAux;
    }
  }

  rowsHorsesRaces(horsesRaces,position,raceNumber)
  {
    const {wagerTypeId} =  this.props;

    this.allItems(horsesRaces,position);
    let rows = [];

    if(wagerTypeId == '10'){
      let place1Race = [];
      let place2Race = [];
      if(position ==2){
        position = 3;
      }
      let position2 = position + 1; 
      for (let horsesrace of horsesRaces){
          let race = {
            id: horsesrace.racesId,
            raceNumber: raceNumber
          }        
          if(horsesrace.statusId==1){
            place1Race.push(<>
              &nbsp;
                <Form.Check key={horsesrace.id} 
                    type="checkbox" 
                    id={position}
                    inline 
                    label={<span className={`horse-${horsesrace.programNumber}`}>&nbsp;&nbsp;{horsesrace.programNumber}&nbsp;&nbsp;</span>}
                    name={horsesrace.id +'-'+ horsesrace.programNumber} 
                    onChange={(e) => this.props.handleChangeCheckbox(e, race)} 
                    checked={(!empty(this.props.checkedHorses) ? (!empty(this.props.checkedHorses[horsesrace.racesId]) ? (!empty(this.props.checkedHorses[horsesrace.racesId][position]) ? this.props.checkedHorses[horsesrace.racesId][position].includes(Number.parseInt(horsesrace.id)):false):false):false)} 
                  />                  
              </>);
              place2Race.push(<>
                &nbsp;
                  <Form.Check key={horsesrace.id} 
                      type="checkbox" 
                      id={position2}
                      inline 
                      label={<span className={`horse-${horsesrace.programNumber}`}>&nbsp;&nbsp;{horsesrace.programNumber}&nbsp;&nbsp;</span>}
                      name={horsesrace.id +'-'+ horsesrace.programNumber} 
                      onChange={(e) => this.props.handleChangeCheckbox(e, race)} 
                      checked={(!empty(this.props.checkedHorses) ? (!empty(this.props.checkedHorses[horsesrace.racesId]) ? (!empty(this.props.checkedHorses[horsesrace.racesId][position2]) ? this.props.checkedHorses[horsesrace.racesId][position2].includes(Number.parseInt(horsesrace.id)):false):false):false)} 
                    />
                    
                </>);
            }
  
          }

        rows.push(<> Caballos Posición 1: {place1Race} <br /><br /></>);
        rows.push(<> Caballos Posición 2: {place2Race} <br /></>);
      
    }else{

      rows = horsesRaces.map((horsesrace) => {
        let race = {
          id: horsesrace.racesId,
          raceNumber: raceNumber
        }
          return (horsesrace.statusId==1  ?
            <>
            &nbsp;
              <Form.Check key={horsesrace.id} 
                  type="checkbox" 
                  id={position}
                  inline 
                  label={<span className={`horse-${horsesrace.programNumber}`}>&nbsp;&nbsp;{horsesrace.programNumber}&nbsp;&nbsp;</span>}
                  name={horsesrace.id +'-'+ horsesrace.programNumber} 
                  onChange={(e) => this.props.handleChangeCheckbox(e, race)} 
                  checked={(!empty(this.props.checkedHorses) ? (!empty(this.props.checkedHorses[horsesrace.racesId]) ? (!empty(this.props.checkedHorses[horsesrace.racesId][position]) ? this.props.checkedHorses[horsesrace.racesId][position].includes(Number.parseInt(horsesrace.id)):false):false):false)} 
                />
                
            </>
          : 
              null)
          
          }
        
        );
    }

    
    return rows;
  }

  render () {
    
      const {racesPools,horsesRacesSelected} = this.props;

      var countRows = 0;
      
      return (
          <div>
              {(!empty(horsesRacesSelected) ?

                horsesRacesSelected.map(function (horserace,index) 
                {
                  countRows=countRows+1;
                
                return (<div key={index}>
                    <label>Caballos disponibles en Carrera:{index}</label> <br />
                    {this.rowsHorsesRaces(horserace,countRows,index)} 
                    <br />
                    <br />
                    
                </div>)}
                ,this) : null)}
          </div>

  )
   }
}

export default RacesPools5y6;

