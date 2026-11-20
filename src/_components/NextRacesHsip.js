import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../_actions';
import AuthActions from '../_actions/AuthActions';
import {Button} from 'react-bootstrap';
import moment from 'moment-timezone'

class NextRacesHsip extends React.Component {

  render () {

      const { newTracks,allNextRacesHsip } = this.props;
      let allNextRaces = allNextRacesHsip;

      let userData = AuthActions.meData();
      let centers_id =  (!empty(userData)) ? userData.centers_id : '';
      let allRaces=[];
      let rowsNextRaces = [];
      let date = require('date-and-time');

      if(empty(allNextRaces)){
        return null;
      }

      allRaces = allNextRaces;

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
  allNextRacesHsip
}) => ({
  allNextRacesHsip
});
const connectedNextRacesArgentino = connect(mapToProps, actions)(NextRacesHsip);
export { connectedNextRacesArgentino as NextRacesHsip };