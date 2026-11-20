import React from 'react';
import { connect } from "redux-zero/react";
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import {Tabs,Tab,Form,Row,Col} from 'react-bootstrap';
import { ValidatorForm } from 'react-form-validator-core';
import empty from 'is-empty';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../../_actions';
import {formatNumber} from '../../_helpers/lib';
import { toast } from 'react-toastify';

class StallsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey       : null,
            show            : false,
            validated       : false,
            value_increment : 0,
            amount_min_usd: 1,
            amount_min_ves: 1500000,
            amount_min_pen: 20,
            amount_min_cop: 17500,
            amount_max_usd: 500,
            amount_max_ves: 30000000,
            amount_max_pen: 350,
            amount_max_cop: 350000,
            errors: {
              tracksId              : '',
              user_horse_races_id   : '',
              amount                : ''
            },
            sellform : {
              tracksId              : this.props.trackSelected[0],
              user_horse_races_id   : '',
              amount                : 0,
              stall_id            : ''
          }
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

      handleClose = () =>  {
        this.setState({ show: false });
      }
    
      handleShow = () => {
        let params = {tracksId:this.props.trackSelected[0]};
       this.setState({ show: true });
      }

    handleSelect = (eventKey) => {
        this.setState({
            activeKey: eventKey 
        });
    }

  onChangeInput = (e) => {
    const { name, value } = e.target;
    this.setState({ 
        sellform: {
            ...this.state.sellform,
            [name]: value
        }
    });
    

}

onChangeHorse = (stall_id,e) => {
  const { name, value} = e.target;
  this.setState({ 
      sellform: {
          ...this.state.sellform,
          [name]     : value,
          stall_id   : stall_id
      }
  });

}

handleOnClick = (e) => {
  const { value_increment} = this.state;
  const { amount} = this.state.sellform;
  this.setState({ 
      value_increment : value_increment,
      sellform: {
          ...this.state.sellform,
          amount: parseFloat(amount) + parseFloat(value_increment)
      }
  });
  

}

  handleSubmit = (e) => {
    const {account} = this.props;
    e.preventDefault();
    let horsesRacesIdSend = '';
    const { sellform } = this.state;
    
  if((this.props.currencyCode == 'USD' && parseFloat(sellform.amount) > this.state.amount_max_usd) 
  || (this.props.currencyCode == 'PEN' && parseFloat(sellform.amount) > this.state.amount_max_pen)
  || (this.props.currencyCode == 'VES' && parseFloat(sellform.amount) > this.state.amount_max_ves)
  || (this.props.currencyCode == 'COP' && parseFloat(sellform.amount) > this.state.amount_max_cop)
  ){
    toast.warn('El monto de la apuesta es mayor al máximo por ticket, debe realizarla por un monto menor',{position: toast.POSITION.TOP_CENTER});
  }else if((this.props.currencyCode == 'USD' && parseFloat(sellform.amount) < this.state.amount_min_usd) 
  || (this.props.currencyCode == 'PEN' && parseFloat(sellform.amount) < this.state.amount_min_pen)
  || (this.props.currencyCode == 'VES' && parseFloat(sellform.amount) < this.state.amount_min_ves)
  || (this.props.currencyCode == 'COP' && parseFloat(sellform.amount) < this.state.amount_min_cop)
  ){
    toast.warn('El monto de la apuesta es menor al mínimo por ticket, debe realizarla por un monto mayor',{position: toast.POSITION.TOP_CENTER});
  }else{
    
    if((parseInt(sellform.amount)>0) && (!empty(sellform.tracksId))){
        let array = sellform.user_horse_races_id.split('|');
        horsesRacesIdSend+='{position:@' + 1 + '@,horsesRacesId:@'+array[0]+'@},';
        sellform.horsesRacesId = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
        this.props.SellActions({action: 'sellStallTicket', params : { sellform }}  );

        this.setState({
            show:false,
            sellform : {
              tracksId:this.props.trackSelected[0],
              horsesRacesId:[],
          }
        });
    }
    else{
          toast.warn('Debe seleccionar el puesto y colocar el monto',{position: toast.POSITION.TOP_CENTER});
        
    }
  }

}

loadHorsesRacesOptions = (horsesraces,stall_id) => {
  
  const {loading } = this.props;      
  let options = [];

  if(!empty(horsesraces)) {
    
      options.push(<option key="0" value=''>Seleccionar..</option>);
      
      for (let horsesrace of horsesraces){
          if(horsesrace.statusId=="1")
          {
              options.push(<option key={horsesrace.id} value={`${horsesrace.id}`} > {`${horsesrace.programNumber} - ${horsesrace.horseByHorsesId.horseName}`} </option>);
          }
      };

  } else {

      if(loading){
          options.push(<option key="0" value=''>Cargando Lista..</option>);
      } else {
          options.push(<option key="0" value=''>Seleccionar..</option>);
      }
      
  }

  return (
      <Form.Control 
          as="select" 
          name="user_horse_races_id"
          value={this.state.sellform.user_horse_races_id}
          onChange={(e) => this.onChangeHorse(stall_id, e)}>
          {options}
      </Form.Control>);
}

