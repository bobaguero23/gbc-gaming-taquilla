import React from 'react';
import { connect } from "redux-zero/react";
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import Dialog from 'react-bootstrap-dialog';
import {Tabs,Tab,Form,Row,Col,OverlayTrigger,Tooltip} from 'react-bootstrap';
import { ValidatorForm } from 'react-form-validator-core';
import empty from 'is-empty';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../../_actions';
import { toast } from 'react-toastify';

class MarksDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey : null,
            show      : false,
            validated : false,
            amount_max_usd: 110,
            amount_max_ves: 33000000,
            amount_max_pen: 385,
            amount_max_cop: 385000,
            amount_min_usd: 5,
            amount_min_ves: 1500000,
            amount_min_pen: 20,
            amount_min_cop: 17500,
            errors: {
              tracksId              : '',
              user_horse_races_id   : '',
              mark_horses_races_id  : '',
              amount                : ''
            },
            sellform : {
              tracksId              : this.props.trackSelected[0],
              user_horse_races_id   : '',
              mark_horses_races_id  : '',
              amount                : 0
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
    const { name, value , text } = e.target;
    
    this.setState({ 
        sellform: {
            ...this.state.sellform,
            [name]: value
        }
    });
    

}

confirmSubmit = (horsesraces) => {
  let horseRacesUser = horsesraces.filter(horsesrace => horsesrace.id ==this.state.sellform.user_horse_races_id);
  let horseRacesMark = horsesraces.filter(horsesrace => horsesrace.id ==this.state.sellform.mark_horses_races_id);

  let horseUserText = (!empty(horseRacesUser) ? `${horseRacesUser[0].programNumber} - ${horseRacesUser[0].horseByHorsesId.horseName}` : null); 

  let horseMarkText = (!empty(horseRacesMark) ? `${horseRacesMark[0].programNumber} - ${horseRacesMark[0].horseByHorsesId.horseName}` : null); 

  if(!empty(horseUserText) && !empty(horseMarkText)){
      this.dialog.show({
        title: 'Confirmar',
        body: `Su caballo seleccionado ${horseUserText} va a competir en contra de ${horseMarkText} que es la marca de la casa ¿Está de acuerdo?`,
        actions: [
            Dialog.CancelAction(),
            Dialog.OKAction(() => {
                this.handleSubmit()
            })
        ],
    })
  }else{
      toast.warn('Debe seleccionar el caballo que va a competir contra la marca y colocar el monto a apostar',{position: toast.POSITION.TOP_CENTER}); 
  }
  
}

  handleSubmit = () => {
    const {account} = this.props;
    let horsesRacesIdSend = '';
    const { sellform } = this.state;

   if((this.props.currencyCode == 'USD' && parseFloat(sellform.amount) > this.state.amount_max_usd) 
    || (this.props.currencyCode == 'VES' && parseFloat(sellform.amount) > this.state.amount_max_ves)
    || (this.props.currencyCode == 'PEN' && parseFloat(sellform.amount) > this.state.amount_max_pen)
    || (this.props.currencyCode == 'COP' && parseFloat(sellform.amount) > this.state.amount_max_cop)
    ){
      toast.warn('El monto de la apuesta es mayor al máximo por ticket, debe realizarla por un monto menor',{position: toast.POSITION.TOP_CENTER});
    }else if((this.props.currencyCode == 'USD' && parseFloat(sellform.amount) < this.state.amount_min_usd) 
    || (this.props.currencyCode == 'VES' && parseFloat(sellform.amount) < this.state.amount_min_ves)
    || (this.props.currencyCode == 'PEN' && parseFloat(sellform.amount) > this.state.amount_min_pen)
    || (this.props.currencyCode == 'COP' && parseFloat(sellform.amount) > this.state.amount_min_cop)
    ){
      toast.warn('El monto de la apuesta es menor al mínimo por ticket, debe realizarla por un monto mayor',{position: toast.POSITION.TOP_CENTER});
    } else{

      if((parseInt(sellform.amount)>0) && (!empty(sellform.tracksId)))
      {
          horsesRacesIdSend+='{position:@' + 1 + '@,horsesRacesId:@'+sellform.user_horse_races_id+'@},';
          horsesRacesIdSend+='{position:@' + 2 + '@,horsesRacesId:@'+sellform.mark_horses_races_id+'@},';
          sellform.horsesRacesId = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
          this.props.SellActions({action: 'sellMarkTicket', params : { sellform }}  );

          this.setState({
              show:false,
              sellform : {
                tracksId:this.props.trackSelected[0],
                horsesRacesId:[],
            }
          });
      }
      else
      {
          toast.warn('Debe seleccionar el caballo que va a competir contra la marca y colocar el monto a apostar',{position: toast.POSITION.TOP_CENTER}); 
      }

    }
}

