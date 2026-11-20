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

class FixedTablesDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey       : null,
            show            : false,
            validated       : false,
            amount_usd: 1,
            errors: {
              tracksId              : '',
              user_horse_races_id   : '',
              amount                : ''
            },
            sellform : {
              tracksId              : this.props.trackSelected[0],
              user_horse_races_id   : '',
              amount                : 0,
              fixed_table_id        : '',
              units                 : 0,
              totalToPay            : 0
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

  onChangeInput = (fixedTablesByRacesId,e) => {
    const { name, value } = e.target;
    const {currencyCode} = this.props;      
    const { user_horse_races_id } = this.state.sellform;
    const {amount_usd,amount_pen,amount_ves,amount_cop, amount_clp} = this.state;

    let amount = this.state.sellform.amount;
    let valueFixedTable = 0;
    let totalToPay = 0;
    let limit = 0;
    
    if(name=="units"){
      totalToPay = parseInt(fixedTablesByRacesId.nodes[0].totalToPay);
      let fixedTableDetails = fixedTablesByRacesId.nodes[0].fixedTablesDetailsByFixedTableId.nodes.filter(horserace => (horserace.horsesRacesId == user_horse_races_id));
      valueFixedTable = fixedTableDetails[0].fixedTableValue;
      limit = fixedTableDetails[0].fixedTableLimit;
      amount = (parseInt(value) * valueFixedTable);
    }

    if(value > limit){
      return;
    }

    this.setState({ 
        sellform: {
            ...this.state.sellform,
            [name]: parseInt(value),
            amount,
            totalToPay
        }
    });
    

}

onChangeHorse = (fixed_table_id,totalToPay,racesFixedTables,e) => {
  const { name, value} = e.target;
  const {currencyCode} = this.props;
  const {units} = this.state.sellform;

  totalToPay=parseInt(totalToPay);
  let amount = this.state.sellform.amount;
  let valueFixedTable = 0;
  let fixedTableDetails = racesFixedTables.nodes[0].fixedTablesDetailsByFixedTableId.nodes.filter(horserace => (horserace.horsesRacesId == value));
  valueFixedTable = fixedTableDetails[0].fixedTableValue;
  amount = (parseInt(units) * valueFixedTable);
    

  this.setState({ 
      sellform: {
          ...this.state.sellform,
          [name]     : value,
          fixed_table_id   : fixed_table_id,
          totalToPay,
          amount
      }
  });

}

  handleSubmit = (e) => {
    e.preventDefault();
    let horsesRacesIdSend = '';
    const { sellform } = this.state;
    
    if((parseInt(sellform.amount)>0) && (!empty(sellform.tracksId))){
        let array = sellform.user_horse_races_id.split('|');
        horsesRacesIdSend+='{position:@' + 1 + '@,horsesRacesId:@'+array[0]+'@},';
        sellform.horsesRacesId = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))];
        this.props.SellActions({action: 'sellFixedTabledTicket', params : { sellform }}  );

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

loadHorsesRacesOptions = (horsesraces,fixed_table_id,totalToPay,racesFixedTables) => {
  
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
          onChange={(e) => this.onChangeHorse(fixed_table_id,totalToPay,racesFixedTables, e)}>
          {options}
      </Form.Control>);
}

