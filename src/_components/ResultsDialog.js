import React from 'react';
import { connect } from "redux-zero/react";
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import {NavDropdown} from 'react-bootstrap';
import TracksDropDown from '../_components/TracksDropDown';
import ResultsTable from '../_components/ResultsTable';
//import { results } from "../_actions/ResultActions";
import empty from 'is-empty';
import actions from '../_actions'

class ResultsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            tracksId:0,
            resultsByTrack:[]
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);    
        this.handleChange = this.handleChange.bind(this);
    }

      handleClose() {
        this.setState({ show: false });
      }
    
      handleShow() {
        this.setState({ show: true });
        this.props.ResultActions({action: 'getAll', params : {}});
        //this.props.dispatch(results());

      }

      handleChange(e) {
        const { value } = e.target;
        let resultsArr = [];
        if(!empty(this.props.results))
        {
            let tracks = (!empty(this.props.results.allTracks.nodes) ? this.props.results.allTracks.nodes: null);

            if(!empty(tracks)){
              
              for(let i=0;i<tracks.length;i++)
              {
                if(parseInt(tracks[i].id)==parseInt(value))
                  {
                    resultsArr = tracks[i].racesByTracksId.nodes;
                  }
              }
            }
        }

        this.setState({
          tracksId: value,
          resultsByTrack:resultsArr
        });
        
    }

      render() {
        //console.log('RESULT DIALOG',this.props);
        return (
          <div className="row">
            <NavDropdown.Item onClick={this.handleShow}>Resultados del día</NavDropdown.Item>
    
            <Modal show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>Resultados del día</Modal.Title>
              </Modal.Header>
              <Modal.Body>

              <TracksDropDown handleChange={this.handleChange} 
              tracks={this.props.results}/>

                  <ResultsTable results={this.state.resultsByTrack}/>
              
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleClose}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
    
    
}

const mapStateToProps = ({ 
  results
}) => ({
  results
});

// Export the class
export default connect(mapStateToProps, actions)(ResultsDialog);
