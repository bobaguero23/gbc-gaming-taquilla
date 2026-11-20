import React from 'react';
import { connect } from "redux-zero/react";
import {Button, Modal, Nav, Tabs, Tab, Table} from 'react-bootstrap';
import empty from 'is-empty';
import actions from '../../_actions';


class EventModalOdds extends React.Component {


      render() {

        let date = require('date-and-time');
        let { mytickets,user, event, eventModalSelected, eventModalShow }  = this.props;
        let centers_id =  (!empty(user)) ? user.centers_id : '';
        let ticket_offices_id =  (!empty(user)) ? user.ticket_offices_id : '';

        let eventOdds = !empty(event) ? event.eventsOddsByEventId.nodes : [];
        let findExtraOdds =  eventOdds.filter((odd) => odd.market != null);

        if(empty(findExtraOdds)){
          return null;
        }

        let oddHome = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Home')) : null;
        let oddDraw = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Draw')) : null;
        let oddAway = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Away')) : null;
        let oddOver = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='over')): null;
        let oddUnder = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='under')): null;
        let oddBothTeamsToScore = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score')): null;
        let oddDoubleChance = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Double Chance')): null;
        let oddDrawNoBet = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Draw No Bet')): null;
        let oddExactGoals = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Exact Goals')): null;
        let oddCorrectScore = !empty(eventModalSelected) ? eventModalSelected.eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Correct Score')): null;
        

        let trExactGoals = [];
        let tdExactGoals = [];
        if(!empty(oddExactGoals)){
          for(let i=0; i < oddExactGoals.length; i++){
            if(i%2==0){
              trExactGoals.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventExactGoals(eventModalSelected,oddExactGoals[i].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddExactGoals[i]) ? oddExactGoals[i].marketType : ''}</span> <span className="sport-odd">{oddExactGoals[i].odd}</span></Button></td>{tdExactGoals}</tr>);
              tdExactGoals = [];
            }else{
              tdExactGoals.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventExactGoals(eventModalSelected,oddExactGoals[i].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddExactGoals[i]) ? oddExactGoals[i].marketType : ''}</span> <span className="sport-odd">{oddExactGoals[i].odd}</span></Button></td>);
            }
          }

        }

        let trCorrectScore = [];
        let tdCorrectScore = [];
        if(!empty(oddCorrectScore)){
          for(let i=0; i < oddCorrectScore.length; i++){
            if(oddCorrectScore[i].marketType!='Other'){
              if(i%3==0){
                trCorrectScore.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventCorrectScore(eventModalSelected,oddCorrectScore[i].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddCorrectScore[i]) ? oddCorrectScore[i].marketType : ''}</span> <span className="sport-odd">{oddCorrectScore[i].odd}</span></Button></td>{tdCorrectScore}</tr>);
                tdCorrectScore = [];
              }else{
                tdCorrectScore.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventCorrectScore(eventModalSelected,oddCorrectScore[i].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddCorrectScore[i]) ? oddCorrectScore[i].marketType : ''}</span> <span className="sport-odd">{oddCorrectScore[i].odd}</span></Button></td>);
              }
              }
  
            }

        }


        return (
          <>

          <Nav.Link onClick={(() => this.props.onShowEvent())}>+</Nav.Link>
  
          {(!empty(eventModalSelected) && (event.id == eventModalSelected.id)) ? 
          <Modal dialogClassName={'dialog-full-screen'} show={eventModalShow} onHide={this.props.onChangeEventModalHide} size={"lg"}>
            <Modal.Header closeButton>
             {(!empty(eventModalSelected)) ? <Modal.Title>{date.format(new Date(eventModalSelected.eventDate),"DD/MM hh:mm A") } - {eventModalSelected.eventHome} Vs. {eventModalSelected.eventAway}</Modal.Title> : null }
            </Modal.Header>
              <Modal.Body>

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className={'text-center'}>1</th>
                      <th className={'text-center'}>x</th>
                      <th className={'text-center'}>2</th>
                      <th className={'text-center'}>OVER</th>
                      <th className={'text-center'}>UNDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                    <td className={'text-center'}>{!empty(oddHome) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(eventModalSelected); this.props.onChangeEventModalHide() } }>{eventModalSelected.eventHome} <span className="sport-odd">{oddHome[0].odd}</span></Button> : ''}</td>
                    <td className={'text-center'}>{!empty(oddDraw) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDraw(eventModalSelected); this.props.onChangeEventModalHide() } }>{'Empate'} <span className="sport-odd">{oddDraw[0].odd}</span></Button>: ''}</td>
                    <td className={'text-center'}>{!empty(oddAway) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(eventModalSelected); this.props.onChangeEventModalHide() } }>{eventModalSelected.eventAway} <span className="sport-odd">{oddAway[0].odd}</span></Button> : ''}</td>
                    <td className={'text-center'}> {!empty(oddOver) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(eventModalSelected); this.props.onChangeEventModalHide() } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {oddOver[0].odd}</Button> : ''}</td>
                    <td className={'text-center'}>{!empty(oddUnder) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(eventModalSelected); this.props.onChangeEventModalHide() } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {oddUnder[0].odd}</Button> : ''}</td>
                    </tr>
                  </tbody>
                </Table>


                  {!empty(oddBothTeamsToScore) ? 
                    <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                      <th colSpan={2}>
                      Ambos equipos marcan
                      </th>
                    </tr>
                    </thead>
                  <tbody>
                    <tr>
                      <td className={'text-center'}>{!empty(oddBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventBoth(eventModalSelected,oddBothTeamsToScore[0].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddBothTeamsToScore[0]) ? oddBothTeamsToScore[0].marketType : ''}</span> {oddBothTeamsToScore[0].odd}</Button> : ''}</td>
                      <td className={'text-center'}>{!empty(oddBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventBoth(eventModalSelected,oddBothTeamsToScore[1].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddBothTeamsToScore[1]) ? oddBothTeamsToScore[1].marketType : ''}</span> {oddBothTeamsToScore[1].odd}</Button> : ''}
                      </td>
                    </tr>
                    </tbody>
                  </Table>
                    : null}

                {!empty(oddDoubleChance) ? 
                    <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                      <th colSpan={3}>
                      Doble Oportunidad
                      </th>
                    </tr>
                    </thead>
                  <tbody>
                    <tr>
                      <td className={'text-center'}>{!empty(oddDoubleChance) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDoubleChance(eventModalSelected,oddDoubleChance[0].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddDoubleChance[0]) ? oddDoubleChance[0].marketType : ''}</span> {oddDoubleChance[0].odd}</Button> : ''}</td>
                      <td className={'text-center'}>{!empty(oddDoubleChance) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDoubleChance(eventModalSelected,oddDoubleChance[1].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddDoubleChance[1]) ? oddDoubleChance[1].marketType : ''}</span> {oddDoubleChance[1].odd}</Button> : ''}</td>
                      <td className={'text-center'}>{!empty(oddDoubleChance) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDoubleChance(eventModalSelected,oddDoubleChance[2].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddDoubleChance[2]) ? oddDoubleChance[2].marketType : ''}</span> {oddDoubleChance[2].odd}</Button> : ''}</td>
                    </tr>
                    </tbody>
                  </Table>
                    : null}

              {!empty(oddDrawNoBet) ? 
                    <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                      <th colSpan={2}>
                      Apuesta sin empate
                      </th>
                    </tr>
                    </thead>
                  <tbody>
                    <tr>
                      <td className={'text-center'}>{!empty(oddDrawNoBet) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDrawNoBet(eventModalSelected,oddDrawNoBet[0].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddDrawNoBet[0]) ? oddDrawNoBet[0].marketType : ''}</span> {oddDrawNoBet[0].odd}</Button> : ''}</td>
                      <td className={'text-center'}>{!empty(oddDrawNoBet) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDrawNoBet(eventModalSelected,oddDrawNoBet[1].marketType); this.props.onChangeEventModalHide() } }><span className="sport-factor">{!empty(oddDrawNoBet[1]) ? oddDrawNoBet[1].marketType : ''}</span> {oddDrawNoBet[1].odd}</Button> : ''}</td>
                    </tr>
                    </tbody>
                  </Table>
                    : null}                    

                  {!empty(oddExactGoals) ? 
                    <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                      <th colSpan={2}>
                      Goles Exactos
                      </th>
                    </tr>
                    </thead>
                  <tbody>
                    {trExactGoals}
                    </tbody>
                  </Table>
                    : null}

                {!empty(oddCorrectScore) ? 
                    <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                      <th colSpan={3}>
                      Marcador Exacto
                      </th>
                    </tr>
                    </thead>
                  <tbody>
                    {trCorrectScore}
                    </tbody>
                  </Table>
                    : null}


              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.props.onChangeEventModalHide}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
            : null }
          </>
        );
      }
    
    
}

const mapToProps = ({
  user
}) => ({
  user
});
const connectedEventModalOdds= connect(mapToProps, actions)(EventModalOdds);
export { connectedEventModalOdds as EventModalOdds };
