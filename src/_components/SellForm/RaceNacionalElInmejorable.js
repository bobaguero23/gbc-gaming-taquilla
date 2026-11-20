import React from 'react';
import {Tabs,Tab,Form,Alert} from 'react-bootstrap';
import empty from 'is-empty';
import ResultsTable from '../ResultsTableNacional';
import moment from 'moment-timezone';
import Countdown from 'react-countdown';

class RaceNacionalElInmejorable extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.wagerTwoColumns = [4,5,6];
    this.wagerThreeColumns = [5,6];
    this.wagerFourColumns = [6];
    this.arrAllItems = [];
    this.state = {
      activeKey: null
    };
  }

  componentDidMount(){
    this.setState({ activeKey: this.props.activeKey });
  }

  componentWillReceiveProps(newProps){
    if(this.props.trackSelected[0] !== newProps.trackSelected[0]){
      this.setState({ activeKey: newProps.activeKey});
    }
  }

  allItems(position,horsesRaces,raceId) {
    let arrAux=[];
    if(!empty(horsesRaces))
    {
        if(empty(this.arrAllItems[raceId]))
        {
          this.arrAllItems[raceId] = [];
        }
        
        horsesRaces.forEach(function(element) {
          (element.statusId==1  ?
              arrAux.push(element.id)
            : null );
        })
        this.arrAllItems[raceId][position] = arrAux;
    }
  }

  rowsHorsesRaces(horsesRaces,race) {

    const {user} = this.props;



    let showOdds = false;

    let raceId = Number.parseInt(race.id);

    this.allItems(1,horsesRaces,race.id);
    ((this.wagerTwoColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0)  ? this.allItems(2,horsesRaces,race.id) :null);
    ((this.wagerThreeColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0)  ? this.allItems(3,horsesRaces,race.id) :null);
    ((this.wagerFourColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0)  ? this.allItems(4,horsesRaces,race.id) :null);

    return horsesRaces.map((horsesrace) =>
          (horsesrace.statusId==1  ?
          <tr key={horsesrace.id}>
            <td>
              <span className={`horse-${horsesrace.programNumber}`}>{horsesrace.programNumber}</span>
              {(showOdds) ? <div className={'horse-odd'}>{empty(horsesrace.odd) ? '-' : horsesrace.odd}</div> : null }
            </td>
            <td>{horsesrace.horseByHorsesId.horseName}</td>
            <td>{empty(horsesrace.jockey) ? '-' : horsesrace.jockey}</td>
            <td>{empty(horsesrace.trainer) ? '-' : horsesrace.trainer}</td>
            <td>
              <Form.Check 
                type="checkbox" 
                id="1" 
                name={horsesrace.id +'-'+ horsesrace.programNumber} 
                onChange={(e) => this.props.handleChangeCheckbox(e, race)} checked={(!empty(this.props.checkedHorses) ? (!empty(this.props.checkedHorses[raceId]) ? (!empty(this.props.checkedHorses[raceId][1]) ? this.props.checkedHorses[raceId][1].includes(Number.parseInt(horsesrace.id)):false):false):false)} 
                />
            </td>
            {((this.wagerTwoColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0)  ? 
            <td>
              <Form.Check 
                type="checkbox" 
                name={horsesrace.id +'-'+ horsesrace.programNumber} 
                id="2" 
                onChange={(e) => this.props.handleChangeCheckbox(e, race)} checked={(!empty(this.props.checkedHorses) ? (!empty(this.props.checkedHorses[raceId]) ? (!empty(this.props.checkedHorses[raceId][2]) ? this.props.checkedHorses[raceId][2].includes(Number.parseInt(horsesrace.id)):false):false):false)} 
              />
            </td>  
              : null)}
            {((this.wagerThreeColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0)  ? 
            <td>
              <Form.Check 
                type="checkbox" 
                name={horsesrace.id +'-'+ horsesrace.programNumber} 
                id="3" 
                onChange={(e) => this.props.handleChangeCheckbox(e, race)} checked={(!empty(this.props.checkedHorses) ? (!empty(this.props.checkedHorses[raceId]) ? (!empty(this.props.checkedHorses[raceId][3]) ? this.props.checkedHorses[raceId][3].includes(Number.parseInt(horsesrace.id)):false):false):false)}
              />
            </td>  
              : null)}
            {((this.wagerFourColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0) ? 
            <td>
              <Form.Check 
                type="checkbox" 
                name={horsesrace.id +'-'+ horsesrace.programNumber} 
                id="4" 
                onChange={(e) => this.props.handleChangeCheckbox(e,race)} checked={(!empty(this.props.checkedHorses) ? (!empty(this.props.checkedHorses[raceId]) ? (!empty(this.props.checkedHorses[raceId][4]) ? this.props.checkedHorses[raceId][4].includes(Number.parseInt(horsesrace.id)):false):false):false)} 
              />
            </td>  
              : null)}
          </tr>
         : 
         <tr key={horsesrace.id}>
            <td>

              <span className={`horse-${horsesrace.programNumber}`}>{horsesrace.programNumber}</span>

            </td>
            <td>{horsesrace.horseByHorsesId.horseName}</td>
            <td colSpan="4">Retirado</td>
          </tr>
         )
    );
  }

  rowsHorsesRacesClose(horsesRaces,raceId) {
    raceId = Number.parseInt(raceId);

    return horsesRaces.map((horsesrace) =>
          (horsesrace.statusId==1  ?
          <tr key={horsesrace.id}>
            <td>
              <span className={`horse-${horsesrace.programNumber}`}>
                {horsesrace.programNumber}
                
              </span>
            </td>
            <td colSpan="2">
              {horsesrace.horseByHorsesId.horseName} <br/>
            </td>
          </tr>
         : 
         <tr key={horsesrace.id}>
            <td>

              <span className={`horse-${horsesrace.programNumber}`}>{horsesrace.programNumber}</span>

            </td>
            <td>{horsesrace.horseByHorsesId.horseName}</td>
            <td colSpan="2">Retirado</td>
          </tr>
         )
    );
  }

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return null;
    } else {
      // Render a countdown

      if(parseInt(hours) != 0){
        return null
      }

      if(parseInt(minutes) > 5){
       return null
      }

      return (<Alert className="alert-close-notification" key="alert-close-notification" variant="danger">
      REALIZA TUS JUGADAS A TIEMPO, LA CARRERA CERRARÁ EN CUALQUIER MOMENTO.
      </Alert>)

    }
  };

  render () {
      const {races, currentTimestamp} = this.props;
      let tabItems = [];

       

      let date = require('date-and-time');
            if(!empty(races)){

              for (let race of races){

                let raceDateVES = moment.tz(race.raceDate,"America/Caracas")
                let currentTimestampVES = moment.tz(currentTimestamp,"America/Caracas")
                let closeDateDiffMin = (moment(raceDateVES).diff(moment(currentTimestampVES),'minutes'))  

                tabItems.push(<Tab eventKey={race.id}  key={race.id} >
                {( race.statusId==1 ?
                <>
                <Countdown date={raceDateVES.toDate()} renderer={this.renderer} />
                
                <span className="timeRace">Hora: {date.format(new Date(race.raceDate),"hh:mm:ss A")}</span>
                
                <table className="table table-sm table-form-bet table-hover">
                      <thead>
                        <tr>
                          <th className={'numberHorse'}>No</th>
                          <th>Ejemplar</th>
                          <th>Jockey</th>
                          <th>Entrenador</th>
                          <th className="betcheck">1</th>
                          {((this.wagerTwoColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0)  ?                                   
                          <th className="betcheck">2</th>
                          : null)}
                          {((this.wagerThreeColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0)  ? 
                          <th className="betcheck">3</th>
                          : null)}
                          {((this.wagerFourColumns.indexOf(parseInt(this.props.wagerTypeId)) >= 0) ? 
                          <th className="betcheck">4</th>
                          : null)}
                        </tr>      
                      </thead>
                      <tbody>
                        {this.rowsHorsesRaces(race.horsesRacesByRacesId.nodes,race)}                              
                      </tbody>
                </table>
              </>
                : <>
                    
                    <span className="timeRace">Hora: {date.format(new Date(race.raceDate),"hh:mm:ss A")} </span>
                    <div className="resultsTableTab">
                      <ResultsTable results={races} raceId={race.id}/>
                    </div>
                 
                  <table className="table table-sm">
                      <thead>
                        <tr>
                          <th className={'numberHorse'}>No</th>
                          <th>Ejemplar</th>
                        </tr>      
                      </thead>
                      <tbody>
                        {this.rowsHorsesRacesClose(race.horsesRacesByRacesId.nodes,Number.parseInt(race.id))}        
             
                      </tbody>
                </table>
              </>)}
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

export default RaceNacionalElInmejorable;