loadHorsesRacesOptions = (horsesraces,marks) => {
  
  const {loading } = this.props;      
  let options = [];
  let marksDisabled = [];
  let marksOne = [];
  let horseRacesIdDisabled = 0;
  let horseRacesIdOne = 0;
  
  if(!empty(marks) && marks.length > 0) {
    marksDisabled = marks[0].marksDetailsByMarksId.nodes.filter(mark => mark.position ==0);
    if(!empty(marksDisabled) && marksDisabled.length > 0){
      horseRacesIdDisabled = marksDisabled[0].horsesRacesId;
    }
  }

  if(!empty(marks) && marks.length > 0) {
    marksOne = marks[0].marksDetailsByMarksId.nodes.filter(mark => mark.position ==1);
    if(!empty(marksOne) && marksOne.length > 0){
      horseRacesIdOne = marksOne[0].horsesRacesId;
    }
  }

  
  if(!empty(horsesraces)) {
  
      options.push(<option key="0" value=''>Seleccionar..</option>);
      horsesraces.map((horsesrace) =>  {
          if(horsesrace.statusId=="1" && horsesrace.id != horseRacesIdDisabled && horsesrace.id != horseRacesIdOne )
          {
              options.push(<option key={horsesrace.id} value={horsesrace.id} > {`${horsesrace.programNumber} - ${horsesrace.horseByHorsesId.horseName}`} </option>);
          }
      })

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
          onChange={this.onChangeInput} >
          {options}
      </Form.Control>);
}

loadMarksOptions = (marks,horsesraces) => {

  const {loading } = this.props;
  const {user_horse_races_id} = this.state.sellform;
  let options = [];
  let position_user_mark = 100;
  let currentHorsesRaces = [];

  if(!empty(marks)) {

      options.push(<option key="0" value=''>Seleccionar..</option>);
      for(let mark of marks) {
          for(let mdetail of mark.marksDetailsByMarksId.nodes){
            if(mdetail.horsesRacesId == user_horse_races_id){
              position_user_mark = mdetail.position;
            }
            if(position_user_mark > mdetail.position && mdetail.position>0){
              currentHorsesRaces = horsesraces.filter(horserace => (horserace.id == mdetail.horsesRacesId));
              if(!empty(currentHorsesRaces) 
              && currentHorsesRaces[0].statusId==1){
                  options.push(<option key={mdetail.horsesRacesId} value={mdetail.horsesRacesId} > {`Marca # ${mdetail.position} - ${currentHorsesRaces[0].programNumber})${currentHorsesRaces[0].horseByHorsesId.horseName}`} </option>);
              }

            }
          }
      }

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
          name="mark_horses_races_id"
          value={this.state.sellform.mark_horses_races_id}
          onChange={this.onChangeInput} >
          {options}
      </Form.Control>);
}

