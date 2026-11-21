import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../_actions';
import AuthActions from '../_actions/AuthActions';
import {Button} from 'react-bootstrap';
import moment from 'moment-timezone'

class NextRaces extends React.Component {

  getRacesByCenterId=(allNextRaces, ticket_offices_id) =>{
    
    let result = [];



    for(let race of allNextRaces){

      if(ticket_offices_id == 193){

        if(race.trackByTracksId.enabledBetpredator){
          result.push(race);
        }

      } else {

        if(race.trackByTracksId.enabledCustomers){
          result.push(race);
        }

      }

    }

    return result.slice(0,9);

  }

  render () {

      const { newTracks,allNextRaces } = this.props;

      let userData = AuthActions.meData();
      let centers_id =  (!empty(userData)) ? userData.centers_id : '';
      let allRaces=[];
      let rowsNextRaces = [];
      let date = require('date-and-time');

      if(empty(allNextRaces)){
        return null;
      }

      allRaces = this.getRacesByCenterId(allNextRaces, centers_id);

      if(!empty(allRaces)) {
              
              for(let k in allRaces){

                if(allRaces[k].trackByTracksId.id != '9101' 
                && allRaces[k].trackByTracksId.id != '9102'
                && allRaces[k].trackByTracksId.id != '9100'){
                  rowsNextRaces.push(<tr key={allRaces[k].id}>
                    <td>{moment(allRaces[k].raceDate).format("hh:mm:ss A")}</td>
                    <td><Button variant="primary" size="sm" onClick={() => { this.props.onClickTrackNextRace(allRaces[k].trackByTracksId.id) } }>{allRaces[k].trackByTracksId.trackName}</Button></td>
                    <td align="center">{allRaces[k].raceNumber}</td>
                  </tr>);
                }
              }  
            
        
      }

       return (
        <div className="row block-next-races"> 
          <h3>Próximas carreras</h3>
          <table className="table table-sm">
          <thead>
            <tr>
              <th width="30%" scope="col">Hora</th>
              <th width="55%" scope="col">Hipódromo</th>
              <th width="15%" align="left" scope="col">Carrera #</th>
            </tr>
          </thead>
          <tbody>
            {rowsNextRaces}
            </tbody>
          </table>     
        </div>
      )
   }
}

const mapToProps = ({
  allNextRaces
}) => ({
  allNextRaces
});
const connectedNextRaces = connect(mapToProps, actions)(NextRaces);
export { connectedNextRaces as NextRaces };