loadTableHorsesRaces = (fixed_tables,horsesraces) => {
  
  const {loading,currencyCode} = this.props;      
  const {amount_usd,amount_pen,amount_ves,amount_cop, amount_clp} = this.state;
  let table = [];
  let rows = [];
  let totalToPay = parseInt(fixed_tables.totalToPay);
  
  let currentHorsesRaces = [];
  let valueFixedTable = 0;
  
  if(currencyCode=='PEN'){
    totalToPay = parseFloat(totalToPay) * parseFloat(amount_pen);
  }else if(currencyCode=='COP'){
    totalToPay = parseFloat(totalToPay) * parseFloat(amount_cop);
  }else if(currencyCode=='VES'){
    totalToPay = parseFloat(totalToPay) * parseFloat(amount_ves);
  }else if(currencyCode=='CLP'){
    totalToPay = parseFloat(totalToPay) * parseFloat(amount_clp);
  }
    
  
  if(!empty(fixed_tables)) {      
      for(let fixedTableDetail of fixed_tables.fixedTablesDetailsByFixedTableId.nodes) {
          if(currencyCode=='USD'){
            valueFixedTable = fixedTableDetail.fixedTableValue;
          }else if(currencyCode=='PEN'){
            valueFixedTable = parseFloat(fixedTableDetail.fixedTableValue) * parseFloat(amount_pen);
          }else if(currencyCode=='COP'){
            valueFixedTable = parseFloat(fixedTableDetail.fixedTableValue) * parseFloat(amount_cop);
          }else if(currencyCode=='VES'){
            valueFixedTable = parseFloat(fixedTableDetail.fixedTableValue) * parseFloat(amount_ves);
          }else if(currencyCode=='CLP'){
            valueFixedTable = parseFloat(fixedTableDetail.fixedTableValue) * parseFloat(amount_clp);
          }
          currentHorsesRaces = horsesraces.filter(horserace => (horserace.id == fixedTableDetail.horsesRacesId));
          if(!empty(currentHorsesRaces) 
          && currentHorsesRaces[0].statusId==1){
              rows.push(
              <tr key={currentHorsesRaces[0].id}> 
                <td> <span className={`horse-${currentHorsesRaces[0].programNumber}`} >{currentHorsesRaces[0].programNumber} </span></td>
                <td> {currentHorsesRaces[0].horseByHorsesId.horseName}</td>
                <td>{formatNumber(currencyCode,valueFixedTable)}</td>
                <td>{fixedTableDetail.fixedTableLimit}</td>
              </tr>);
          }
      };

  } 
    table.push( <table className="table table-sm">
    <thead>
      <tr>
        <th colSpan="2">Caballo</th>
        <th>Valor</th>
        <th>Límite</th>
      </tr>      
    </thead>
    <tbody>
        {rows}
        <tr>
          <th align="right" colSpan='2'>
            TOTAL A PAGAR POR CADA TABLA
          </th>
          <th colSpan='2'>
            {formatNumber(currencyCode,totalToPay)}
          </th>
        </tr>
    </tbody>
    </table>);

  return table;
}

      render() {
      const { racesFixedTables, currencyCode} = this.props;
      const { errors, validated} = this.state;
      const { amount, totalToPay} = this.state.sellform;

      let existFixedTable = false;

      let tabItems = null;
      let date = require('date-and-time');
            if(!empty(racesFixedTables)){
            tabItems = racesFixedTables.map((race) =>
                  ((race.statusId==1) ?
                  <Tab eventKey={race.id} title={"Race # " + race.raceNumber} key={race.id}>
                    {( 
                      
                      (!empty(race.fixedTablesByRacesId.nodes) && 
                      !empty(race.fixedTablesByRacesId.nodes[0]) &&
                      !empty(race.fixedTablesByRacesId.nodes[0].fixedTablesDetailsByFixedTableId.nodes) &&
                       race.fixedTablesByRacesId.nodes[0].fixedTablesDetailsByFixedTableId.nodes.length > 0)

                     ? 
                     <>
                          {existFixedTable=true}
                            <Form 
                                id="fixedTablesForm"
                                ref="fixedTablesForm"
                                noValidate
                                validated={validated}
                                onSubmit={this.handleSubmit}>
                        <span className="timeRace">Hora: {date.format(new Date(race.raceDate),"hh:mm:ss A")}</span>
                    {this.loadTableHorsesRaces(race.fixedTablesByRacesId.nodes[0], race.horsesRacesByRacesId.nodes)}
                    <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Caballo</th>
                                  <th>Cantidad de Tablas a Jugar</th>
                                  <th>Monto a Jugar</th>
                                  <th>Monto a Cobrar</th>
                                </tr>      
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                  <Form.Group controlId="horse_race_id">
                                  {this.loadHorsesRacesOptions(race.horsesRacesByRacesId.nodes,race.fixedTablesByRacesId.nodes[0].id,race.fixedTablesByRacesId.nodes[0].totalToPay,race.fixedTablesByRacesId)}
                                  </Form.Group>
                                  </td>
                                  <td>
                                    <Form.Group controlId="units">
                                      <Form.Control 
                                      required 
                                      requiredmessage="Campo es obligatorio"
                                      type="number" 
                                      value={this.state.sellform.units}
                                      onChange={
                                        (e) => this.onChangeInput(race.fixedTablesByRacesId,e)}
                                      name="units"
                                      placeholder="Tablas a sellar" />
                                      <Form.Control.Feedback type="invalid">
                                          {errors.amount}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                    </td>
                                    <td>
                                      {formatNumber(currencyCode,amount)}
                                    </td>
                                    <td>
                                      {formatNumber(currencyCode,totalToPay)}
                                    </td>
                                </tr> 
                                <tr>
                                  <td colSpan='5' align='center'>
                                      <Button
                                        type="submit"
                                        variant="success" 
                                        style={{marginRight: '0'}} >Apostar Tabla Fija</Button>
                                  </td>
                                </tr>
                              </tbody>
                        </table>
                        </Form>
                      </>
                        : 'No hay tablas fijas para esta carrera' )}
                  </Tab>
                  : '')
                );
            }

        

        return (
          <div className="row display-b">

          <PrintProvider>
            <NoPrint force>
            <div className="form-group col-12">
              <Button className="btn-full" variant="primary" onClick={this.handleShow}>
                VENTA DE TABLAS FIJAS
              </Button>
            </div>
    
            <Modal show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>Tablas Fijas</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              {( existFixedTable ? 
              <Tabs
                    activeKey={this.state.activeKey} 
                    onSelect={k => this.handleSelect(k)}>
                  {tabItems}
              </Tabs>
              : 'No hay tablas fijas para este hipódromo' )}
              
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
const connectedFixedTablesDialog = connect(mapToProps, actions)(FixedTablesDialog);
export { connectedFixedTablesDialog as FixedTablesDialog };
