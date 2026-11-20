import React from 'react';
import {Form, Row,Col} from 'react-bootstrap';
import empty from 'is-empty';
import {Button} from 'react-bootstrap';

class TableMacuares extends React.Component {
  constructor(props, context) { 
    super(props, context);
    this.state = {
      countRows : 0,
      sellform : {
        amount  :0
      },
      errors:{
        amount:0
      }

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
      const {racesPools,races,account,currencyCode,totalToPay} = this.props;
      const {errors} = this.state;
      
      let horsesRacesSelected = {};
      let raceList = [];
      let newRaces = [];
      var countRows = 0;
      let racesPoolsMacuares = [];
      let macuare = this.props.macuare;
      let multiplier = 0;
      let openRaces = true;
      
      

      if(!empty(racesPools)){
          
          racesPoolsMacuares = racesPools.filter(race => race.wagerTypeByWagerTypeId.id ==28);
          
          if(!empty(racesPoolsMacuares) && !empty(macuare)){
            raceList = racesPoolsMacuares[0].raceList;
            multiplier = (!empty(macuare) && !empty(macuare[0]) ? macuare[0].multiplier: 0);
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
                
                <div className="macuares-horses" key={index}>
                    <label>Caballos disponibles en Carrera: {index} )  </label> 
                    <br />
                    {this.rowsHorsesRaces(horserace,countRows)}                       
                </div>)}
                ,this) : <p>No hay carreras disponibles</p>)}
                        { openRaces ? 
                        <div>
                        
                         <table className="table table-sm">
                              <thead align="center">
                                <tr>
                                  <th>Cantidad a Apostar</th>
                                  <th>Multiplicador</th>
                                  <th>Monto a ganar</th>
                                  <th>Apostar</th>
                                </tr>      
                              </thead>
                              <tbody align="center">
                                <tr>
                                  <td>
                                    <Form.Group controlId="amount-macuares">
                                      <Form.Control 
                                      required 
                                      requiredmessage="Campo es obligatorio"
                                      type="number" 
                                      onChange={
                                        (e) => this.props.onChangeInput(multiplier, e)}
                                      name="amount"
                                      placeholder="Cantidad a apostar" />
                                      <Form.Control.Feedback type="invalid">
                                          {errors.amount}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </td>
                                  <td >
                                      {multiplier}
                                  </td>
                                  <td>
                                      {totalToPay}
                                  </td>
                                  <td>
                                      <Button
                                          type="button"
                                          onClick={(e) => this.props.handleSubmitMacuares(e)}
                                          variant="success" 
                                          style={{marginRight: '0'}} >Crear Mi Macuare</Button>


                                  </td>
                                </tr>
                            </tbody>
                          </table>
                          </div>
                        : null
                      }
          </div>
          

  )
   }
}

export default TableMacuares;

