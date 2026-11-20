import React from 'react';
import { connect } from "redux-zero/react";
import {Modal,Badge,Button,Alert} from 'react-bootstrap';

import empty from 'is-empty';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../../_actions';
import { toast } from 'react-toastify';

class ViewCocksDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketValue: 0,
            ticketCombinations: 0,
            turfClass: this.props.trackSelected[2],
            show: false,
            horsesRacesIdAll:[],
            horsesRacesSelected:[],
            amount_usd: 1,
            dialogform : {
              wagerTypeId: 27,
              tracksId:this.props.trackSelected[0],
              horsesRacesId:[],
              username: ''
          }
        };    
    }

      handleClose = () =>   {
        this.setState({ show: false });
      }
    
      handleShow = () => {
        let params = !empty(this.props.cock) && !empty(this.props.cock[0]) ? {cock_id:parseInt(this.props.cock[0].id)} : {}; 
        this.props.TicketsActions({action: 'getAllTicketsProcCocksById', params: {params}});  
        this.setState({ 
          show: true
      });
      }

  horsesNames = (horsesaces,wager_type_id) =>{
    let horses_name = [];    
      for(let l=0;l<horsesaces.length;l++){
        horses_name.push(<>C{horsesaces[l].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber} - ({horsesaces[l].horsesRaceByHorsesRacesId.programNumber}) / </>);
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
                  {cocksTickets[i].userAlias}/{cocksTickets[i].confirm}
             </td>
            <td>{cocksTickets[i].raceNumber1} - ({cocksTickets[i].programNumber1}) </td>
            <td>{cocksTickets[i].raceNumber2} - ({cocksTickets[i].programNumber2}) </td>
            <td>{cocksTickets[i].raceNumber3} - ({cocksTickets[i].programNumber3}) </td>
            <td>{cocksTickets[i].raceNumber4} - ({cocksTickets[i].programNumber4}) </td>
            <td>{cocksTickets[i].raceNumber5} - ({cocksTickets[i].programNumber5}) </td>
            <td>{cocksTickets[i].raceNumber6} - ({cocksTickets[i].programNumber6}) </td>

            <td>{cocksTickets[i].totalPoints}</td>
        </tr>);
        
    }

    return rowsMyTickets;
  }
    
    
      render() {

        return (
          <div className="row display-b">
          <PrintProvider>
            <NoPrint force>
            {!empty(this.props.cock) ?  
                  <div className="form-group col-12">
                  <Button className="btn-full" variant="info" onClick={this.handleShow}>
                    {'Ver Pollas Selladas' }
                  </Button>
                </div>
            : null}
    
            <Modal dialogClassName={`center_53`} show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>{'Polla Hípica'} - {this.props.trackSelected[1]}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
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
                              <th>TotalPuntos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.rowsMyTickets()}
                            </tbody>
                          </table>     
                          </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleClose}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
            </NoPrint>
            </PrintProvider>
          </div>
        );
      }
    
    
}

const mapToProps = ({
  tracks,
  cocksTickets,
  ticketInfo,
  ticketoffice,
  user
}) => ({
  tracks,
  cocksTickets,
  ticketInfo,
  ticketoffice,
  user
});
const connectedViewCocksDialog = connect(mapToProps, actions)(ViewCocksDialog);
export { connectedViewCocksDialog as ViewCocksDialog };