loadMarksLabel = (marks,horsesraces) => {

let markLabel ='';
let arrMarkActive=[],arrMarkActiveSort=[];
let arrMarkInactive=[];
let currentHorsesRaces = [];
let _ = require('underscore');
  if(!empty(marks)) {
     for(let mark of marks){
            for (let mdetail of mark.marksDetailsByMarksId.nodes){
              currentHorsesRaces = horsesraces.filter(horserace => (horserace.id == mdetail.horsesRacesId));
              if(!empty(currentHorsesRaces) 
              && currentHorsesRaces[0].statusId==1){
                if(mdetail.position>0){
                  arrMarkActive.push({position:mdetail.position,programNumber:currentHorsesRaces[0].programNumber});
                }else{
                  arrMarkInactive.push({position:mdetail.position,programNumber:currentHorsesRaces[0].programNumber});
                }
              }
            }
      }
      arrMarkActiveSort = _.sortBy( arrMarkActive, 'position' );
  } 

  let names = arrMarkActiveSort.map(function(item) {
    return item['programNumber'];
  });

  if(!empty(names) && names.length>0){
    markLabel = names.join("-");
  }

  let namesInactives = arrMarkInactive.map(function(item) {
    return item['programNumber'];
  });

  if(!empty(namesInactives) && namesInactives.length>0){
    markLabel += ` Sin ${namesInactives.join("-")}`;
  }
  

  return markLabel;
}
    
    
      render() {
      const { racesMarks} = this.props;
      const { errors, validated,amount_max_usd,amount_max_ves,amount_max_pen,amount_min_usd,amount_min_ves,amount_min_pen,amount_min_cop,amount_max_cop} = this.state;

      let currencyCode = this.props.currencyCode;
      let labelMaxValue = '';
      if(currencyCode == 'USD'){
        labelMaxValue=`USD ${amount_max_usd}`;
      }else if(currencyCode == 'VES'){
        labelMaxValue=`VES ${amount_max_ves}`;
      }else if(currencyCode == 'PEN'){
        labelMaxValue=`PEN ${amount_max_pen}`;
      }else if(currencyCode == 'COP'){
        labelMaxValue=`COP ${amount_max_cop}`;
      }

      let labelMinValue = '';
      if(currencyCode == 'USD'){
        labelMinValue=`USD ${amount_min_usd}`;
      }else if(currencyCode == 'VES'){
        labelMinValue=`VES ${amount_min_ves}`;
      }else if(currencyCode == 'PEN'){
        labelMinValue=`PEN ${amount_min_pen}`;
      }else if(currencyCode == 'COP'){
        labelMinValue=`COP ${amount_min_cop}`;
      }


      let tabItems = null;
      let date = require('date-and-time');
            if(!empty(racesMarks)){
            tabItems = racesMarks.map((race) =>
                  
                  ((race.statusId==1) ?
                  <Tab eventKey={race.id} title={"Race # " + race.raceNumber} key={race.id}>
                    {(!empty(race.marksByRacesId.nodes) ? 
                        <Form 
                            id="marksForm"
                            ref="marksForm"
                            noValidate
                            validated={validated}
                            onSubmit={this.handleSubmit}>
                    <span className="timeRace">Hora: {date.format(new Date(race.raceDate),"hh:mm:ss A")}</span>
                    
                    <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Tú selección de Caballo</th>
                              <th>Vs.</th>
                              <th>Marcas de la Casa {this.loadMarksLabel(race.marksByRacesId.nodes,race.horsesRacesByRacesId.nodes)}</th>
                            </tr>      
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                              <Form.Group controlId="horse_race_id">
                                {this.loadHorsesRacesOptions(race.horsesRacesByRacesId.nodes,race.marksByRacesId.nodes)}
                              </Form.Group>
                              </td>
                              <td>Vs.</td>
                              <td><Form.Group controlId="horse_race_id">
                                {this.loadMarksOptions(race.marksByRacesId.nodes,race.horsesRacesByRacesId.nodes)}
                              </Form.Group></td>
                            </tr> 
                            <tr>
                              <td colSpan='3' align='center'>  
                                <Row align='center'>
                                <Col xs='12' lg='4'>
                                <Form.Group controlId="amount">
                                  <Form.Label>Cantidad a Apostar</Form.Label>
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
                                </Col>
                                </Row>                          
                              </td>
                            </tr>
                            <tr>
                              <td colSpan='3' align='center'>
                                    <Button variant="success" onClick={() => {
                                      this.confirmSubmit(race.horsesRacesByRacesId.nodes)
                                  }} >
                                      Apostar Marca</Button>
                              </td>
                            </tr>
                          </tbody>
                    </table>
                    </Form>
                    : 'No hay marcas para esta carrera' )}
              </Tab>
                  : '')
                  
                  
                );
            }

        

        return (
          <div className="fl">
          <PrintProvider>
            <NoPrint force>
            <Dialog ref={(component) => { this.dialog = component }} />
            <div className="form-group col-12 col-lg-4 col-md-6 p-0 mr-10">
              <Button className="btn-full" variant="danger" onClick={this.handleShow}>
                Marcas
              </Button>
            </div>
    
            <Modal show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>Marcas</Modal.Title>
              </Modal.Header>
              <Modal.Body>

              <Tabs
                    activeKey={this.state.activeKey} 
                    onSelect={k => this.handleSelect(k)}>
                  {tabItems}
              </Tabs>
              <br />
              <h3>Reglas de Marcas</h3>
              <ul className="list-group list-group-flush">
              <li className="list-group-item">De existir empate entre los caballos la jugada de marca no tendrá validez.</li>
              <li className="list-group-item">El monto mínimo a jugar por ticket es: {labelMinValue}</li>
              <li className="list-group-item">El monto máximo a jugar por ticket es: {labelMaxValue}</li>
              <li className="list-group-item">La marca colocada por la casa puede cambiar en cualquier momento, sin embargo las jugadas realizadas anterior al cambio de marca se mantienen.</li>
              <li className="list-group-item">Debes elegir un caballo en contra del caballo proporcionado por la Casa.</li>
              <li className="list-group-item">La casa puede sacar un caballo para hacer más competitiva la jugada.</li>
              <li className="list-group-item">La proporción de las marcas es 11/10, lo que se traduce en un logro de -110.</li>
              <li className="list-group-item">Para que la jugada tenga decisión uno de los dos caballos involucrados  en la apuesta debe llegar en los primeros cuatro(4) lugares.</li>
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
const connectedMarksDialog = connect(mapToProps, actions)(MarksDialog);
export { connectedMarksDialog as MarksDialog };