loadTableHorsesRaces = (stalls,horsesraces) => {
  
  const {loading } = this.props;      
  let table = [];
  let rows = [];
  let currencyCode = '';
  let totalToPay = 0;
  let currentHorsesRaces = [];

  if(!empty(stalls)) {      
      for(let stallDetail of stalls.stallsDetailsByStallsId.nodes) {
          currentHorsesRaces = horsesraces.filter(horserace => (horserace.id == stallDetail.horsesRacesId));
          if(!empty(currentHorsesRaces) 
          && currentHorsesRaces[0].statusId==1){
              rows.push(
              <tr key={currentHorsesRaces[0].id}> 
                <td>{`${currentHorsesRaces[0].programNumber} - ${currentHorsesRaces[0].horseByHorsesId.horseName}`} </td>
                <td>{stallDetail.stallsTypeByStallsTypesId.stallName}</td>
              </tr>);
          }
      };

  } 
    table.push( <table className="table table-sm">
    <thead>
      <tr>
        <th>Caballo</th>
        <th>Puesto</th>
      </tr>      
    </thead>
    <tbody>
        {rows}
    </tbody>
    </table>);

  return table;
}

      render() {
      const { racesStalls} = this.props;
      const { errors, validated} = this.state;

      let tabItems = null;
      let date = require('date-and-time');
            if(!empty(racesStalls)){
            tabItems = racesStalls.map((race) =>
                  ((race.statusId==1) ?
                  <Tab eventKey={race.id} title={"Race # " + race.raceNumber} key={race.id}>
                    {( 
                      
                      (!empty(race.stallsByRacesId.nodes) && 
                      !empty(race.stallsByRacesId.nodes[0]) &&
                      !empty(race.stallsByRacesId.nodes[0].stallsDetailsByStallsId.nodes) &&
                       race.stallsByRacesId.nodes[0].stallsDetailsByStallsId.nodes.length > 0)

                     ? 
                            <Form 
                                id="stallsForm"
                                ref="stallsForm"
                                noValidate
                                validated={validated}
                                onSubmit={this.handleSubmit}>
                        <span className="timeRace">Hora: {date.format(new Date(race.raceDate),"hh:mm:ss A")}</span>
                    {this.loadTableHorsesRaces(race.stallsByRacesId.nodes[0], race.horsesRacesByRacesId.nodes)}
                    <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Caballo</th>
                                  <th>Cantidad a Apostar</th>
                                </tr>      
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                  <Form.Group controlId="horse_race_id">
                                  {this.loadHorsesRacesOptions(race.horsesRacesByRacesId.nodes,race.stallsByRacesId.nodes[0].id)}
                                  </Form.Group>
                                  </td>
                                  <td>
                                    <Form.Group controlId="amount">
                                      <Form.Control 
                                      required 
                                      requiredmessage="Campo es obligatorio"
                                      type="number" 
                                      value={this.state.sellform.amount}
                                      onChange={this.onChangeInput}
                                      name="amount"
                                      placeholder="Cantidad a apostar" />
                                      <Form.Control.Feedback type="invalid">
                                          {errors.amount}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                    </td>
                                    <td>
                                    <Button
                                        type="button"
                                        variant="primary" 
                                        style={{marginRight: '0'}} 
                                        onClick={this.handleOnClick}>+</Button>
                                </td>
                                </tr> 
                                <tr>
                                  <td colSpan='3' align='center'>
                                      <Button
                                        type="submit"
                                        variant="success" 
                                        style={{marginRight: '0'}} >Apostar Puesto</Button>
                                  </td>
                                </tr>
                              </tbody>
                        </table>
                        </Form>
                        : 'No hay puestos para esta carrera' )}
                  </Tab>
                  : '')
                );
            }

        

        return (
          <div className="fl">
          <PrintProvider>
            <NoPrint force>
            <div className="form-group col-12">
              <Button className="btn-full" variant="primary" onClick={this.handleShow}>
                VENTA DE PUESTOS
              </Button>
            </div>
    
            <Modal show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>Puestos</Modal.Title>
              </Modal.Header>
              <Modal.Body>

              <Tabs
                    activeKey={this.state.activeKey} 
                    onSelect={k => this.handleSelect(k)}>
                  {tabItems}
              </Tabs>
              <br />
              <h3>Reglas de Puestos</h3>
              <ul className="list-group list-group-flush">
              <li className="list-group-item">
              El monto mínimo a jugar por ticket es: 
              {this.props.currencyCode=='USD' ? ` USD ${this.state.amount_min_usd}` : null}
              {this.props.currencyCode=='PEN' ? ` PEN ${this.state.amount_min_pen}` : null}
              {this.props.currencyCode=='VES' ? ` VES ${this.state.amount_min_ves}` : null}
              {this.props.currencyCode=='COP' ? ` COP ${this.state.amount_min_cop}` : null}
              </li>
              <li className="list-group-item">
              El monto máximo a jugar por ticket es: 
              {this.props.currencyCode=='USD' ? ` USD ${this.state.amount_max_usd}` : null}
              {this.props.currencyCode=='PEN' ? ` PEN ${this.state.amount_max_pen}` : null}
              {this.props.currencyCode=='VES' ? ` VES ${this.state.amount_max_ves}` : null}
              {this.props.currencyCode=='COP' ? ` COP ${this.state.amount_max_cop}` : null}
              </li>
              </ul>
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
  ticketInfo,
  account
}) => ({
  tracks,
  ticketInfo,
  account
});
const connectedAuctionsDialog = connect(mapToProps, actions)(StallsDialog);
export { connectedAuctionsDialog as StallsDialog };
