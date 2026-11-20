import React from 'react';
import { connect } from "redux-zero/react";
import {Table, Button,Badge,Row,Col} from 'react-bootstrap';

import empty from 'is-empty';
import actions from '../_actions';
import {translateType,translateDescription} from '../_helpers/libSport';
import { orderOddsHandicap, orderUnderAndOver } from '../_helpers/lib';

class SportPageDetail extends React.Component {

    constructor(props) {
        
        super(props);
        this.state = {
            activeKey           : '',
            ticketValue         : 0,
            ticketCombinations  : 0,
            valueUnits          : !empty(this.props.ticketoffice) ? this.props.ticketoffice[0].valueUnits: null,
            channel             : 0,
            specialKey          : null,
            sportNameSelected   : 'Soccer',
            sellform : {
                events  : [],
                riskMultiple:0,
                totalToPayMultiple : 0
            },
            eventModalShow : false,
            events : {}
        };

    }

    onClickSportName = (sportName) =>{
        localStorage.removeItem('tabActiveKeySport');
        this.setState({
            sportNameSelected: sportName
        });
    }

    componentDidUpdate(prevProps, prevState){

        if(JSON.stringify(this.props.events) == JSON.stringify(prevProps.events)){
            return false;
        }
         
    }
 
    render() {
        let {valueUnits} = this.state;
        const {loading, ticketoffice, events, showOdds, sportNameSelected} = this.props;

        let date = require('date-and-time');

        if(!empty(loading)){
            return null;
        }

        if(!empty(ticketoffice)){
            valueUnits = ticketoffice[0].valueUnits;
        }

        let obj = {
          nodes:[] 
        };

        let eventOdds = [];

        if(sportNameSelected=='Soccer'){
          eventOdds = !empty(events) ? events[0].eventsOddsSoccerPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsSoccerPrematchesByEventId : [];
      }else if(sportNameSelected=='Baseball'){
          eventOdds = !empty(events) ? events[0].eventsOddsBaseballPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsBaseballPrematchesByEventId : [];
      }else if(sportNameSelected=='Basketball'){
          eventOdds = !empty(events) ? events[0].eventsOddsBasketballPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsBasketballPrematchesByEventId : [];
      }else if(sportNameSelected=='American Football'){
          eventOdds = !empty(events) ? events[0].eventsOddsAmericanFootballPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsAmericanFootballPrematchesByEventId : [];
      }else if(sportNameSelected=='Tennis'){
          eventOdds = !empty(events) ? events[0].eventsOddsTennisPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsTennisPrematchesByEventId : [];
      }else if(sportNameSelected=='Boxing'){
          eventOdds = !empty(events) ? events[0].eventsOddsBoxingPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsBoxingPrematchesByEventId : [];
      }else if(sportNameSelected=='MMA'){
          eventOdds = !empty(events) ? events[0].eventsOddsMmaPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsMmaPrematchesByEventId : [];
      }else if(sportNameSelected=='Ice-hockey'){
          eventOdds = !empty(events) ? events[0].eventsOddsIceHockeyPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsIceHockeyPrematchesByEventId : [];
      }else if(sportNameSelected=='Volleyball'){
          eventOdds = !empty(events) ? events[0].eventsOddsVolleyballPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsVolleyballPrematchesByEventId : [];
      }else if(sportNameSelected=='Table Tennis'){
          eventOdds = !empty(events) ? events[0].eventsOddsTableTennisPrematchesByEventId.nodes : [];
          events[0].eventsOddsByEventId = !empty(events) ? events[0].eventsOddsTableTennisPrematchesByEventId : [];
      }

        let findExtraOdds =  eventOdds.filter((odd) => odd.market != null);

        let oddHome = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Home')) : null;
        let oddDraw = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Draw')) : null;
        let oddAway = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Away')) : null;
        let oddOver = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='over')): null;
        let oddUnder = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='under')): null;
        
        let oddBothTeamsToScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score')): null;
        
        let tdBothTeamsToScoreYes = [];
        let tdBothTeamsToScoreNo = [];

        if(!empty(oddBothTeamsToScore)){
          for(let i=0; i < oddBothTeamsToScore.length; i++){
            if(oddBothTeamsToScore[i].marketType=='Yes' && empty(tdBothTeamsToScoreYes)){
              tdBothTeamsToScoreYes.push(<td className={'text-center'}>{!empty(oddBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Both Teams To Score',oddBothTeamsToScore[i].marketType,'both');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddBothTeamsToScore[i].odd)}</Button> : ''}</td>)
            }
            if(oddBothTeamsToScore[i].marketType=='No' && empty(tdBothTeamsToScoreNo)){
              tdBothTeamsToScoreNo.push(<td className={'text-center'}>{!empty(oddBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Both Teams To Score',oddBothTeamsToScore[i].marketType,'both');  } }><span className="sport-factor">{!empty(oddBothTeamsToScore[i]) ? oddBothTeamsToScore[i].marketType : ''}</span> {showOdds == 'D' ? oddBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddBothTeamsToScore[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddFirstBothTeamsToScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score 1st Half')): null;
        
        let tdFirstBothTeamsToScoreYes = [];
        let tdFirstBothTeamsToScoreNo = [];

        if(!empty(oddFirstBothTeamsToScore)){
          for(let i=0; i < oddFirstBothTeamsToScore.length; i++){
            if(oddFirstBothTeamsToScore[i].marketType=='Yes' && empty(tdFirstBothTeamsToScoreYes)){
              tdFirstBothTeamsToScoreYes.push(<td className={'text-center'}>{!empty(oddFirstBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Both Teams To Score 1st Half',oddFirstBothTeamsToScore[i].marketType,'bothfirst');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddFirstBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddFirstBothTeamsToScore[i].odd)}</Button> : ''}</td>)
            }
            if(oddFirstBothTeamsToScore[i].marketType=='No' && empty(tdFirstBothTeamsToScoreNo)){
              tdFirstBothTeamsToScoreNo.push(<td className={'text-center'}>{!empty(oddFirstBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Both Teams To Score 1st Half',oddFirstBothTeamsToScore[i].marketType,'bothfirst');  } }><span className="sport-factor">{!empty(oddFirstBothTeamsToScore[i]) ? oddFirstBothTeamsToScore[i].marketType : ''}</span> {showOdds == 'D' ? oddFirstBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddFirstBothTeamsToScore[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddSecondBothTeamsToScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score 2nd Half')): null;
        
        let tdSecondBothTeamsToScoreYes = [];
        let tdSecondBothTeamsToScoreNo = [];

        if(!empty(oddSecondBothTeamsToScore)){
          for(let i=0; i < oddSecondBothTeamsToScore.length; i++){
            if(oddSecondBothTeamsToScore[i].marketType=='Yes' && empty(tdSecondBothTeamsToScoreYes)){
              tdSecondBothTeamsToScoreYes.push(<td className={'text-center'}>{!empty(oddSecondBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Both Teams To Score 2nd Half',oddSecondBothTeamsToScore[i].marketType,'bothsecond');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddSecondBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddSecondBothTeamsToScore[i].odd)}</Button> : ''}</td>)
            }
            if(oddSecondBothTeamsToScore[i].marketType=='No' && empty(tdSecondBothTeamsToScoreNo)){
              tdSecondBothTeamsToScoreNo.push(<td className={'text-center'}>{!empty(oddSecondBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Both Teams To Score 2nd Half',oddSecondBothTeamsToScore[i].marketType,'bothsecond');  } }><span className="sport-factor">{!empty(oddSecondBothTeamsToScore[i]) ? oddSecondBothTeamsToScore[i].marketType : ''}</span> {showOdds == 'D' ? oddSecondBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddSecondBothTeamsToScore[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddDoubleChance = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Double Chance')): null;

        
        let tdDoubleChance1X = []; 
        let tdDoubleChance12 = []; 
        let tdDoubleChanceX2 = []; 
        if(!empty(oddDoubleChance)){

          for(let i=0; i < oddDoubleChance.length; i++){
            if(oddDoubleChance[i].marketType=='1X' && empty(tdDoubleChance1X)){
              tdDoubleChance1X.push(<td className={'text-center'}>{!empty(oddDoubleChance) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance',oddDoubleChance[i].marketType,"doublechance"); } }><span className="sport-factor">{!empty(oddDoubleChance[i]) ? oddDoubleChance[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChance[i].odd : this.props.convertOddToAmerican(oddDoubleChance[i].odd)} </Button> : ''}</td>)
            }
            if(oddDoubleChance[i].marketType=='12'  && empty(tdDoubleChance12)){
              tdDoubleChance12.push(<td className={'text-center'}>{!empty(oddDoubleChance) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance',oddDoubleChance[i].marketType,"doublechance"); } }><span className="sport-factor">{!empty(oddDoubleChance[i]) ? oddDoubleChance[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChance[i].odd : this.props.convertOddToAmerican(oddDoubleChance[i].odd)}</Button> : ''}</td>)
            }
            if(oddDoubleChance[i].marketType=='X2' && empty(tdDoubleChanceX2)){
              tdDoubleChanceX2.push(<td className={'text-center'}>{!empty(oddDoubleChance) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance',oddDoubleChance[i].marketType,"doublechance"); } }><span className="sport-factor">{!empty(oddDoubleChance[i]) ? oddDoubleChance[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChance[i].odd : this.props.convertOddToAmerican(oddDoubleChance[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddDoubleChanceFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Double Chance 1st Period')): null;

        
        let tdDoubleChanceFirstPeriod1X = []; 
        let tdDoubleChanceFirstPeriod12 = []; 
        let tdDoubleChanceFirstPeriodX2 = []; 
        if(!empty(oddDoubleChanceFirstPeriod)){

          for(let i=0; i < oddDoubleChanceFirstPeriod.length; i++){
            if(oddDoubleChanceFirstPeriod[i].marketType=='1X' && empty(tdDoubleChanceFirstPeriod1X)){
              tdDoubleChanceFirstPeriod1X.push(<td className={'text-center'}>{!empty(oddDoubleChanceFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance 1st Period',oddDoubleChanceFirstPeriod[i].marketType,"doublechancefirstperiod"); } }><span className="sport-factor">{!empty(oddDoubleChanceFirstPeriod[i]) ? oddDoubleChanceFirstPeriod[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChanceFirstPeriod[i].odd : this.props.convertOddToAmerican(oddDoubleChanceFirstPeriod[i].odd)}</Button> : ''}</td>)
            }
            if(oddDoubleChanceFirstPeriod[i].marketType=='12'  && empty(tdDoubleChanceFirstPeriod12)){
              tdDoubleChanceFirstPeriod12.push(<td className={'text-center'}>{!empty(oddDoubleChanceFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance 1st Period',oddDoubleChanceFirstPeriod[i].marketType,"doublechancefirstperiod"); } }><span className="sport-factor">{!empty(oddDoubleChanceFirstPeriod[i]) ? oddDoubleChanceFirstPeriod[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChanceFirstPeriod[i].odd : this.props.convertOddToAmerican(oddDoubleChanceFirstPeriod[i].odd)}</Button> : ''}</td>)
            }
            if(oddDoubleChanceFirstPeriod[i].marketType=='X2' && empty(tdDoubleChanceFirstPeriodX2)){
              tdDoubleChanceFirstPeriodX2.push(<td className={'text-center'}>{!empty(oddDoubleChanceFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance 1st Period',oddDoubleChanceFirstPeriod[i].marketType,"doublechancefirstperiod"); } }><span className="sport-factor">{!empty(oddDoubleChanceFirstPeriod[i]) ? oddDoubleChanceFirstPeriod[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChanceFirstPeriod[i].odd : this.props.convertOddToAmerican(oddDoubleChanceFirstPeriod[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddDoubleChanceHT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Double Chance Halftime')): null;

        
        let tdDoubleChanceHT1X = []; 
        let tdDoubleChanceHT12 = []; 
        let tdDoubleChanceHTX2 = []; 
        if(!empty(oddDoubleChanceHT)){

          for(let i=0; i < oddDoubleChanceHT.length; i++){
            if(oddDoubleChanceHT[i].marketType=='1X' && empty(tdDoubleChanceHT1X)){
              tdDoubleChanceHT1X.push(<td className={'text-center'}>{!empty(oddDoubleChanceHT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance Halftime',oddDoubleChanceHT[i].marketType,"doublechanceht"); } }><span className="sport-factor">{!empty(oddDoubleChanceHT[i]) ? oddDoubleChanceHT[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChanceHT[i].odd : this.props.convertOddToAmerican(oddDoubleChanceHT[i].odd)}</Button> : ''}</td>)
            }
            if(oddDoubleChanceHT[i].marketType=='12'  && empty(tdDoubleChanceHT12)){
              tdDoubleChanceHT12.push(<td className={'text-center'}>{!empty(oddDoubleChanceHT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance Halftime',oddDoubleChanceHT[i].marketType,"doublechanceht"); } }><span className="sport-factor">{!empty(oddDoubleChanceHT[i]) ? oddDoubleChanceHT[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChanceHT[i].odd : this.props.convertOddToAmerican(oddDoubleChanceHT[i].odd)}</Button> : ''}</td>)
            }
            if(oddDoubleChanceHT[i].marketType=='X2' && empty(tdDoubleChanceHTX2)){
              tdDoubleChanceHTX2.push(<td className={'text-center'}>{!empty(oddDoubleChanceHT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Double Chance Halftime',oddDoubleChanceHT[i].marketType,"doublechanceht"); } }><span className="sport-factor">{!empty(oddDoubleChanceHT[i]) ? oddDoubleChanceHT[i].marketType : ''}</span> {showOdds == 'D' ? oddDoubleChanceHT[i].odd : this.props.convertOddToAmerican(oddDoubleChanceHT[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddDrawNoBet = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='12')): null;
        let tdDrawNoBetHome = []; 
        let tdDrawNoBetAway = []; 
        if(!empty(oddDrawNoBet)){

          for(let i=0; i < oddDrawNoBet.length; i++){
            if(oddDrawNoBet[i].marketType=='1' && empty(tdDrawNoBetHome)){
              tdDrawNoBetHome.push(<td className={'text-center'}>{!empty(oddDrawNoBet) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'12',oddDrawNoBet[i].marketType,'drawnobet');  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddDrawNoBet[i].odd : this.props.convertOddToAmerican(oddDrawNoBet[i].odd)} </Button> : ''}</td>)
            }
            if(oddDrawNoBet[i].marketType=='2' && empty(tdDrawNoBetAway)){
              tdDrawNoBetAway.push(<td className={'text-center'}>{!empty(oddDrawNoBet) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'12',oddDrawNoBet[i].marketType,'drawnobet');  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddDrawNoBet[i].odd : this.props.convertOddToAmerican(oddDrawNoBet[i].odd)} </Button> : ''}</td>)
            }
          }

        }

        let oddDrawNoBetOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='12 Including Overtime')): null;
        let tdDrawNoBetOTHome = []; 
        let tdDrawNoBetOTAway = []; 
        if(!empty(oddDrawNoBetOT)){

          for(let i=0; i < oddDrawNoBetOT.length; i++){
            if(oddDrawNoBetOT[i].marketType=='1' && empty(tdDrawNoBetOTHome)){
              tdDrawNoBetOTHome.push(<td className={'text-center'}>{!empty(oddDrawNoBetOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'12 Including Overtime',oddDrawNoBetOT[i].marketType,'drawnobetot');  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddDrawNoBetOT[i].odd : this.props.convertOddToAmerican(oddDrawNoBetOT[i].odd)} </Button> : ''}</td>)
            }
            if(oddDrawNoBetOT[i].marketType=='2' && empty(tdDrawNoBetOTAway)){
              tdDrawNoBetOTAway.push(<td className={'text-center'}>{!empty(oddDrawNoBetOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'12 Including Overtime',oddDrawNoBetOT[i].marketType,'drawnobetot');  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddDrawNoBetOT[i].odd : this.props.convertOddToAmerican(oddDrawNoBetOT[i].odd)} </Button> : ''}</td>)
            }
          }

        }


        let oddExactGoals = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Number of Goals')): null;
        
        let trExactGoals = [];
        let tdExactGoals = [];
        if(!empty(oddExactGoals)){
          for(let i=0; i < oddExactGoals.length; i++){
            let x = i+1;  
            if(x%3==0){
              trExactGoals.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Number of Goals',oddExactGoals[i].marketType,"exactgoals"); } }><span className="sport-factor">{!empty(oddExactGoals[i]) ? oddExactGoals[i].marketType : ''}</span> <span className="sport-odd"> {showOdds == 'D' ? oddExactGoals[i].odd : this.props.convertOddToAmerican(oddExactGoals[i].odd)} </span></Button></td>{tdExactGoals}</tr>);
              tdExactGoals = [];
            }else{
              tdExactGoals.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Number of Goals',oddExactGoals[i].marketType,"exactgoals");  } }><span className="sport-factor">{!empty(oddExactGoals[i]) ? oddExactGoals[i].marketType : ''}</span> <span className="sport-odd"> {showOdds == 'D' ? oddExactGoals[i].odd : this.props.convertOddToAmerican(oddExactGoals[i].odd)} </span></Button></td>);
            }
            if(x==oddExactGoals.length && !empty(tdExactGoals)){
              trExactGoals.push(<tr>{tdExactGoals}<td colSpan={3-tdExactGoals.length}>{' '}</td></tr>);
              tdExactGoals = []; 
            }
          }

        }

        let oddExactGoalsFirst = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Number of Goals 1st Half')): null;
        
        let trExactGoalsFirst = [];
        let tdExactGoalsFirst = [];
        if(!empty(oddExactGoalsFirst)){
          for(let i=0; i < oddExactGoalsFirst.length; i++){
            let x = i+1;  
            if(x%3==0){
              trExactGoalsFirst.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Number of Goals 1st Half',oddExactGoalsFirst[i].marketType,"numbergoalsfirst"); } }><span className="sport-factor">{!empty(oddExactGoalsFirst[i]) ? oddExactGoalsFirst[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddExactGoalsFirst[i].odd : this.props.convertOddToAmerican(oddExactGoalsFirst[i].odd)} </span></Button></td>{tdExactGoalsFirst}</tr>);
              tdExactGoalsFirst = [];
            }else{
              tdExactGoalsFirst.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Number of Goals 1st Half',oddExactGoalsFirst[i].marketType,"numbergoalsfirst");  } }><span className="sport-factor">{!empty(oddExactGoalsFirst[i]) ? oddExactGoalsFirst[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddExactGoalsFirst[i].odd : this.props.convertOddToAmerican(oddExactGoalsFirst[i].odd)} </span></Button></td>);
            }
            if(x==oddExactGoalsFirst.length && !empty(tdExactGoalsFirst)){
              trExactGoalsFirst.push(<tr>{tdExactGoalsFirst}<td colSpan={3-tdExactGoalsFirst.length}>{' '}</td></tr>);
              tdExactGoalsFirst = []; 
            }
          }

        }

        let oddExactGoalsSecond = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Number of Goals 2nd Half')): null;
        
        let trExactGoalsSecond = [];
        let tdExactGoalsSecond = [];
        if(!empty(oddExactGoalsSecond)){
          for(let i=0; i < oddExactGoalsSecond.length; i++){
            let x = i+1;  
            if(x%3==0){
              trExactGoalsSecond.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Number of Goals 2nd Half',oddExactGoalsSecond[i].marketType,"numbergoalssecond"); } }><span className="sport-factor">{!empty(oddExactGoalsSecond[i]) ? oddExactGoalsSecond[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddExactGoalsSecond[i].odd : this.props.convertOddToAmerican(oddExactGoalsSecond[i].odd)} </span></Button></td>{tdExactGoalsSecond}</tr>);
              tdExactGoalsSecond = [];
            }else{
              tdExactGoalsSecond.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Number of Goals 2nd Half',oddExactGoalsSecond[i].marketType,"numbergoalssecond");  } }><span className="sport-factor">{!empty(oddExactGoalsSecond[i]) ? oddExactGoalsSecond[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddExactGoalsSecond[i].odd : this.props.convertOddToAmerican(oddExactGoalsSecond[i].odd)}</span></Button></td>);
            }
            if(x==oddExactGoalsSecond.length && !empty(tdExactGoalsSecond)){
              trExactGoalsSecond.push(<tr>{tdExactGoalsSecond}<td colSpan={3-tdExactGoalsSecond.length}>{' '}</td></tr>);
              tdExactGoalsSecond = []; 
            }
          }

        }

        let oddHomeExactGoals = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Home Team Number Of Goals')): null;
        
        let trHomeExactGoals = [];
        let tdHomeExactGoals = [];
        if(!empty(oddHomeExactGoals)){
          for(let i=0; i < oddHomeExactGoals.length; i++){
            let x = i+1;  
            if(x%3==0){
              trHomeExactGoals.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Home Team Number Of Goals',oddHomeExactGoals[i].marketType,"numbergoalshome"); } }><span className="sport-factor">{!empty(oddHomeExactGoals[i]) ? oddHomeExactGoals[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddHomeExactGoals[i].odd : this.props.convertOddToAmerican(oddHomeExactGoals[i].odd)} </span></Button></td>{tdHomeExactGoals}</tr>);
              tdHomeExactGoals = [];
            }else{
              tdHomeExactGoals.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Home Team Number Of Goals',oddHomeExactGoals[i].marketType,"numbergoalshome");  } }><span className="sport-factor">{!empty(oddHomeExactGoals[i]) ? oddHomeExactGoals[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddHomeExactGoals[i].odd : this.props.convertOddToAmerican(oddHomeExactGoals[i].odd)} </span></Button></td>);
            }
            if(x==oddHomeExactGoals.length && !empty(tdHomeExactGoals)){
              trHomeExactGoals.push(<tr>{tdHomeExactGoals}<td colSpan={3-tdHomeExactGoals.length}>{' '}</td></tr>);
              tdHomeExactGoals = []; 
            }
          }

        }

        let oddAwayExactGoals = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Away Team Number Of Goals')): null;
        
        let trAwayExactGoals = [];
        let tdAwayExactGoals = [];
        if(!empty(oddAwayExactGoals)){
          for(let i=0; i < oddAwayExactGoals.length; i++){
            let x = i+1;  
            if(x%3==0){
              trAwayExactGoals.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Away Team Number Of Goals',oddAwayExactGoals[i].marketType,"numbergoalsaway"); } }><span className="sport-factor">{!empty(oddAwayExactGoals[i]) ? oddAwayExactGoals[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAwayExactGoals[i].odd : this.props.convertOddToAmerican(oddAwayExactGoals[i].odd)} </span></Button></td>{tdAwayExactGoals}</tr>);
              tdAwayExactGoals = [];
            }else{
              tdAwayExactGoals.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Away Team Number Of Goals',oddAwayExactGoals[i].marketType,"numbergoalsaway");  } }><span className="sport-factor">{!empty(oddAwayExactGoals[i]) ? oddAwayExactGoals[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAwayExactGoals[i].odd : this.props.convertOddToAmerican(oddAwayExactGoals[i].odd)}</span></Button></td>);
            }
            if(x==oddAwayExactGoals.length && !empty(tdAwayExactGoals)){
              trAwayExactGoals.push(<tr>{tdHomeExactGoals}<td colSpan={3-tdAwayExactGoals.length}>{' '}</td></tr>);
              tdAwayExactGoals = []; 
            }
          }

        }

        let oddCorrectScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Correct Score')): null;
        let trCorrectScore = [];
        let tdCorrectScore = [];
        if(!empty(oddCorrectScore)){
          for(let i=0; i < oddCorrectScore.length; i++){
            if(oddCorrectScore[i].marketType!='Other'){
                let x = i+1;  
                if(x%3==0){
                  trCorrectScore.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Correct Score',oddCorrectScore[i].marketType,"correctscore");  } }>
                    <span className="sport-factor">{!empty(oddCorrectScore[i]) ? oddCorrectScore[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCorrectScore[i].odd : this.props.convertOddToAmerican(oddCorrectScore[i].odd)}</span>
                  </Button></td>{tdCorrectScore}</tr>);
                  tdCorrectScore = [];
                }else{
                  tdCorrectScore.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Correct Score',oddCorrectScore[i].marketType,"correctscore");  } }>
                    <span className="sport-factor">{!empty(oddCorrectScore[i]) ? oddCorrectScore[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCorrectScore[i].odd : this.props.convertOddToAmerican(oddCorrectScore[i].odd)}</span>
                  </Button></td>);
                }
                if(x==oddCorrectScore.length && !empty(tdCorrectScore)){
                  trCorrectScore.push(<tr>{tdCorrectScore}<td colSpan={6-tdCorrectScore.length}>{' '}</td></tr>);
                  tdCorrectScore = []; 
                }
              }
  
            }
        }

        let oddCorrectScoreFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Correct Score 1st Period')): null;
        let trCorrectScoreFirstPeriod = [];
        let tdCorrectScoreFirstPeriod = [];
        if(!empty(oddCorrectScoreFirstPeriod)){
          for(let i=0; i < oddCorrectScoreFirstPeriod.length; i++){
            
            if(oddCorrectScoreFirstPeriod[i].marketType!='Other'){
                let x = i+1;  
                if(x%3==0){
                  trCorrectScoreFirstPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Correct Score 1st Period',oddCorrectScoreFirstPeriod[i].marketType,"correctscorefirstperiod");  } }>
                    <span className="sport-factor">{!empty(oddCorrectScoreFirstPeriod[i]) ? oddCorrectScoreFirstPeriod[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCorrectScoreFirstPeriod[i].odd : this.props.convertOddToAmerican(oddCorrectScoreFirstPeriod[i].odd)}</span>
                  </Button></td>{tdCorrectScoreFirstPeriod}</tr>);
                  tdCorrectScoreFirstPeriod = [];
                }else{
                  tdCorrectScoreFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Correct Score 1st Period',oddCorrectScoreFirstPeriod[i].marketType,"correctscorefirstperiod");  } }>
                    <span className="sport-factor">{!empty(oddCorrectScoreFirstPeriod[i]) ? oddCorrectScoreFirstPeriod[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCorrectScoreFirstPeriod[i].odd : this.props.convertOddToAmerican(oddCorrectScoreFirstPeriod[i].odd)}</span>
                  </Button></td>);
                }
                if(x==oddCorrectScoreFirstPeriod.length && !empty(tdCorrectScoreFirstPeriod)){
                  trCorrectScoreFirstPeriod.push(<tr>{tdCorrectScoreFirstPeriod}<td colSpan={6-tdCorrectScoreFirstPeriod.length}>{' '}</td></tr>);
                  tdCorrectScoreFirstPeriod = []; 
                }
              }
  
            }
        }

        let oddCorrectScoreOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Correct Score Including Overtime')): null;
        let trCorrectScoreOT = [];
        let tdCorrectScoreOT = [];
        if(!empty(oddCorrectScoreOT)){
          for(let i=0; i < oddCorrectScoreOT.length; i++){
            if(oddCorrectScoreOT[i].marketType!='Other'){
                let x = i+1;  
                if(x%3==0){
                  trCorrectScoreOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Correct Score Including Overtime',oddCorrectScoreOT[i].marketType,"correctscoreot");  } }>
                    <span className="sport-factor">{!empty(oddCorrectScoreOT[i]) ? oddCorrectScoreOT[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCorrectScoreOT[i].odd : this.props.convertOddToAmerican(oddCorrectScoreOT[i].odd)}</span>
                  </Button></td>{tdCorrectScoreOT}</tr>);
                  tdCorrectScoreOT = [];
                }else{
                  tdCorrectScoreOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Correct Score Including Overtime',oddCorrectScoreOT[i].marketType,"correctscoreot");  } }>
                    <span className="sport-factor">{!empty(oddCorrectScoreOT[i]) ? oddCorrectScoreOT[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCorrectScoreOT[i].odd : this.props.convertOddToAmerican(oddCorrectScoreOT[i].odd)}</span>
                  </Button></td>);
                }
                if(x==oddCorrectScoreOT.length && !empty(tdCorrectScoreOT)){
                  trCorrectScoreOT.push(<tr>{tdCorrectScoreOT}<td colSpan={6-tdCorrectScoreOT.length}>{' '}</td></tr>);
                  tdCorrectScoreOT = []; 
                }
              }
  
            }
        }

        let odd1X2Corners = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1X2 Corners')): null;

        let td1X2Corners1 = []; 
        let td1X2CornersX = []; 
        let td1X2Corners2 = []; 
        if(!empty(odd1X2Corners)){

          for(let i=0; i < odd1X2Corners.length; i++){
            if(odd1X2Corners[i].marketType=='1' && empty(td1X2Corners1)){
              td1X2Corners1.push(<td className={'text-center'}>{!empty(odd1X2Corners) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '1X2 Corners',odd1X2Corners[i].marketType,'1x2corners');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventHome : ''}</span> {showOdds == 'D' ? odd1X2Corners[i].odd : this.props.convertOddToAmerican(odd1X2Corners[i].odd)}</Button> : ''}</td>)
            }
            if(odd1X2Corners[i].marketType=='X'  && empty(td1X2CornersX)){
              td1X2CornersX.push(<td className={'text-center'}>{!empty(odd1X2Corners) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '1X2 Corners',odd1X2Corners[i].marketType,'1x2corners');  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? odd1X2Corners[i].odd : this.props.convertOddToAmerican(odd1X2Corners[i].odd)}</Button> : ''}</td>)
            }
            if(odd1X2Corners[i].marketType=='2' && empty(td1X2Corners2)){
              td1X2Corners2.push(<td className={'text-center'}>{!empty(odd1X2Corners) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '1X2 Corners',odd1X2Corners[i].marketType,'1x2corners');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventAway : ''}</span> {showOdds == 'D' ? odd1X2Corners[i].odd : this.props.convertOddToAmerican(odd1X2Corners[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddTotalCorners = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Total Corners')): null;
        let trTotalCorners = [];
        let tdTotalCorners = [];
        if(!empty(oddTotalCorners)){
          oddTotalCorners = orderUnderAndOver(oddTotalCorners);
          for(let i=0; i < oddTotalCorners.length; i++){
              let x = i+1;  
              if(x%2==0){
                trTotalCorners.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Total Corners', oddTotalCorners[i].marketType,oddTotalCorners[i].factorExtra,"totalcorners" );  } }>
                  <span className="sport-factor">{!empty(oddTotalCorners[i]) ? oddTotalCorners[i].marketType=='Over' ? 'Más de' : oddTotalCorners[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddTotalCorners[i]) ? oddTotalCorners[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddTotalCorners[i].odd : this.props.convertOddToAmerican(oddTotalCorners[i].odd)}</span>
                </Button></td>{tdTotalCorners}</tr>);
                tdTotalCorners = [];
              }else{
                tdTotalCorners.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Total Corners',oddTotalCorners[i].marketType,oddTotalCorners[i].factorExtra,"totalcorners" );  } }>
                  <span className="sport-factor">{!empty(oddTotalCorners[i]) ? oddTotalCorners[i].marketType=='Over' ? 'Más de' : oddTotalCorners[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddTotalCorners[i]) ? oddTotalCorners[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddTotalCorners[i].odd : this.props.convertOddToAmerican(oddTotalCorners[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddTotalCorners.length && !empty(tdTotalCorners)){
                  trTotalCorners.push(<tr>{tdTotalCorners}<td colSpan={4-tdTotalCorners.length}>{' '}</td></tr>);
                  tdTotalCorners = []; 
              }
  
            }
        }

        let oddAsianUnderOverCorners = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Under/Over Corners')): null;
        let trAsianUnderOverCorners = [];
        let tdAsianUnderOverCorners = [];
        if(!empty(oddAsianUnderOverCorners)){
          oddAsianUnderOverCorners = orderUnderAndOver(oddAsianUnderOverCorners);
          for(let i=0; i < oddAsianUnderOverCorners.length; i++){
              if(empty(oddAsianUnderOverCorners[i])) {
                trAsianUnderOverCorners.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trAsianUnderOverCorners.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Asian Under/Over Corners',oddAsianUnderOverCorners[i].marketType,oddAsianUnderOverCorners[i].factorExtra,"asianunderovercorners" );  } }>
                  <span className="sport-factor">{!empty(oddAsianUnderOverCorners[i]) ? oddAsianUnderOverCorners[i].marketType=='Over' ? 'Más de' : oddAsianUnderOverCorners[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddAsianUnderOverCorners[i]) ? oddAsianUnderOverCorners[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddAsianUnderOverCorners[i].odd : this.props.convertOddToAmerican(oddAsianUnderOverCorners[i].odd)}</span>
                </Button></td>{tdAsianUnderOverCorners}</tr>);
                tdAsianUnderOverCorners = [];
              }else{
                tdAsianUnderOverCorners.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Asian Under/Over Corners',oddAsianUnderOverCorners[i].marketType,oddAsianUnderOverCorners[i].factorExtra,"asianunderovercorners" );  } }>
                  <span className="sport-factor">{!empty(oddAsianUnderOverCorners[i]) ? oddAsianUnderOverCorners[i].marketType=='Over' ? 'Más de' : oddAsianUnderOverCorners[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddAsianUnderOverCorners[i]) ? oddAsianUnderOverCorners[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddAsianUnderOverCorners[i].odd : this.props.convertOddToAmerican(oddAsianUnderOverCorners[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddAsianUnderOverCorners.length && !empty(tdAsianUnderOverCorners)){
                trAsianUnderOverCorners.push(<tr>{tdAsianUnderOverCorners}<td colSpan={4-tdAsianUnderOverCorners.length}>{' '}</td></tr>);
                tdAsianUnderOverCorners = []; 
              }
  
            }
        }

        let oddUnderOverCornersFirst = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Corners - 1st Half')): null;
        let trUnderOverCornersFirst = [];
        let tdUnderOverCornersFirst = [];
        if(!empty(oddUnderOverCornersFirst)){
          oddUnderOverCornersFirst = orderUnderAndOver(oddUnderOverCornersFirst);
          for(let i=0; i < oddUnderOverCornersFirst.length; i++){
              if(empty(oddUnderOverCornersFirst[i])) {
                trUnderOverCornersFirst.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trUnderOverCornersFirst.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Corners - 1st Half',oddUnderOverCornersFirst[i].marketType,oddUnderOverCornersFirst[i].factorExtra,"underovercornersfirst" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverCornersFirst[i]) ? oddUnderOverCornersFirst[i].marketType=='Over' ? 'Más de' : oddUnderOverCornersFirst[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverCornersFirst[i]) ? oddUnderOverCornersFirst[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverCornersFirst[i].odd : this.props.convertOddToAmerican(oddUnderOverCornersFirst[i].odd)}</span>
                </Button></td>{tdUnderOverCornersFirst}</tr>);
                tdUnderOverCornersFirst = [];
              }else{
                tdUnderOverCornersFirst.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Corners - 1st Half',oddUnderOverCornersFirst[i].marketType,oddUnderOverCornersFirst[i].factorExtra,"underovercornersfirst" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverCornersFirst[i]) ? oddUnderOverCornersFirst[i].marketType=='Over' ? 'Más de' : oddUnderOverCornersFirst[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverCornersFirst[i]) ? oddUnderOverCornersFirst[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverCornersFirst[i].odd : this.props.convertOddToAmerican(oddUnderOverCornersFirst[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverCornersFirst.length && !empty(tdUnderOverCornersFirst)){
                trUnderOverCornersFirst.push(<tr>{tdUnderOverCornersFirst}<td colSpan={4-tdUnderOverCornersFirst.length}>{' '}</td></tr>);
                tdUnderOverCornersFirst = []; 
              }
  
            }
        }


        let oddUnderOverHalfTime = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Halftime')): null;
        let trUnderOverHalfTime = [];
        let tdUnderOverHalfTime = [];
        if(!empty(oddUnderOverHalfTime)){
          oddUnderOverHalfTime = orderUnderAndOver(oddUnderOverHalfTime);
          for(let i=0; i < oddUnderOverHalfTime.length; i++){
              if(empty(oddUnderOverHalfTime[i])) {
                trUnderOverHalfTime.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trUnderOverHalfTime.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Halftime',oddUnderOverHalfTime[i].marketType,oddUnderOverHalfTime[i].factorExtra,"underoverhalftime" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverHalfTime[i]) ? oddUnderOverHalfTime[i].marketType=='Over' ? 'Más de' : oddUnderOverHalfTime[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverHalfTime[i]) ? oddUnderOverHalfTime[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverHalfTime[i].odd : this.props.convertOddToAmerican(oddUnderOverHalfTime[i].odd)}</span>
                </Button></td>{tdUnderOverHalfTime}</tr>);
                tdUnderOverHalfTime = [];
              }else{
                tdUnderOverHalfTime.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Halftime',oddUnderOverHalfTime[i].marketType,oddUnderOverHalfTime[i].factorExtra,"underoverhalftime" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverHalfTime[i]) ? oddUnderOverHalfTime[i].marketType=='Over' ? 'Más de' : oddUnderOverHalfTime[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverHalfTime[i]) ? oddUnderOverHalfTime[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverHalfTime[i].odd : this.props.convertOddToAmerican(oddUnderOverHalfTime[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverHalfTime.length && !empty(tdUnderOverHalfTime)){
                trUnderOverHalfTime.push(<tr>{tdUnderOverHalfTime}<td colSpan={4-tdUnderOverHalfTime.length}>{' '}</td></tr>);
                tdUnderOverHalfTime = []; 
              }
  
            }
        }

        let oddUnderOver = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over')): null;
        let trUnderOver = [];
        let tdUnderOver = [];
        if(!empty(oddUnderOver)){
          oddUnderOver = orderUnderAndOver(oddUnderOver);
          for(let i=0; i < oddUnderOver.length; i++){
              if(empty(oddUnderOver[i])) {
                trUnderOver.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trUnderOver.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over',oddUnderOver[i].marketType,oddUnderOver[i].factorExtra,"underover" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOver[i]) ? oddUnderOver[i].marketType=='Over' ? 'Más de' : oddUnderOver[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOver[i]) ? oddUnderOver[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOver[i].odd : this.props.convertOddToAmerican(oddUnderOver[i].odd)}</span>
                </Button></td>{tdUnderOver}</tr>);
                tdUnderOver = [];
              }else{
                tdUnderOver.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over',oddUnderOver[i].marketType,oddUnderOver[i].factorExtra,"underover" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOver[i]) ? oddUnderOver[i].marketType=='Over' ? 'Más de' : oddUnderOver[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOver[i]) ? oddUnderOver[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOver[i].odd : this.props.convertOddToAmerican(oddUnderOver[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOver.length && !empty(tdUnderOver)){
                trUnderOver.push(<tr>{tdUnderOver}<td colSpan={4-tdUnderOver.length}>{' '}</td></tr>);
                tdUnderOver = []; 
              }
  
            }
        }

        let oddUnderOverOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Including Overtime')): null;
        let trUnderOverOT = [];
        let tdUnderOverOT = [];
        if(!empty(oddUnderOverOT)){
          oddUnderOverOT = orderUnderAndOver(oddUnderOverOT);
          for(let i=0; i < oddUnderOverOT.length; i++){
              if(empty(oddUnderOverOT[i])) {
                trUnderOverOT.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trUnderOverOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Including Overtime',oddUnderOverOT[i].marketType,oddUnderOverOT[i].factorExtra,"underoverot" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverOT[i]) ? oddUnderOverOT[i].marketType=='Over' ? 'Más de' : oddUnderOverOT[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverOT[i]) ? oddUnderOverOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverOT[i].odd : this.props.convertOddToAmerican(oddUnderOverOT[i].odd)}</span>
                </Button></td>{tdUnderOverOT}</tr>);
                tdUnderOverOT = [];
              }else{
                tdUnderOverOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Including Overtime',oddUnderOverOT[i].marketType,oddUnderOverOT[i].factorExtra,"underoverot" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverOT[i]) ? oddUnderOverOT[i].marketType=='Over' ? 'Más de' : oddUnderOverOT[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverOT[i]) ? oddUnderOverOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverOT[i].odd : this.props.convertOddToAmerican(oddUnderOverOT[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverOT.length && !empty(tdUnderOverOT)){
                trUnderOverOT.push(<tr>{tdUnderOverOT}<td colSpan={4-tdUnderOverOT.length}>{' '}</td></tr>);
                tdUnderOverOT = []; 
              }
  
            }
        }

        let oddUnderOverFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over 1st Period')): null;
        let trUnderOverFirstPeriod = [];
        let tdUnderOverFirstPeriod = [];
        if(!empty(oddUnderOverFirstPeriod)){
          oddUnderOverFirstPeriod = orderUnderAndOver(oddUnderOverFirstPeriod);
          for(let i=0; i < oddUnderOverFirstPeriod.length; i++){
              if(empty(oddUnderOverFirstPeriod[i])) {
                  trUnderOverFirstPeriod.push(<tr><td className={'text-center'}></td></tr>);
                  continue;
              }
              let x = i+1;  
              if(x%2==0){
                trUnderOverFirstPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over 1st Period',oddUnderOverFirstPeriod[i].marketType,oddUnderOverFirstPeriod[i].factorExtra,"underoverfirstperiod" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverFirstPeriod[i]) ? oddUnderOverFirstPeriod[i].marketType=='Over' ? 'Más de' : oddUnderOverFirstPeriod[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverFirstPeriod[i]) ? oddUnderOverFirstPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverFirstPeriod[i].odd : this.props.convertOddToAmerican(oddUnderOverFirstPeriod[i].odd)}</span>
                </Button></td>{tdUnderOverFirstPeriod}</tr>);
                tdUnderOverFirstPeriod = [];
              }else{
                tdUnderOverFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over 1st Period',oddUnderOverFirstPeriod[i].marketType,oddUnderOverFirstPeriod[i].factorExtra,"underoverfirstperiod" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverFirstPeriod[i]) ? oddUnderOverFirstPeriod[i].marketType=='Over' ? 'Más de' : oddUnderOverFirstPeriod[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverFirstPeriod[i]) ? oddUnderOverFirstPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverFirstPeriod[i].odd : this.props.convertOddToAmerican(oddUnderOverFirstPeriod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUnderOverFirstPeriod.length && !empty(tdUnderOverFirstPeriod)){
                trUnderOverFirstPeriod.push(<tr>{tdUnderOverFirstPeriod}<td colSpan={4-tdUnderOverFirstPeriod.length}>{' '}</td></tr>);
                tdUnderOverFirstPeriod = []; 
              }
  
            }
        }

        let oddUnderOverSecondPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over 2nd Period')): null;
        let trUnderOverSecondPeriod = [];
        let tdUnderOverSecondPeriod = [];
        if(!empty(oddUnderOverSecondPeriod)){
          oddUnderOverSecondPeriod = orderUnderAndOver(oddUnderOverSecondPeriod);
          for(let i=0; i < oddUnderOverSecondPeriod.length; i++){
            if(empty(oddUnderOverSecondPeriod[i])) {
                trUnderOverSecondPeriod.push(<tr><td className={'text-center'}></td></tr>);
                continue;
            }
            let x = i+1;  
              if(x%2==0){
                trUnderOverSecondPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over 2nd Period',oddUnderOverSecondPeriod[i].marketType,oddUnderOverSecondPeriod[i].factorExtra,"underoversecondperiod" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverSecondPeriod[i]) ? oddUnderOverSecondPeriod[i].marketType=='Over' ? 'Más de' : oddUnderOverSecondPeriod[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverSecondPeriod[i]) ? oddUnderOverSecondPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverSecondPeriod[i].odd : this.props.convertOddToAmerican(oddUnderOverSecondPeriod[i].odd)} </span>
                </Button></td>{tdUnderOverSecondPeriod}</tr>);
                tdUnderOverSecondPeriod = [];
              }else{
                tdUnderOverSecondPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over 2nd Period',oddUnderOverSecondPeriod[i].marketType,oddUnderOverSecondPeriod[i].factorExtra,"underoversecondperiod" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverSecondPeriod[i]) ? oddUnderOverSecondPeriod[i].marketType=='Over' ? 'Más de' : oddUnderOverSecondPeriod[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverSecondPeriod[i]) ? oddUnderOverSecondPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverSecondPeriod[i].odd : this.props.convertOddToAmerican(oddUnderOverSecondPeriod[i].odd)} </span>
                </Button></td>);
              }
              if(x==oddUnderOverSecondPeriod.length && !empty(tdUnderOverSecondPeriod)){
                trUnderOverSecondPeriod.push(<tr>{tdUnderOverSecondPeriod}<td colSpan={4-tdUnderOverSecondPeriod.length}>{' '}</td></tr>);
                tdUnderOverSecondPeriod = []; 
              }
  
            }
        }

        let oddAsianUnderOver = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Under/Over')): null;
        let trAsianUnderOver = [];
        let tdAsianUnderOver = [];
        if(!empty(oddAsianUnderOver)){
          oddAsianUnderOver = orderUnderAndOver(oddAsianUnderOver);
          for(let i=0; i < oddAsianUnderOver.length; i++){
            if(empty(oddAsianUnderOver[i])) {
                trAsianUnderOver.push(<tr><td className={'text-center'}></td></tr>);
                continue;
            }
            let x = i+1;  
              if(x%2==0){
                trAsianUnderOver.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Asian Under/Over',oddAsianUnderOver[i].marketType,oddAsianUnderOver[i].factorExtra,"asianunderover" );  } }>
                  <span className="sport-factor">{!empty(oddAsianUnderOver[i]) ? oddAsianUnderOver[i].marketType=='Over' ? 'Más de' : oddAsianUnderOver[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddAsianUnderOver[i]) ? oddAsianUnderOver[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddAsianUnderOver[i].odd : this.props.convertOddToAmerican(oddAsianUnderOver[i].odd)}</span>
                </Button></td>{tdAsianUnderOver}</tr>);
                tdAsianUnderOver = [];
              }else{
                tdAsianUnderOver.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Asian Under/Over',oddAsianUnderOver[i].marketType,oddAsianUnderOver[i].factorExtra,"asianunderover" );  } }>
                  <span className="sport-factor">{!empty(oddAsianUnderOver[i]) ? oddAsianUnderOver[i].marketType=='Over' ? 'Más de' : oddAsianUnderOver[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddAsianUnderOver[i]) ? oddAsianUnderOver[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddAsianUnderOver[i].odd : this.props.convertOddToAmerican(oddAsianUnderOver[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddAsianUnderOver.length && !empty(tdAsianUnderOver)){
                trAsianUnderOver.push(<tr>{tdAsianUnderOver}<td colSpan={4-tdAsianUnderOver.length}>{' '}</td></tr>);
                tdAsianUnderOver = []; 
              }
  
            }
        }

        let oddAsianUnderOverFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Under/Over 1st Period')): null;
        let trAsianUnderOverFirstPeriod = [];
        let tdAsianUnderOverFirstPeriod = [];
        if(!empty(oddAsianUnderOverFirstPeriod)){
          oddAsianUnderOverFirstPeriod = orderUnderAndOver(oddAsianUnderOverFirstPeriod);
          for(let i=0; i < oddAsianUnderOverFirstPeriod.length; i++){
              if(empty(oddAsianUnderOverFirstPeriod[i])) {
                trAsianUnderOverFirstPeriod.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trAsianUnderOverFirstPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Asian Under/Over 1st Period',oddAsianUnderOverFirstPeriod[i].marketType,oddAsianUnderOverFirstPeriod[i].factorExtra,"asianunderoverfirstperiod" );  } }>
                  <span className="sport-factor">{!empty(oddAsianUnderOverFirstPeriod[i]) ? oddAsianUnderOverFirstPeriod[i].marketType=='Over' ? 'Más de' : oddAsianUnderOverFirstPeriod[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddAsianUnderOverFirstPeriod[i]) ? oddAsianUnderOverFirstPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddAsianUnderOverFirstPeriod[i].odd : this.props.convertOddToAmerican(oddAsianUnderOverFirstPeriod[i].odd)}</span>
                </Button></td>{tdAsianUnderOverFirstPeriod}</tr>);
                tdAsianUnderOverFirstPeriod = [];
              }else{
                tdAsianUnderOverFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Asian Under/Over 1st Period',oddAsianUnderOverFirstPeriod[i].marketType,oddAsianUnderOverFirstPeriod[i].factorExtra,"asianunderoverfirstperiod" );  } }>
                  <span className="sport-factor">{!empty(oddAsianUnderOverFirstPeriod[i]) ? oddAsianUnderOverFirstPeriod[i].marketType=='Over' ? 'Más de' : oddAsianUnderOverFirstPeriod[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddAsianUnderOverFirstPeriod[i]) ? oddAsianUnderOverFirstPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddAsianUnderOverFirstPeriod[i].odd : this.props.convertOddToAmerican(oddAsianUnderOverFirstPeriod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddAsianUnderOverFirstPeriod.length && !empty(tdAsianUnderOverFirstPeriod)){
                trAsianUnderOverFirstPeriod.push(<tr>{tdAsianUnderOverFirstPeriod}<td colSpan={4-tdAsianUnderOverFirstPeriod.length}>{' '}</td></tr>);
                tdAsianUnderOverFirstPeriod = []; 
              }
  
            }
        }

        let oddUnderOverHomeTeam = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over - Home Team')): null;
        let trUnderOverHomeTeam = [];
        let tdUnderOverHomeTeam = [];
        if(!empty(oddUnderOverHomeTeam)){
          oddUnderOverHomeTeam = orderUnderAndOver(oddUnderOverHomeTeam);
          for(let i=0; i < oddUnderOverHomeTeam.length; i++){
              if(empty(oddUnderOverHomeTeam[i])) {
                trUnderOverHomeTeam.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trUnderOverHomeTeam.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - Home Team',oddUnderOverHomeTeam[i].marketType,oddUnderOverHomeTeam[i].factorExtra,"underoverhometeam" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverHomeTeam[i]) ? oddUnderOverHomeTeam[i].marketType=='Over' ? 'Más de' : oddUnderOverHomeTeam[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverHomeTeam[i]) ? oddUnderOverHomeTeam[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverHomeTeam[i].odd : this.props.convertOddToAmerican(oddUnderOverHomeTeam[i].odd)}</span>
                </Button></td>{tdUnderOverHomeTeam}</tr>);
                tdUnderOverHomeTeam = [];
              }else{
                tdUnderOverHomeTeam.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - Home Team',oddUnderOverHomeTeam[i].marketType,oddUnderOverHomeTeam[i].factorExtra,"underoverhometeam" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverHomeTeam[i]) ? oddUnderOverHomeTeam[i].marketType=='Over' ? 'Más de' : oddUnderOverHomeTeam[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverHomeTeam[i]) ? oddUnderOverHomeTeam[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverHomeTeam[i].odd : this.props.convertOddToAmerican(oddUnderOverHomeTeam[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUnderOverHomeTeam.length && !empty(tdUnderOverHomeTeam)){
                trUnderOverHomeTeam.push(<tr>{tdUnderOverHomeTeam}<td colSpan={4-tdUnderOverHomeTeam.length}>{' '}</td></tr>);
                tdUnderOverHomeTeam = []; 
              }
  
            }
        }

        let oddUnderOverHomeTeamOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over - Home Team Including Overtime')): null;
        let trUnderOverHomeTeamOT = [];
        let tdUnderOverHomeTeamOT = [];
        if(!empty(oddUnderOverHomeTeamOT)){
          oddUnderOverHomeTeamOT = orderUnderAndOver(oddUnderOverHomeTeamOT);
          for(let i=0; i < oddUnderOverHomeTeamOT.length; i++){
              if(empty(oddUnderOverHomeTeamOT[i])) {
                trUnderOverHomeTeamOT.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trUnderOverHomeTeamOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - Home Team Including Overtime',oddUnderOverHomeTeamOT[i].marketType,oddUnderOverHomeTeamOT[i].factorExtra,"underoverhometeamot" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverHomeTeamOT[i]) ? oddUnderOverHomeTeamOT[i].marketType=='Over' ? 'Más de' : oddUnderOverHomeTeamOT[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverHomeTeamOT[i]) ? oddUnderOverHomeTeamOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverHomeTeamOT[i].odd : this.props.convertOddToAmerican(oddUnderOverHomeTeamOT[i].odd)} </span>
                </Button></td>{tdUnderOverHomeTeamOT}</tr>);
                tdUnderOverHomeTeamOT = [];
              }else{
                tdUnderOverHomeTeamOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - Home Team Including Overtime',oddUnderOverHomeTeamOT[i].marketType,oddUnderOverHomeTeamOT[i].factorExtra,"underoverhometeamot" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverHomeTeamOT[i]) ? oddUnderOverHomeTeamOT[i].marketType=='Over' ? 'Más de' : oddUnderOverHomeTeamOT[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverHomeTeamOT[i]) ? oddUnderOverHomeTeamOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverHomeTeamOT[i].odd : this.props.convertOddToAmerican(oddUnderOverHomeTeamOT[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUnderOverHomeTeamOT.length && !empty(tdUnderOverHomeTeamOT)){
                trUnderOverHomeTeamOT.push(<tr>{tdUnderOverHomeTeamOT}<td colSpan={4-tdUnderOverHomeTeamOT.length}>{' '}</td></tr>);
                tdUnderOverHomeTeamOT = []; 
              }
  
            }
        }

        let oddUnderOverAwayTeamOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over - Away Team Including Overtime')): null;
        let trUnderOverAwayTeamOT = [];
        let tdUnderOverAwayTeamOT = [];
        if(!empty(oddUnderOverAwayTeamOT)){
          oddUnderOverAwayTeamOT = orderUnderAndOver(oddUnderOverAwayTeamOT);
          for(let i=0; i < oddUnderOverAwayTeamOT.length; i++){
              if(empty(oddUnderOverAwayTeamOT[i])) {
                trUnderOverAwayTeamOT.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;  
              if(x%2==0){
                trUnderOverAwayTeamOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - Away Team Including Overtime',oddUnderOverAwayTeamOT[i].marketType,oddUnderOverAwayTeamOT[i].factorExtra,"underoverawayteamot" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverAwayTeamOT[i]) ? oddUnderOverAwayTeamOT[i].marketType=='Over' ? 'Más de' : oddUnderOverAwayTeamOT[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverAwayTeamOT[i]) ? oddUnderOverAwayTeamOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverAwayTeamOT[i].odd : this.props.convertOddToAmerican(oddUnderOverAwayTeamOT[i].odd)}</span>
                </Button></td>{tdUnderOverAwayTeamOT}</tr>);
                tdUnderOverAwayTeamOT = [];
              }else{
                tdUnderOverAwayTeamOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - Away Team Including Overtime',oddUnderOverAwayTeamOT[i].marketType,oddUnderOverAwayTeamOT[i].factorExtra,"underoverawayteamot" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverAwayTeamOT[i]) ? oddUnderOverAwayTeamOT[i].marketType=='Over' ? 'Más de' : oddUnderOverAwayTeamOT[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverAwayTeamOT[i]) ? oddUnderOverAwayTeamOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverAwayTeamOT[i].odd : this.props.convertOddToAmerican(oddUnderOverAwayTeamOT[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUnderOverAwayTeamOT.length && !empty(tdUnderOverAwayTeamOT)){
                trUnderOverAwayTeamOT.push(<tr>{tdUnderOverAwayTeamOT}<td colSpan={4-tdUnderOverAwayTeamOT.length}>{' '}</td></tr>);
                tdUnderOverAwayTeamOT = []; 
              }
  
            }
        }

        let oddUnderOverAwayTeam = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over - Away Team')): null;
        let trUnderOverAwayTeam = [];
        let tdUnderOverAwayTeam = [];
        if(!empty(oddUnderOverAwayTeam)){
          oddUnderOverAwayTeam = orderUnderAndOver(oddUnderOverAwayTeam);
          for(let i=0; i < oddUnderOverAwayTeam.length; i++){
              if(empty(oddUnderOverAwayTeam[i])) {
                trUnderOverAwayTeam.push(<tr><td className={'text-center'}></td></tr>);
                continue;
              }
              let x = i+1;
              if(x%2==0){
                trUnderOverAwayTeam.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - Away Team',oddUnderOverAwayTeam[i].marketType,oddUnderOverAwayTeam[i].factorExtra,"underoverawayteam" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverAwayTeam[i]) ? oddUnderOverAwayTeam[i].marketType=='Over' ? 'Más de' : oddUnderOverAwayTeam[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverAwayTeam[i]) ? oddUnderOverAwayTeam[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverAwayTeam[i].odd : this.props.convertOddToAmerican(oddUnderOverAwayTeam[i].odd)}</span>
                </Button></td>{tdUnderOverAwayTeam}</tr>);
                tdUnderOverAwayTeam = [];
              }else{
                tdUnderOverAwayTeam.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - Away Team',oddUnderOverAwayTeam[i].marketType,oddUnderOverAwayTeam[i].factorExtra,"underoverawayteam" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverAwayTeam[i]) ? oddUnderOverAwayTeam[i].marketType=='Over' ? 'Más de' : oddUnderOverAwayTeam[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverAwayTeam[i]) ? oddUnderOverAwayTeam[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverAwayTeam[i].odd : this.props.convertOddToAmerican(oddUnderOverAwayTeam[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUnderOverAwayTeam.length && !empty(tdUnderOverAwayTeam)){
                trUnderOverAwayTeam.push(<tr>{tdUnderOverAwayTeam}<td colSpan={4-tdUnderOverAwayTeam.length}>{' '}</td></tr>);
                tdUnderOverAwayTeam = []; 
              }
  
            }
        }

        let oddOddEven = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Odd/Even')): null;
        let tdoddOddEvenOdd = [];
        let tdoddOddEvenEven = [];

        if(!empty(oddOddEven)){
          for(let i=0; i < oddOddEven.length; i++){
            if(oddOddEven[i].marketType=='Odd' && empty(tdoddOddEvenOdd)){
              tdoddOddEvenOdd.push(<td className={'text-center'}>{!empty(oddOddEven) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even',oddOddEven[i].marketType,"oddeven");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEven[i].odd : this.props.convertOddToAmerican(oddOddEven[i].odd)}</Button> : ''}</td>)
            }
            if(oddOddEven[i].marketType=='Even' && empty(tdoddOddEvenEven)){
              tdoddOddEvenEven.push(<td className={'text-center'}>{!empty(oddOddEven) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even',oddOddEven[i].marketType,"oddeven");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEven[i].odd : this.props.convertOddToAmerican(oddOddEven[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddOddEvenHome = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Odd/Even - Home Team')): null;
        let tdoddOddEvenOddHome = [];
        let tdoddOddEvenEvenHome = [];

        if(!empty(oddOddEvenHome)){
          for(let i=0; i < oddOddEvenHome.length; i++){
            if(oddOddEvenHome[i].marketType=='Odd' && empty(tdoddOddEvenOddHome)){
              tdoddOddEvenOddHome.push(<td className={'text-center'}>{!empty(oddOddEvenHome) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even - Home Team',oddOddEvenHome[i].marketType,"oddevenhome");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenHome[i].odd : this.props.convertOddToAmerican(oddOddEvenHome[i].odd)} </Button> : ''}</td>)
            }
            if(oddOddEvenHome[i].marketType=='Even' && empty(tdoddOddEvenEvenHome)){
              tdoddOddEvenEvenHome.push(<td className={'text-center'}>{!empty(oddOddEvenHome) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even - Home Team',oddOddEvenHome[i].marketType,"oddevenhome");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenHome[i].odd : this.props.convertOddToAmerican(oddOddEvenHome[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddOddEvenAway = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Odd/Even - Away Team')): null;
        let tdoddOddEvenOddAway = [];
        let tdoddOddEvenEvenAway = [];

        if(!empty(oddOddEvenAway)){
          for(let i=0; i < oddOddEvenAway.length; i++){
            if(oddOddEvenAway[i].marketType=='Odd' && empty(tdoddOddEvenOddAway)){
              tdoddOddEvenOddAway.push(<td className={'text-center'}>{!empty(oddOddEvenAway) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even - Away Team',oddOddEvenAway[i].marketType,"oddevenaway");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenAway[i].odd : this.props.convertOddToAmerican(oddOddEvenAway[i].odd)} </Button> : ''}</td>)
            }
            if(oddOddEvenAway[i].marketType=='Even' && empty(tdoddOddEvenEvenAway)){
              tdoddOddEvenEvenAway.push(<td className={'text-center'}>{!empty(oddOddEvenAway) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even - Away Team',oddOddEvenAway[i].marketType,"oddevenaway");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenAway[i].odd : this.props.convertOddToAmerican(oddOddEvenAway[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddOddEvenIncludingOvertime = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Odd/Even Including Overtime')): null;
        let tdoddOddEvenOTOdd = [];
        let tdoddOddEvenOTEven = [];

        if(!empty(oddOddEvenIncludingOvertime)){
          for(let i=0; i < oddOddEvenIncludingOvertime.length; i++){
            if(oddOddEvenIncludingOvertime[i].marketType=='Odd' && empty(tdoddOddEvenOTOdd)){
              tdoddOddEvenOTOdd.push(<td className={'text-center'}>{!empty(oddOddEvenIncludingOvertime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even Including Overtime',oddOddEvenIncludingOvertime[i].marketType,"oddevenot");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenIncludingOvertime[i].odd : this.props.convertOddToAmerican(oddOddEvenIncludingOvertime[i].odd)} </Button> : ''}</td>)
            }
            if(oddOddEvenIncludingOvertime[i].marketType=='Even' && empty(tdoddOddEvenOTEven)){
              tdoddOddEvenOTEven.push(<td className={'text-center'}>{!empty(oddOddEvenIncludingOvertime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even Including Overtime',oddOddEvenIncludingOvertime[i].marketType,"oddevenot");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenIncludingOvertime[i].odd : this.props.convertOddToAmerican(oddOddEvenIncludingOvertime[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddOddEvenCorners = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Odd/Even Corners')): null;
        let tdoddOddEvenCornersOdd = [];
        let tdoddOddEvenCornersEven = [];

        if(!empty(oddOddEvenCorners)){
          for(let i=0; i < oddOddEvenCorners.length; i++){
            if(oddOddEvenCorners[i].marketType=='Odd' && empty(tdoddOddEvenCornersOdd)){
              tdoddOddEvenCornersOdd.push(<td className={'text-center'}>{!empty(oddOddEvenCorners) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even Corners',oddOddEvenCorners[i].marketType,"oddevencorners");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenCorners[i].odd : this.props.convertOddToAmerican(oddOddEvenCorners[i].odd)} </Button> : ''}</td>)
            }
            if(oddOddEvenCorners[i].marketType=='Even' && empty(tdoddOddEvenCornersEven)){
              tdoddOddEvenCornersEven.push(<td className={'text-center'}>{!empty(oddOddEvenCorners) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Odd/Even Corners',oddOddEvenCorners[i].marketType,"oddevencorners");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenCorners[i].odd : this.props.convertOddToAmerican(oddOddEvenCorners[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddAsianHandicapHalftime = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Handicap Halftime')): null;
        let trAsianHandicapHalftime = [];
        let tdAsianHandicapHalftime = [];

        if(!empty(oddAsianHandicapHalftime)){
          oddAsianHandicapHalftime = orderOddsHandicap(oddAsianHandicapHalftime);
          for(let i=0; i < oddAsianHandicapHalftime.length; i++){
            if(empty(oddAsianHandicapHalftime[i])) {
              trAsianHandicapHalftime.push(<tr><td className={'text-center'}></td></tr>);
              continue;
            }
            let factorExtra = oddAsianHandicapHalftime[i].factorExtra.split(' ');
            let x = i+1;  
            if(x%2==0){
              trAsianHandicapHalftime.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Halftime',oddAsianHandicapHalftime[i].marketType,factorExtra[0],"asianhandicaphalftime"); } }><span className="sport-factor">{!empty(oddAsianHandicapHalftime[i]) && oddAsianHandicapHalftime[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapHalftime[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapHalftime[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd"> {showOdds == 'D' ? oddAsianHandicapHalftime[i].odd : this.props.convertOddToAmerican(oddAsianHandicapHalftime[i].odd)} </span></Button></td>{tdAsianHandicapHalftime}</tr>);
              tdAsianHandicapHalftime = [];
            }else{
              tdAsianHandicapHalftime.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Halftime',oddAsianHandicapHalftime[i].marketType,factorExtra[0],"asianhandicaphalftime"); } }><span className="sport-factor">{!empty(oddAsianHandicapHalftime[i]) && oddAsianHandicapHalftime[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapHalftime[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapHalftime[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapHalftime[i].odd : this.props.convertOddToAmerican(oddAsianHandicapHalftime[i].odd)} </span></Button></td>);
            }
            if(x==oddAsianHandicapHalftime.length && !empty(tdAsianHandicapHalftime)){
              trAsianHandicapHalftime.push(<tr>{tdAsianHandicapHalftime}<td colSpan={4-tdAsianHandicapHalftime.length}>{' '}</td></tr>);
              tdAsianHandicapHalftime = []; 
            }
          }
        }

        let oddAsianHandicap = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Handicap')): null;
        let trAsianHandicap = [];
        let tdAsianHandicap = [];

        if(!empty(oddAsianHandicap)){
          oddAsianHandicap = orderOddsHandicap(oddAsianHandicap);
          for(let i=0; i < oddAsianHandicap.length; i++){
            if(empty(oddAsianHandicap[i])) {
              trAsianHandicap.push(<tr><td className={'text-center'}></td></tr>);
              continue;
            }
            let factorExtra = oddAsianHandicap[i].factorExtra.split(' ');
            let x = i+1;  
            if(x%2==0){
              trAsianHandicap.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap',oddAsianHandicap[i].marketType,factorExtra[0],"asianhandicap"); } }><span className="sport-factor">{!empty(oddAsianHandicap[i]) && oddAsianHandicap[i].marketType=='1' ? events[0].eventHome : oddAsianHandicap[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicap[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicap[i].odd : this.props.convertOddToAmerican(oddAsianHandicap[i].odd)} </span></Button></td>{tdAsianHandicap}</tr>);
              tdAsianHandicap = [];
            }else{
              tdAsianHandicap.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap',oddAsianHandicap[i].marketType,factorExtra[0],"asianhandicap"); } }><span className="sport-factor">{!empty(oddAsianHandicap[i]) && oddAsianHandicap[i].marketType=='1' ? events[0].eventHome : oddAsianHandicap[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicap[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicap[i].odd : this.props.convertOddToAmerican(oddAsianHandicap[i].odd)}</span></Button></td>);
            }
            if(x==oddAsianHandicap.length && !empty(tdAsianHandicap)){
              trAsianHandicap.push(<tr>{tdAsianHandicap}<td colSpan={4-tdAsianHandicap.length}>{' '}</td></tr>);
              tdAsianHandicap = []; 
            }
          }
        }

        let oddAsianHandicapFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Handicap 1st Period')): null;
        let trAsianHandicapFirstPeriod = [];
        let tdAsianHandicapFirstPeriod = [];

        if(!empty(oddAsianHandicapFirstPeriod)){
          oddAsianHandicapFirstPeriod = orderOddsHandicap(oddAsianHandicapFirstPeriod);
          for(let i=0; i < oddAsianHandicapFirstPeriod.length; i++){
             if(empty(oddAsianHandicapFirstPeriod[i])) {
              trAsianHandicapFirstPeriod.push(<tr><td className={'text-center'}></td></tr>);
              continue;
            }
            let factorExtra = oddAsianHandicapFirstPeriod[i].factorExtra.split(' ');
            let x = i+1;  
            if(x%2==0){
              trAsianHandicapFirstPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap 1st Period',oddAsianHandicapFirstPeriod[i].marketType,factorExtra[0],"asianhandicapfirstperiod"); } }><span className="sport-factor">{!empty(oddAsianHandicapFirstPeriod[i]) && oddAsianHandicapFirstPeriod[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapFirstPeriod[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapFirstPeriod[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapFirstPeriod[i].odd : this.props.convertOddToAmerican(oddAsianHandicapFirstPeriod[i].odd)}</span></Button></td>{tdAsianHandicapFirstPeriod}</tr>);
              tdAsianHandicapFirstPeriod = [];
            }else{
              tdAsianHandicapFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap 1st Period',oddAsianHandicapFirstPeriod[i].marketType,factorExtra[0],"asianhandicapfirstperiod"); } }><span className="sport-factor">{!empty(oddAsianHandicapFirstPeriod[i]) && oddAsianHandicapFirstPeriod[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapFirstPeriod[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapFirstPeriod[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapFirstPeriod[i].odd : this.props.convertOddToAmerican(oddAsianHandicapFirstPeriod[i].odd)}</span></Button></td>);
            }

            if(x==oddAsianHandicapFirstPeriod.length && !empty(tdAsianHandicapFirstPeriod)){
              trAsianHandicapFirstPeriod.push(<tr>{tdAsianHandicapFirstPeriod}<td colSpan={4-tdAsianHandicapFirstPeriod.length}>{' '}</td></tr>);
              tdAsianHandicapFirstPeriod = []; 
            }
          }
        }

        let oddAsianHandicapOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Handicap Including Overtime')): null;
        let trAsianHandicapOT = [];
        let tdAsianHandicapOT = [];

        if(!empty(oddAsianHandicapOT)){
          oddAsianHandicapOT = orderOddsHandicap(oddAsianHandicapOT);
          for(let i=0; i < oddAsianHandicapOT.length; i++){
            if(empty(oddAsianHandicapOT[i])) {
              trAsianHandicapOT.push(<tr><td className={'text-center'}></td></tr>);
              continue;
            }
            let factorExtra = oddAsianHandicapOT[i].factorExtra.split(' ');
            let x = i+1;  
            if(x%2==0){
              trAsianHandicapOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Including Overtime',oddAsianHandicapOT[i].marketType,factorExtra[0],"asianhandicapovertime"); } }><span className="sport-factor">{!empty(oddAsianHandicapOT[i]) && oddAsianHandicapOT[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapOT[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapOT[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapOT[i].odd : this.props.convertOddToAmerican(oddAsianHandicapOT[i].odd)} </span></Button></td>{tdAsianHandicapOT}</tr>);
              tdAsianHandicapOT = [];
            }else{
              tdAsianHandicapOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Including Overtime',oddAsianHandicapOT[i].marketType,factorExtra[0],"asianhandicapovertime"); } }><span className="sport-factor">{!empty(oddAsianHandicapOT[i]) && oddAsianHandicapOT[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapOT[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapOT[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapOT[i].odd : this.props.convertOddToAmerican(oddAsianHandicapOT[i].odd)} </span></Button></td>);
            }
            if(x==oddAsianHandicapOT.length && !empty(tdAsianHandicapOT)){
              trAsianHandicapOT.push(<tr>{tdAsianHandicapOT}<td colSpan={4-tdAsianHandicapOT.length}>{' '}</td></tr>);
              tdAsianHandicapOT = []; 
            }
          }
        }

        let oddTotalFoulsCommitted = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Total Fouls Committed')): null;
        let trTotalFoulsCommitted = [];
        let tdTotalFoulsCommitted = [];
        if(!empty(oddTotalFoulsCommitted)){
          oddTotalFoulsCommitted = orderUnderAndOver(oddTotalFoulsCommitted);
          for(let i=0; i < oddTotalFoulsCommitted.length; i++){
              let x = i+1;  
              if(x%2==0){
                trTotalFoulsCommitted.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Total Fouls Committed', oddTotalFoulsCommitted[i].marketType,oddTotalFoulsCommitted[i].factorExtra,"totalfoulscommitted" );  } }>
                  <span className="sport-factor">{!empty(oddTotalFoulsCommitted[i]) ? oddTotalFoulsCommitted[i].marketType=='Over' ? 'Más de' : oddTotalFoulsCommitted[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddTotalFoulsCommitted[i]) ? oddTotalFoulsCommitted[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddTotalFoulsCommitted[i].odd : this.props.convertOddToAmerican(oddTotalFoulsCommitted[i].odd)} </span>
                </Button></td>{tdTotalFoulsCommitted}</tr>);
                tdTotalFoulsCommitted = [];
              }else{
                tdTotalFoulsCommitted.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Total Fouls Committed',oddTotalFoulsCommitted[i].marketType,oddTotalFoulsCommitted[i].factorExtra,"totalfoulscommitted" );  } }>
                  <span className="sport-factor">{!empty(oddTotalFoulsCommitted[i]) ? oddTotalFoulsCommitted[i].marketType=='Over' ? 'Más de' : oddTotalFoulsCommitted[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddTotalFoulsCommitted[i]) ? oddTotalFoulsCommitted[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddTotalFoulsCommitted[i].odd : this.props.convertOddToAmerican(oddTotalFoulsCommitted[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddTotalFoulsCommitted.length && !empty(tdTotalFoulsCommitted)){
                trTotalFoulsCommitted.push(<tr>{tdTotalFoulsCommitted}<td colSpan={4-tdTotalFoulsCommitted.length}>{' '}</td></tr>);
                tdTotalFoulsCommitted = []; 
              }
  
            }
        }

        let oddFirstTeamToScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='First Team To Score')): null;
  
        let tdFirstTeamToScore1 = []; 
        let tdFirstTeamToScore2 = []; 
        let tdFirstTeamToScoreNoGoal = []; 
        if(!empty(oddFirstTeamToScore)){

          for(let i=0; i < oddFirstTeamToScore.length; i++){
            if(oddFirstTeamToScore[i].marketType=='1' && empty(tdFirstTeamToScore1)){
              tdFirstTeamToScore1.push(<td className={'text-center'}>{!empty(oddFirstTeamToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Team To Score',oddFirstTeamToScore[i].marketType,"firstteamtoscore");  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddFirstTeamToScore[i].odd : this.props.convertOddToAmerican(oddFirstTeamToScore[i].odd)} </Button> : ''}</td>)
            }
            if(oddFirstTeamToScore[i].marketType=='2'  && empty(tdFirstTeamToScore2)){
              tdFirstTeamToScore2.push(<td className={'text-center'}>{!empty(oddFirstTeamToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Team To Score',oddFirstTeamToScore[i].marketType,"firstteamtoscore");  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddFirstTeamToScore[i].odd : this.props.convertOddToAmerican(oddFirstTeamToScore[i].odd)}</Button> : ''}</td>)
            }
            if(oddFirstTeamToScore[i].marketType=='No Goal' && empty(tdFirstTeamToScoreNoGoal)){
              tdFirstTeamToScoreNoGoal.push(<td className={'text-center'}>{!empty(oddFirstTeamToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Team To Score',oddFirstTeamToScore[i].marketType,"firstteamtoscore");  } }><span className="sport-factor">{'Sin goles'}</span> {showOdds == 'D' ? oddFirstTeamToScore[i].odd : this.props.convertOddToAmerican(oddFirstTeamToScore[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddLastTeamToScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Last Team To Score')): null;
  
        let tdLastTeamToScore1 = []; 
        let tdLastTeamToScore2 = []; 
        let tdLastTeamToScoreNoGoal = []; 
        if(!empty(oddLastTeamToScore)){

          for(let i=0; i < oddLastTeamToScore.length; i++){
            if(oddLastTeamToScore[i].marketType=='1' && empty(tdLastTeamToScore1)){
              tdLastTeamToScore1.push(<td className={'text-center'}>{!empty(oddLastTeamToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Team To Score',oddLastTeamToScore[i].marketType,"lastteamtoscore");  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddLastTeamToScore[i].odd : this.props.convertOddToAmerican(oddLastTeamToScore[i].odd)} </Button> : ''}</td>)
            }
            if(oddLastTeamToScore[i].marketType=='2'  && empty(tdLastTeamToScore2)){
              tdLastTeamToScore2.push(<td className={'text-center'}>{!empty(oddLastTeamToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Team To Score',oddLastTeamToScore[i].marketType,"lastteamtoscore");  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddLastTeamToScore[i].odd : this.props.convertOddToAmerican(oddLastTeamToScore[i].odd)}</Button> : ''}</td>)
            }
            if(oddLastTeamToScore[i].marketType=='No Goal' && empty(tdLastTeamToScoreNoGoal)){
              tdLastTeamToScoreNoGoal.push(<td className={'text-center'}>{!empty(oddLastTeamToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Team To Score',oddLastTeamToScore[i].marketType,"lastteamtoscore");  } }><span className="sport-factor">{'Sin goles'}</span> {showOdds == 'D' ? oddLastTeamToScore[i].odd : this.props.convertOddToAmerican(oddLastTeamToScore[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddOddEvenFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Odd/Even')): null;
        let tdoddOddEvenOddFirstPeriod = [];
        let tdoddOddEvenEvenFirstPeriod = [];

        if(!empty(oddOddEvenFirstPeriod)){
          for(let i=0; i < oddOddEvenFirstPeriod.length; i++){
            if(oddOddEvenFirstPeriod[i].marketType=='Odd' && empty(tdoddOddEvenOddFirstPeriod)){
              tdoddOddEvenOddFirstPeriod.push(<td className={'text-center'}>{!empty(oddOddEvenFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1st Period Odd/Even',oddOddEvenFirstPeriod[i].marketType,"firstperiododdeven");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenFirstPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenFirstPeriod[i].odd)} </Button> : ''}</td>)
            }
            if(oddOddEvenFirstPeriod[i].marketType=='Even' && empty(tdoddOddEvenEvenFirstPeriod)){
              tdoddOddEvenEvenFirstPeriod.push(<td className={'text-center'}>{!empty(oddOddEvenFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1st Period Odd/Even',oddOddEvenFirstPeriod[i].marketType,"firstperiododdeven");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenFirstPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenFirstPeriod[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddOddEvenSecondPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='2nd Period Odd/Even')): null;
        let tdoddOddEvenOddSecondPeriod = [];
        let tdoddOddEvenEvenSecondPeriod = [];

        if(!empty(oddOddEvenSecondPeriod)){
          for(let i=0; i < oddOddEvenSecondPeriod.length; i++){
            if(oddOddEvenSecondPeriod[i].marketType=='Odd' && empty(tdoddOddEvenOddSecondPeriod)){
              tdoddOddEvenOddSecondPeriod.push(<td className={'text-center'}>{!empty(oddOddEvenSecondPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'2nd Period Odd/Even',oddOddEvenSecondPeriod[i].marketType,"secondperiododdeven");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenSecondPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenSecondPeriod[i].odd)}</Button> : ''}</td>)
            }
            if(oddOddEvenSecondPeriod[i].marketType=='Even' && empty(tdoddOddEvenEvenSecondPeriod)){
              tdoddOddEvenEvenSecondPeriod.push(<td className={'text-center'}>{!empty(oddOddEvenSecondPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'2nd Period Odd/Even',oddOddEvenSecondPeriod[i].marketType,"secondperiododdeven");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenSecondPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenSecondPeriod[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddOddEvenThirdPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='3er Period Odd/Even')): null;
        let tdoddOddEvenOddThirdPeriod = [];
        let tdoddOddEvenEvenThirdPeriod = [];

        if(!empty(oddOddEvenThirdPeriod)){
          for(let i=0; i < oddOddEvenThirdPeriod.length; i++){
            if(oddOddEvenThirdPeriod[i].marketType=='Odd' && empty(tdoddOddEvenOddSecondPeriod)){
              tdoddOddEvenOddThirdPeriod.push(<td className={'text-center'}>{!empty(oddOddEvenThirdPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'3rd Period Odd/Even',oddOddEvenThirdPeriod[i].marketType,"thirdperiododdeven");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenThirdPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenThirdPeriod[i].odd)} </Button> : ''}</td>)
            }
            if(oddOddEvenThirdPeriod[i].marketType=='Even' && empty(tdoddOddEvenEvenSecondPeriod)){
              tdoddOddEvenEvenThirdPeriod.push(<td className={'text-center'}>{!empty(oddOddEvenThirdPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'3rd Period Odd/Even',oddOddEvenThirdPeriod[i].marketType,"thirdperiododdeven");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenThirdPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenThirdPeriod[i].odd)} </Button> : ''}</td>)
            }
          }
        }

        let oddOddEvenFourthPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='4th Period Odd/Even')): null;
        let tdoddOddEvenOddFourthPeriod = [];
        let tdoddOddEvenEvenFourthPeriod = [];

        if(!empty(oddOddEvenFourthPeriod)){
          for(let i=0; i < oddOddEvenFourthPeriod.length; i++){
            if(oddOddEvenFourthPeriod[i].marketType=='Odd' && empty(tdoddOddEvenOddSecondPeriod)){
              tdoddOddEvenOddFourthPeriod.push(<td className={'text-center'}>{!empty(oddOddEvenFourthPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'4th Period Odd/Even',oddOddEvenFourthPeriod[i].marketType,"fourthperiododdeven");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenFourthPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenFourthPeriod[i].odd)}</Button> : ''}</td>)
            }
            if(oddOddEvenFourthPeriod[i].marketType=='Even' && empty(tdoddOddEvenEvenSecondPeriod)){
              tdoddOddEvenEvenFourthPeriod.push(<td className={'text-center'}>{!empty(oddOddEvenFourthPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'4th Period Odd/Even',oddOddEvenFourthPeriod[i].marketType,"fourthperiododdeven");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenFourthPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenFourthPeriod[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let odd12HalfTime = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='12 Halftime')): null;
  
        let td12HalfTime1 = []; 
        let td12HalfTime2 = []; 
        if(!empty(odd12HalfTime)){

          for(let i=0; i < odd12HalfTime.length; i++){
            if(odd12HalfTime[i].marketType=='1' && empty(td12HalfTime1)){
              td12HalfTime1.push(<td className={'text-center'}>{!empty(odd12HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'12 Halftime',odd12HalfTime[i].marketType,"12halftime");  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? odd12HalfTime[i].odd : this.props.convertOddToAmerican(odd12HalfTime[i].odd)} </Button> : ''}</td>)
            }
            if(odd12HalfTime[i].marketType=='2'  && empty(td12HalfTime2)){
              td12HalfTime2.push(<td className={'text-center'}>{!empty(odd12HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'12 Halftime',odd12HalfTime[i].marketType,"12halftime");  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? odd12HalfTime[i].odd : this.props.convertOddToAmerican(odd12HalfTime[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let odd1x2HalfTime = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1X2 Halftime')): null;
  
        let td1x2HalfTime1 = []; 
        let td1x2HalfTimeX = []; 
        let td1x2HalfTime2 = []; 
        if(!empty(odd1x2HalfTime)){

          for(let i=0; i < odd1x2HalfTime.length; i++){
            if(odd1x2HalfTime[i].marketType=='1' && empty(td1x2HalfTime1)){
              td1x2HalfTime1.push(<td className={'text-center'}>{!empty(odd1x2HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1X2 Halftime',odd1x2HalfTime[i].marketType,"1x2halftime");  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? odd1x2HalfTime[i].odd : this.props.convertOddToAmerican(odd1x2HalfTime[i].odd)} </Button> : ''}</td>)
            }
            if(odd1x2HalfTime[i].marketType=='X'  && empty(td1x2HalfTimeX)){
              td1x2HalfTimeX.push(<td className={'text-center'}>{!empty(odd1x2HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1X2 Halftime',odd1x2HalfTime[i].marketType,"1x2halftime");  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? odd1x2HalfTime[i].odd : this.props.convertOddToAmerican(odd1x2HalfTime[i].odd)} </Button> : ''}</td>)
            }
            if(odd1x2HalfTime[i].marketType=='2'  && empty(td1x2HalfTime2)){
              td1x2HalfTime2.push(<td className={'text-center'}>{!empty(odd1x2HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1X2 Halftime',odd1x2HalfTime[i].marketType,"1x2halftime");  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? odd1x2HalfTime[i].odd : this.props.convertOddToAmerican(odd1x2HalfTime[i].odd)} </Button> : ''}</td>)
            }
          }

        }

        let oddHTFT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='HT/FT')): null;
        let trHTFT = [];
        let tdHTFT = [];
        if(!empty(oddHTFT)){
          for(let i=0; i < oddHTFT.length; i++){
              let x = i+1;  
              if(x%3==0){
                    trHTFT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'HT/FT',oddHTFT[i].marketType,"htft");  } }>
                    <span className="sport-factor">{!empty(oddHTFT[i]) ? oddHTFT[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddHTFT[i].odd : this.props.convertOddToAmerican(oddHTFT[i].odd)}</span>
                    </Button></td>{tdHTFT}</tr>);
                  tdHTFT = [];                  
                }else{
                  tdHTFT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'HT/FT',oddHTFT[i].marketType,"htft");  } }>
                    <span className="sport-factor">{!empty(oddHTFT[i]) ? oddHTFT[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddHTFT[i].odd : this.props.convertOddToAmerican(oddHTFT[i].odd)}</span>
                  </Button></td>);
                }
                if(x==oddHTFT.length && !empty(tdHTFT)){
                  trHTFT.push(<tr>{tdHTFT}<td colSpan={3-tdHTFT.length}>{' '}</td></tr>);
                  tdHTFT = []; 
                }
              
            }
        }

        let oddHTFTOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='HT/FT Including Overtime')): null;
        let trHTFTOT = [];
        let tdHTFTOT = [];
        if(!empty(oddHTFTOT)){
          for(let i=0; i < oddHTFTOT.length; i++){
              let x = i+1;  
              if(x%3==0){
                trHTFTOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'HT/FT Including Overtime',oddHTFTOT[i].marketType,"htftot");  } }>
                    <span className="sport-factor">{!empty(oddHTFTOT[i]) ? oddHTFTOT[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddHTFTOT[i].odd : this.props.convertOddToAmerican(oddHTFTOT[i].odd)} </span>
                    </Button></td>{tdHTFTOT}</tr>);
                  tdHTFTOT = [];                  
                }else{
                  tdHTFTOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'HT/FT Including Overtime',oddHTFTOT[i].marketType,"htftot");  } }>
                    <span className="sport-factor">{!empty(oddHTFTOT[i]) ? oddHTFTOT[i].marketType : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddHTFTOT[i].odd : this.props.convertOddToAmerican(oddHTFTOT[i].odd)}</span>
                  </Button></td>);
                }
                if(x==oddHTFTOT.length && !empty(tdHTFTOT)){
                  trHTFTOT.push(<tr>{tdHTFTOT}<td colSpan={3-tdHTFTOT.length}>{' '}</td></tr>);
                  tdHTFTOT = []; 
                }
              
            }
        }

        
        let oddCornersUOE = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Corners - Under/Exactly/Over')): null;
        let trCornersUOE = [];
        let tdCornersUOE = [];
        if(!empty(oddCornersUOE)){
          for(let i=0; i < oddCornersUOE.length; i++){
            let x = i+1;  
              if(x%2==0){
                trCornersUOE.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Corners - Under/Exactly/Over', oddCornersUOE[i].marketType,oddCornersUOE[i].factorExtra,"cornersuoe" );  } }>
                  <span className="sport-factor">{!empty(oddCornersUOE[i]) ? oddCornersUOE[i].marketType=='Over' ? 'Más de' : oddCornersUOE[i].marketType=='Under' ? 'Menos de' : oddCornersUOE[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddCornersUOE[i]) ? oddCornersUOE[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCornersUOE[i].odd : this.props.convertOddToAmerican(oddCornersUOE[i].odd)}</span>
                </Button></td>{tdCornersUOE}</tr>);
                tdCornersUOE = [];
              }else{
                tdCornersUOE.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Corners - Under/Exactly/Over',oddCornersUOE[i].marketType,oddCornersUOE[i].factorExtra,"cornersuoe" );  } }>
                  <span className="sport-factor">{!empty(oddCornersUOE[i]) ? oddCornersUOE[i].marketType=='Over' ? 'Más de' : oddCornersUOE[i].marketType=='Under' ? 'Menos de' : oddCornersUOE[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddCornersUOE[i]) ? oddCornersUOE[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCornersUOE[i].odd : this.props.convertOddToAmerican(oddCornersUOE[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddCornersUOE.length && !empty(tdCornersUOE)){
                trCornersUOE.push(<tr>{tdCornersUOE}<td colSpan={4-tdCornersUOE.length}>{' '}</td></tr>);
                tdCornersUOE = []; 
              }
  
            }
        }

        let oddFirstHalfCornersUOE = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='First Half Corners - Under/Exactly/Over')): null;
        let trFirstHalfCornersUOE = [];
        let tdFirstHalfCornersUOE = [];
        if(!empty(oddFirstHalfCornersUOE)){
          for(let i=0; i < oddFirstHalfCornersUOE.length; i++){
            let x = i+1;  
              if(x%2==0){
                trFirstHalfCornersUOE.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'First Half Corners - Under/Exactly/Over', oddFirstHalfCornersUOE[i].marketType,oddFirstHalfCornersUOE[i].factorExtra,"firsthalfcornersuoe" );  } }>
                  <span className="sport-factor">{!empty(oddFirstHalfCornersUOE[i]) ? oddFirstHalfCornersUOE[i].marketType=='Over' ? 'Más de' : oddFirstHalfCornersUOE[i].marketType=='Under' ? 'Menos de' : oddFirstHalfCornersUOE[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddFirstHalfCornersUOE[i]) ? oddFirstHalfCornersUOE[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstHalfCornersUOE[i].odd : this.props.convertOddToAmerican(oddFirstHalfCornersUOE[i].odd)}</span>
                </Button></td>{tdFirstHalfCornersUOE}</tr>);
                tdFirstHalfCornersUOE = [];
              }else{
                tdFirstHalfCornersUOE.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'First Half Corners - Under/Exactly/Over',oddFirstHalfCornersUOE[i].marketType,oddFirstHalfCornersUOE[i].factorExtra,"firsthalfcornersuoe" );  } }>
                  <span className="sport-factor">{!empty(oddFirstHalfCornersUOE[i]) ? oddFirstHalfCornersUOE[i].marketType=='Over' ? 'Más de' : oddFirstHalfCornersUOE[i].marketType=='Under' ? 'Menos de' : oddFirstHalfCornersUOE[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddFirstHalfCornersUOE[i]) ? oddFirstHalfCornersUOE[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstHalfCornersUOE[i].odd : this.props.convertOddToAmerican(oddFirstHalfCornersUOE[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddFirstHalfCornersUOE.length && !empty(tdFirstHalfCornersUOE)){
                trFirstHalfCornersUOE.push(<tr>{tdFirstHalfCornersUOE}<td colSpan={4-tdFirstHalfCornersUOE.length}>{' '}</td></tr>);
                tdFirstHalfCornersUOE = []; 
              }
  
            }
        }

        let oddFirstPlayer = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='First Player To Score')): null;
        let trFirstPlayer = [];
        let tdFirstPlayer = [];
        if(!empty(oddFirstPlayer)){
          for(let i=0; i < oddFirstPlayer.length; i++){
            let x = i+1;  
              if(x%3==0){
                trFirstPlayer.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Player To Score',oddFirstPlayer[i].marketType,"firstplayertoscore");  } }>
                  <span className="sport-factor">{!empty(oddFirstPlayer[i]) ? oddFirstPlayer[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstPlayer[i].odd : this.props.convertOddToAmerican(oddFirstPlayer[i].odd)}</span>
                </Button></td>{tdFirstPlayer}</tr>);
                tdFirstPlayer = [];
              }else{
                tdFirstPlayer.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Player To Score',oddFirstPlayer[i].marketType,"firstplayertoscore");  } }>
                  <span className="sport-factor">{!empty(oddFirstPlayer[i]) ? oddFirstPlayer[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstPlayer[i].odd : this.props.convertOddToAmerican(oddFirstPlayer[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddFirstPlayer.length && !empty(tdFirstPlayer)){
                trFirstPlayer.push(<tr>{tdFirstPlayer}<td colSpan={3-tdFirstPlayer.length}>{' '}</td></tr>);
                tdFirstPlayer = []; 
              }
            }
        }

        let oddLastPlayer = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Last Player To Score')): null;
        let trLastPlayer = [];
        let tdLastPlayer = [];
        if(!empty(oddLastPlayer)){
          for(let i=0; i < oddLastPlayer.length; i++){
            let x = i+1;  
              if(x%3==0){
                trLastPlayer.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Player To Score',oddLastPlayer[i].marketType,"lastplayertoscore");  } }>
                  <span className="sport-factor">{!empty(oddLastPlayer[i]) ? oddLastPlayer[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddLastPlayer[i].odd : this.props.convertOddToAmerican(oddLastPlayer[i].odd)}</span>
                </Button></td>{tdLastPlayer}</tr>);
                tdLastPlayer = [];
              }else{
                tdLastPlayer.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Player To Score',oddLastPlayer[i].marketType,"lastplayertoscore");  } }>
                  <span className="sport-factor">{!empty(oddLastPlayer[i]) ? oddLastPlayer[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddLastPlayer[i].odd : this.props.convertOddToAmerican(oddLastPlayer[i].odd)} </span>
                </Button></td>);
              }
              if(x==oddLastPlayer.length && !empty(tdLastPlayer)){
                trLastPlayer.push(<tr>{tdLastPlayer}<td colSpan={3-tdLastPlayer.length}>{' '}</td></tr>);
                tdLastPlayer = []; 
              }
            }
        }
        
        let oddPlayerScoreAnytime = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Player To Score In Anytime')): null;
        let trPlayerScoreAnytime = [];
        let tdPlayerScoreAnytime = [];
        if(!empty(oddPlayerScoreAnytime)){
          for(let i=0; i < oddPlayerScoreAnytime.length; i++){
            let x = i+1;  
              if(x%3==0){
                trPlayerScoreAnytime.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Score In Anytime',oddPlayerScoreAnytime[i].marketType,"playertoscoreanytime");  } }>
                  <span className="sport-factor">{!empty(oddPlayerScoreAnytime[i]) ? oddPlayerScoreAnytime[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerScoreAnytime[i].odd : this.props.convertOddToAmerican(oddPlayerScoreAnytime[i].odd)}</span>
                </Button></td>{tdPlayerScoreAnytime}</tr>);
                tdPlayerScoreAnytime = [];
              }else{
                tdPlayerScoreAnytime.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Score In Anytime',oddPlayerScoreAnytime[i].marketType,"playertoscoreanytime");  } }>
                  <span className="sport-factor">{!empty(oddPlayerScoreAnytime[i]) ? oddPlayerScoreAnytime[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerScoreAnytime[i].odd : this.props.convertOddToAmerican(oddPlayerScoreAnytime[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerScoreAnytime.length && !empty(tdPlayerScoreAnytime)){
                trPlayerScoreAnytime.push(<tr>{tdPlayerScoreAnytime}<td colSpan={3-tdPlayerScoreAnytime.length}>{' '}</td></tr>);
                tdPlayerScoreAnytime = []; 
              }
            }
        }

        let oddPlayerScore2Goals = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Player To Score 2 Or More Goals')): null;
        let trPlayerScore2Goals = [];
        let tdPlayerScore2Goals = [];
        if(!empty(oddPlayerScore2Goals)){
          for(let i=0; i < oddPlayerScore2Goals.length; i++){
            let x = i+1;  
              if(x%3==0){
                trPlayerScore2Goals.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Score 2 Or More Goals',oddPlayerScore2Goals[i].marketType,"playertoscore2goals");  } }>
                  <span className="sport-factor">{!empty(oddPlayerScore2Goals[i]) ? oddPlayerScore2Goals[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerScore2Goals[i].odd : this.props.convertOddToAmerican(oddPlayerScore2Goals[i].odd)}</span>
                </Button></td>{tdPlayerScore2Goals}</tr>);
                tdPlayerScore2Goals = [];
              }else{
                tdPlayerScore2Goals.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Score 2 Or More Goals',oddPlayerScore2Goals[i].marketType,"playertoscore2goals");  } }>
                  <span className="sport-factor">{!empty(oddPlayerScore2Goals[i]) ? oddPlayerScore2Goals[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerScore2Goals[i].odd : this.props.convertOddToAmerican(oddPlayerScore2Goals[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerScore2Goals.length && !empty(tdPlayerScore2Goals)){
                trPlayerScore2Goals.push(<tr>{tdPlayerScore2Goals}<td colSpan={3-tdPlayerScore2Goals.length}>{' '}</td></tr>);
                tdPlayerScore2Goals = []; 
              }
            }
        }

        let oddPlayerScore3Goals = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Player To Score 3 Or More Goals')): null;
        let trPlayerScore3Goals = [];
        let tdPlayerScore3Goals = [];
        if(!empty(oddPlayerScore3Goals)){
          for(let i=0; i < oddPlayerScore3Goals.length; i++){
            let x = i+1;  
              if(x%3==0){
                trPlayerScore3Goals.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Score 3 Or More Goals',oddPlayerScore3Goals[i].marketType,"playertoscore3goals");  } }>
                  <span className="sport-factor">{!empty(oddPlayerScore3Goals[i]) ? oddPlayerScore3Goals[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerScore3Goals[i].odd : this.props.convertOddToAmerican(oddPlayerScore3Goals[i].odd)}</span>
                </Button></td>{tdPlayerScore3Goals}</tr>);
                tdPlayerScore3Goals = [];
              }else{
                tdPlayerScore3Goals.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Score 3 Or More Goals',oddPlayerScore3Goals[i].marketType,"playertoscore3goals");  } }>
                  <span className="sport-factor">{!empty(oddPlayerScore3Goals[i]) ? oddPlayerScore3Goals[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerScore3Goals[i].odd : this.props.convertOddToAmerican(oddPlayerScore3Goals[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerScore3Goals.length && !empty(tdPlayerScore3Goals)){
                trPlayerScore3Goals.push(<tr>{tdPlayerScore3Goals}<td colSpan={3-tdPlayerScore3Goals.length}>{' '}</td></tr>);
                tdPlayerScore3Goals = []; 
              }
            }
        }

        let oddTeamFirstPlayer = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Team First Goalscorer')): null;
        let trTeamFirstPlayer = [];
        let tdTeamFirstPlayer = [];
        if(!empty(oddTeamFirstPlayer)){
          for(let i=0; i < oddTeamFirstPlayer.length; i++){
            let x = i+1;  
              if(x%3==0){
                trTeamFirstPlayer.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Team First Goalscorer',oddTeamFirstPlayer[i].marketType,"teamfirstplayer");  } }>
                  <span className="sport-factor">{!empty(oddTeamFirstPlayer[i]) ? oddTeamFirstPlayer[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddTeamFirstPlayer[i].odd : this.props.convertOddToAmerican(oddTeamFirstPlayer[i].odd)}</span>
                </Button></td>{tdTeamFirstPlayer}</tr>);
                tdTeamFirstPlayer = [];
              }else{
                tdTeamFirstPlayer.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Team First Goalscorer',oddTeamFirstPlayer[i].marketType,"teamfirstplayer");  } }>
                  <span className="sport-factor">{!empty(oddTeamFirstPlayer[i]) ? oddTeamFirstPlayer[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddTeamFirstPlayer[i].odd : this.props.convertOddToAmerican(oddTeamFirstPlayer[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddTeamFirstPlayer.length && !empty(tdTeamFirstPlayer)){
                trTeamFirstPlayer.push(<tr>{tdTeamFirstPlayer}<td colSpan={3-tdTeamFirstPlayer.length}>{' '}</td></tr>);
                tdTeamFirstPlayer = []; 
              }
            }
        }

        let oddTeamLastPlayer = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Team Last Goalscorer')): null;
        let trTeamLastPlayer = [];
        let tdTeamLastPlayer = [];
        if(!empty(oddTeamLastPlayer)){
          for(let i=0; i < oddTeamLastPlayer.length; i++){
            let x = i+1;  
              if(x%3==0){
                trTeamLastPlayer.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Team Last Goalscorer',oddTeamLastPlayer[i].marketType,"teamlastplayer");  } }>
                  <span className="sport-factor">{!empty(oddTeamLastPlayer[i]) ? oddTeamLastPlayer[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddTeamLastPlayer[i].odd : this.props.convertOddToAmerican(oddTeamLastPlayer[i].odd)}</span>
                </Button></td>{tdTeamLastPlayer}</tr>);
                tdTeamLastPlayer = [];
              }else{
                tdTeamLastPlayer.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Team Last Goalscorer',oddTeamLastPlayer[i].marketType,"teamlastplayer");  } }>
                  <span className="sport-factor">{!empty(oddTeamLastPlayer[i]) ? oddTeamLastPlayer[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddTeamLastPlayer[i].odd : this.props.convertOddToAmerican(oddTeamLastPlayer[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddTeamLastPlayer.length && !empty(tdTeamLastPlayer)){
                trTeamLastPlayer.push(<tr>{tdTeamLastPlayer}<td colSpan={3-tdTeamLastPlayer.length}>{' '}</td></tr>);
                tdTeamLastPlayer = []; 
              }
            }
        }

        let oddWinningMarginFirst = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Winning Margin - 1st Half')): null;
        let trWinningMarginFirst = [];
        let tdWinningMarginFirst = [];
        if(!empty(oddWinningMarginFirst)){
          for(let i=0; i < oddWinningMarginFirst.length; i++){
            let marketType1 = oddWinningMarginFirst[i].marketType;
            let x = i+1;  
              if(x%3==0){
                trWinningMarginFirst.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin - 1st Half',oddWinningMarginFirst[i].marketType,"winningmarginfirst");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginFirst[i]) ? oddWinningMarginFirst[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginFirst[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginFirst[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginFirst[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : oddWinningMarginFirst[i].marketType=='X' ? 'Empate' : '' : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginFirst[i].odd : this.props.convertOddToAmerican(oddWinningMarginFirst[i].odd)}</span>
                </Button></td>{tdWinningMarginFirst}</tr>);
                tdWinningMarginFirst = [];
              }else{
                tdWinningMarginFirst.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin - 1st Half',oddWinningMarginFirst[i].marketType,"winningmarginfirst");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginFirst[i]) ? oddWinningMarginFirst[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginFirst[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginFirst[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginFirst[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : oddWinningMarginFirst[i].marketType=='X' ? 'Empate' : ''  : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginFirst[i].odd : this.props.convertOddToAmerican(oddWinningMarginFirst[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddWinningMarginFirst.length && !empty(tdWinningMarginFirst)){
                trWinningMarginFirst.push(<tr>{tdWinningMarginFirst}<td colSpan={3-tdWinningMarginFirst.length}>{' '}</td></tr>);
                tdWinningMarginFirst = []; 
              }
            }
        }

        let oddWinningMarginTeamsFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Winning Margin Teams - 1st Period')): null;
        let trWinningMarginTeamsFirstPeriod = [];
        let tdWinningMarginTeamsFirstPeriod = [];
        if(!empty(oddWinningMarginTeamsFirstPeriod)){
          for(let i=0; i < oddWinningMarginTeamsFirstPeriod.length; i++){
            let marketType1 = oddWinningMarginTeamsFirstPeriod[i].marketType;
            let x = i+1;  
              if(x%3==0){
                trWinningMarginTeamsFirstPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin Teams - 1st Period',oddWinningMarginTeamsFirstPeriod[i].marketType,"winningmarginteamsfirstperiod");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginTeamsFirstPeriod[i]) ? oddWinningMarginTeamsFirstPeriod[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginTeamsFirstPeriod[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginTeamsFirstPeriod[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginTeamsFirstPeriod[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : oddWinningMarginTeamsFirstPeriod[i].marketType=='X' ? 'Empate' : '' : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginTeamsFirstPeriod[i].odd : this.props.convertOddToAmerican(oddWinningMarginTeamsFirstPeriod[i].odd)}</span>
                </Button></td>{tdWinningMarginTeamsFirstPeriod}</tr>);
                tdWinningMarginTeamsFirstPeriod = [];
              }else{
                tdWinningMarginTeamsFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin Teams - 1st Period',oddWinningMarginTeamsFirstPeriod[i].marketType,"winningmarginteamsfirstperiod");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginTeamsFirstPeriod[i]) ? oddWinningMarginTeamsFirstPeriod[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginTeamsFirstPeriod[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginTeamsFirstPeriod[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginTeamsFirstPeriod[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : oddWinningMarginTeamsFirstPeriod[i].marketType=='X' ? 'Empate' : ''  : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginTeamsFirstPeriod[i].odd : this.props.convertOddToAmerican(oddWinningMarginTeamsFirstPeriod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddWinningMarginTeamsFirstPeriod.length && !empty(tdWinningMarginTeamsFirstPeriod)){
                trWinningMarginTeamsFirstPeriod.push(<tr>{tdWinningMarginTeamsFirstPeriod}<td colSpan={3-tdWinningMarginTeamsFirstPeriod.length}>{' '}</td></tr>);
                tdWinningMarginTeamsFirstPeriod = []; 
              }
            }
        }

        let oddWinningMarginExact = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Winning Margin Exact')): null;
        let trWinningMarginExact = [];
        let tdWinningMarginExact = [];
        if(!empty(oddWinningMarginExact)){
          for(let i=0; i < oddWinningMarginExact.length; i++){
            let marketType1 = oddWinningMarginExact[i].marketType;
            let x = i+1;  
              if(x%3==0){
                trWinningMarginExact.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin Exact',oddWinningMarginExact[i].marketType,"winningmarginexact");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginExact[i]) ? oddWinningMarginExact[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginExact[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginExact[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginExact[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : '' : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginExact[i].odd : this.props.convertOddToAmerican(oddWinningMarginExact[i].odd)}</span>
                </Button></td>{tdWinningMarginExact}</tr>);
                tdWinningMarginExact = [];
              }else{
                tdWinningMarginExact.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin Exact',oddWinningMarginExact[i].marketType,"winningmarginexact");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginExact[i]) ? oddWinningMarginExact[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginExact[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginExact[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginExact[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : '' : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginExact[i].odd : this.props.convertOddToAmerican(oddWinningMarginExact[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddWinningMarginExact.length && !empty(tdWinningMarginExact)){
                trWinningMarginExact.push(<tr>{tdWinningMarginExact}<td colSpan={3-tdWinningMarginExact.length}>{' '}</td></tr>);
                tdWinningMarginExact = []; 
              }
            }
        }

        let oddWinningMarginOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Winning Margin - Teams Including Overtime')): null;
        let trWinningMarginOT = [];
        let tdWinningMarginOT = [];
        if(!empty(oddWinningMarginOT)){
          for(let i=0; i < oddWinningMarginOT.length; i++){
            let marketType1 = oddWinningMarginOT[i].marketType;
            let x = i+1;  
              if(x%3==0){
                trWinningMarginOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin - Teams Including Overtime',oddWinningMarginOT[i].marketType,"winningmarginot");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginOT[i]) ? oddWinningMarginOT[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginOT[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginOT[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginOT[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : '' : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginOT[i].odd : this.props.convertOddToAmerican(oddWinningMarginOT[i].odd)}</span>
                </Button></td>{tdWinningMarginOT}</tr>);
                tdWinningMarginOT = [];
              }else{
                tdWinningMarginOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin - Teams Including Overtime',oddWinningMarginOT[i].marketType,"winningmarginot");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginOT[i]) ? oddWinningMarginOT[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginOT[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginOT[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginOT[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : '' : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginOT[i].odd : this.props.convertOddToAmerican(oddWinningMarginOT[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddWinningMarginOT.length && !empty(tdWinningMarginOT)){
                trWinningMarginOT.push(<tr>{tdWinningMarginOT}<td colSpan={3-tdWinningMarginOT.length}>{' '}</td></tr>);
                tdWinningMarginOT = []; 
              }
            }
        }

        let odd3WayWinningMarginOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='3-Way Winning Margin Range Including Overtime')): null;
        let tr3WayWinningMarginOT = [];
        let td3WayWinningMarginOT = [];
        if(!empty(odd3WayWinningMarginOT)){
          for(let i=0; i < odd3WayWinningMarginOT.length; i++){
            let marketType1 = odd3WayWinningMarginOT[i].marketType;
            let x = i+1;  
              if(x%3==0){
                tr3WayWinningMarginOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'3-Way Winning Margin Range Including Overtime', odd3WayWinningMarginOT[i].marketType,odd3WayWinningMarginOT[i].factorExtra,"3waywinningmarginot" );  } }>
                  <span className="sport-factor">{!empty(odd3WayWinningMarginOT[i]) ? odd3WayWinningMarginOT[i].marketType=='1' ? events[0].eventHome  : odd3WayWinningMarginOT[i].marketType=='2' ? events[0].eventAway :  '' : ''}{' '}{!empty(odd3WayWinningMarginOT[i]) ? odd3WayWinningMarginOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd3WayWinningMarginOT[i].odd : this.props.convertOddToAmerican(odd3WayWinningMarginOT[i].odd)}</span>
                </Button></td>{td3WayWinningMarginOT}</tr>);
                td3WayWinningMarginOT = [];
              }else{
                td3WayWinningMarginOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'3-Way Winning Margin Range Including Overtime', odd3WayWinningMarginOT[i].marketType,odd3WayWinningMarginOT[i].factorExtra,"3waywinningmarginot" );  } }>
                <span className="sport-factor">{!empty(odd3WayWinningMarginOT[i]) ? odd3WayWinningMarginOT[i].marketType=='1' ? events[0].eventHome  : odd3WayWinningMarginOT[i].marketType=='2' ? events[0].eventAway :  '' : ''}{' '}{!empty(odd3WayWinningMarginOT[i]) ? odd3WayWinningMarginOT[i].factorExtra : ''}</span>
                <span className="sport-odd">{'  '}{showOdds == 'D' ? odd3WayWinningMarginOT[i].odd : this.props.convertOddToAmerican(odd3WayWinningMarginOT[i].odd)}</span>
              </Button></td>);
              }
              if(x==odd3WayWinningMarginOT.length && !empty(td3WayWinningMarginOT)){
                tr3WayWinningMarginOT.push(<tr>{td3WayWinningMarginOT}<td colSpan={3-td3WayWinningMarginOT.length}>{' '}</td></tr>);
                td3WayWinningMarginOT = []; 
              }
            }
        }

        let oddFirstGoalTime = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='First Goal Time')): null;
        let trFirstGoalTime = [];
        let tdFirstGoalTime = [];
        if(!empty(oddFirstGoalTime)){
          for(let i=0; i < oddFirstGoalTime.length; i++){
            let x = i+1;  
              if(x%2==0){
                trFirstGoalTime.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Goal Time',oddFirstGoalTime[i].marketType,"firstgoaltime");  } }>
                  <span className="sport-factor">{!empty(oddFirstGoalTime[i]) ? oddFirstGoalTime[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstGoalTime[i].odd : this.props.convertOddToAmerican(oddFirstGoalTime[i].odd)}</span>
                </Button></td>{tdFirstGoalTime}</tr>);
                tdFirstGoalTime = [];
              }else{
                tdFirstGoalTime.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Goal Time',oddFirstGoalTime[i].marketType,"firstgoaltime");  } }>
                  <span className="sport-factor">{!empty(oddFirstGoalTime[i]) ? oddFirstGoalTime[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstGoalTime[i].odd : this.props.convertOddToAmerican(oddFirstGoalTime[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddFirstGoalTime.length && !empty(tdFirstGoalTime)){
                trFirstGoalTime.push(<tr>{tdFirstGoalTime}<td colSpan={4-tdFirstGoalTime.length}>{' '}</td></tr>);
                tdFirstGoalTime = []; 
              }
            }
        }

        let odd1x2BothTeamsToScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1X2 And Both Teams To Score')): null;
        let tr1x2BothTeamsToScore = [];
        let td1x2BothTeamsToScore = [];
        if(!empty(odd1x2BothTeamsToScore)){
          for(let i=0; i < odd1x2BothTeamsToScore.length; i++){
            let x = i+1;  
              if(x%2==0){
                tr1x2BothTeamsToScore.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1X2 And Both Teams To Score',odd1x2BothTeamsToScore[i].marketType,"1x2bothteamstoscore");  } }>
                  <span className="sport-factor">{!empty(odd1x2BothTeamsToScore[i]) ? translateDescription("1x2bothteamstoscore",events[0].eventHome,events[0].eventAway,0,odd1x2BothTeamsToScore[i].marketType,0,'') : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd1x2BothTeamsToScore[i].odd : this.props.convertOddToAmerican(odd1x2BothTeamsToScore[i].odd)}</span>
                </Button></td>{td1x2BothTeamsToScore}</tr>);
                td1x2BothTeamsToScore = [];
              }else{
                td1x2BothTeamsToScore.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1X2 And Both Teams To Score',odd1x2BothTeamsToScore[i].marketType,"1x2bothteamstoscore");  } }>
                  <span className="sport-factor">{!empty(odd1x2BothTeamsToScore[i]) ? translateDescription("1x2bothteamstoscore",events[0].eventHome,events[0].eventAway,0,odd1x2BothTeamsToScore[i].marketType,0,'') : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd1x2BothTeamsToScore[i].odd : this.props.convertOddToAmerican(odd1x2BothTeamsToScore[i].odd)}</span>
                </Button></td>);
              }
              if(x==odd1x2BothTeamsToScore.length && !empty(td1x2BothTeamsToScore)){
                tr1x2BothTeamsToScore.push(<tr>{td1x2BothTeamsToScore}<td colSpan={2-td1x2BothTeamsToScore.length}>{' '}</td></tr>);
                td1x2BothTeamsToScore = []; 
              }
            }
        }

        let oddFirst1x2BothTeamsToScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period 1X2 And Both Teams To Score')): null;
        let trFirst1x2BothTeamsToScore = [];
        let tdFirst1x2BothTeamsToScore = [];
        if(!empty(oddFirst1x2BothTeamsToScore)){
          for(let i=0; i < oddFirst1x2BothTeamsToScore.length; i++){
            let x = i+1;  
              if(x%2==0){
                trFirst1x2BothTeamsToScore.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1st Period 1X2 And Both Teams To Score',oddFirst1x2BothTeamsToScore[i].marketType,"first1x2bothteamstoscore");  } }>
                  <span className="sport-factor">{!empty(oddFirst1x2BothTeamsToScore[i]) ? translateDescription("first1x2bothteamstoscore",events[0].eventHome,events[0].eventAway,0,oddFirst1x2BothTeamsToScore[i].marketType,0,'') : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirst1x2BothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddFirst1x2BothTeamsToScore[i].odd)}</span>
                </Button></td>{tdFirst1x2BothTeamsToScore}</tr>);
                tdFirst1x2BothTeamsToScore = [];
              }else{
                tdFirst1x2BothTeamsToScore.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1st Period 1X2 And Both Teams To Score',oddFirst1x2BothTeamsToScore[i].marketType,"first1x2bothteamstoscore");  } }>
                  <span className="sport-factor">{!empty(oddFirst1x2BothTeamsToScore[i]) ? translateDescription("first1x2bothteamstoscore",events[0].eventHome,events[0].eventAway,0,oddFirst1x2BothTeamsToScore[i].marketType,0,'') : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirst1x2BothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddFirst1x2BothTeamsToScore[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddFirst1x2BothTeamsToScore.length && !empty(tdFirst1x2BothTeamsToScore)){
                trFirst1x2BothTeamsToScore.push(<tr>{tdFirst1x2BothTeamsToScore}<td colSpan={2-tdFirst1x2BothTeamsToScore.length}>{' '}</td></tr>);
                tdFirst1x2BothTeamsToScore = []; 
              }
            }
        }

        let oddRaceToCorners = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Race To Corners')): null;
        let trRaceToCorners = [];
        let tdRaceToCorners = [];
        if(!empty(oddRaceToCorners)){
          for(let i=0; i < oddRaceToCorners.length; i++){
            let x = i+1;  
              if(x%2==0){
                trRaceToCorners.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Race To Corners', oddRaceToCorners[i].marketType,oddRaceToCorners[i].factorExtra,"racestocorners" );  } }>
                  <span className="sport-factor">{translateDescription("racestocorners",events[0].eventHome,events[0].eventAway,0,oddRaceToCorners[i].marketType,oddRaceToCorners[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddRaceToCorners[i].odd : this.props.convertOddToAmerican(oddRaceToCorners[i].odd)}</span>
                </Button></td>{tdRaceToCorners}</tr>);
                tdRaceToCorners = [];
              }else{
                tdRaceToCorners.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Race To Corners',oddRaceToCorners[i].marketType,oddRaceToCorners[i].factorExtra,"racestocorners" );  } }>
                  <span className="sport-factor">{translateDescription("racestocorners",events[0].eventHome,events[0].eventAway,0,oddRaceToCorners[i].marketType,oddRaceToCorners[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddRaceToCorners[i].odd : this.props.convertOddToAmerican(oddRaceToCorners[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddRaceToCorners.length && !empty(tdRaceToCorners)){
                trRaceToCorners.push(<tr>{tdRaceToCorners}<td colSpan={4-tdRaceToCorners.length}>{' '}</td></tr>);
                tdRaceToCorners = []; 
              }
  
            }
        }

        let oddFirstHalfRaceTo = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Half Race To')): null;
        let trFirstHalfRaceTo = [];
        let tdFirstHalfRaceTo = [];
        if(!empty(oddFirstHalfRaceTo)){
          for(let i=0; i < oddFirstHalfRaceTo.length; i++){
            let x = i+1;  
              if(x%2==0){
                trFirstHalfRaceTo.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'1st Half Race To', oddFirstHalfRaceTo[i].marketType,oddFirstHalfRaceTo[i].factorExtra,"firsthalfraceto" );  } }>
                  <span className="sport-factor">{translateDescription("firsthalfraceto",events[0].eventHome,events[0].eventAway,0,oddFirstHalfRaceTo[i].marketType,oddFirstHalfRaceTo[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstHalfRaceTo[i].odd : this.props.convertOddToAmerican(oddFirstHalfRaceTo[i].odd)}</span>
                </Button></td>{tdFirstHalfRaceTo}</tr>);
                tdFirstHalfRaceTo = [];
              }else{
                tdFirstHalfRaceTo.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'1st Half Race To',oddFirstHalfRaceTo[i].marketType,oddFirstHalfRaceTo[i].factorExtra,"firsthalfraceto" );  } }>
                  <span className="sport-factor">{translateDescription("firsthalfraceto",events[0].eventHome,events[0].eventAway,0,oddFirstHalfRaceTo[i].marketType,oddFirstHalfRaceTo[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstHalfRaceTo[i].odd : this.props.convertOddToAmerican(oddFirstHalfRaceTo[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddFirstHalfRaceTo.length && !empty(tdFirstHalfRaceTo)){
                trFirstHalfRaceTo.push(<tr>{tdFirstHalfRaceTo}<td colSpan={4-tdFirstHalfRaceTo.length}>{' '}</td></tr>);
                tdFirstHalfRaceTo = []; 
              }
  
            }
        }

        let oddSecondHalfRaceToOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='2nd Half Race To - Including Overtime')): null;
        let trSecondHalfRaceToOT = [];
        let tdSecondHalfRaceToOT = [];
        if(!empty(oddSecondHalfRaceToOT)){
          for(let i=0; i < oddSecondHalfRaceToOT.length; i++){
            let x = i+1;  
              if(x%2==0){
                trSecondHalfRaceToOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'2nd Half Race To - Including Overtime', oddSecondHalfRaceToOT[i].marketType,oddSecondHalfRaceToOT[i].factorExtra,"secondhalfracetoot" );  } }>
                  <span className="sport-factor">{translateDescription("secondhalfracetoot",events[0].eventHome,events[0].eventAway,0,oddSecondHalfRaceToOT[i].marketType,oddSecondHalfRaceToOT[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddSecondHalfRaceToOT[i].odd : this.props.convertOddToAmerican(oddSecondHalfRaceToOT[i].odd)}</span>
                </Button></td>{tdSecondHalfRaceToOT}</tr>);
                tdSecondHalfRaceToOT = [];
              }else{
                tdSecondHalfRaceToOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'2nd Half Race To - Including Overtime',oddSecondHalfRaceToOT[i].marketType,oddSecondHalfRaceToOT[i].factorExtra,"secondhalfracetoot" );  } }>
                  <span className="sport-factor">{translateDescription("secondhalfracetoot",events[0].eventHome,events[0].eventAway,0,oddSecondHalfRaceToOT[i].marketType,oddSecondHalfRaceToOT[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddSecondHalfRaceToOT[i].odd : this.props.convertOddToAmerican(oddSecondHalfRaceToOT[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddSecondHalfRaceToOT.length && !empty(tdSecondHalfRaceToOT)){
                trSecondHalfRaceToOT.push(<tr>{tdSecondHalfRaceToOT}<td colSpan={4-tdSecondHalfRaceToOT.length}>{' '}</td></tr>);
                tdSecondHalfRaceToOT = []; 
              }
  
            }
        }

        let oddFirstPeriodRaceTo = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Race To')): null;
        let trFirstPeriodRaceTo = [];
        let tdFirstPeriodRaceTo = [];
        if(!empty(oddFirstPeriodRaceTo)){
          for(let i=0; i < oddFirstPeriodRaceTo.length; i++){
            let x = i+1;  
              if(x%2==0){
                trFirstPeriodRaceTo.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'1st Period Race To', oddFirstPeriodRaceTo[i].marketType,oddFirstPeriodRaceTo[i].factorExtra,"firstperiodraceto" );  } }>
                  <span className="sport-factor">{translateDescription("firstperiodraceto",events[0].eventHome,events[0].eventAway,0,oddFirstPeriodRaceTo[i].marketType,oddFirstPeriodRaceTo[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstPeriodRaceTo[i].odd : this.props.convertOddToAmerican(oddFirstPeriodRaceTo[i].odd)}</span>
                </Button></td>{tdFirstPeriodRaceTo}</tr>);
                tdFirstPeriodRaceTo = [];
              }else{
                tdFirstPeriodRaceTo.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'1st Period Race To',oddFirstPeriodRaceTo[i].marketType,oddFirstPeriodRaceTo[i].factorExtra,"firstperiodraceto" );  } }>
                  <span className="sport-factor">{translateDescription("firstperiodraceto",events[0].eventHome,events[0].eventAway,0,oddFirstPeriodRaceTo[i].marketType,oddFirstPeriodRaceTo[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstPeriodRaceTo[i].odd : this.props.convertOddToAmerican(oddFirstPeriodRaceTo[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddFirstPeriodRaceTo.length && !empty(tdFirstPeriodRaceTo)){
                trFirstPeriodRaceTo.push(<tr>{tdFirstPeriodRaceTo}<td colSpan={4-tdFirstPeriodRaceTo.length}>{' '}</td></tr>);
                tdFirstPeriodRaceTo = []; 
              }
  
            }
        }

        let oddRaceToOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Race To Including Overtime')): null;
        let trRaceToOT = [];
        let tdRaceToOT = [];
        if(!empty(oddRaceToOT)){
          for(let i=0; i < oddRaceToOT.length; i++){
            let x = i+1;  
              if(x%2==0){
                trRaceToOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Race To Including Overtime', oddRaceToOT[i].marketType,oddRaceToOT[i].factorExtra,"racetoot" );  } }>
                  <span className="sport-factor">{translateDescription("racetoot",events[0].eventHome,events[0].eventAway,0,oddRaceToOT[i].marketType,oddRaceToOT[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddRaceToOT[i].odd : this.props.convertOddToAmerican(oddRaceToOT[i].odd)}</span>
                </Button></td>{tdRaceToOT}</tr>);
                tdRaceToOT = [];
              }else{
                tdRaceToOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Race To Including Overtime',oddRaceToOT[i].marketType,oddRaceToOT[i].factorExtra,"racetoot" );  } }>
                  <span className="sport-factor">{translateDescription("racetoot",events[0].eventHome,events[0].eventAway,0,oddRaceToOT[i].marketType,oddRaceToOT[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddRaceToOT[i].odd : this.props.convertOddToAmerican(oddRaceToOT[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddRaceToOT.length && !empty(trRaceToOT)){
                trRaceToCorners.push(<tr>{tdRaceToOT}<td colSpan={4-tdRaceToOT.length}>{' '}</td></tr>);
                trRaceToOT = []; 
              }
  
            }
        }

        let oddFirstPeriodWinner = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Winner')): null;

        
        let tdFirstPeriodWinner1 = []; 
        let tdFirstPeriodWinnerX = []; 
        let tdFirstPeriodWinner2 = []; 
        if(!empty(oddFirstPeriodWinner)){

          for(let i=0; i < oddFirstPeriodWinner.length; i++){
            if(oddFirstPeriodWinner[i].marketType=='1' && empty(tdFirstPeriodWinner1)){
              tdFirstPeriodWinner1.push(<td className={'text-center'}>{!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventHome : ''}</span> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : ''}</td>)
            }
            if(oddFirstPeriodWinner[i].marketType=='X'  && empty(tdFirstPeriodWinnerX)){
              tdFirstPeriodWinnerX.push(<td className={'text-center'}>{!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : ''}</td>)
            }
            if(oddFirstPeriodWinner[i].marketType=='2' && empty(tdFirstPeriodWinner2)){
              tdFirstPeriodWinner2.push(<td className={'text-center'}>{!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventAway : ''}</span> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddSecondPeriodWinner = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='2nd Period Winner')): null;

        
        let tdSecondPeriodWinner1 = []; 
        let tdSecondPeriodWinnerX = []; 
        let tdSecondPeriodWinner2 = []; 
        if(!empty(oddSecondPeriodWinner)){

          for(let i=0; i < oddSecondPeriodWinner.length; i++){
            if(oddSecondPeriodWinner[i].marketType=='1' && empty(tdSecondPeriodWinner1)){
              tdSecondPeriodWinner1.push(<td className={'text-center'}>{!empty(oddSecondPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '2nd Period Winner',oddSecondPeriodWinner[i].marketType,'secondperiodwinner');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventHome : ''}</span> {showOdds == 'D' ? oddSecondPeriodWinner[i].odd : this.props.convertOddToAmerican(oddSecondPeriodWinner[i].odd)} </Button> : ''}</td>)
            }
            if(oddSecondPeriodWinner[i].marketType=='X'  && empty(tdSecondPeriodWinnerX)){
              tdSecondPeriodWinnerX.push(<td className={'text-center'}>{!empty(oddSecondPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '2nd Period Winner',oddSecondPeriodWinner[i].marketType,'secondperiodwinner');  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? oddSecondPeriodWinner[i].odd : this.props.convertOddToAmerican(oddSecondPeriodWinner[i].odd)}</Button> : ''}</td>)
            }
            if(oddSecondPeriodWinner[i].marketType=='2' && empty(tdSecondPeriodWinner2)){
              tdSecondPeriodWinner2.push(<td className={'text-center'}>{!empty(oddSecondPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '2nd Period Winner',oddSecondPeriodWinner[i].marketType,'secondperiodwinner');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventAway : ''}</span> {showOdds == 'D' ? oddSecondPeriodWinner[i].odd : this.props.convertOddToAmerican(oddSecondPeriodWinner[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddPlayerToBeBooked = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Player To Be Booked')): null;
        let trPlayerToBeBooked = [];
        let tdPlayerToBeBooked = [];
        if(!empty(oddPlayerToBeBooked)){
          for(let i=0; i < oddPlayerToBeBooked.length; i++){
            let x = i+1;  
              if(x%3==0){
                trPlayerToBeBooked.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Be Booked',oddPlayerToBeBooked[i].marketType,"playertobebooked");  } }>
                  <span className="sport-factor">{!empty(oddPlayerToBeBooked[i]) ? oddPlayerToBeBooked[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerToBeBooked[i].odd : this.props.convertOddToAmerican(oddPlayerToBeBooked[i].odd)}</span>
                </Button></td>{tdPlayerToBeBooked}</tr>);
                tdPlayerToBeBooked = [];
              }else{
                tdPlayerToBeBooked.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Be Booked',oddPlayerToBeBooked[i].marketType,"playertobebooked");  } }>
                  <span className="sport-factor">{!empty(oddPlayerToBeBooked[i]) ? oddPlayerToBeBooked[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerToBeBooked[i].odd : this.props.convertOddToAmerican(oddPlayerToBeBooked[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerToBeBooked.length && !empty(tdPlayerToBeBooked)){
                trPlayerToBeBooked.push(<tr>{tdPlayerToBeBooked}<td colSpan={3-tdPlayerToBeBooked.length}>{' '}</td></tr>);
                tdPlayerToBeBooked = []; 
              }
            }
        }

        let oddPlayerToBeSentOff = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Player To Be Sent Off')): null;
        let trPlayerToBeSentOff = [];
        let tdPlayerToBeSentOff = [];
        if(!empty(oddPlayerToBeSentOff)){
          for(let i=0; i < oddPlayerToBeSentOff.length; i++){
            let x = i+1;  
              if(x%3==0){
                trPlayerToBeSentOff.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Be Sent Off',oddPlayerToBeSentOff[i].marketType,"playertobesentoff");  } }>
                  <span className="sport-factor">{!empty(oddPlayerToBeSentOff[i]) ? oddPlayerToBeSentOff[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerToBeSentOff[i].odd : this.props.convertOddToAmerican(oddPlayerToBeSentOff[i].odd)}</span>
                </Button></td>{tdPlayerToBeSentOff}</tr>);
                tdPlayerToBeSentOff = [];
              }else{
                tdPlayerToBeSentOff.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Player To Be Sent Off',oddPlayerToBeSentOff[i].marketType,"playertobesentoff");  } }>
                  <span className="sport-factor">{!empty(oddPlayerToBeSentOff[i]) ? oddPlayerToBeSentOff[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerToBeSentOff[i].odd : this.props.convertOddToAmerican(oddPlayerToBeSentOff[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerToBeSentOff.length && !empty(tdPlayerToBeSentOff)){
                trPlayerToBeSentOff.push(<tr>{tdPlayerToBeSentOff}<td colSpan={3-tdPlayerToBeSentOff.length}>{' '}</td></tr>);
                tdPlayerToBeSentOff = []; 
              }
            }
        }

        let oddGoalsRange = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Goals Range')): null;
        let trGoalsRange = [];
        let tdGoalsRange = [];
        if(!empty(oddGoalsRange)){
          for(let i=0; i < oddGoalsRange.length; i++){
            let x = i+1;  
              if(x%3==0){
                trGoalsRange.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Goals Range',oddGoalsRange[i].marketType,"goalsrange");  } }>
                  <span className="sport-factor">{!empty(oddGoalsRange[i]) ? oddGoalsRange[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddGoalsRange[i].odd : this.props.convertOddToAmerican(oddGoalsRange[i].odd)}</span>
                </Button></td>{tdGoalsRange}</tr>);
                tdGoalsRange = [];
              }else{
                tdGoalsRange.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Goals Range',oddGoalsRange[i].marketType,"goalsrange");  } }>
                  <span className="sport-factor">{!empty(oddGoalsRange[i]) ? oddGoalsRange[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddGoalsRange[i].odd : this.props.convertOddToAmerican(oddGoalsRange[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddGoalsRange.length && !empty(tdGoalsRange)){
                trGoalsRange.push(<tr>{tdGoalsRange}<td colSpan={3-tdGoalsRange.length}>{' '}</td></tr>);
                tdGoalsRange = []; 
              }
            }
        }

        let oddHighestScoringHalf = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Highest Scoring Half')): null;

        
        let tdHighestScoringHalf1 = []; 
        let tdHighestScoringHalfX = []; 
        let tdHighestScoringHalf2 = []; 
        if(!empty(oddHighestScoringHalf)){

          for(let i=0; i < oddHighestScoringHalf.length; i++){
            if(oddHighestScoringHalf[i].marketType=='1st Half' && empty(tdHighestScoringHalf1)){
              tdHighestScoringHalf1.push(<td className={'text-center'}>{!empty(oddHighestScoringHalf) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Highest Scoring Half',oddHighestScoringHalf[i].marketType,'highestscoringhalf');  } }><span className="sport-factor">{'1era. Mitad'}</span> {showOdds == 'D' ? oddHighestScoringHalf[i].odd : this.props.convertOddToAmerican(oddHighestScoringHalf[i].odd)}</Button> : ''}</td>)
            }
            if(oddHighestScoringHalf[i].marketType=='2nd Half' && empty(tdHighestScoringHalf2)){
              tdHighestScoringHalf2.push(<td className={'text-center'}>{!empty(oddHighestScoringHalf) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Highest Scoring Half',oddHighestScoringHalf[i].marketType,'highestscoringhalf');  } }><span className="sport-factor">{'2da. Mitad'}</span> {showOdds == 'D' ? oddHighestScoringHalf[i].odd : this.props.convertOddToAmerican(oddHighestScoringHalf[i].odd)}</Button> : ''}</td>)
            }
            if(oddHighestScoringHalf[i].marketType=='All Periods The Same' && empty(tdHighestScoringHalfX)){
              tdHighestScoringHalfX.push(<td className={'text-center'}>{!empty(oddHighestScoringHalf) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Highest Scoring Half',oddHighestScoringHalf[i].marketType,'highestscoringhalf');  } }><span className="sport-factor">{'Ambos periodos iguales'}</span> {oddHighestScoringHalf[i].odd}</Button> : ''}</td>)
            }
          }

        }

        let oddHalfHomeTeamMoreScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='In Which Half Home Team Will Score More Goals?')): null;

        let tdHalfHomeTeamMoreScore1 = []; 
        let tdHalfHomeTeamMoreScoreX = []; 
        let tdHalfHomeTeamMoreScore2 = []; 
        if(!empty(oddHalfHomeTeamMoreScore)){

          for(let i=0; i < oddHalfHomeTeamMoreScore.length; i++){
            if(oddHalfHomeTeamMoreScore[i].marketType=='1st Half' && empty(tdHalfHomeTeamMoreScore1)){
              tdHalfHomeTeamMoreScore1.push(<td className={'text-center'}>{!empty(oddHalfHomeTeamMoreScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'In Which Half Home Team Will Score More Goals?',oddHalfHomeTeamMoreScore[i].marketType,'halfhometeammorescore');  } }><span className="sport-factor">{'1era. Mitad'}</span> {showOdds == 'D' ? oddHalfHomeTeamMoreScore[i].odd : this.props.convertOddToAmerican(oddHalfHomeTeamMoreScore[i].odd)} </Button> : ''}</td>)
            }
            if(oddHalfHomeTeamMoreScore[i].marketType=='2nd Half' && empty(tdHalfHomeTeamMoreScore2)){
              tdHalfHomeTeamMoreScore2.push(<td className={'text-center'}>{!empty(oddHalfHomeTeamMoreScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'In Which Half Home Team Will Score More Goals?',oddHalfHomeTeamMoreScore[i].marketType,'halfhometeammorescore');  } }><span className="sport-factor">{'2da. Mitad'}</span> {showOdds == 'D' ? oddHalfHomeTeamMoreScore[i].odd : this.props.convertOddToAmerican(oddHalfHomeTeamMoreScore[i].odd)} </Button> : ''}</td>)
            }
            if(oddHalfHomeTeamMoreScore[i].marketType=='All Periods The Same' && empty(tdHalfHomeTeamMoreScoreX)){
              tdHalfHomeTeamMoreScoreX.push(<td className={'text-center'}>{!empty(oddHalfHomeTeamMoreScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'In Which Half Home Team Will Score More Goals?',oddHalfHomeTeamMoreScore[i].marketType,'halfhometeammorescore');  } }><span className="sport-factor">{'Ambos períodos iguales'}</span> {showOdds == 'D' ? oddHalfHomeTeamMoreScore[i].odd : this.props.convertOddToAmerican(oddHalfHomeTeamMoreScore[i].odd)} </Button> : ''}</td>)
            }
          }

        }

        let oddHalfAwayTeamMoreScore = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='In Which Half Away Team Will Score More Goals?')): null;

        let tdHalfAwayTeamMoreScore1 = []; 
        let tdHalfAwayTeamMoreScoreX = []; 
        let tdHalfAwayTeamMoreScore2 = []; 
        if(!empty(oddHalfAwayTeamMoreScore)){

          for(let i=0; i < oddHalfAwayTeamMoreScore.length; i++){
            if(oddHalfAwayTeamMoreScore[i].marketType=='1st Half' && empty(tdHalfAwayTeamMoreScore1)){
              tdHalfAwayTeamMoreScore1.push(<td className={'text-center'}>{!empty(oddHalfAwayTeamMoreScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'In Which Half Away Team Will Score More Goals?',oddHalfAwayTeamMoreScore[i].marketType,'halfawayteammorescore');  } }><span className="sport-factor">{'1era. Mitad'}</span> {showOdds == 'D' ? oddHalfAwayTeamMoreScore[i].odd : this.props.convertOddToAmerican(oddHalfAwayTeamMoreScore[i].odd)} </Button> : ''}</td>)
            }
            if(oddHalfAwayTeamMoreScore[i].marketType=='2nd Half' && empty(tdHalfAwayTeamMoreScore2)){
              tdHalfAwayTeamMoreScore2.push(<td className={'text-center'}>{!empty(oddHalfAwayTeamMoreScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'In Which Half Away Team Will Score More Goals?',oddHalfAwayTeamMoreScore[i].marketType,'halfawayteammorescore');  } }><span className="sport-factor">{'2da. Mitad'}</span> {showOdds == 'D' ? oddHalfAwayTeamMoreScore[i].odd : this.props.convertOddToAmerican(oddHalfAwayTeamMoreScore[i].odd)}</Button> : ''}</td>)
            }
            if(oddHalfAwayTeamMoreScore[i].marketType=='All Periods The Same' && empty(tdHalfAwayTeamMoreScoreX)){
              tdHalfAwayTeamMoreScoreX.push(<td className={'text-center'}>{!empty(oddHalfAwayTeamMoreScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'In Which Half Away Team Will Score More Goals?',oddHalfAwayTeamMoreScore[i].marketType,'halfawayteammorescore');  } }><span className="sport-factor">{'Ambos períodos iguales'}</span> {showOdds == 'D' ? oddHalfAwayTeamMoreScore[i].odd : this.props.convertOddToAmerican(oddHalfAwayTeamMoreScore[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let odd10MinuteResult = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='10 Minute Result')): null;

        
        let td10MinuteResult1 = []; 
        let td10MinuteResultX = []; 
        let td10MinuteResult2 = []; 
        if(!empty(odd10MinuteResult)){

          for(let i=0; i < odd10MinuteResult.length; i++){
            if(odd10MinuteResult[i].marketType=='1' && empty(td10MinuteResult1)){
              td10MinuteResult1.push(<td className={'text-center'}>{!empty(odd10MinuteResult) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '10 Minute Result',odd10MinuteResult[i].marketType,'10minuteresult');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventHome : ''}</span> {showOdds == 'D' ? odd10MinuteResult[i].odd : this.props.convertOddToAmerican(odd10MinuteResult[i].odd)} </Button> : ''}</td>)
            }
            if(odd10MinuteResult[i].marketType=='X'  && empty(td10MinuteResultX)){
              td10MinuteResultX.push(<td className={'text-center'}>{!empty(odd10MinuteResult) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '10 Minute Result',odd10MinuteResult[i].marketType,'10minuteresult');  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? odd10MinuteResult[i].odd : this.props.convertOddToAmerican(odd10MinuteResult[i].odd)}</Button> : ''}</td>)
            }
            if(odd10MinuteResult[i].marketType=='2' && empty(td10MinuteResult2)){
              td10MinuteResult2.push(<td className={'text-center'}>{!empty(odd10MinuteResult) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], '10 Minute Result',odd10MinuteResult[i].marketType,'10minuteresult');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventAway : ''}</span> {showOdds == 'D' ? odd10MinuteResult[i].odd : this.props.convertOddToAmerican(odd10MinuteResult[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let odd10MinuteUnderOver = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='10 Minute Under/Over')): null;
        let tr10MinuteUnderOver = [];
        let td10MinuteUnderOver = [];
        if(!empty(odd10MinuteUnderOver)){
          odd10MinuteUnderOver = orderUnderAndOver(odd10MinuteUnderOver);
          for(let i=0; i < odd10MinuteUnderOver.length; i++){
              let x = i+1;  
              if(x%2==0){
                tr10MinuteUnderOver.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'10 Minute Under/Over',odd10MinuteUnderOver[i].marketType,odd10MinuteUnderOver[i].factorExtra,"10minuteunderover" );  } }>
                  <span className="sport-factor">{!empty(odd10MinuteUnderOver[i]) ? odd10MinuteUnderOver[i].marketType=='Over' ? 'Más de' : odd10MinuteUnderOver[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(odd10MinuteUnderOver[i]) ? odd10MinuteUnderOver[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd10MinuteUnderOver[i].odd : this.props.convertOddToAmerican(odd10MinuteUnderOver[i].odd)} </span>
                </Button></td>{td10MinuteUnderOver}</tr>);
                td10MinuteUnderOver = [];
              }else{
                td10MinuteUnderOver.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'10 Minute Under/Over',odd10MinuteUnderOver[i].marketType,odd10MinuteUnderOver[i].factorExtra,"10minuteunderover" );  } }>
                  <span className="sport-factor">{!empty(odd10MinuteUnderOver[i]) ? odd10MinuteUnderOver[i].marketType=='Over' ? 'Más de' : odd10MinuteUnderOver[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(odd10MinuteUnderOver[i]) ? odd10MinuteUnderOver[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd10MinuteUnderOver[i].odd : this.props.convertOddToAmerican(odd10MinuteUnderOver[i].odd)} </span>
                </Button></td>);
              }

              if(x==odd10MinuteUnderOver.length && !empty(td10MinuteUnderOver)){
                tr10MinuteUnderOver.push(<tr>{td10MinuteUnderOver}<td colSpan={4-td10MinuteUnderOver.length}>{' '}</td></tr>);
                td10MinuteUnderOver = []; 
              }
  
            }
        }

        let odd10MinuteUnderOverCorners = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='10 Minute Under/Over - Corners')): null;
        let tr10MinuteUnderOverCorners = [];
        let td10MinuteUnderOverCorners = [];
        if(!empty(odd10MinuteUnderOverCorners)){
          odd10MinuteUnderOverCorners = orderUnderAndOver(odd10MinuteUnderOverCorners);
          for(let i=0; i < odd10MinuteUnderOverCorners.length; i++){
              let x = i+1;  
              if(x%2==0){
                tr10MinuteUnderOverCorners.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'10 Minute Under/Over - Corners',odd10MinuteUnderOverCorners[i].marketType,odd10MinuteUnderOverCorners[i].factorExtra,"10minuteunderovercorners" );  } }>
                  <span className="sport-factor">{!empty(odd10MinuteUnderOverCorners[i]) ? odd10MinuteUnderOverCorners[i].marketType=='Over' ? 'Más de' : odd10MinuteUnderOverCorners[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(odd10MinuteUnderOverCorners[i]) ? odd10MinuteUnderOverCorners[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd10MinuteUnderOverCorners[i].odd : this.props.convertOddToAmerican(odd10MinuteUnderOverCorners[i].odd)} </span>
                </Button></td>{td10MinuteUnderOverCorners}</tr>);
                td10MinuteUnderOverCorners = [];
              }else{
                td10MinuteUnderOverCorners.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'10 Minute Under/Over - Corners',odd10MinuteUnderOverCorners[i].marketType,odd10MinuteUnderOverCorners[i].factorExtra,"10minuteunderovercorners" );  } }>
                  <span className="sport-factor">{!empty(odd10MinuteUnderOverCorners[i]) ? odd10MinuteUnderOverCorners[i].marketType=='Over' ? 'Más de' : odd10MinuteUnderOverCorners[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(odd10MinuteUnderOverCorners[i]) ? odd10MinuteUnderOverCorners[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd10MinuteUnderOverCorners[i].odd : this.props.convertOddToAmerican(odd10MinuteUnderOverCorners[i].odd)} </span>
                </Button></td>);
              }

              if(x==odd10MinuteUnderOverCorners.length && !empty(td10MinuteUnderOverCorners)){
                tr10MinuteUnderOverCorners.push(<tr>{td10MinuteUnderOverCorners}<td colSpan={4-td10MinuteUnderOverCorners.length}>{' '}</td></tr>);
                td10MinuteUnderOverCorners = []; 
              }
  
            }
        }

        let oddFirstPeriodWinnerHA = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Winner Home/Away')): null;
        let tdFirstPeriodWinnerHAHome = []; 
        let tdFirstPeriodWinnerHAAway = []; 
        if(!empty(oddFirstPeriodWinnerHA)){

          for(let i=0; i < oddFirstPeriodWinnerHA.length; i++){
            if(oddFirstPeriodWinnerHA[i].marketType=='1' && empty(tdFirstPeriodWinnerHAHome)){
              tdFirstPeriodWinnerHAHome.push(<td className={'text-center'}>{!empty(oddFirstPeriodWinnerHA) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1st Period Winner Home/Away',oddFirstPeriodWinnerHA[i].marketType,'firstperiodwinnerha');  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddFirstPeriodWinnerHA[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinnerHA[i].odd)} </Button> : ''}</td>)
            }
            if(oddFirstPeriodWinnerHA[i].marketType=='2' && empty(tdFirstPeriodWinnerHAAway)){
              tdFirstPeriodWinnerHAAway.push(<td className={'text-center'}>{!empty(oddFirstPeriodWinnerHA) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1st Period Winner Home/Away',oddFirstPeriodWinnerHA[i].marketType,'firstperiodwinnerha');  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddFirstPeriodWinnerHA[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinnerHA[i].odd)} </Button> : ''}</td>)
            }
          }

        }

        let oddFirstGoalMethod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='First Goal Method')): null;
        let trFirstGoalMethod = [];
        let tdFirstGoalMethod = [];
        if(!empty(oddFirstGoalMethod)){
          for(let i=0; i < oddFirstGoalMethod.length; i++){
            let x = i+1;  
              if(x%3==0){
                trFirstGoalMethod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Goal Method',oddFirstGoalMethod[i].marketType,"firstgoalmethod");  } }>
                  <span className="sport-factor">{translateDescription("firstgoalmethod","","",0,oddFirstGoalMethod[i].marketType,0,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstGoalMethod[i].odd : this.props.convertOddToAmerican(oddFirstGoalMethod[i].odd)}</span>
                </Button></td>{tdFirstGoalMethod}</tr>);
                tdFirstGoalMethod = [];
              }else{
                tdFirstGoalMethod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Goal Method',oddFirstGoalMethod[i].marketType,"firstgoalmethod");  } }>
                  <span className="sport-factor">{translateDescription("firstgoalmethod","","",0,oddFirstGoalMethod[i].marketType,0,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddFirstGoalMethod[i].odd : this.props.convertOddToAmerican(oddFirstGoalMethod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddFirstGoalMethod.length && !empty(tdFirstGoalMethod)){
                trFirstGoalMethod.push(<tr>{tdFirstGoalMethod}<td colSpan={3-tdFirstGoalMethod.length}>{' '}</td></tr>);
                tdFirstGoalMethod = []; 
              }
            }
        }

        let oddWinningMarginFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Winning Margin - 1st Period')): null;
        let trWinningMarginFirstPeriod = [];
        let tdWinningMarginFirstPeriod = [];
        if(!empty(oddWinningMarginFirstPeriod)){
          for(let i=0; i < oddWinningMarginFirstPeriod.length; i++){
            let marketType1 = oddWinningMarginFirstPeriod[i].marketType;
            let x = i+1;  
              if(x%3==0){
                trWinningMarginFirstPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Winning Margin - 1st Period',oddWinningMarginFirstPeriod[i].marketType,oddWinningMarginFirstPeriod[i].factorExtra,"winningmarginfirstperiod" );  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginFirstPeriod[i]) ? oddWinningMarginFirstPeriod[i].marketType == '1' ? events[0].eventHome  : oddWinningMarginFirstPeriod[i].marketType == '2' ? events[0].eventAway : '' : ''}{' '}{oddWinningMarginFirstPeriod[i].factorExtra}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginFirstPeriod[i].odd : this.props.convertOddToAmerican(oddWinningMarginFirstPeriod[i].odd)}</span>
                </Button></td>{tdWinningMarginFirstPeriod}</tr>);
                tdWinningMarginFirstPeriod = [];
              }else{
                tdWinningMarginFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Winning Margin - 1st Period',oddWinningMarginFirstPeriod[i].marketType,oddWinningMarginFirstPeriod[i].factorExtra,"winningmarginfirstperiod" );  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginFirstPeriod[i]) ? oddWinningMarginFirstPeriod[i].marketType == '1' ? events[0].eventHome  : oddWinningMarginFirstPeriod[i].marketType == '2' ? events[0].eventAway : '' : ''}{' '}{oddWinningMarginFirstPeriod[i].factorExtra}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginFirstPeriod[i].odd : this.props.convertOddToAmerican(oddWinningMarginFirstPeriod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddWinningMarginFirstPeriod.length && !empty(tdWinningMarginFirstPeriod)){
                trWinningMarginFirstPeriod.push(<tr>{tdWinningMarginFirstPeriod}<td colSpan={3-tdWinningMarginFirstPeriod.length}>{' '}</td></tr>);
                tdWinningMarginFirstPeriod = []; 
              }
            }
        }

        let oddMultipleCorners = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Multiple Corners ')): null;
        let trMultipleCorners = [];
        let tdMultipleCorners = [];
        if(!empty(oddMultipleCorners)){
          oddMultipleCorners = orderUnderAndOver(oddMultipleCorners);
          for(let i=0; i < oddMultipleCorners.length; i++){
              let x = i+1;  
              if(x%2==0){
                trMultipleCorners.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Multiple Corners ',oddMultipleCorners[i].marketType,oddMultipleCorners[i].factorExtra,"multiplecorners" );  } }>
                  <span className="sport-factor">{!empty(oddMultipleCorners[i]) ? oddMultipleCorners[i].marketType=='Over' ? 'Más de' : oddMultipleCorners[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddMultipleCorners[i]) ? oddMultipleCorners[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddMultipleCorners[i].odd : this.props.convertOddToAmerican(oddMultipleCorners[i].odd)}</span>
                </Button></td>{tdMultipleCorners}</tr>);
                tdMultipleCorners = [];
              }else{
                tdMultipleCorners.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Multiple Corners ',oddMultipleCorners[i].marketType,oddMultipleCorners[i].factorExtra,"multiplecorners" );  } }>
                  <span className="sport-factor">{!empty(oddMultipleCorners[i]) ? oddMultipleCorners[i].marketType=='Over' ? 'Más de' : oddMultipleCorners[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddMultipleCorners[i]) ? oddMultipleCorners[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddMultipleCorners[i].odd : this.props.convertOddToAmerican(oddMultipleCorners[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddMultipleCorners.length && !empty(tdMultipleCorners)){
                trMultipleCorners.push(<tr>{tdMultipleCorners}<td colSpan={4-tdMultipleCorners.length}>{' '}</td></tr>);
                tdMultipleCorners = []; 
              }
  
            }
        }

        let oddCornersHandicap = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Corners Handicap')): null;
        let trCornersHandicap = [];
        let tdCornersHandicap = [];
        if(!empty(oddCornersHandicap)){
          for(let i=0; i < oddCornersHandicap.length; i++){
              let x = i+1;  
              if(x%2==0){
                trCornersHandicap.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Corners Handicap',oddCornersHandicap[i].marketType,oddCornersHandicap[i].factorExtra,"cornershandicap" );  } }>
                  <span className="sport-factor">{translateDescription("cornershandicap",events[0].eventHome,events[0].eventAway,oddCornersHandicap[i].factor,oddCornersHandicap[i].marketType,oddCornersHandicap[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCornersHandicap[i].odd : this.props.convertOddToAmerican(oddCornersHandicap[i].odd)}</span>
                </Button></td>{tdCornersHandicap}</tr>);
                tdCornersHandicap = [];
              }else{
                tdCornersHandicap.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Corners Handicap',oddCornersHandicap[i].marketType,oddCornersHandicap[i].factorExtra,"cornershandicap" );  } }>
                  <span className="sport-factor">{translateDescription("cornershandicap",events[0].eventHome,events[0].eventAway,oddCornersHandicap[i].factor,oddCornersHandicap[i].marketType,oddCornersHandicap[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCornersHandicap[i].odd : this.props.convertOddToAmerican(oddCornersHandicap[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddCornersHandicap.length && !empty(tdCornersHandicap)){
                trCornersHandicap.push(<tr>{tdCornersHandicap}<td colSpan={4-tdCornersHandicap.length}>{' '}</td></tr>);
                tdCornersHandicap = []; 
              }
  
            }
        }

        let oddFirstMatchCorner = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market==' First Match Corner - 12')): null;
  
        let tdFirstMatchCorner1 = []; 
        let tdFirstMatchCorner2 = []; 
        if(!empty(oddFirstMatchCorner)){

          for(let i=0; i < oddFirstMatchCorner.length; i++){
            if(oddFirstMatchCorner[i].marketType=='1' && empty(tdFirstMatchCorner1)){
              tdFirstMatchCorner1.push(<td className={'text-center'}>{!empty(oddFirstMatchCorner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],' First Match Corner - 12',oddFirstMatchCorner[i].marketType,"firstmatchcorner");  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddFirstMatchCorner[i].odd : this.props.convertOddToAmerican(oddFirstMatchCorner[i].odd)} </Button> : ''}</td>)
            }
            if(oddFirstMatchCorner[i].marketType=='2'  && empty(tdFirstMatchCorner2)){
              tdFirstMatchCorner2.push(<td className={'text-center'}>{!empty(oddFirstMatchCorner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],' First Match Corner - 12',oddFirstMatchCorner[i].marketType,"firstmatchcorner");  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddFirstMatchCorner[i].odd : this.props.convertOddToAmerican(oddFirstMatchCorner[i].odd)} </Button> : ''}</td>)
            }
          }

        }

        let oddLastMatchCorner = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Last Match Corner - 12')): null;
  
        let tdLastMatchCorner1 = []; 
        let tdLastMatchCorner2 = [];
        if(!empty(oddLastMatchCorner)){

          for(let i=0; i < oddLastMatchCorner.length; i++){
            if(oddLastMatchCorner[i].marketType=='1' && empty(tdLastMatchCorner1)){
              tdLastMatchCorner1.push(<td className={'text-center'}>{!empty(oddLastMatchCorner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Match Corner - 12',oddLastMatchCorner[i].marketType,"lastmatchcorner");  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddLastMatchCorner[i].odd : this.props.convertOddToAmerican(oddLastMatchCorner[i].odd)}  </Button> : ''}</td>)
            }
            if(oddLastMatchCorner[i].marketType=='2'  && empty(tdLastMatchCorner2)){
              tdLastMatchCorner2.push(<td className={'text-center'}>{!empty(oddLastMatchCorner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Match Corner - 12',oddLastMatchCorner[i].marketType,"lastmatchcorner");  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddLastMatchCorner[i].odd : this.props.convertOddToAmerican(oddLastMatchCorner[i].odd)}  </Button> : ''}</td>)
            }
          }

        }

        let oddWinningMarginRanges = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Winning Margin Ranges')): null;
        let trWinningMarginRanges = [];
        let tdWinningMarginRanges = [];
        if(!empty(oddWinningMarginRanges)){
          for(let i=0; i < oddWinningMarginRanges.length; i++){
            let x = i+1;  
              if(x%3==0){
                trWinningMarginRanges.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin Ranges',oddWinningMarginRanges[i].marketType,"winningmarginranges");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginRanges[i]) ? oddWinningMarginRanges[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginRanges[i].odd : this.props.convertOddToAmerican(oddWinningMarginRanges[i].odd)}</span>
                </Button></td>{tdWinningMarginRanges}</tr>);
                tdWinningMarginRanges = [];
              }else{
                tdWinningMarginRanges.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin Ranges',oddWinningMarginRanges[i].marketType,"winningmarginranges");  } }>
                  <span className="sport-factor">{!empty(oddWinningMarginRanges[i]) ? oddWinningMarginRanges[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginRanges[i].odd : this.props.convertOddToAmerican(oddWinningMarginRanges[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddWinningMarginRanges.length && !empty(tdWinningMarginRanges)){
                trWinningMarginRanges.push(<tr>{tdWinningMarginRanges}<td colSpan={3-tdWinningMarginRanges.length}>{' '}</td></tr>);
                tdWinningMarginRanges = []; 
              }
            }
        }

        let oddUOEFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Exactly/Over - 1st Period')): null;
        let trUOEFirstPeriod = [];
        let tdUOEFirstPeriod = [];
        if(!empty(oddUOEFirstPeriod)){
          for(let i=0; i < oddUOEFirstPeriod.length; i++){
            let x = i+1;  
              if(x%2==0){
                trUOEFirstPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Exactly/Over - 1st Period', oddUOEFirstPeriod[i].marketType,oddUOEFirstPeriod[i].factorExtra,"uoefirstperiod" );  } }>
                  <span className="sport-factor">{!empty(oddUOEFirstPeriod[i]) ? oddUOEFirstPeriod[i].marketType=='Over' ? 'Más de' : oddUOEFirstPeriod[i].marketType=='Under' ? 'Menos de' : oddUOEFirstPeriod[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddUOEFirstPeriod[i]) ? oddUOEFirstPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOEFirstPeriod[i].odd : this.props.convertOddToAmerican(oddUOEFirstPeriod[i].odd)}</span>
                </Button></td>{tdUOEFirstPeriod}</tr>);
                tdUOEFirstPeriod = [];
              }else{
                tdUOEFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Exactly/Over - 1st Period',oddUOEFirstPeriod[i].marketType,oddUOEFirstPeriod[i].factorExtra,"uoefirstperiod" );  } }>
                  <span className="sport-factor">{!empty(oddUOEFirstPeriod[i]) ? oddUOEFirstPeriod[i].marketType=='Over' ? 'Más de' : oddUOEFirstPeriod[i].marketType=='Under' ? 'Menos de' : oddUOEFirstPeriod[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddUOEFirstPeriod[i]) ? oddUOEFirstPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOEFirstPeriod[i].odd : this.props.convertOddToAmerican(oddUOEFirstPeriod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUOEFirstPeriod.length && !empty(tdUOEFirstPeriod)){
                trUOEFirstPeriod.push(<tr>{tdUOEFirstPeriod}<td colSpan={4-tdUOEFirstPeriod.length}>{' '}</td></tr>);
                tdUOEFirstPeriod = []; 
              }
  
            }
        }

        let oddUOE = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Exactly/Over')): null;
        let trUOE = [];
        let tdUOE = [];
        if(!empty(oddUOE)){
          for(let i=0; i < oddUOE.length; i++){
            let x = i+1;  
              if(x%2==0){
                trUOE.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Exactly/Over', oddUOE[i].marketType,oddUOE[i].factorExtra,"uoe" );  } }>
                  <span className="sport-factor">{!empty(oddUOE[i]) ? oddUOE[i].marketType=='Over' ? 'Más de' : oddUOE[i].marketType=='Under' ? 'Menos de' : oddUOE[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddUOE[i]) ? oddUOE[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOE[i].odd : this.props.convertOddToAmerican(oddUOE[i].odd)}</span>
                </Button></td>{tdUOE}</tr>);
                tdUOE = [];
              }else{
                tdUOE.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Exactly/Over',oddUOE[i].marketType,oddUOE[i].factorExtra,"uoe" );  } }>
                  <span className="sport-factor">{!empty(oddUOE[i]) ? oddUOE[i].marketType=='Over' ? 'Más de' : oddUOE[i].marketType=='Under' ? 'Menos de' : oddUOE[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddUOE[i]) ? oddUOE[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOE[i].odd : this.props.convertOddToAmerican(oddUOE[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUOE.length && !empty(tdUOE)){
                trUOE.push(<tr>{tdUOE}<td colSpan={4-tdUOE.length}>{' '}</td></tr>);
                tdUOE = []; 
              }
  
            }
        }

        let oddHighestScoringPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Highest Scoring Period')): null;
        
        let trHighestScoringPeriod = [];
        let tdHighestScoringPeriod = [];
        if(!empty(oddHighestScoringPeriod)){
          for(let i=0; i < oddHighestScoringPeriod.length; i++){
            let x = i+1;  
              if(x%2==0){
                trHighestScoringPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Highest Scoring Period',oddHighestScoringPeriod[i].marketType,"highestscoringperiod");  } }>
                  <span className="sport-factor">{!empty(oddHighestScoringPeriod[i]) ? (oddHighestScoringPeriod[i].marketType=='1st Period') ? `1er. Período` : (oddHighestScoringPeriod[i].marketType=='2nd Period') ? `2do. Período`: (oddHighestScoringPeriod[i].marketType=='3rd Period') ? `3er. Período` : (oddHighestScoringPeriod[i].marketType=='4th Period') ? `4to. Período` : (oddHighestScoringPeriod[i].marketType=='All Periods The Same') ? `Todos los períodos misma puntuación` : '' : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddHighestScoringPeriod[i].odd : this.props.convertOddToAmerican(oddHighestScoringPeriod[i].odd)}</span>
                </Button></td>{tdHighestScoringPeriod}</tr>);
                tdHighestScoringPeriod = [];
              }else{
                tdHighestScoringPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Highest Scoring Period',oddHighestScoringPeriod[i].marketType,"highestscoringperiod");  } }>
                  <span className="sport-factor">{!empty(oddHighestScoringPeriod[i]) ? (oddHighestScoringPeriod[i].marketType=='1st Period') ? `1er. Período` : (oddHighestScoringPeriod[i].marketType=='2nd Period') ? `2do. Período`: (oddHighestScoringPeriod[i].marketType=='3rd Period') ? `3er. Período` : (oddHighestScoringPeriod[i].marketType=='4th Period') ? `4to. Período` : (oddHighestScoringPeriod[i].marketType=='All Periods The Same') ? `Todos los períodos misma puntuación` : '' : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddHighestScoringPeriod[i].odd : this.props.convertOddToAmerican(oddHighestScoringPeriod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddHighestScoringPeriod.length && !empty(tdHighestScoringPeriod)){
                trHighestScoringPeriod.push(<tr>{tdHighestScoringPeriod}<td colSpan={4-tdHighestScoringPeriod.length}>{' '}</td></tr>);
                tdHighestScoringPeriod = []; 
              }
  
            }
        }

        let oddWillBeAnOwnGoal = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Will Be An Own Goal?')): null;
        
        let tdWillBeAnOwnGoalYes = [];
        let tdWillBeAnOwnGoalNo = [];

        if(!empty(oddWillBeAnOwnGoal)){
          for(let i=0; i < oddWillBeAnOwnGoal.length; i++){
            if(oddWillBeAnOwnGoal[i].marketType=='Yes' && empty(tdWillBeAnOwnGoalYes)){
              tdWillBeAnOwnGoalYes.push(<td className={'text-center'}>{!empty(oddWillBeAnOwnGoal) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will Be An Own Goal?',oddWillBeAnOwnGoal[i].marketType,'willbeanowngoal');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddWillBeAnOwnGoal[i].odd : this.props.convertOddToAmerican(oddWillBeAnOwnGoal[i].odd)}</Button> : ''}</td>)
            }
            if(oddWillBeAnOwnGoal[i].marketType=='No' && empty(tdWillBeAnOwnGoalNo)){
              tdWillBeAnOwnGoalNo.push(<td className={'text-center'}>{!empty(oddWillBeAnOwnGoal) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will Be An Own Goal?',oddWillBeAnOwnGoal[i].marketType,'willbeanowngoal');  } }><span className="sport-factor">{!empty(oddWillBeAnOwnGoal[i]) ? oddWillBeAnOwnGoal[i].marketType : ''}</span> {showOdds == 'D' ? oddWillBeAnOwnGoal[i].odd : this.props.convertOddToAmerican(oddWillBeAnOwnGoal[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddBothScoreFirstHalf = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score Number Of Points - 1st Half')): null;
        let trBothScoreFirstHalf = [];
        let tdBothScoreFirstHalf = [];

        if(!empty(oddBothScoreFirstHalf)){
          for(let i=0; i < oddBothScoreFirstHalf.length; i++){
            let x = i+1;  
              if(x%2==0){
                trBothScoreFirstHalf.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Both Teams To Score Number Of Points - 1st Half', oddBothScoreFirstHalf[i].marketType,oddBothScoreFirstHalf[i].factorExtra,"bothscorefirsthalf" );  } }>
                  <span className="sport-factor">{!empty(oddBothScoreFirstHalf[i]) ? oddBothScoreFirstHalf[i].marketType=='Yes' ? 'Sí' : oddBothScoreFirstHalf[i].marketType : ''} {' '} {oddBothScoreFirstHalf[i].factorExtra}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddBothScoreFirstHalf[i].odd : this.props.convertOddToAmerican(oddBothScoreFirstHalf[i].odd)} </span>
                </Button></td>{tdBothScoreFirstHalf}</tr>);
                tdBothScoreFirstHalf = [];
              }else{
                tdBothScoreFirstHalf.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Both Teams To Score Number Of Points - 1st Half', oddBothScoreFirstHalf[i].marketType,oddBothScoreFirstHalf[i].factorExtra,"bothscorefirsthalf" );  } }>
                <span className="sport-factor">{!empty(oddBothScoreFirstHalf[i]) ? oddBothScoreFirstHalf[i].marketType=='Yes' ? 'Sí' : oddBothScoreFirstHalf[i].marketType : ''} {' '} {oddBothScoreFirstHalf[i].factorExtra}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddBothScoreFirstHalf[i].odd : this.props.convertOddToAmerican(oddBothScoreFirstHalf[i].odd)} </span>
                </Button></td>);
              }
              if(x==oddBothScoreFirstHalf.length && !empty(tdBothScoreFirstHalf)){
                trBothScoreFirstHalf.push(<tr>{tdBothScoreFirstHalf}<td colSpan={4-tdBothScoreFirstHalf.length}>{' '}</td></tr>);
                tdBothScoreFirstHalf = []; 
              }
  
            }
        }

        let oddBothScoreFirstPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score Number Of Points - 1st Period')): null;
        let trBothScoreFirstPeriod = [];
        let tdBothScoreFirstPeriod = [];

        if(!empty(oddBothScoreFirstPeriod)){
          for(let i=0; i < oddBothScoreFirstPeriod.length; i++){
            let x = i+1;  
              if(x%2==0){
                trBothScoreFirstPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Both Teams To Score Number Of Points - 1st Period', oddBothScoreFirstPeriod[i].marketType,oddBothScoreFirstPeriod[i].factorExtra,"bothscorefirsthalf" );  } }>
                  <span className="sport-factor">{!empty(oddBothScoreFirstPeriod[i]) ? oddBothScoreFirstPeriod[i].marketType=='Yes' ? 'Sí' : oddBothScoreFirstPeriod[i].marketType : ''} {' '} {oddBothScoreFirstPeriod[i].factorExtra}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddBothScoreFirstPeriod[i].odd : this.props.convertOddToAmerican(oddBothScoreFirstPeriod[i].odd)}</span>
                </Button></td>{tdBothScoreFirstPeriod}</tr>);
                tdBothScoreFirstPeriod = [];
              }else{
                tdBothScoreFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Both Teams To Score Number Of Points - 1st Period', oddBothScoreFirstPeriod[i].marketType,oddBothScoreFirstPeriod[i].factorExtra,"bothscorefirsthalf" );  } }>
                <span className="sport-factor">{!empty(oddBothScoreFirstPeriod[i]) ? oddBothScoreFirstPeriod[i].marketType=='Yes' ? 'Sí' : oddBothScoreFirstPeriod[i].marketType : ''} {' '} {oddBothScoreFirstPeriod[i].factorExtra}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddBothScoreFirstPeriod[i].odd : this.props.convertOddToAmerican(oddBothScoreFirstPeriod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddBothScoreFirstPeriod.length && !empty(tdBothScoreFirstPeriod)){
                trBothScoreFirstPeriod.push(<tr>{tdBothScoreFirstPeriod}<td colSpan={4-tdBothScoreFirstPeriod.length}>{' '}</td></tr>);
                tdBothScoreFirstPeriod = []; 
              }
  
            }
        }

        let oddRaceTo = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Race To')): null;
        let trRaceTo = [];
        let tdRaceTo = [];
        if(!empty(oddRaceTo)){
          for(let i=0; i < oddRaceTo.length; i++){
            let x = i+1;  
              if(x%2==0){
                trRaceTo.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Race To', oddRaceTo[i].marketType,oddRaceTo[i].factorExtra,"raceto" );  } }>
                  <span className="sport-factor">{translateDescription("raceto",events[0].eventHome,events[0].eventAway,0,oddRaceTo[i].marketType,oddRaceTo[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddRaceTo[i].odd : this.props.convertOddToAmerican(oddRaceTo[i].odd)}</span>
                </Button></td>{tdRaceTo}</tr>);
                tdRaceTo = [];
              }else{
                tdRaceTo.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Race To',oddRaceTo[i].marketType,oddRaceTo[i].factorExtra,"raceto" );  } }>
                  <span className="sport-factor">{translateDescription("raceto",events[0].eventHome,events[0].eventAway,0,oddRaceTo[i].marketType,oddRaceTo[i].factorExtra,'')}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddRaceTo[i].odd : this.props.convertOddToAmerican(oddRaceTo[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddRaceTo.length && !empty(tdRaceTo)){
                trRaceTo.push(<tr>{tdRaceTo}<td colSpan={4-tdRaceTo.length}>{' '}</td></tr>);
                tdRaceTo = []; 
              }
  
            }
        }

        let oddPlayerAssists = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Assists')): null;
        let trPlayerAssists = [];
        let tdPlayerAssists = [];
        if(!empty(oddPlayerAssists)){
          for(let i=0; i < oddPlayerAssists.length; i++){
            let x = i+1;  
            let player = oddPlayerAssists[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerAssists.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Assists', oddPlayerAssists[i].marketType,oddPlayerAssists[i].factorExtra,"uoplayerassists",oddPlayerAssists[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerAssists[i]) ? oddPlayerAssists[i].marketType=='Over' ? 'Más de' : oddPlayerAssists[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerAssists[i]) ? oddPlayerAssists[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerAssists[i].odd : this.props.convertOddToAmerican(oddPlayerAssists[i].odd)}</span>
                </Button></td>{tdPlayerAssists}</tr>);
                tdPlayerAssists = [];
              }else{
                tdPlayerAssists.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Assists',oddPlayerAssists[i].marketType,oddPlayerAssists[i].factorExtra,"uoplayerassists",oddPlayerAssists[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerAssists[i]) ? oddPlayerAssists[i].marketType=='Over' ? 'Más de' : oddPlayerAssists[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerAssists[i]) ? oddPlayerAssists[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerAssists[i].odd : this.props.convertOddToAmerican(oddPlayerAssists[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerAssists.length && !empty(tdPlayerAssists)){
                trPlayerAssists.push(<tr>{tdPlayerAssists}<td colSpan={3-tdPlayerAssists.length}>{' '}</td></tr>);
                tdPlayerAssists = []; 
              }
  
            }
        }

        let oddPlayerShots = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Shots')): null;
        let trPlayerShots = [];
        let tdPlayerShots = [];
        if(!empty(oddPlayerShots)){
          oddPlayerShots = orderUnderAndOver(oddPlayerShots);
          for(let i=0; i < oddPlayerShots.length; i++){
            let x = i+1;  
            let player = oddPlayerShots[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerShots.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Shots', oddPlayerShots[i].marketType,oddPlayerShots[i].factorExtra,"uoplayershots",oddPlayerShots[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerShots[i]) ? oddPlayerShots[i].marketType=='Over' ? 'Más de' : oddPlayerShots[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerShots[i]) ? oddPlayerShots[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerShots[i].odd : this.props.convertOddToAmerican(oddPlayerShots[i].odd)}</span>
                </Button></td>{tdPlayerShots}</tr>);
                tdPlayerShots = [];
              }else{
                tdPlayerShots.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Shots',oddPlayerShots[i].marketType,oddPlayerShots[i].factorExtra,"uoplayershots",oddPlayerShots[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerShots[i]) ? oddPlayerShots[i].marketType=='Over' ? 'Más de' : oddPlayerShots[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerShots[i]) ? oddPlayerShots[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerShots[i].odd : this.props.convertOddToAmerican(oddPlayerShots[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerShots.length && !empty(tdPlayerShots)){
                trPlayerShots.push(<tr>{tdPlayerShots}<td colSpan={3-tdPlayerShots.length}>{' '}</td></tr>);
                tdPlayerShots = []; 
              }
  
            }
        }

        let oddToScoreAPenalty = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='To Score a Penalty')): null;
        let tdToScoreAPenaltyHome = []; 
        let tdToScoreAPenaltyAway = []; 
        if(!empty(oddToScoreAPenalty)){

          for(let i=0; i < oddToScoreAPenalty.length; i++){
            if(oddToScoreAPenalty[i].marketType=='1' && empty(tdToScoreAPenaltyHome)){
              tdToScoreAPenaltyHome.push(<td className={'text-center'}>{!empty(oddToScoreAPenalty) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'To Score a Penalty',oddToScoreAPenalty[i].marketType,'toscoreapenalty');  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddToScoreAPenalty[i].odd : this.props.convertOddToAmerican(oddToScoreAPenalty[i].odd)}</Button> : ''}</td>)
            }
            if(oddToScoreAPenalty[i].marketType=='2' && empty(tdToScoreAPenaltyAway)){
              tdToScoreAPenaltyAway.push(<td className={'text-center'}>{!empty(oddToScoreAPenalty) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'To Score a Penalty',oddToScoreAPenalty[i].marketType,'toscoreapenalty');  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddToScoreAPenalty[i].odd : this.props.convertOddToAmerican(oddToScoreAPenalty[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddWinningMarginTeamsAny = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Winning Margin - Teams With Any Other Score')): null;
        let trWinningMarginTeamsAny = [];
        let tdWinningMarginTeamsAny = [];
        if(!empty(oddWinningMarginTeamsAny)){
          for(let i=0; i < oddWinningMarginTeamsAny.length; i++){
            if(oddWinningMarginTeamsAny[i].marketType!='Any Other Result'){
              let marketType1 = oddWinningMarginTeamsAny[i].marketType;
              let x = i+1;  
                if(x%3==0){
                  trWinningMarginTeamsAny.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin - Teams With Any Other Score',oddWinningMarginTeamsAny[i].marketType,"winningmarginteamsany");  } }>
                    <span className="sport-factor">{!empty(oddWinningMarginTeamsAny[i]) ? oddWinningMarginTeamsAny[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginTeamsAny[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginTeamsAny[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginTeamsAny[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : oddWinningMarginTeamsAny[i].marketType=='X' ? 'Empate' : '' : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginTeamsAny[i].odd : this.props.convertOddToAmerican(oddWinningMarginTeamsAny[i].odd)}</span>
                  </Button></td>{tdWinningMarginTeamsAny}</tr>);
                  tdWinningMarginTeamsAny = [];
                }else{
                  tdWinningMarginTeamsAny.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Winning Margin - Teams With Any Other Score',oddWinningMarginTeamsAny[i].marketType,"winningmarginteamsany");  } }>
                    <span className="sport-factor">{!empty(oddWinningMarginTeamsAny[i]) ? oddWinningMarginTeamsAny[i].marketType.includes('Home') ? marketType1.replace('Home',events[0].eventHome)  : oddWinningMarginTeamsAny[i].marketType.includes('Away') ? marketType1.replace('Away',events[0].eventAway) : oddWinningMarginTeamsAny[i].marketType.includes('Score Draw') ? marketType1.replace('Score Draw','Marcador Empatado') : oddWinningMarginTeamsAny[i].marketType.includes('No Goal') ? marketType1.replace('No Goal','Sin Goles') : oddWinningMarginTeamsAny[i].marketType=='X' ? 'Empate' : ''  : ''}</span>
                    <span className="sport-odd">{'  '}{showOdds == 'D' ? oddWinningMarginTeamsAny[i].odd : this.props.convertOddToAmerican(oddWinningMarginTeamsAny[i].odd)}</span>
                  </Button></td>);
                }
                if(x==oddWinningMarginTeamsAny.length && !empty(tdWinningMarginTeamsAny)){
                  trWinningMarginTeamsAny.push(<tr>{tdWinningMarginTeamsAny}<td colSpan={3-tdWinningMarginTeamsAny.length}>{' '}</td></tr>);
                  tdWinningMarginTeamsAny = []; 
                }
              }
            }
        }

        let oddAsianHandicapPoints = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Handicap Points')): null;
        let trAsianHandicapPoints = [];
        let tdAsianHandicapPoints = [];

        if(!empty(oddAsianHandicapPoints)){
          for(let i=0; i < oddAsianHandicapPoints.length; i++){
            let factorExtra = oddAsianHandicapPoints[i].factorExtra.split(' ');
            let x = i+1;  
            if(x%2==0){
              trAsianHandicapPoints.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Points',oddAsianHandicapPoints[i].marketType,factorExtra[0],"asianhandicappoints"); } }><span className="sport-factor">{!empty(oddAsianHandicapPoints[i]) && oddAsianHandicapPoints[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapPoints[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapPoints[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapPoints[i].odd : this.props.convertOddToAmerican(oddAsianHandicapPoints[i].odd)} </span></Button></td>{tdAsianHandicapPoints}</tr>);
              oddAsianHandicapPoints = [];
            }else{
              tdAsianHandicapPoints.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Points',oddAsianHandicapPoints[i].marketType,factorExtra[0],"asianhandicappoints"); } }><span className="sport-factor">{!empty(oddAsianHandicapPoints[i]) && oddAsianHandicapPoints[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapPoints[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapPoints[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapPoints[i].odd : this.props.convertOddToAmerican(oddAsianHandicapPoints[i].odd)}</span></Button></td>);
            }
            if(x==oddAsianHandicapPoints.length && !empty(tdAsianHandicapPoints)){
              trAsianHandicapPoints.push(<tr>{tdAsianHandicapPoints}<td colSpan={4-tdAsianHandicapPoints.length}>{' '}</td></tr>);
              tdAsianHandicapPoints = []; 
            }
          }
        }

        let oddPlayerPowerPlayPoints = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Powerplay Points')): null;
        let trPlayerPowerPlayPoints = [];
        let tdPlayerPowerPlayPoints = [];
        if(!empty(oddPlayerPowerPlayPoints)){
          for(let i=0; i < oddPlayerPowerPlayPoints.length; i++){
            let x = i+1;  
            let player = oddPlayerPowerPlayPoints[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerPowerPlayPoints.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Powerplay Points', oddPlayerPowerPlayPoints[i].marketType,oddPlayerPowerPlayPoints[i].factorExtra,"uoplayerpowerplaypoints",oddPlayerPowerPlayPoints[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerPowerPlayPoints[i]) ? oddPlayerPowerPlayPoints[i].marketType=='Over' ? 'Más de' : oddPlayerPowerPlayPoints[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerPowerPlayPoints[i]) ? oddPlayerPowerPlayPoints[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerPowerPlayPoints[i].odd : this.props.convertOddToAmerican(oddPlayerPowerPlayPoints[i].odd)}</span>
                </Button></td>{tdPlayerPowerPlayPoints}</tr>);
                tdPlayerPowerPlayPoints = [];
              }else{
                tdPlayerPowerPlayPoints.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Powerplay Points',oddPlayerPowerPlayPoints[i].marketType,oddPlayerPowerPlayPoints[i].factorExtra,"uoplayerpowerplaypoints",oddPlayerPowerPlayPoints[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerPowerPlayPoints[i]) ? oddPlayerPowerPlayPoints[i].marketType=='Over' ? 'Más de' : oddPlayerPowerPlayPoints[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerPowerPlayPoints[i]) ? oddPlayerPowerPlayPoints[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerPowerPlayPoints[i].odd : this.props.convertOddToAmerican(oddPlayerPowerPlayPoints[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerPowerPlayPoints.length && !empty(tdPlayerPowerPlayPoints)){
                trPlayerPowerPlayPoints.push(<tr>{tdPlayerPowerPlayPoints}<td colSpan={3-tdPlayerPowerPlayPoints.length}>{' '}</td></tr>);
                tdPlayerPowerPlayPoints = []; 
              }
  
            }
        }

        let oddFirstCard = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='First Card')): null;
  
        let tdFirstCard1 = []; 
        let tdFirstCard2 = []; 
        let tdFirstCardNoCard = []; 
        if(!empty(oddFirstCard)){

          for(let i=0; i < oddFirstCard.length; i++){
            if(oddFirstCard[i].marketType=='1' && empty(tdFirstCard1)){
              tdFirstCard1.push(<td className={'text-center'}>{!empty(oddFirstCard) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Card',oddFirstCard[i].marketType,"firstcard");  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddFirstCard[i].odd : this.props.convertOddToAmerican(oddFirstCard[i].odd)}</Button> : ''}</td>)
            }
            if(oddFirstCard[i].marketType=='2'  && empty(tdFirstCard2)){
              tdFirstCard2.push(<td className={'text-center'}>{!empty(oddFirstCard) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Card',oddFirstCard[i].marketType,"firstcard");  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddFirstCard[i].odd : this.props.convertOddToAmerican(oddFirstCard[i].odd)}</Button> : ''}</td>)
            }
            if(oddFirstCard[i].marketType=='No Goal' && empty(tdFirstCardNoCard)){
              tdFirstCardNoCard.push(<td className={'text-center'}>{!empty(oddFirstCard) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'First Card',oddFirstCard[i].marketType,"firstcard");  } }><span className="sport-factor">{'Sin tarjeta'}</span> {showOdds == 'D' ? oddFirstCard[i].odd : this.props.convertOddToAmerican(oddFirstCard[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddRaceTo20Points = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Race To 20 Points')): null;
        let tdRaceTo20PointsHome = []; 
        let tdRaceTo20PointsAway = []; 
        if(!empty(oddRaceTo20Points)){

          for(let i=0; i < oddRaceTo20Points.length; i++){
            if(oddRaceTo20Points[i].marketType=='1' && empty(tdRaceTo20PointsHome)){
              tdRaceTo20PointsHome.push(<td className={'text-center'}>{!empty(oddRaceTo20Points) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Race To 20 Points',oddRaceTo20Points[i].marketType,'raceto20points');  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddRaceTo20Points[i].odd : this.props.convertOddToAmerican(oddRaceTo20Points[i].odd)} </Button> : ''}</td>)
            }
            if(oddRaceTo20Points[i].marketType=='2' && empty(tdRaceTo20PointsAway)){
              tdRaceTo20PointsAway.push(<td className={'text-center'}>{!empty(oddRaceTo20Points) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Race To 20 Points',oddRaceTo20Points[i].marketType,'raceto20points');  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddRaceTo20Points[i].odd : this.props.convertOddToAmerican(oddRaceTo20Points[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddWillTheGameGoToOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Will The Game Go To Overtime?')): null;
        
        let tdWillTheGameGoToOTYes = [];
        let tdWillTheGameGoToOTNo = [];

        if(!empty(oddWillTheGameGoToOT)){
          for(let i=0; i < oddWillTheGameGoToOT.length; i++){
            if(oddWillTheGameGoToOT[i].marketType=='Yes' && empty(tdWillTheGameGoToOTYes)){
              tdWillTheGameGoToOTYes.push(<td className={'text-center'}>{!empty(oddWillTheGameGoToOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will The Game Go To Overtime?',oddWillTheGameGoToOT[i].marketType,'willthegamegotoot');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddWillTheGameGoToOT[i].odd : this.props.convertOddToAmerican(oddWillTheGameGoToOT[i].odd)}</Button> : ''}</td>)
            }
            if(oddWillTheGameGoToOT[i].marketType=='No' && empty(tdWillTheGameGoToOTNo)){
              tdWillTheGameGoToOTNo.push(<td className={'text-center'}>{!empty(oddWillTheGameGoToOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will The Game Go To Overtime?',oddWillTheGameGoToOT[i].marketType,'willthegamegotoot');  } }><span className="sport-factor">{!empty(oddWillTheGameGoToOT[i]) ? oddWillTheGameGoToOT[i].marketType : ''}</span> {showOdds == 'D' ? oddWillTheGameGoToOT[i].odd : this.props.convertOddToAmerican(oddWillTheGameGoToOT[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddAsianUnderOverCards = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Under/Over Cards')): null;
        let trAsianUnderOverCards = [];
        let tdAsianUnderOverCards = [];
        if(!empty(oddAsianUnderOverCards)){
          oddAsianUnderOverCards = orderUnderAndOver(oddAsianUnderOverCards);
          for(let i=0; i < oddAsianUnderOverCards.length; i++){
            let x = i+1;  
              if(x%2==0){
                trAsianUnderOverCards.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Asian Under/Over Cards',oddAsianUnderOverCards[i].marketType,oddAsianUnderOverCards[i].factorExtra,"asianunderovercards" );  } }>
                  <span className="sport-factor">{!empty(oddAsianUnderOverCards[i]) ? oddAsianUnderOverCards[i].marketType=='Over' ? 'Más de' : oddAsianUnderOverCards[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddAsianUnderOverCards[i]) ? oddAsianUnderOverCards[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddAsianUnderOverCards[i].odd : this.props.convertOddToAmerican(oddAsianUnderOverCards[i].odd)} </span>
                </Button></td>{tdAsianUnderOverCards}</tr>);
                tdAsianUnderOverCards = [];
              }else{
                tdAsianUnderOverCards.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Asian Under/Over Cards',oddAsianUnderOverCards[i].marketType,oddAsianUnderOverCards[i].factorExtra,"asianunderovercards" );  } }>
                  <span className="sport-factor">{!empty(oddAsianUnderOverCards[i]) ? oddAsianUnderOverCards[i].marketType=='Over' ? 'Más de' : oddAsianUnderOverCards[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddAsianUnderOverCards[i]) ? oddAsianUnderOverCards[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddAsianUnderOverCards[i].odd : this.props.convertOddToAmerican(oddAsianUnderOverCards[i].odd)} </span>
                </Button></td>);
              }

              if(x==oddAsianUnderOverCards.length && !empty(tdAsianUnderOverCards)){
                trAsianUnderOverCards.push(<tr>{tdAsianUnderOverCards}<td colSpan={4-tdAsianUnderOverCards.length}>{' '}</td></tr>);
                tdAsianUnderOverCards = []; 
              }
  
            }
        }

        let oddAsianHandicapCards = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Handicap Cards')): null;
        let trAsianHandicapCards = [];
        let tdAsianHandicapCards = [];

        if(!empty(oddAsianHandicapCards)){
          for(let i=0; i < oddAsianHandicapCards.length; i++){
            let factorExtra = oddAsianHandicapCards[i].factorExtra.split(' ');
            let x = i+1;  
            if(x%2==0){
              trAsianHandicapCards.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Cards',oddAsianHandicapCards[i].marketType,factorExtra[0],"asianhandicapcards"); } }><span className="sport-factor">{!empty(oddAsianHandicapCards[i]) && oddAsianHandicapCards[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapCards[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapCards[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapCards[i].odd : this.props.convertOddToAmerican(oddAsianHandicapCards[i].odd)}</span></Button></td>{tdAsianHandicapCards}</tr>);
              tdAsianHandicapCards = [];
            }else{
              tdAsianHandicapCards.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Cards',oddAsianHandicapCards[i].marketType,factorExtra[0],"asianhandicapcards"); } }><span className="sport-factor">{!empty(oddAsianHandicapCards[i]) && oddAsianHandicapCards[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapCards[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapCards[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapCards[i].odd : this.props.convertOddToAmerican(oddAsianHandicapCards[i].odd)}</span></Button></td>);
            }
            if(x==oddAsianHandicapCards.length && !empty(tdAsianHandicapCards)){
              trAsianHandicapCards.push(<tr>{tdAsianHandicapCards}<td colSpan={4-tdAsianHandicapCards.length}>{' '}</td></tr>);
              tdAsianHandicapCards = []; 
            }
          }
        }

        let oddUnderOverCards = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Cards')): null;
        let trUnderOverCards = [];
        let tdUnderOverCards = [];
        if(!empty(oddUnderOverCards)){
          oddUnderOverCards = orderUnderAndOver(oddUnderOverCards);
          for(let i=0; i < oddUnderOverCards.length; i++){
            let x = i+1;  
              if(x%2==0){
                trUnderOverCards.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Cards',oddUnderOverCards[i].marketType,oddUnderOverCards[i].factorExtra,"underovercards" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverCards[i]) ? oddUnderOverCards[i].marketType=='Over' ? 'Más de' : oddUnderOverCards[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverCards[i]) ? oddUnderOverCards[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverCards[i].odd : this.props.convertOddToAmerican(oddUnderOverCards[i].odd)} </span>
                </Button></td>{tdUnderOverCards}</tr>);
                tdUnderOverCards = [];
              }else{
                tdUnderOverCards.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Cards',oddUnderOverCards[i].marketType,oddUnderOverCards[i].factorExtra,"underovercards" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverCards[i]) ? oddUnderOverCards[i].marketType=='Over' ? 'Más de' : oddUnderOverCards[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverCards[i]) ? oddUnderOverCards[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverCards[i].odd : this.props.convertOddToAmerican(oddUnderOverCards[i].odd)} </span>
                </Button></td>);
              }

              if(x==oddUnderOverCards.length && !empty(tdUnderOverCards)){
                trUnderOverCards.push(<tr>{tdUnderOverCards}<td colSpan={4-tdUnderOverCards.length}>{' '}</td></tr>);
                tdUnderOverCards = []; 
              }
  
            }
        }

        let odd10MinuteUnderOverCards = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='10 Minute Under/Over - Cards')): null;
        let tr10MinuteUnderOverCards = [];
        let td10MinuteUnderOverCards = [];
        if(!empty(odd10MinuteUnderOverCards)){
          odd10MinuteUnderOverCards = orderUnderAndOver(odd10MinuteUnderOverCards);
          for(let i=0; i < odd10MinuteUnderOverCards.length; i++){
            let x = i+1;  
              if(x%2==0){
                tr10MinuteUnderOverCards.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'10 Minute Under/Over - Cards',odd10MinuteUnderOverCards[i].marketType,odd10MinuteUnderOverCards[i].factorExtra,"10minuteunderovercards" );  } }>
                  <span className="sport-factor">{!empty(odd10MinuteUnderOverCards[i]) ? odd10MinuteUnderOverCards[i].marketType=='Over' ? 'Más de' : odd10MinuteUnderOverCards[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(odd10MinuteUnderOverCards[i]) ? odd10MinuteUnderOverCards[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd10MinuteUnderOverCards[i].odd : this.props.convertOddToAmerican(odd10MinuteUnderOverCards[i].odd)}</span>
                </Button></td>{td10MinuteUnderOverCards}</tr>);
                td10MinuteUnderOverCards = [];
              }else{
                td10MinuteUnderOverCards.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'10 Minute Under/Over - Cards',odd10MinuteUnderOverCards[i].marketType,odd10MinuteUnderOverCards[i].factorExtra,"10minuteunderovercards" );  } }>
                  <span className="sport-factor">{!empty(odd10MinuteUnderOverCards[i]) ? odd10MinuteUnderOverCards[i].marketType=='Over' ? 'Más de' : odd10MinuteUnderOverCards[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(odd10MinuteUnderOverCards[i]) ? odd10MinuteUnderOverCards[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? odd10MinuteUnderOverCards[i].odd : this.props.convertOddToAmerican(odd10MinuteUnderOverCards[i].odd)}</span>
                </Button></td>);
              }

              if(x==odd10MinuteUnderOverCards.length && !empty(td10MinuteUnderOverCards)){
                tr10MinuteUnderOverCards.push(<tr>{td10MinuteUnderOverCards}<td colSpan={4-td10MinuteUnderOverCards.length}>{' '}</td></tr>);
                td10MinuteUnderOverCards = []; 
              }
  
            }
        }

        let oddTeamToWinTheMostPeriods = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Team To Win The Most Periods')): null;

        let tdTeamToWinTheMostPeriods1 = []; 
        let tdTeamToWinTheMostPeriodsX = []; 
        let tdTeamToWinTheMostPeriods2 = []; 
        if(!empty(oddTeamToWinTheMostPeriods)){

          for(let i=0; i < oddTeamToWinTheMostPeriods.length; i++){
            if(oddTeamToWinTheMostPeriods[i].marketType=='1' && empty(tdTeamToWinTheMostPeriods1)){
              tdTeamToWinTheMostPeriods1.push(<td className={'text-center'}>{!empty(oddTeamToWinTheMostPeriods) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Team To Win The Most Periods',oddTeamToWinTheMostPeriods[i].marketType,'teamtowinthemostperiods');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventHome : ''}</span> {showOdds == 'D' ? oddTeamToWinTheMostPeriods[i].odd : this.props.convertOddToAmerican(oddTeamToWinTheMostPeriods[i].odd)} </Button> : ''}</td>)
            }
            if(oddTeamToWinTheMostPeriods[i].marketType=='X'  && empty(tdTeamToWinTheMostPeriodsX)){
              tdTeamToWinTheMostPeriodsX.push(<td className={'text-center'}>{!empty(oddTeamToWinTheMostPeriods) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Team To Win The Most Periods',oddTeamToWinTheMostPeriods[i].marketType,'teamtowinthemostperiods');  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? oddTeamToWinTheMostPeriods[i].odd : this.props.convertOddToAmerican(oddTeamToWinTheMostPeriods[i].odd)}</Button> : ''}</td>)
            }
            if(oddTeamToWinTheMostPeriods[i].marketType=='2' && empty(tdTeamToWinTheMostPeriods2)){
              tdTeamToWinTheMostPeriods2.push(<td className={'text-center'}>{!empty(oddTeamToWinTheMostPeriods) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Team To Win The Most Periods',oddTeamToWinTheMostPeriods[i].marketType,'teamtowinthemostperiods');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventAway : ''}</span> {showOdds == 'D' ? oddTeamToWinTheMostPeriods[i].odd : this.props.convertOddToAmerican(oddTeamToWinTheMostPeriods[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddPlayerPointsRebounds = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Points And Rebounds')): null;
        let trPlayerPointsRebounds = [];
        let tdPlayerPointsRebounds = [];
        if(!empty(oddPlayerPointsRebounds)){
          for(let i=0; i < oddPlayerPointsRebounds.length; i++){
            let x = i+1;  
            let player = oddPlayerPointsRebounds[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerPointsRebounds.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Points And Rebounds', oddPlayerPointsRebounds[i].marketType,oddPlayerPointsRebounds[i].factorExtra,"uoplayerpointsrebounds",oddPlayerPointsRebounds[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerPointsRebounds[i]) ? oddPlayerPointsRebounds[i].marketType=='Over' ? 'Más de' : oddPlayerPointsRebounds[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerPointsRebounds[i]) ? oddPlayerPointsRebounds[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerPointsRebounds[i].odd : this.props.convertOddToAmerican(oddPlayerPointsRebounds[i].odd)}</span>
                </Button></td>{tdPlayerPointsRebounds}</tr>);
                tdPlayerPointsRebounds = [];
              }else{
                tdPlayerPointsRebounds.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Points And Rebounds',oddPlayerPointsRebounds[i].marketType,oddPlayerPointsRebounds[i].factorExtra,"uoplayerpointsrebounds",oddPlayerPointsRebounds[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerPointsRebounds[i]) ? oddPlayerPointsRebounds[i].marketType=='Over' ? 'Más de' : oddPlayerPointsRebounds[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerPointsRebounds[i]) ? oddPlayerPointsRebounds[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerPointsRebounds[i].odd : this.props.convertOddToAmerican(oddPlayerPointsRebounds[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerPointsRebounds.length && !empty(tdPlayerPointsRebounds)){
                trPlayerPointsRebounds.push(<tr>{tdPlayerPointsRebounds}<td colSpan={3-tdPlayerPointsRebounds.length}>{' '}</td></tr>);
                tdPlayerPointsRebounds = []; 
              }
  
            }
        }

        let oddPlayerPointsAssists = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Points And Assists')): null;
        let trPlayerPointsAssists = [];
        let tdPlayerPointsAssists = [];
        if(!empty(oddPlayerPointsAssists)){
          for(let i=0; i < oddPlayerPointsAssists.length; i++){
            let x = i+1;  
            let player = oddPlayerPointsAssists[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerPointsAssists.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Points And Assists', oddPlayerPointsAssists[i].marketType,oddPlayerPointsAssists[i].factorExtra,"uoplayerpointsassists",oddPlayerPointsAssists[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerPointsAssists[i]) ? oddPlayerPointsAssists[i].marketType=='Over' ? 'Más de' : oddPlayerPointsAssists[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerPointsAssists[i]) ? oddPlayerPointsAssists[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerPointsAssists[i].odd : this.props.convertOddToAmerican(oddPlayerPointsAssists[i].odd)}</span>
                </Button></td>{tdPlayerPointsAssists}</tr>);
                tdPlayerPointsAssists = [];
              }else{
                tdPlayerPointsAssists.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Points And Assists',oddPlayerPointsAssists[i].marketType,oddPlayerPointsAssists[i].factorExtra,"uoplayerpointsassists",oddPlayerPointsAssists[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerPointsAssists[i]) ? oddPlayerPointsAssists[i].marketType=='Over' ? 'Más de' : oddPlayerPointsAssists[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerPointsAssists[i]) ? oddPlayerPointsAssists[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerPointsAssists[i].odd : this.props.convertOddToAmerican(oddPlayerPointsAssists[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerPointsAssists.length && !empty(tdPlayerPointsAssists)){
                trPlayerPointsAssists.push(<tr>{tdPlayerPointsAssists}<td colSpan={3-tdPlayerPointsAssists.length}>{' '}</td></tr>);
                tdPlayerPointsAssists = []; 
              }
  
            }
        }

        let oddPlayerAssistsRebounds = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Assists And Rebounds')): null;
        let trPlayerAssistsRebounds = [];
        let tdPlayerAssistsRebounds = [];
        if(!empty(oddPlayerAssistsRebounds)){
          for(let i=0; i < oddPlayerAssistsRebounds.length; i++){
            let x = i+1;  
            let player = oddPlayerAssistsRebounds[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerAssistsRebounds.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Assists And Rebounds', oddPlayerAssistsRebounds[i].marketType,oddPlayerAssistsRebounds[i].factorExtra,"uoplayersassistsrebounds",oddPlayerAssistsRebounds[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerAssistsRebounds[i]) ? oddPlayerAssistsRebounds[i].marketType=='Over' ? 'Más de' : oddPlayerAssistsRebounds[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerAssistsRebounds[i]) ? oddPlayerAssistsRebounds[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerAssistsRebounds[i].odd : this.props.convertOddToAmerican(oddPlayerAssistsRebounds[i].odd)}</span>
                </Button></td>{tdPlayerAssistsRebounds}</tr>);
                tdPlayerAssistsRebounds = [];
              }else{
                tdPlayerAssistsRebounds.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Assists And Rebounds',oddPlayerAssistsRebounds[i].marketType,oddPlayerAssistsRebounds[i].factorExtra,"uoplayersassistsrebounds",oddPlayerAssistsRebounds[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerAssistsRebounds[i]) ? oddPlayerAssistsRebounds[i].marketType=='Over' ? 'Más de' : oddPlayerAssistsRebounds[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerAssistsRebounds[i]) ? oddPlayerAssistsRebounds[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerAssistsRebounds[i].odd : this.props.convertOddToAmerican(oddPlayerAssistsRebounds[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerAssistsRebounds.length && !empty(tdPlayerAssistsRebounds)){
                trPlayerAssistsRebounds.push(<tr>{tdPlayerAssistsRebounds}<td colSpan={3-tdPlayerAssistsRebounds.length}>{' '}</td></tr>);
                tdPlayerAssistsRebounds = []; 
              }
  
            }
        }

        let oddFirstPeriodExtraPoints = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period - Extra Points?')): null;
        
        let tdFirstPeriodExtraPointsYes = [];
        let tdFirstPeriodExtraPointsNo = [];

        if(!empty(oddFirstPeriodExtraPoints)){
          for(let i=0; i < oddFirstPeriodExtraPoints.length; i++){
            if(oddFirstPeriodExtraPoints[i].marketType=='Yes' && empty(tdFirstPeriodExtraPointsYes)){
              tdFirstPeriodExtraPointsYes.push(<td className={'text-center'}>{!empty(oddFirstPeriodExtraPoints) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1st Period - Extra Points?',oddFirstPeriodExtraPoints[i].marketType,'firstperiodextrapoints');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddFirstPeriodExtraPoints[i].odd : this.props.convertOddToAmerican(oddFirstPeriodExtraPoints[i].odd)} </Button> : ''}</td>)
            }
            if(oddFirstPeriodExtraPoints[i].marketType=='No' && empty(tdFirstPeriodExtraPointsNo)){
              tdFirstPeriodExtraPointsNo.push(<td className={'text-center'}>{!empty(oddFirstPeriodExtraPoints) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'1st Period - Extra Points?',oddFirstPeriodExtraPoints[i].marketType,'firstperiodextrapoints');  } }><span className="sport-factor">{!empty(oddFirstPeriodExtraPoints[i]) ? oddFirstPeriodExtraPoints[i].marketType : ''}</span> {showOdds == 'D' ? oddFirstPeriodExtraPoints[i].odd : this.props.convertOddToAmerican(oddFirstPeriodExtraPoints[i].odd)} </Button> : ''}</td>)
            }
          }
        }

        let oddAsianHandicapGames = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Handicap Games')): null;
        let trAsianHandicapGames = [];
        let tdAsianHandicapGames = [];

        if(!empty(oddAsianHandicapGames)){
          for(let i=0; i < oddAsianHandicapGames.length; i++){
            let factorExtra = oddAsianHandicapGames[i].factorExtra.split(' ');
            let x = i+1;  
            if(x%2==0){
              trAsianHandicapGames.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Games',oddAsianHandicapGames[i].marketType,factorExtra[0],"asianhandicapgames"); } }><span className="sport-factor">{!empty(oddAsianHandicapGames[i]) && oddAsianHandicapGames[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapGames[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapGames[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapGames[i].odd : this.props.convertOddToAmerican(oddAsianHandicapGames[i].odd)}</span></Button></td>{tdAsianHandicapGames}</tr>);
              tdAsianHandicapGames = [];
            }else{
              tdAsianHandicapGames.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Games',oddAsianHandicapGames[i].marketType,factorExtra[0],"asianhandicapgames"); } }><span className="sport-factor">{!empty(oddAsianHandicapGames[i]) && oddAsianHandicapGames[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapGames[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapGames[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapGames[i].odd : this.props.convertOddToAmerican(oddAsianHandicapGames[i].odd)}</span></Button></td>);
            }
            if(x==oddAsianHandicapGames.length && !empty(tdAsianHandicapGames)){
              trAsianHandicapGames.push(<tr>{tdAsianHandicapGames}<td colSpan={4-tdAsianHandicapGames.length}>{' '}</td></tr>);
              tdAsianHandicapGames = []; 
            }
          }
        }

        let oddPlayerPoints = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Points')): null;
        let trPlayerPoints = [];
        let tdPlayerPoints = [];
        if(!empty(oddPlayerPoints)){
          for(let i=0; i < oddPlayerPoints.length; i++){
            let x = i+1;  
            let player = oddPlayerPoints[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerPoints.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Points', oddPlayerPoints[i].marketType,oddPlayerPoints[i].factorExtra,"uoplayerpoints",oddPlayerPoints[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerPoints[i]) ? oddPlayerPoints[i].marketType=='Over' ? 'Más de' : oddPlayerPoints[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerPoints[i]) ? oddPlayerPoints[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerPoints[i].odd : this.props.convertOddToAmerican(oddPlayerPoints[i].odd)}</span>
                </Button></td>{tdPlayerPoints}</tr>);
                tdPlayerPoints = [];
              }else{
                tdPlayerPoints.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Points',oddPlayerPoints[i].marketType,oddPlayerPoints[i].factorExtra,"uoplayerpoints",oddPlayerPoints[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerPoints[i]) ? oddPlayerPoints[i].marketType=='Over' ? 'Más de' : oddPlayerPoints[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerPoints[i]) ? oddPlayerPoints[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerPoints[i].odd : this.props.convertOddToAmerican(oddPlayerPoints[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerPoints.length && !empty(tdPlayerPoints)){
                trPlayerPoints.push(<tr>{tdPlayerPoints}<td colSpan={3-tdPlayerPoints.length}>{' '}</td></tr>);
                tdPlayerPoints = []; 
              }
  
            }
        }

        let oddUnderOverGames = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Games')): null;
        let trUnderOverGames = [];
        let tdUnderOverGames = [];
        if(!empty(oddUnderOverGames)){
          oddUnderOverGames = orderUnderAndOver(oddUnderOverGames);
          for(let i=0; i < oddUnderOverGames.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUnderOverGames.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Games',oddUnderOverGames[i].marketType,oddUnderOverGames[i].factorExtra,"underovergames" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverGames[i]) ? oddUnderOverGames[i].marketType=='Over' ? 'Más de' : oddUnderOverGames[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverGames[i]) ? oddUnderOverGames[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverGames[i].odd : this.props.convertOddToAmerican(oddUnderOverGames[i].odd)}</span>
                </Button></td>{tdUnderOverGames}</tr>);
                tdUnderOverGames = [];
              }else{
                tdUnderOverGames.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Games',oddUnderOverGames[i].marketType,oddUnderOverGames[i].factorExtra,"underovergames" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverGames[i]) ? oddUnderOverGames[i].marketType=='Over' ? 'Más de' : oddUnderOverGames[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverGames[i]) ? oddUnderOverGames[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverGames[i].odd : this.props.convertOddToAmerican(oddUnderOverGames[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverGames.length && !empty(tdUnderOverGames)){
                trUnderOverGames.push(<tr>{tdUnderOverGames}<td colSpan={4-tdUnderOverGames.length}>{' '}</td></tr>);
                tdUnderOverGames = []; 
              }
  
            }
        }

        let oddPlayerTurnovers = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Turnovers')): null;
        let trPlayerTurnovers = [];
        let tdPlayerTurnovers = [];
        if(!empty(oddPlayerTurnovers)){
          oddPlayerTurnovers = orderUnderAndOver(oddPlayerTurnovers);
          for(let i=0; i < oddPlayerTurnovers.length; i++){
            let x = i+1;  
            let player = oddPlayerTurnovers[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerTurnovers.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Turnovers', oddPlayerTurnovers[i].marketType,oddPlayerTurnovers[i].factorExtra,"uoplayerpoints",oddPlayerTurnovers[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerTurnovers[i]) ? oddPlayerTurnovers[i].marketType=='Over' ? 'Más de' : oddPlayerTurnovers[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerTurnovers[i]) ? oddPlayerTurnovers[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerTurnovers[i].odd : this.props.convertOddToAmerican(oddPlayerTurnovers[i].odd)}</span>
                </Button></td>{tdPlayerTurnovers}</tr>);
                tdPlayerTurnovers = [];
              }else{
                tdPlayerTurnovers.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Turnovers',oddPlayerTurnovers[i].marketType,oddPlayerTurnovers[i].factorExtra,"uoplayerpoints",oddPlayerTurnovers[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerTurnovers[i]) ? oddPlayerTurnovers[i].marketType=='Over' ? 'Más de' : oddPlayerTurnovers[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerTurnovers[i]) ? oddPlayerTurnovers[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerTurnovers[i].odd : this.props.convertOddToAmerican(oddPlayerTurnovers[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerTurnovers.length && !empty(tdPlayerTurnovers)){
                trPlayerTurnovers.push(<tr>{tdPlayerTurnovers}<td colSpan={3-tdPlayerTurnovers.length}>{' '}</td></tr>);
                tdPlayerTurnovers = []; 
              }
  
            }
        }

        let oddPlayerRebounds = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Rebounds')): null;
        let trPlayerRebounds = [];
        let tdPlayerRebounds = [];
        if(!empty(oddPlayerRebounds)){
          oddPlayerRebounds = orderUnderAndOver(oddPlayerRebounds);
          for(let i=0; i < oddPlayerRebounds.length; i++){
            let x = i+1;  
            let player = oddPlayerRebounds[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerRebounds.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Rebounds', oddPlayerRebounds[i].marketType,oddPlayerRebounds[i].factorExtra,"uoplayersrebounds",oddPlayerRebounds[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerRebounds[i]) ? oddPlayerRebounds[i].marketType=='Over' ? 'Más de' : oddPlayerRebounds[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerRebounds[i]) ? oddPlayerRebounds[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerRebounds[i].odd : this.props.convertOddToAmerican(oddPlayerRebounds[i].odd)}</span>
                </Button></td>{tdPlayerRebounds}</tr>);
                tdPlayerRebounds = [];
              }else{
                tdPlayerRebounds.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Rebounds',oddPlayerRebounds[i].marketType,oddPlayerRebounds[i].factorExtra,"uoplayersrebounds",oddPlayerRebounds[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerRebounds[i]) ? oddPlayerRebounds[i].marketType=='Over' ? 'Más de' : oddPlayerRebounds[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerRebounds[i]) ? oddPlayerRebounds[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerRebounds[i].odd : this.props.convertOddToAmerican(oddPlayerRebounds[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerRebounds.length && !empty(tdPlayerRebounds)){
                trPlayerRebounds.push(<tr>{tdPlayerRebounds}<td colSpan={3-tdPlayerRebounds.length}>{' '}</td></tr>);
                tdPlayerRebounds = []; 
              }
  
            }
        }

        let oddAsianHandicapSets = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Asian Handicap Sets')): null;
        let trAsianHandicapSets = [];
        let tdAsianHandicapSets = [];

        if(!empty(oddAsianHandicapSets)){
          for(let i=0; i < oddAsianHandicapSets.length; i++){
            let factorExtra = oddAsianHandicapSets[i].factorExtra.split(' ');
            let x = i+1;  
            if(x%2==0){
              trAsianHandicapSets.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Sets',oddAsianHandicapSets[i].marketType,factorExtra[0],"asianhandicapsets"); } }><span className="sport-factor">{!empty(oddAsianHandicapSets[i]) && oddAsianHandicapSets[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapSets[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapSets[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapSets[i].odd : this.props.convertOddToAmerican(oddAsianHandicapSets[i].odd)}</span></Button></td>{tdAsianHandicapSets}</tr>);
              tdAsianHandicapSets = [];
            }else{
              tdAsianHandicapSets.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'Asian Handicap Sets',oddAsianHandicapSets[i].marketType,factorExtra[0],"asianhandicapsets"); } }><span className="sport-factor">{!empty(oddAsianHandicapSets[i]) && oddAsianHandicapSets[i].marketType=='1' ? events[0].eventHome : oddAsianHandicapSets[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddAsianHandicapSets[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddAsianHandicapSets[i].odd : this.props.convertOddToAmerican(oddAsianHandicapSets[i].odd)}</span></Button></td>);
            }
            if(x==oddAsianHandicapSets.length && !empty(tdAsianHandicapSets)){
              trAsianHandicapSets.push(<tr>{tdAsianHandicapSets}<td colSpan={4-tdAsianHandicapSets.length}>{' '}</td></tr>);
              tdAsianHandicapSets = []; 
            }
          }
        }

        let oddPlayerSteals = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Steals')): null;
        let trPlayerSteals = [];
        let tdPlayerSteals = [];
        if(!empty(oddPlayerSteals)){
          oddPlayerSteals = orderUnderAndOver(oddPlayerSteals);
          for(let i=0; i < oddPlayerSteals.length; i++){
            let x = i+1;  
            let player = oddPlayerSteals[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerSteals.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Steals', oddPlayerSteals[i].marketType,oddPlayerSteals[i].factorExtra,"uoplayerssteals",oddPlayerSteals[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerSteals[i]) ? oddPlayerSteals[i].marketType=='Over' ? 'Más de' : oddPlayerSteals[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerSteals[i]) ? oddPlayerSteals[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerSteals[i].odd : this.props.convertOddToAmerican(oddPlayerSteals[i].odd)}</span>
                </Button></td>{tdPlayerSteals}</tr>);
                tdPlayerSteals = [];
              }else{
                tdPlayerSteals.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Steals',oddPlayerSteals[i].marketType,oddPlayerSteals[i].factorExtra,"uoplayerssteals",oddPlayerSteals[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerSteals[i]) ? oddPlayerSteals[i].marketType=='Over' ? 'Más de' : oddPlayerSteals[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerSteals[i]) ? oddPlayerSteals[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerSteals[i].odd : this.props.convertOddToAmerican(oddPlayerSteals[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerSteals.length && !empty(tdPlayerSteals)){
                trPlayerSteals.push(<tr>{tdPlayerSteals}<td colSpan={3-tdPlayerSteals.length}>{' '}</td></tr>);
                tdPlayerSteals = []; 
              }
  
            }
        }

        let oddPlayerStealsBlocks = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Steals And Blocks')): null;
        let trPlayerStealsBlocks = [];
        let tdPlayerStealsBlocks = [];
        if(!empty(oddPlayerStealsBlocks)){
          oddPlayerStealsBlocks = orderUnderAndOver(oddPlayerStealsBlocks);
          for(let i=0; i < oddPlayerStealsBlocks.length; i++){
            let x = i+1;  
            let player = oddPlayerStealsBlocks[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerStealsBlocks.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Steals And Blocks', oddPlayerStealsBlocks[i].marketType,oddPlayerStealsBlocks[i].factorExtra,"uoplayersstealsblocks",oddPlayerStealsBlocks[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerStealsBlocks[i]) ? oddPlayerStealsBlocks[i].marketType=='Over' ? 'Más de' : oddPlayerStealsBlocks[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerStealsBlocks[i]) ? oddPlayerStealsBlocks[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerStealsBlocks[i].odd : this.props.convertOddToAmerican(oddPlayerStealsBlocks[i].odd)}</span>
                </Button></td>{tdPlayerStealsBlocks}</tr>);
                tdPlayerStealsBlocks = [];
              }else{
                tdPlayerStealsBlocks.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Steals And Blocks',oddPlayerStealsBlocks[i].marketType,oddPlayerStealsBlocks[i].factorExtra,"uoplayersstealsblocks",oddPlayerStealsBlocks[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerStealsBlocks[i]) ? oddPlayerStealsBlocks[i].marketType=='Over' ? 'Más de' : oddPlayerStealsBlocks[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerStealsBlocks[i]) ? oddPlayerStealsBlocks[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerStealsBlocks[i].odd : this.props.convertOddToAmerican(oddPlayerStealsBlocks[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerStealsBlocks.length && !empty(tdPlayerStealsBlocks)){
                trPlayerStealsBlocks.push(<tr>{tdPlayerStealsBlocks}<td colSpan={3-tdPlayerStealsBlocks.length}>{' '}</td></tr>);
                tdPlayerStealsBlocks = []; 
              }
  
            }
        }

        let oddPlayerBlocks = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Blocks')): null;
        let trPlayerBlocks = [];
        let tdPlayerBlocks = [];
        if(!empty(oddPlayerBlocks)){
          oddPlayerBlocks = orderUnderAndOver(oddPlayerBlocks);
          for(let i=0; i < oddPlayerBlocks.length; i++){
            let x = i+1;  
            let player = oddPlayerBlocks[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerBlocks.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Blocks', oddPlayerBlocks[i].marketType,oddPlayerBlocks[i].factorExtra,"uoplayersblocks",oddPlayerBlocks[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerBlocks[i]) ? oddPlayerBlocks[i].marketType=='Over' ? 'Más de' : oddPlayerBlocks[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerBlocks[i]) ? oddPlayerBlocks[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerBlocks[i].odd : this.props.convertOddToAmerican(oddPlayerBlocks[i].odd)}</span>
                </Button></td>{tdPlayerBlocks}</tr>);
                tdPlayerBlocks = [];
              }else{
                tdPlayerBlocks.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Blocks',oddPlayerBlocks[i].marketType,oddPlayerBlocks[i].factorExtra,"uoplayersblocks",oddPlayerBlocks[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerBlocks[i]) ? oddPlayerBlocks[i].marketType=='Over' ? 'Más de' : oddPlayerBlocks[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerBlocks[i]) ? oddPlayerBlocks[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerBlocks[i].odd : this.props.convertOddToAmerican(oddPlayerBlocks[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerBlocks.length && !empty(tdPlayerBlocks)){
                trPlayerBlocks.push(<tr>{tdPlayerBlocks}<td colSpan={3-tdPlayerBlocks.length}>{' '}</td></tr>);
                tdPlayerBlocks = []; 
              }
  
            }
        }

        let oddWillARedCardBeShown = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Will A Red Card Be Shown?')): null;
        
        let tdWillARedCardBeShownYes = [];
        let tdWillARedCardBeShownNo = [];

        if(!empty(oddWillARedCardBeShown)){
          for(let i=0; i < oddWillARedCardBeShown.length; i++){
            if(oddWillARedCardBeShown[i].marketType=='Yes' && empty(tdWillARedCardBeShownYes)){
              tdWillARedCardBeShownYes.push(<td className={'text-center'}>{!empty(oddWillARedCardBeShown) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will A Red Card Be Shown?',oddWillARedCardBeShown[i].marketType,'willaredcardbeshown');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddWillARedCardBeShown[i].odd : this.props.convertOddToAmerican(oddWillARedCardBeShown[i].odd)}</Button> : ''}</td>)
            }
            if(oddWillARedCardBeShown[i].marketType=='No' && empty(tdWillARedCardBeShownNo)){
              tdWillARedCardBeShownNo.push(<td className={'text-center'}>{!empty(oddWillARedCardBeShown) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will A Red Card Be Shown?',oddWillARedCardBeShown[i].marketType,'willaredcardbeshown');  } }><span className="sport-factor">{!empty(oddWillARedCardBeShown[i]) ? oddWillARedCardBeShown[i].marketType : ''}</span> {showOdds == 'D' ? oddWillARedCardBeShown[i].odd : this.props.convertOddToAmerican(oddWillARedCardBeShown[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddWillAPenaltyBeAwarded = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Will A Penalty Be Awarded?')): null;
        
        let tdWillAPenaltyBeAwardedYes = [];
        let tdWillAPenaltyBeAwardedNo = [];

        if(!empty(oddWillAPenaltyBeAwarded)){
          for(let i=0; i < oddWillAPenaltyBeAwarded.length; i++){
            if(oddWillAPenaltyBeAwarded[i].marketType=='Yes' && empty(tdWillAPenaltyBeAwardedYes)){
              tdWillAPenaltyBeAwardedYes.push(<td className={'text-center'}>{!empty(oddWillAPenaltyBeAwarded) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will A Penalty Be Awarded?',oddWillAPenaltyBeAwarded[i].marketType,'willapenaltybeawarded');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddWillAPenaltyBeAwarded[i].odd : this.props.convertOddToAmerican(oddWillAPenaltyBeAwarded[i].odd)}</Button> : ''}</td>)
            }
            if(oddWillAPenaltyBeAwarded[i].marketType=='No' && empty(tdWillAPenaltyBeAwardedNo)){
              tdWillAPenaltyBeAwardedNo.push(<td className={'text-center'}>{!empty(oddWillAPenaltyBeAwarded) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will A Penalty Be Awarded?',oddWillAPenaltyBeAwarded[i].marketType,'willapenaltybeawarded');  } }><span className="sport-factor">{!empty(oddWillAPenaltyBeAwarded[i]) ? oddWillAPenaltyBeAwarded[i].marketType : ''}</span> {showOdds == 'D' ? oddWillAPenaltyBeAwarded[i].odd : this.props.convertOddToAmerican(oddWillAPenaltyBeAwarded[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddWillFirstScoringTeamWin = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Will The First Scoring Team Win?')): null;
        
        let tdWillFirstScoringTeamWinYes = [];
        let tdWillFirstScoringTeamWinNo = [];

        if(!empty(oddWillFirstScoringTeamWin)){
          for(let i=0; i < oddWillFirstScoringTeamWin.length; i++){
            if(oddWillFirstScoringTeamWin[i].marketType=='Yes' && empty(tdWillFirstScoringTeamWinYes)){
              tdWillFirstScoringTeamWinYes.push(<td className={'text-center'}>{!empty(oddWillFirstScoringTeamWin) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will The First Scoring Team Win?',oddWillFirstScoringTeamWin[i].marketType,'willfirstscoringteamwin');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddWillFirstScoringTeamWin[i].odd : this.props.convertOddToAmerican(oddWillFirstScoringTeamWin[i].odd)}</Button> : ''}</td>)
            }
            if(oddWillFirstScoringTeamWin[i].marketType=='No' && empty(tdWillFirstScoringTeamWinNo)){
              tdWillFirstScoringTeamWinNo.push(<td className={'text-center'}>{!empty(oddWillFirstScoringTeamWin) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will The First Scoring Team Win?',oddWillFirstScoringTeamWin[i].marketType,'willfirstscoringteamwin');  } }><span className="sport-factor">{!empty(oddWillFirstScoringTeamWin[i]) ? oddWillFirstScoringTeamWin[i].marketType : ''}</span> {showOdds == 'D' ? oddWillFirstScoringTeamWin[i].odd : this.props.convertOddToAmerican(oddWillFirstScoringTeamWin[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddPlayerDoubleDouble = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Player Double Double')): null;
        let trPlayerDoubleDouble = [];
        let tdPlayerDoubleDouble = [];
        if(!empty(oddPlayerDoubleDouble)){
          for(let i=0; i < oddPlayerDoubleDouble.length; i++){
            let x = i+1;  
            let player = oddPlayerDoubleDouble[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerDoubleDouble.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Player Double Double', oddPlayerDoubleDouble[i].marketType,oddPlayerDoubleDouble[i].factorExtra,"playerdoubledouble",oddPlayerDoubleDouble[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[1]) ? player[1] : ''}{' '}{!empty(oddPlayerDoubleDouble[i]) ? oddPlayerDoubleDouble[i].marketType=='Yes' ? 'Sí' : oddPlayerDoubleDouble[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerDoubleDouble[i].odd : this.props.convertOddToAmerican(oddPlayerDoubleDouble[i].odd)}</span>
                </Button></td>{tdPlayerDoubleDouble}</tr>);
                tdPlayerDoubleDouble = [];
              }else{
                tdPlayerDoubleDouble.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Player Double Double',oddPlayerDoubleDouble[i].marketType,oddPlayerDoubleDouble[i].factorExtra,"playerdoubledouble",oddPlayerDoubleDouble[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[1]) ? player[1] : ''}{' '}{!empty(oddPlayerDoubleDouble[i]) ? oddPlayerDoubleDouble[i].marketType=='Yes' ? 'Sí' : oddPlayerDoubleDouble[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerDoubleDouble[i].odd : this.props.convertOddToAmerican(oddPlayerDoubleDouble[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerDoubleDouble.length && !empty(tdPlayerDoubleDouble)){
                trPlayerDoubleDouble.push(<tr>{tdPlayerDoubleDouble}<td colSpan={3-tdPlayerDoubleDouble.length}>{' '}</td></tr>);
                tdPlayerDoubleDouble = []; 
              }
  
            }
        }

        let oddPlayerShotsOnTarget = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Shots On Target')): null;
        let trPlayerShotsOnTarget = [];
        let tdPlayerShotsOnTarget = [];
        if(!empty(oddPlayerShotsOnTarget)){
          oddPlayerShotsOnTarget = orderUnderAndOver(oddPlayerShotsOnTarget);
          for(let i=0; i < oddPlayerShotsOnTarget.length; i++){
            let x = i+1;  
            let player = oddPlayerShotsOnTarget[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerShotsOnTarget.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Shots On Target', oddPlayerShotsOnTarget[i].marketType,oddPlayerShotsOnTarget[i].factorExtra,"uoplayersshotsontarget",oddPlayerShotsOnTarget[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerShotsOnTarget[i]) ? oddPlayerShotsOnTarget[i].marketType=='Over' ? 'Más de' : oddPlayerShotsOnTarget[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerShotsOnTarget[i]) ? oddPlayerShotsOnTarget[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerShotsOnTarget[i].odd : this.props.convertOddToAmerican(oddPlayerShotsOnTarget[i].odd)}</span>
                </Button></td>{tdPlayerShotsOnTarget}</tr>);
                tdPlayerShotsOnTarget = [];
              }else{
                tdPlayerShotsOnTarget.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Shots On Target',oddPlayerShotsOnTarget[i].marketType,oddPlayerShotsOnTarget[i].factorExtra,"uoplayersshotsontarget",oddPlayerShotsOnTarget[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerShotsOnTarget[i]) ? oddPlayerShotsOnTarget[i].marketType=='Over' ? 'Más de' : oddPlayerShotsOnTarget[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerShotsOnTarget[i]) ? oddPlayerShotsOnTarget[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerShotsOnTarget[i].odd : this.props.convertOddToAmerican(oddPlayerShotsOnTarget[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerShotsOnTarget.length && !empty(tdPlayerShotsOnTarget)){
                trPlayerShotsOnTarget.push(<tr>{tdPlayerShotsOnTarget}<td colSpan={3-tdPlayerShotsOnTarget.length}>{' '}</td></tr>);
                tdPlayerShotsOnTarget = []; 
              }
  
            }
        }

        let oddWillGameGoToShootout = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Will Game Go to Shootout?')): null;
        
        let tdWillGameGoToShootoutYes = [];
        let tdWillGameGoToShootoutNo = [];

        if(!empty(oddWillGameGoToShootout)){
          for(let i=0; i < oddWillGameGoToShootout.length; i++){
            if(oddWillGameGoToShootout[i].marketType=='Yes' && empty(tdWillGameGoToShootoutYes)){
              tdWillGameGoToShootoutYes.push(<td className={'text-center'}>{!empty(oddWillGameGoToShootout) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will Game Go to Shootout?',oddWillGameGoToShootout[i].marketType,'willgamegotoshootout');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddWillGameGoToShootout[i].odd : this.props.convertOddToAmerican(oddWillGameGoToShootout[i].odd)} </Button> : ''}</td>)
            }
            if(oddWillGameGoToShootout[i].marketType=='No' && empty(tdWillGameGoToShootoutNo)){
              tdWillGameGoToShootoutNo.push(<td className={'text-center'}>{!empty(oddWillGameGoToShootout) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will Game Go to Shootout?',oddWillGameGoToShootout[i].marketType,'willgamegotoshootout');  } }><span className="sport-factor">{!empty(oddWillGameGoToShootout[i]) ? oddWillGameGoToShootout[i].marketType : ''}</span> {showOdds == 'D' ? oddWillGameGoToShootout[i].odd : this.props.convertOddToAmerican(oddWillGameGoToShootout[i].odd)} </Button> : ''}</td>)
            }
          }
        }

        let oddUnderOverBreakPoints = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Break points')): null;
        let trUnderOverBreakPoints = [];
        let tdUnderOverBreakPoints = [];
        if(!empty(oddUnderOverBreakPoints)){
          oddUnderOverBreakPoints = orderUnderAndOver(oddUnderOverBreakPoints);
          for(let i=0; i < oddUnderOverBreakPoints.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUnderOverBreakPoints.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Break points',oddUnderOverBreakPoints[i].marketType,oddUnderOverBreakPoints[i].factorExtra,"underoverbreakpoints" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverBreakPoints[i]) ? oddUnderOverBreakPoints[i].marketType=='Over' ? 'Más de' : oddUnderOverBreakPoints[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverBreakPoints[i]) ? oddUnderOverBreakPoints[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverBreakPoints[i].odd : this.props.convertOddToAmerican(oddUnderOverBreakPoints[i].odd)}</span>
                </Button></td>{tdUnderOverBreakPoints}</tr>);
                tdUnderOverBreakPoints = [];
              }else{
                tdUnderOverBreakPoints.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Break points',oddUnderOverBreakPoints[i].marketType,oddUnderOverBreakPoints[i].factorExtra,"underoverbreakpoints" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverBreakPoints[i]) ? oddUnderOverBreakPoints[i].marketType=='Over' ? 'Más de' : oddUnderOverBreakPoints[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverBreakPoints[i]) ? oddUnderOverBreakPoints[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverBreakPoints[i].odd : this.props.convertOddToAmerican(oddUnderOverBreakPoints[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverBreakPoints.length && !empty(tdUnderOverBreakPoints)){
                trUnderOverBreakPoints.push(<tr>{tdUnderOverBreakPoints}<td colSpan={4-tdUnderOverBreakPoints.length}>{' '}</td></tr>);
                tdUnderOverBreakPoints = []; 
              }
  
            }
        }

        let oddToQualify = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='To Qualify')): null;
        let tdToQualifyHome = []; 
        let tdToQualifyAway = []; 
        if(!empty(oddToQualify)){

          for(let i=0; i < oddToQualify.length; i++){
            if(oddToQualify[i].marketType=='1' && empty(tdToQualifyHome)){
              tdToQualifyHome.push(<td className={'text-center'}>{!empty(oddToQualify) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'To Qualify',oddToQualify[i].marketType,'toqualify');  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddToQualify[i].odd : this.props.convertOddToAmerican(oddToQualify[i].odd)}</Button> : ''}</td>)
            }
            if(oddToQualify[i].marketType=='2' && empty(tdToQualifyAway)){
              tdToQualifyAway.push(<td className={'text-center'}>{!empty(oddToQualify) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'To Qualify',oddToQualify[i].marketType,'toqualify');  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddToQualify[i].odd : this.props.convertOddToAmerican(oddToQualify[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddUnderOverTieBreakMatch = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Tie Break in the match')): null;
        let trUnderOverTieBreakMatch = [];
        let tdUnderOverTieBreakMatch = [];
        if(!empty(oddUnderOverTieBreakMatch)){
          oddUnderOverTieBreakMatch = orderUnderAndOver(oddUnderOverTieBreakMatch);
          for(let i=0; i < oddUnderOverTieBreakMatch.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUnderOverTieBreakMatch.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Tie Break in the match',oddUnderOverTieBreakMatch[i].marketType,oddUnderOverTieBreakMatch[i].factorExtra,"underovertiebreakmatch" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverTieBreakMatch[i]) ? oddUnderOverTieBreakMatch[i].marketType=='Over' ? 'Más de' : oddUnderOverTieBreakMatch[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverTieBreakMatch[i]) ? oddUnderOverTieBreakMatch[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverTieBreakMatch[i].odd : this.props.convertOddToAmerican(oddUnderOverTieBreakMatch[i].odd)}</span>
                </Button></td>{tdUnderOverTieBreakMatch}</tr>);
                tdUnderOverTieBreakMatch = [];
              }else{
                tdUnderOverTieBreakMatch.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Tie Break in the match',oddUnderOverTieBreakMatch[i].marketType,oddUnderOverTieBreakMatch[i].factorExtra,"underovertiebreakmatch" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverTieBreakMatch[i]) ? oddUnderOverTieBreakMatch[i].marketType=='Over' ? 'Más de' : oddUnderOverTieBreakMatch[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverTieBreakMatch[i]) ? oddUnderOverTieBreakMatch[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverTieBreakMatch[i].odd : this.props.convertOddToAmerican(oddUnderOverTieBreakMatch[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverTieBreakMatch.length && !empty(tdUnderOverTieBreakMatch)){
                trUnderOverTieBreakMatch.push(<tr>{tdUnderOverTieBreakMatch}<td colSpan={4-tdUnderOverTieBreakMatch.length}>{' '}</td></tr>);
                tdUnderOverTieBreakMatch = []; 
              }
  
            }
        }

        let oddUOESecondPeriod = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Exactly/Over - 2nd Period')): null;
        let trUOESecondPeriod = [];
        let tdUOESecondPeriod = [];
        if(!empty(oddUOESecondPeriod)){
          for(let i=0; i < oddUOESecondPeriod.length; i++){
            let x = i+1;  
              if(x%2==0){
                trUOESecondPeriod.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Exactly/Over - 2nd Period', oddUOESecondPeriod[i].marketType,oddUOESecondPeriod[i].factorExtra,"uoesecondperiod" );  } }>
                  <span className="sport-factor">{!empty(oddUOESecondPeriod[i]) ? oddUOESecondPeriod[i].marketType=='Over' ? 'Más de' : oddUOESecondPeriod[i].marketType=='Under' ? 'Menos de' : oddUOESecondPeriod[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddUOESecondPeriod[i]) ? oddUOESecondPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOESecondPeriod[i].odd : this.props.convertOddToAmerican(oddUOESecondPeriod[i].odd)}</span>
                </Button></td>{tdUOESecondPeriod}</tr>);
                tdUOESecondPeriod = [];
              }else{
                tdUOESecondPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Exactly/Over - 2nd Period',oddUOESecondPeriod[i].marketType,oddUOESecondPeriod[i].factorExtra,"uoesecondperiod" );  } }>
                  <span className="sport-factor">{!empty(oddUOESecondPeriod[i]) ? oddUOESecondPeriod[i].marketType=='Over' ? 'Más de' : oddUOESecondPeriod[i].marketType=='Under' ? 'Menos de' : oddUOESecondPeriod[i].marketType=='Exactly' ? 'Exactamente' : '' : ''}{' '}{!empty(oddUOESecondPeriod[i]) ? oddUOESecondPeriod[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOESecondPeriod[i].odd : this.props.convertOddToAmerican(oddUOESecondPeriod[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUOESecondPeriod.length && !empty(tdUOESecondPeriod)){
                trUOESecondPeriod.push(<tr>{tdUOESecondPeriod}<td colSpan={4-tdUOESecondPeriod.length}>{' '}</td></tr>);
                tdUOESecondPeriod = []; 
              }
  
            }
        }

        let oddNumberOfSets= !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Number Of Sets')): null;
        
        let trNumberOfSets = [];
        let tdNumberOfSets = [];
        if(!empty(oddNumberOfSets)){
          for(let i=0; i < oddNumberOfSets.length; i++){
            let x = i+1;  
            if(x%3==0){
              trNumberOfSets.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Number Of Sets',oddNumberOfSets[i].marketType,"numberofsets"); } }><span className="sport-factor">{!empty(oddNumberOfSets[i]) ? oddNumberOfSets[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddNumberOfSets[i].odd : this.props.convertOddToAmerican(oddNumberOfSets[i].odd)}</span></Button></td>{tdNumberOfSets}</tr>);
              tdNumberOfSets = [];
            }else{
              tdNumberOfSets.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Number Of Sets',oddNumberOfSets[i].marketType,"numberofsets");  } }><span className="sport-factor">{!empty(oddNumberOfSets[i]) ? oddNumberOfSets[i].marketType : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddNumberOfSets[i].odd : this.props.convertOddToAmerican(oddNumberOfSets[i].odd)}</span></Button></td>);
            }
            if(x==oddNumberOfSets.length && !empty(tdNumberOfSets)){
              trNumberOfSets.push(<tr>{tdNumberOfSets}<td colSpan={3-tdNumberOfSets.length}>{' '}</td></tr>);
              tdNumberOfSets = []; 
            }
          }

        }

        let oddUnderOverFirstInning = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over - 1st Inning')): null;
        let trUnderOverFirstInning = [];
        let tdUnderOverFirstInning = [];
        if(!empty(oddUnderOverFirstInning)){
          oddUnderOverFirstInning = orderUnderAndOver(oddUnderOverFirstInning);
          for(let i=0; i < oddUnderOverFirstInning.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUnderOverFirstInning.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - 1st Inning',oddUnderOverFirstInning[i].marketType,oddUnderOverFirstInning[i].factorExtra,"underoverfirstinning" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverFirstInning[i]) ? oddUnderOverFirstInning[i].marketType=='Over' ? 'Más de' : oddUnderOverFirstInning[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverFirstInning[i]) ? oddUnderOverFirstInning[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverFirstInning[i].odd : this.props.convertOddToAmerican(oddUnderOverFirstInning[i].odd)}</span>
                </Button></td>{tdUnderOverFirstInning}</tr>);
                tdUnderOverFirstInning = [];
              }else{
                tdUnderOverFirstInning.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over - 1st Inning',oddUnderOverFirstInning[i].marketType,oddUnderOverFirstInning[i].factorExtra,"underoverfirstinning" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverFirstInning[i]) ? oddUnderOverFirstInning[i].marketType=='Over' ? 'Más de' : oddUnderOverFirstInning[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverFirstInning[i]) ? oddUnderOverFirstInning[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverFirstInning[i].odd : this.props.convertOddToAmerican(oddUnderOverFirstInning[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverFirstInning.length && !empty(tdUnderOverFirstInning)){
                trUnderOverFirstInning.push(<tr>{tdUnderOverFirstInning}<td colSpan={4-tdUnderOverFirstInning.length}>{' '}</td></tr>);
                tdUnderOverFirstInning = []; 
              }
  
            }
        }

        let oddPlayerTripleDouble = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Player Triple Double')): null;
        let trPlayerTripleDouble = [];
        let tdPlayerTripleDouble = [];
        if(!empty(oddPlayerTripleDouble)){
          for(let i=0; i < oddPlayerTripleDouble.length; i++){
            let x = i+1;  
            let player = oddPlayerTripleDouble[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerTripleDouble.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Player Triple Double', oddPlayerTripleDouble[i].marketType,oddPlayerTripleDouble[i].factorExtra,"playertripledouble",oddPlayerTripleDouble[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[1]) ? player[1] : ''}{' '}{!empty(oddPlayerTripleDouble[i]) ? oddPlayerTripleDouble[i].marketType=='Yes' ? 'Sí' : oddPlayerTripleDouble[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerTripleDouble[i].odd : this.props.convertOddToAmerican(oddPlayerTripleDouble[i].odd)}</span>
                </Button></td>{tdPlayerTripleDouble}</tr>);
                tdPlayerTripleDouble = [];
              }else{
                tdPlayerTripleDouble.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Player Triple Double',oddPlayerTripleDouble[i].marketType,oddPlayerTripleDouble[i].factorExtra,"playertripledouble",oddPlayerTripleDouble[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[1]) ? player[1] : ''}{' '}{!empty(oddPlayerTripleDouble[i]) ? oddPlayerTripleDouble[i].marketType=='Yes' ? 'Sí' : oddPlayerTripleDouble[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerTripleDouble[i].odd : this.props.convertOddToAmerican(oddPlayerTripleDouble[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerTripleDouble.length && !empty(tdPlayerTripleDouble)){
                trPlayerTripleDouble.push(<tr>{tdPlayerTripleDouble}<td colSpan={3-tdPlayerTripleDouble.length}>{' '}</td></tr>);
                tdPlayerTripleDouble = []; 
              }
  
            }
        }

        let oddLastTeamToScoreOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Last Team to Score - Including Overtime')): null;
  
        let tdLastTeamToScoreOT1 = []; 
        let tdLastTeamToScoreOT2 = []; 
        if(!empty(oddLastTeamToScoreOT)){

          for(let i=0; i < oddLastTeamToScoreOT.length; i++){
            if(oddLastTeamToScoreOT[i].marketType=='1' && empty(tdLastTeamToScoreOT1)){
              tdLastTeamToScoreOT1.push(<td className={'text-center'}>{!empty(oddLastTeamToScoreOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Team to Score - Including Overtime',oddLastTeamToScoreOT[i].marketType,"lastteamtoscoreot");  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddLastTeamToScoreOT[i].odd : this.props.convertOddToAmerican(oddLastTeamToScoreOT[i].odd)}</Button> : ''}</td>)
            }
            if(oddLastTeamToScoreOT[i].marketType=='2'  && empty(tdLastTeamToScoreOT2)){
              tdLastTeamToScoreOT2.push(<td className={'text-center'}>{!empty(oddLastTeamToScoreOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Last Team to Score - Including Overtime',oddLastTeamToScoreOT[i].marketType,"lastteamtoscoreot");  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddLastTeamToScoreOT[i].odd : this.props.convertOddToAmerican(oddLastTeamToScoreOT[i].odd)} </Button> : ''}</td>)
            }
          }

        }

        let oddWillGameDecidedExtraTime = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Will Game Decided in Extra Time?')): null;
        
        let tdWillGameDecidedExtraTimeYes = [];
        let tdWillGameDecidedExtraTimeNo = [];

        if(!empty(oddWillGameDecidedExtraTime)){
          for(let i=0; i < oddWillGameDecidedExtraTime.length; i++){
            if(oddWillGameDecidedExtraTime[i].marketType=='Yes' && empty(tdWillGameDecidedExtraTimeYes)){
              tdWillGameDecidedExtraTimeYes.push(<td className={'text-center'}>{!empty(oddWillGameDecidedExtraTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will Game Decided in Extra Time?',oddWillGameDecidedExtraTime[i].marketType,'willgamedecidedextratime');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddWillGameDecidedExtraTime[i].odd : this.props.convertOddToAmerican(oddWillGameDecidedExtraTime[i].odd)}</Button> : ''}</td>)
            }
            if(oddWillGameDecidedExtraTime[i].marketType=='No' && empty(tdWillGameDecidedExtraTimeNo)){
              tdWillGameDecidedExtraTimeNo.push(<td className={'text-center'}>{!empty(oddWillGameDecidedExtraTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Will Game Decided in Extra Time?',oddWillGameDecidedExtraTime[i].marketType,'willgamedecidedextratime');  } }><span className="sport-factor">{!empty(oddWillGameDecidedExtraTime[i]) ? oddWillGameDecidedExtraTime[i].marketType : ''}</span> {showOdds == 'D' ? oddWillGameDecidedExtraTime[i].odd : this.props.convertOddToAmerican(oddWillGameDecidedExtraTime[i].odd)}</Button> : ''}</td>)
            }
          }
        }

        let oddCupWinner = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Cup Winner')): null;
        let tdCupWinnerHome = []; 
        let tdCupWinnerAway = []; 
        if(!empty(oddCupWinner)){

          for(let i=0; i < oddCupWinner.length; i++){
            if(oddCupWinner[i].marketType=='1' && empty(tdCupWinnerHome)){
              tdCupWinnerHome.push(<td className={'text-center'}>{!empty(oddCupWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Cup Winner',oddCupWinner[i].marketType,'cupwinner');  } }><span className="sport-factor">{events[0].eventHome}</span> {showOdds == 'D' ? oddCupWinner[i].odd : this.props.convertOddToAmerican(oddCupWinner[i].odd)}</Button> : ''}</td>)
            }
            if(oddCupWinner[i].marketType=='2' && empty(tdCupWinnerAway)){
              tdCupWinnerAway.push(<td className={'text-center'}>{!empty(oddCupWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Cup Winner',oddCupWinner[i].marketType,'cupwinner');  } }><span className="sport-factor">{events[0].eventAway}</span> {showOdds == 'D' ? oddCupWinner[i].odd : this.props.convertOddToAmerican(oddCupWinner[i].odd)} </Button> : ''}</td>)
            }
          }

        }

        let oddCornersRange = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Corners Range')): null;
        let trCornersRange = [];
        let tdCornersRange = [];
        if(!empty(oddCornersRange)){
          for(let i=0; i < oddCornersRange.length; i++){
            let x = i+1;  
              if(x%3==0){
                trCornersRange.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Corners Range',oddCornersRange[i].marketType,"cornersrange");  } }>
                  <span className="sport-factor">{!empty(oddCornersRange[i]) ? oddCornersRange[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCornersRange[i].odd : this.props.convertOddToAmerican(oddCornersRange[i].odd)}</span>
                </Button></td>{tdCornersRange}</tr>);
                tdCornersRange = [];
              }else{
                tdCornersRange.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'Corners Range',oddCornersRange[i].marketType,"cornersrange");  } }>
                  <span className="sport-factor">{!empty(oddCornersRange[i]) ? oddCornersRange[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddCornersRange[i].odd : this.props.convertOddToAmerican(oddCornersRange[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddCornersRange.length && !empty(tdCornersRange)){
                trCornersRange.push(<tr>{tdCornersRange}<td colSpan={3-tdCornersRange.length}>{' '}</td></tr>);
                tdCornersRange = []; 
              }
            }
        }

        let oddTeamWithHighestScoringInning = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Team With Highest Scoring Inning')): null;

        let tdTeamWithHighestScoringInning1 = []; 
        let tdTeamWithHighestScoringInningX = []; 
        let tdTeamWithHighestScoringInning2 = []; 
        if(!empty(oddTeamWithHighestScoringInning)){

          for(let i=0; i < oddTeamWithHighestScoringInning.length; i++){
            if(oddTeamWithHighestScoringInning[i].marketType=='1' && empty(tdTeamWithHighestScoringInning1)){
              tdTeamWithHighestScoringInning1.push(<td className={'text-center'}>{!empty(oddTeamWithHighestScoringInning) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Team With Highest Scoring Inning',oddTeamWithHighestScoringInning[i].marketType,'teamwithhighestscoringinning');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventHome : ''}</span> {showOdds == 'D' ? oddTeamWithHighestScoringInning[i].odd : this.props.convertOddToAmerican(oddTeamWithHighestScoringInning[i].odd)}</Button> : ''}</td>)
            }
            if(oddTeamWithHighestScoringInning[i].marketType=='X'  && empty(tdTeamWithHighestScoringInningX)){
              tdTeamWithHighestScoringInningX.push(<td className={'text-center'}>{!empty(oddTeamWithHighestScoringInning) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Team With Highest Scoring Inning',oddTeamWithHighestScoringInning[i].marketType,'teamwithhighestscoringinning');  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? oddTeamWithHighestScoringInning[i].odd : this.props.convertOddToAmerican(oddTeamWithHighestScoringInning[i].odd)}</Button> : ''}</td>)
            }
            if(oddTeamWithHighestScoringInning[i].marketType=='2' && empty(tdTeamWithHighestScoringInning2)){
              tdTeamWithHighestScoringInning2.push(<td className={'text-center'}>{!empty(oddTeamWithHighestScoringInning) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Team With Highest Scoring Inning',oddTeamWithHighestScoringInning[i].marketType,'teamwithhighestscoringinning');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventAway : ''}</span> {showOdds == 'D' ? oddTeamWithHighestScoringInning[i].odd : this.props.convertOddToAmerican(oddTeamWithHighestScoringInning[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddARunFirstInning = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='A Run in the 1st Inning')): null;
        
        let tdARunFirstInningYes = [];
        let tdARunFirstInningNo = [];

        if(!empty(oddARunFirstInning)){
          for(let i=0; i < oddARunFirstInning.length; i++){
            if(oddARunFirstInning[i].marketType=='Yes' && empty(tdARunFirstInningYes)){
              tdARunFirstInningYes.push(<td className={'text-center'}>{!empty(oddARunFirstInning) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'A Run in the 1st Inning',oddARunFirstInning[i].marketType,'arunfirstinning');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddARunFirstInning[i].odd : this.props.convertOddToAmerican(oddARunFirstInning[i].odd)} </Button> : ''}</td>)
            }
            if(oddARunFirstInning[i].marketType=='No' && empty(tdARunFirstInningNo)){
              tdARunFirstInningNo.push(<td className={'text-center'}>{!empty(oddARunFirstInning) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0],'A Run in the 1st Inning',oddARunFirstInning[i].marketType,'arunfirstinning');  } }><span className="sport-factor">{!empty(oddARunFirstInning[i]) ? oddARunFirstInning[i].marketType : ''}</span> {showOdds == 'D' ? oddARunFirstInning[i].odd : this.props.convertOddToAmerican(oddARunFirstInning[i].odd)} </Button> : ''}</td>)
            }
          }
        }

        let oddUnderOverFirst5Innings = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st 5 Innings Under/Over')): null;
        let trUnderOverFirst5Innings = [];
        let tdUnderOverFirst5Innings = [];
        if(!empty(oddUnderOverFirst5Innings)){
          oddUnderOverFirst5Innings = orderUnderAndOver(oddUnderOverFirst5Innings);
          for(let i=0; i < oddUnderOverFirst5Innings.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUnderOverFirst5Innings.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'1st 5 Innings Under/Over',oddUnderOverFirst5Innings[i].marketType,oddUnderOverFirst5Innings[i].factorExtra,"underoverfirst5innings" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverFirst5Innings[i]) ? oddUnderOverFirst5Innings[i].marketType=='Over' ? 'Más de' : oddUnderOverFirst5Innings[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverFirst5Innings[i]) ? oddUnderOverFirst5Innings[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverFirst5Innings[i].odd : this.props.convertOddToAmerican(oddUnderOverFirst5Innings[i].odd)} </span>
                </Button></td>{tdUnderOverFirst5Innings}</tr>);
                tdUnderOverFirst5Innings = [];
              }else{
                tdUnderOverFirst5Innings.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'1st 5 Innings Under/Over',oddUnderOverFirst5Innings[i].marketType,oddUnderOverFirst5Innings[i].factorExtra,"underoverfirst5innings" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverFirst5Innings[i]) ? oddUnderOverFirst5Innings[i].marketType=='Over' ? 'Más de' : oddUnderOverFirst5Innings[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverFirst5Innings[i]) ? oddUnderOverFirst5Innings[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverFirst5Innings[i].odd : this.props.convertOddToAmerican(oddUnderOverFirst5Innings[i].odd)} </span>
                </Button></td>);
              }

              if(x==oddUnderOverFirst5Innings.length && !empty(tdUnderOverFirst5Innings)){
                trUnderOverFirst5Innings.push(<tr>{tdUnderOverFirst5Innings}<td colSpan={4-tdUnderOverFirst5Innings.length}>{' '}</td></tr>);
                tdUnderOverFirst5Innings = []; 
              }
  
            }
        }

        let oddPlayerTotalBases = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Total Bases')): null;
        let trPlayerTotalBases = [];
        let tdPlayerTotalBases = [];
        if(!empty(oddPlayerTotalBases)){
          oddPlayerTotalBases = orderUnderAndOver(oddPlayerTotalBases);
          for(let i=0; i < oddPlayerTotalBases.length; i++){
            let x = i+1;  
            let player = oddPlayerTotalBases[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerTotalBases.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Total Bases', oddPlayerTotalBases[i].marketType,oddPlayerTotalBases[i].factorExtra,"uoplayertotalbases",oddPlayerTotalBases[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerTotalBases[i]) ? oddPlayerTotalBases[i].marketType=='Over' ? 'Más de' : oddPlayerTotalBases[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerTotalBases[i]) ? oddPlayerTotalBases[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerTotalBases[i].odd : this.props.convertOddToAmerican(oddPlayerTotalBases[i].odd)}</span>
                </Button></td>{tdPlayerTotalBases}</tr>);
                tdPlayerTotalBases = [];
              }else{
                tdPlayerTotalBases.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Total Bases',oddPlayerTotalBases[i].marketType,oddPlayerTotalBases[i].factorExtra,"uoplayertotalbases",oddPlayerTotalBases[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerTotalBases[i]) ? oddPlayerTotalBases[i].marketType=='Over' ? 'Más de' : oddPlayerTotalBases[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerTotalBases[i]) ? oddPlayerTotalBases[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerTotalBases[i].odd : this.props.convertOddToAmerican(oddPlayerTotalBases[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerTotalBases.length && !empty(tdPlayerTotalBases)){
                trPlayerTotalBases.push(<tr>{tdPlayerTotalBases}<td colSpan={3-tdPlayerTotalBases.length}>{' '}</td></tr>);
                tdPlayerTotalBases = []; 
              }
  
            }
        }

        let oddPlayerHomeRuns = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Home Runs')): null;
        let trPlayerHomeRuns = [];
        let tdPlayerHomeRuns = [];
        if(!empty(oddPlayerHomeRuns)){
          oddPlayerHomeRuns = orderUnderAndOver(oddPlayerHomeRuns);
          for(let i=0; i < oddPlayerHomeRuns.length; i++){
            let x = i+1;  
            let player = oddPlayerHomeRuns[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerHomeRuns.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Home Runs', oddPlayerHomeRuns[i].marketType,oddPlayerHomeRuns[i].factorExtra,"uoplayerhomeruns",oddPlayerHomeRuns[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerHomeRuns[i]) ? oddPlayerHomeRuns[i].marketType=='Over' ? 'Más de' : oddPlayerHomeRuns[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerHomeRuns[i]) ? oddPlayerHomeRuns[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerHomeRuns[i].odd : this.props.convertOddToAmerican(oddPlayerHomeRuns[i].odd)}</span>
                </Button></td>{tdPlayerHomeRuns}</tr>);
                tdPlayerHomeRuns = [];
              }else{
                tdPlayerHomeRuns.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Home Runs',oddPlayerHomeRuns[i].marketType,oddPlayerHomeRuns[i].factorExtra,"uoplayerhomeruns",oddPlayerHomeRuns[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerHomeRuns[i]) ? oddPlayerHomeRuns[i].marketType=='Over' ? 'Más de' : oddPlayerHomeRuns[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerHomeRuns[i]) ? oddPlayerHomeRuns[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerHomeRuns[i].odd : this.props.convertOddToAmerican(oddPlayerHomeRuns[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerHomeRuns.length && !empty(tdPlayerHomeRuns)){
                trPlayerHomeRuns.push(<tr>{tdPlayerHomeRuns}<td colSpan={3-tdPlayerHomeRuns.length}>{' '}</td></tr>);
                tdPlayerHomeRuns = []; 
              }
  
            }
        }

        let oddPlayerSingles = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Singles')): null;
        let trPlayerSingles = [];
        let tdPlayerSingles = [];
        if(!empty(oddPlayerSingles)){
          for(let i=0; i < oddPlayerSingles.length; i++){
            let x = i+1;  
            let player = oddPlayerSingles[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerSingles.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Singles', oddPlayerSingles[i].marketType,oddPlayerSingles[i].factorExtra,"uoplayersingles",oddPlayerSingles[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerSingles[i]) ? oddPlayerSingles[i].marketType=='Over' ? 'Más de' : oddPlayerSingles[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerSingles[i]) ? oddPlayerSingles[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerSingles[i].odd : this.props.convertOddToAmerican(oddPlayerSingles[i].odd)}</span>
                </Button></td>{tdPlayerSingles}</tr>);
                tdPlayerSingles = [];
              }else{
                tdPlayerSingles.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Singles',oddPlayerSingles[i].marketType,oddPlayerSingles[i].factorExtra,"uoplayersingles",oddPlayerSingles[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerSingles[i]) ? oddPlayerSingles[i].marketType=='Over' ? 'Más de' : oddPlayerSingles[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerSingles[i]) ? oddPlayerSingles[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerSingles[i].odd : this.props.convertOddToAmerican(oddPlayerSingles[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerSingles.length && !empty(tdPlayerSingles)){
                trPlayerSingles.push(<tr>{tdPlayerSingles}<td colSpan={3-tdPlayerSingles.length}>{' '}</td></tr>);
                tdPlayerSingles = []; 
              }
  
            }
        }

        let oddPlayerDoubles = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Doubles')): null;
        let trPlayerDoubles = [];
        let tdPlayerDoubles = [];
        if(!empty(oddPlayerDoubles)){
          for(let i=0; i < oddPlayerDoubles.length; i++){
            let x = i+1;  
            let player = oddPlayerDoubles[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerDoubles.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Doubles', oddPlayerDoubles[i].marketType,oddPlayerDoubles[i].factorExtra,"uoplayerdoubles",oddPlayerDoubles[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerDoubles[i]) ? oddPlayerDoubles[i].marketType=='Over' ? 'Más de' : oddPlayerDoubles[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerDoubles[i]) ? oddPlayerDoubles[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerDoubles[i].odd : this.props.convertOddToAmerican(oddPlayerDoubles[i].odd)}</span>
                </Button></td>{tdPlayerDoubles}</tr>);
                tdPlayerDoubles = [];
              }else{
                tdPlayerDoubles.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Doubles',oddPlayerDoubles[i].marketType,oddPlayerDoubles[i].factorExtra,"uoplayerdoubles",oddPlayerDoubles[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerDoubles[i]) ? oddPlayerDoubles[i].marketType=='Over' ? 'Más de' : oddPlayerDoubles[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerDoubles[i]) ? oddPlayerDoubles[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerDoubles[i].odd : this.props.convertOddToAmerican(oddPlayerDoubles[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerDoubles.length && !empty(tdPlayerDoubles)){
                trPlayerDoubles.push(<tr>{tdPlayerDoubles}<td colSpan={3-tdPlayerDoubles.length}>{' '}</td></tr>);
                tdPlayerDoubles = []; 
              }
  
            }
        }

        let oddPlayer3PointMade = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player 3 Points Made')): null;
        let trPlayer3PointMade = [];
        let tdPlayer3PointMade = [];
        if(!empty(oddPlayer3PointMade)){
          oddPlayer3PointMade = orderUnderAndOver(oddPlayer3PointMade);
          for(let i=0; i < oddPlayer3PointMade.length; i++){
            let x = i+1;  
            let player = oddPlayer3PointMade[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayer3PointMade.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player 3 Points Made', oddPlayer3PointMade[i].marketType,oddPlayer3PointMade[i].factorExtra,"uoplayer3points",oddPlayer3PointMade[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayer3PointMade[i]) ? oddPlayer3PointMade[i].marketType=='Over' ? 'Más de' : oddPlayer3PointMade[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayer3PointMade[i]) ? oddPlayer3PointMade[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayer3PointMade[i].odd : this.props.convertOddToAmerican(oddPlayer3PointMade[i].odd)}</span>
                </Button></td>{tdPlayer3PointMade}</tr>);
                tdPlayer3PointMade = [];
              }else{
                tdPlayer3PointMade.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player 3 Points Made',oddPlayer3PointMade[i].marketType,oddPlayer3PointMade[i].factorExtra,"uoplayer3points",oddPlayer3PointMade[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayer3PointMade[i]) ? oddPlayer3PointMade[i].marketType=='Over' ? 'Más de' : oddPlayer3PointMade[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayer3PointMade[i]) ? oddPlayer3PointMade[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayer3PointMade[i].odd : this.props.convertOddToAmerican(oddPlayer3PointMade[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayer3PointMade.length && !empty(tdPlayer3PointMade)){
                trPlayer3PointMade.push(<tr>{tdPlayer3PointMade}<td colSpan={3-tdPlayer3PointMade.length}>{' '}</td></tr>);
                tdPlayer3PointMade = []; 
              }
  
            }
        }

        let oddPlayerRuns = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Runs')): null;
        let trPlayerRuns = [];
        let tdPlayerRuns = [];
        if(!empty(oddPlayerRuns)){
          oddPlayerRuns = orderUnderAndOver(oddPlayerRuns);
          for(let i=0; i < oddPlayerRuns.length; i++){
            let x = i+1;  
            let player = oddPlayerRuns[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerRuns.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Runs', oddPlayerRuns[i].marketType,oddPlayerRuns[i].factorExtra,"uoplayerruns",oddPlayerRuns[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerRuns[i]) ? oddPlayerRuns[i].marketType=='Over' ? 'Más de' : oddPlayerRuns[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerRuns[i]) ? oddPlayerRuns[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerRuns[i].odd : this.props.convertOddToAmerican(oddPlayerRuns[i].odd)}</span>
                </Button></td>{tdPlayerRuns}</tr>);
                tdPlayerRuns = [];
              }else{
                tdPlayerRuns.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Runs',oddPlayerRuns[i].marketType,oddPlayerRuns[i].factorExtra,"uoplayerruns",oddPlayerRuns[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerRuns[i]) ? oddPlayerRuns[i].marketType=='Over' ? 'Más de' : oddPlayerRuns[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerRuns[i]) ? oddPlayerRuns[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerRuns[i].odd : this.props.convertOddToAmerican(oddPlayerRuns[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerRuns.length && !empty(tdPlayerRuns)){
                trPlayerRuns.push(<tr>{tdPlayerRuns}<td colSpan={3-tdPlayerRuns.length}>{' '}</td></tr>);
                tdPlayerRuns = []; 
              }
  
            }
        }

        let oddPlayerStolenBases = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Stolen Bases')): null;
        let trPlayerStolenBases = [];
        let tdPlayerStolenBases = [];
        if(!empty(oddPlayerStolenBases)){
          oddPlayerStolenBases = orderUnderAndOver(oddPlayerStolenBases);
          for(let i=0; i < oddPlayerStolenBases.length; i++){
            let x = i+1;  
            let player = oddPlayerStolenBases[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPlayerStolenBases.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Stolen Bases', oddPlayerStolenBases[i].marketType,oddPlayerStolenBases[i].factorExtra,"uoplayerstolenbases",oddPlayerStolenBases[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerStolenBases[i]) ? oddPlayerStolenBases[i].marketType=='Over' ? 'Más de' : oddPlayerStolenBases[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerStolenBases[i]) ? oddPlayerStolenBases[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerStolenBases[i].odd : this.props.convertOddToAmerican(oddPlayerStolenBases[i].odd)}</span>
                </Button></td>{tdPlayerStolenBases}</tr>);
                tdPlayerStolenBases = [];
              }else{
                tdPlayerStolenBases.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Stolen Bases',oddPlayerStolenBases[i].marketType,oddPlayerStolenBases[i].factorExtra,"uoplayerstolenbases",oddPlayerStolenBases[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPlayerStolenBases[i]) ? oddPlayerStolenBases[i].marketType=='Over' ? 'Más de' : oddPlayerStolenBases[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPlayerStolenBases[i]) ? oddPlayerStolenBases[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPlayerStolenBases[i].odd : this.props.convertOddToAmerican(oddPlayerStolenBases[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPlayerStolenBases.length && !empty(tdPlayerStolenBases)){
                trPlayerStolenBases.push(<tr>{tdPlayerStolenBases}<td colSpan={3-tdPlayerStolenBases.length}>{' '}</td></tr>);
                tdPlayerStolenBases = []; 
              }
  
            }
        }

        // let oddFirst5InningsAsianHandicap = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st 5 Innings Asian Handicap')): null;
        // let trFirst5InningsAsianHandicap = [];
        // let tdFirst5InningsAsianHandicap = [];

        // if(!empty(oddFirst5InningsAsianHandicap)){
        //   for(let i=0; i < oddFirst5InningsAsianHandicap.length; i++){
        //     let factorExtra = oddFirst5InningsAsianHandicap[i].factorExtra.split(' ');
        //     let x = i+1;  
        //     if(x%2==0){
        //       trFirst5InningsAsianHandicap.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'1st 5 Innings Asian Handicap',oddFirst5InningsAsianHandicap[i].marketType,factorExtra[0],"first5inningsasianhandicap"); } }><span className="sport-factor">{!empty(oddFirst5InningsAsianHandicap[i]) && oddFirst5InningsAsianHandicap[i].marketType=='1' ? events[0].eventHome : oddFirst5InningsAsianHandicap[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddFirst5InningsAsianHandicap[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddFirst5InningsAsianHandicap[i].odd : this.props.convertOddToAmerican(oddFirst5InningsAsianHandicap[i].odd)}</span></Button></td>{tdFirst5InningsAsianHandicap}</tr>);
        //       tdFirst5InningsAsianHandicap = [];
        //     }else{
        //       tdFirst5InningsAsianHandicap.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[0],'1st 5 Innings Asian Handicap',oddFirst5InningsAsianHandicap[i].marketType,factorExtra[0],"first5inningsasianhandicap"); } }><span className="sport-factor">{!empty(oddFirst5InningsAsianHandicap[i]) && oddFirst5InningsAsianHandicap[i].marketType=='1' ? events[0].eventHome : oddFirst5InningsAsianHandicap[i].marketType=='2' ? events[0].eventAway : ''}</span> <span className="sport-factor">{!empty(oddFirst5InningsAsianHandicap[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddFirst5InningsAsianHandicap[i].odd : this.props.convertOddToAmerican(oddFirst5InningsAsianHandicap[i].odd)}</span></Button></td>);
        //     }
        //     if(x==oddFirst5InningsAsianHandicap.length && !empty(tdFirst5InningsAsianHandicap)){
        //       trFirst5InningsAsianHandicap.push(<tr>{tdFirst5InningsAsianHandicap}<td colSpan={4-tdFirst5InningsAsianHandicap.length}>{' '}</td></tr>);
        //       tdFirst5InningsAsianHandicap = []; 
        //     }
        //   }
        // }

        let oddUOPlayerTriples = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Player Triples')): null;
        let trUOPlayerTriples = [];
        let tdUOPlayerTriples = [];
        if(!empty(oddUOPlayerTriples)){
          oddUOPlayerTriples = orderUnderAndOver(oddUOPlayerTriples);
          for(let i=0; i < oddUOPlayerTriples.length; i++){
            let x = i+1;  
            let player = oddUOPlayerTriples[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trUOPlayerTriples.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Triples', oddUOPlayerTriples[i].marketType,oddUOPlayerTriples[i].factorExtra,"uoplayertriples",oddUOPlayerTriples[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddUOPlayerTriples[i]) ? oddUOPlayerTriples[i].marketType=='Over' ? 'Más de' : oddUOPlayerTriples[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUOPlayerTriples[i]) ? oddUOPlayerTriples[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOPlayerTriples[i].odd : this.props.convertOddToAmerican(oddUOPlayerTriples[i].odd)}</span>
                </Button></td>{tdUOPlayerTriples}</tr>);
                tdUOPlayerTriples = [];
              }else{
                tdUOPlayerTriples.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Player Triples',oddUOPlayerTriples[i].marketType,oddUOPlayerTriples[i].factorExtra,"uoplayertriples",oddUOPlayerTriples[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddUOPlayerTriples[i]) ? oddUOPlayerTriples[i].marketType=='Over' ? 'Más de' : oddUOPlayerTriples[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUOPlayerTriples[i]) ? oddUOPlayerTriples[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOPlayerTriples[i].odd : this.props.convertOddToAmerican(oddUOPlayerTriples[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUOPlayerTriples.length && !empty(tdUOPlayerTriples)){
                trUOPlayerTriples.push(<tr>{tdUOPlayerTriples}<td colSpan={3-tdUOPlayerTriples.length}>{' '}</td></tr>);
                tdUOPlayerTriples = []; 
              }
  
            }
        }

        let oddUOPitcherStrikeouts = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Pitcher Strikeouts')): null;
        let trUOPitcherStrikeouts = [];
        let tdUOPitcherStrikeouts = [];
        if(!empty(oddUOPitcherStrikeouts)){
          oddUOPitcherStrikeouts = orderUnderAndOver(oddUOPitcherStrikeouts);
          for(let i=0; i < oddUOPitcherStrikeouts.length; i++){
            let x = i+1;  
            let player = oddUOPitcherStrikeouts[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trUOPitcherStrikeouts.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Pitcher Strikeouts', oddUOPitcherStrikeouts[i].marketType,oddUOPitcherStrikeouts[i].factorExtra,"uopitcherstrikeouts",oddUOPitcherStrikeouts[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddUOPitcherStrikeouts[i]) ? oddUOPitcherStrikeouts[i].marketType=='Over' ? 'Más de' : oddUOPitcherStrikeouts[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUOPitcherStrikeouts[i]) ? oddUOPitcherStrikeouts[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOPitcherStrikeouts[i].odd : this.props.convertOddToAmerican(oddUOPitcherStrikeouts[i].odd)}</span>
                </Button></td>{tdUOPitcherStrikeouts}</tr>);
                tdUOPitcherStrikeouts = [];
              }else{
                tdUOPitcherStrikeouts.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Pitcher Strikeouts',oddUOPitcherStrikeouts[i].marketType,oddUOPitcherStrikeouts[i].factorExtra,"uopitcherstrikeouts",oddUOPitcherStrikeouts[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddUOPitcherStrikeouts[i]) ? oddUOPitcherStrikeouts[i].marketType=='Over' ? 'Más de' : oddUOPitcherStrikeouts[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUOPitcherStrikeouts[i]) ? oddUOPitcherStrikeouts[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOPitcherStrikeouts[i].odd : this.props.convertOddToAmerican(oddUOPitcherStrikeouts[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddUOPitcherStrikeouts.length && !empty(tdUOPitcherStrikeouts)){
                trUOPitcherStrikeouts.push(<tr>{tdUOPitcherStrikeouts}<td colSpan={3-tdUOPitcherStrikeouts.length}>{' '}</td></tr>);
                tdUOPitcherStrikeouts = []; 
              }
  
            }
        }

        let oddUOHitsOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Hits - Including Overtime')): null;
        let trUOHitsOT = [];
        let tdUOHitsOT = [];
        if(!empty(oddUOHitsOT)){
          oddUOHitsOT = orderUnderAndOver(oddUOHitsOT);
          for(let i=0; i < oddUOHitsOT.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUOHitsOT.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Hits - Including Overtime',oddUOHitsOT[i].marketType,oddUOHitsOT[i].factorExtra,"uohits" );  } }>
                  <span className="sport-factor">{!empty(oddUOHitsOT[i]) ? oddUOHitsOT[i].marketType=='Over' ? 'Más de' : oddUOHitsOT[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUOHitsOT[i]) ? oddUOHitsOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOHitsOT[i].odd : this.props.convertOddToAmerican(oddUOHitsOT[i].odd)}</span>
                </Button></td>{tdUOHitsOT}</tr>);
                tdUOHitsOT = [];
              }else{
                tdUOHitsOT.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Hits - Including Overtime',oddUOHitsOT[i].marketType,oddUOHitsOT[i].factorExtra,"uohits" );  } }>
                  <span className="sport-factor">{!empty(oddUOHitsOT[i]) ? oddUOHitsOT[i].marketType=='Over' ? 'Más de' : oddUOHitsOT[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUOHitsOT[i]) ? oddUOHitsOT[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUOHitsOT[i].odd : this.props.convertOddToAmerican(oddUOHitsOT[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUOHitsOT.length && !empty(tdUOHitsOT)){
                trUOHitsOT.push(<tr>{tdUOHitsOT}<td colSpan={4-tdUOHitsOT.length}>{' '}</td></tr>);
                tdUOHitsOT = []; 
              }
  
            }
        }

        let oddPitcherRecordWin = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Pitcher To Record The Win')): null;
        let trPitcherRecordWin = [];
        let tdPitcherRecordWin = [];
        if(!empty(oddPitcherRecordWin)){
          for(let i=0; i < oddPitcherRecordWin.length; i++){
            let x = i+1;  
            let player = oddPitcherRecordWin[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPitcherRecordWin.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Pitcher To Record The Win', oddPitcherRecordWin[i].marketType,oddPitcherRecordWin[i].factorExtra,"pitcherrecordwin",oddPitcherRecordWin[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[1]) ? player[1] : ''}{' '}{!empty(oddPitcherRecordWin[i]) ? oddPitcherRecordWin[i].marketType=='Yes' ? 'Sí' : oddPitcherRecordWin[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPitcherRecordWin[i].odd : this.props.convertOddToAmerican(oddPitcherRecordWin[i].odd)}</span>
                </Button></td>{tdPitcherRecordWin}</tr>);
                tdPitcherRecordWin = [];
              }else{
                tdPitcherRecordWin.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Pitcher To Record The Win',oddPitcherRecordWin[i].marketType,oddPitcherRecordWin[i].factorExtra,"pitcherrecordwin",oddPitcherRecordWin[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[1]) ? player[1] : ''}{' '}{!empty(oddPitcherRecordWin[i]) ? oddPitcherRecordWin[i].marketType=='Yes' ? 'Sí' : oddPitcherRecordWin[i].marketType : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPitcherRecordWin[i].odd : this.props.convertOddToAmerican(oddPitcherRecordWin[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPitcherRecordWin.length && !empty(tdPitcherRecordWin)){
                trPitcherRecordWin.push(<tr>{tdPitcherRecordWin}<td colSpan={3-tdPitcherRecordWin.length}>{' '}</td></tr>);
                tdPitcherRecordWin = []; 
              }
  
            }
        }

        let oddPitcherRunsEarned = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Pitcher Runs Earned')): null;
        let trPitcherRunsEarned = [];
        let tdPitcherRunsEarned = [];
        if(!empty(oddPitcherRunsEarned)){
          oddPitcherRunsEarned = orderUnderAndOver(oddPitcherRunsEarned);
          for(let i=0; i < oddPitcherRunsEarned.length; i++){
            let x = i+1;  
            let player = oddPitcherRunsEarned[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPitcherRunsEarned.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Pitcher Runs Earned', oddPitcherRunsEarned[i].marketType,oddPitcherRunsEarned[i].factorExtra,"uopitcherrunsearned",oddPitcherRunsEarned[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPitcherRunsEarned[i]) ? oddPitcherRunsEarned[i].marketType=='Over' ? 'Más de' : oddPitcherRunsEarned[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPitcherRunsEarned[i]) ? oddPitcherRunsEarned[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPitcherRunsEarned[i].odd : this.props.convertOddToAmerican(oddPitcherRunsEarned[i].odd)}</span>
                </Button></td>{tdPitcherRunsEarned}</tr>);
                tdPitcherRunsEarned = [];
              }else{
                tdPitcherRunsEarned.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Pitcher Runs Earned',oddPitcherRunsEarned[i].marketType,oddPitcherRunsEarned[i].factorExtra,"uopitcherrunsearned",oddPitcherRunsEarned[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPitcherRunsEarned[i]) ? oddPitcherRunsEarned[i].marketType=='Over' ? 'Más de' : oddPitcherRunsEarned[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPitcherRunsEarned[i]) ? oddPitcherRunsEarned[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPitcherRunsEarned[i].odd : this.props.convertOddToAmerican(oddPitcherRunsEarned[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPitcherRunsEarned.length && !empty(tdPitcherRunsEarned)){
                trPitcherRunsEarned.push(<tr>{tdPitcherRunsEarned}<td colSpan={3-tdPitcherRunsEarned.length}>{' '}</td></tr>);
                tdPitcherRunsEarned = []; 
              }
  
            }
        }

        let oddPitcherHitsAllowed = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Pitcher Hits Allowed')): null;
        let trPitcherHitsAllowed = [];
        let tdPitcherHitsAllowed = [];
        if(!empty(oddPitcherHitsAllowed)){
          oddPitcherHitsAllowed = orderUnderAndOver(oddPitcherHitsAllowed);
          for(let i=0; i < oddPitcherHitsAllowed.length; i++){
            let x = i+1;  
            let player = oddPitcherHitsAllowed[i].marketTypeDetail.split(' ');
              if(x%3==0){
                trPitcherHitsAllowed.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Pitcher Hits Allowed', oddPitcherHitsAllowed[i].marketType,oddPitcherHitsAllowed[i].factorExtra,"uopitcherhitsallowed",oddPitcherHitsAllowed[i].marketTypeDetail);  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPitcherHitsAllowed[i]) ? oddPitcherHitsAllowed[i].marketType=='Over' ? 'Más de' : oddPitcherHitsAllowed[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPitcherHitsAllowed[i]) ? oddPitcherHitsAllowed[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPitcherHitsAllowed[i].odd : this.props.convertOddToAmerican(oddPitcherHitsAllowed[i].odd)}</span>
                </Button></td>{tdPitcherHitsAllowed}</tr>);
                tdPitcherHitsAllowed = [];
              }else{
                tdPitcherHitsAllowed.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraMarketTypeDetail(events[0],'Under/Over Pitcher Hits Allowed',oddPitcherHitsAllowed[i].marketType,oddPitcherHitsAllowed[i].factorExtra,"uopitcherhitsallowed",oddPitcherHitsAllowed[i].marketTypeDetail );  } }>
                  <span className="sport-factor">{player[0]}{' '}{!empty(player[2]) ? player[1] : ''}{' '}{!empty(oddPitcherHitsAllowed[i]) ? oddPitcherHitsAllowed[i].marketType=='Over' ? 'Más de' : oddPitcherHitsAllowed[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddPitcherHitsAllowed[i]) ? oddPitcherHitsAllowed[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddPitcherHitsAllowed[i].odd : this.props.convertOddToAmerican(oddPitcherHitsAllowed[i].odd)}</span>
                </Button></td>);
              }
              if(x==oddPitcherHitsAllowed.length && !empty(tdPitcherHitsAllowed)){
                trPitcherHitsAllowed.push(<tr>{tdPitcherHitsAllowed}<td colSpan={3-tdPitcherHitsAllowed.length}>{' '}</td></tr>);
                tdPitcherHitsAllowed = []; 
              }
  
            }
        }

        let oddMostHitsFirstInning = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Most Hits In The 1st Inning')): null;

        let tdMostHitsFirstInning1 = []; 
        let tdMostHitsFirstInningX = []; 
        let tdMostHitsFirstInning2 = []; 
        if(!empty(oddMostHitsFirstInning)){

          for(let i=0; i < oddMostHitsFirstInning.length; i++){
            if(oddMostHitsFirstInning[i].marketType=='1' && empty(tdMostHitsFirstInning1)){
              tdMostHitsFirstInning1.push(<td className={'text-center'}>{!empty(oddMostHitsFirstInning) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Most Hits In The 1st Inning',oddMostHitsFirstInning[i].marketType,'mosthitsfirstinning');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventHome : ''}</span> {showOdds == 'D' ? oddMostHitsFirstInning[i].odd : this.props.convertOddToAmerican(oddMostHitsFirstInning[i].odd)}</Button> : ''}</td>)
            }
            if(oddMostHitsFirstInning[i].marketType=='X'  && empty(tdMostHitsFirstInningX)){
              tdMostHitsFirstInningX.push(<td className={'text-center'}>{!empty(oddMostHitsFirstInning) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Most Hits In The 1st Inning',oddMostHitsFirstInning[i].marketType,'mosthitsfirstinning');  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? oddMostHitsFirstInning[i].odd : this.props.convertOddToAmerican(oddMostHitsFirstInning[i].odd)}</Button> : ''}</td>)
            }
            if(oddMostHitsFirstInning[i].marketType=='2' && empty(tdMostHitsFirstInning2)){
              tdMostHitsFirstInning2.push(<td className={'text-center'}>{!empty(oddMostHitsFirstInning) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Most Hits In The 1st Inning',oddMostHitsFirstInning[i].marketType,'mosthitsfirstinning');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventAway : ''}</span> {showOdds == 'D' ? oddMostHitsFirstInning[i].odd : this.props.convertOddToAmerican(oddMostHitsFirstInning[i].odd)}</Button> : ''}</td>)
            }
          }
        
        }

          
        let oddMostHitsOT = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Most Hits - Including Overtime')): null;

        let tdMostHitsOT1 = []; 
        let tdMostHitsOTX = []; 
        let tdMostHitsOT2 = []; 
        if(!empty(oddMostHitsOT)){

          for(let i=0; i < oddMostHitsOT.length; i++){
            if(oddMostHitsOT[i].marketType=='1' && empty(tdMostHitsOT1)){
              tdMostHitsOT1.push(<td className={'text-center'}>{!empty(oddMostHitsOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Most Hits - Including Overtime',oddMostHitsOT[i].marketType,'mosthitsot');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventHome : ''}</span> {showOdds == 'D' ? oddMostHitsOT[i].odd : this.props.convertOddToAmerican(oddMostHitsOT[i].odd)} </Button> : ''}</td>)
            }
            if(oddMostHitsOT[i].marketType=='X'  && empty(tdMostHitsOTX)){
              tdMostHitsOTX.push(<td className={'text-center'}>{!empty(oddMostHitsOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Most Hits - Including Overtime',oddMostHitsOT[i].marketType,'mosthitsot');  } }><span className="sport-factor">{'Empate'}</span> {showOdds == 'D' ? oddMostHitsOT[i].odd : this.props.convertOddToAmerican(oddMostHitsOT[i].odd)}</Button> : ''}</td>)
            }
            if(oddMostHitsOT[i].marketType=='2' && empty(tdMostHitsOT2)){
              tdMostHitsOT2.push(<td className={'text-center'}>{!empty(oddMostHitsOT) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[0], 'Most Hits - Including Overtime',oddMostHitsOT[i].marketType,'mosthitsot');  } }><span className="sport-factor">{!empty(events[0]) ? events[0].eventAway : ''}</span> {showOdds == 'D' ? oddMostHitsOT[i].odd : this.props.convertOddToAmerican(oddMostHitsOT[i].odd)}</Button> : ''}</td>)
            }
          }

        }

        let oddUnderOverTotalShots = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Total Shots')): null;
        let trUnderOverTotalShots = [];
        let tdUnderOverTotalShots = [];
        if(!empty(oddUnderOverTotalShots)){
          oddUnderOverTotalShots = orderUnderAndOver(oddUnderOverTotalShots);
          for(let i=0; i < oddUnderOverTotalShots.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUnderOverTotalShots.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Total Shots',oddUnderOverTotalShots[i].marketType,oddUnderOverTotalShots[i].factorExtra,"underovertotalshots" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverTotalShots[i]) ? oddUnderOverTotalShots[i].marketType=='Over' ? 'Más de' : oddUnderOverTotalShots[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverTotalShots[i]) ? oddUnderOverTotalShots[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverTotalShots[i].odd : this.props.convertOddToAmerican(oddUnderOverTotalShots[i].odd)}</span>
                </Button></td>{tdUnderOverTotalShots}</tr>);
                tdUnderOverTotalShots = [];
              }else{
                tdUnderOverTotalShots.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Total Shots',oddUnderOverTotalShots[i].marketType,oddUnderOverTotalShots[i].factorExtra,"underovertotalshots" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverTotalShots[i]) ? oddUnderOverTotalShots[i].marketType=='Over' ? 'Más de' : oddUnderOverTotalShots[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverTotalShots[i]) ? oddUnderOverTotalShots[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverTotalShots[i].odd : this.props.convertOddToAmerican(oddUnderOverTotalShots[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverTotalShots.length && !empty(tdUnderOverTotalShots)){
                trUnderOverTotalShots.push(<tr>{tdUnderOverTotalShots}<td colSpan={4-tdUnderOverTotalShots.length}>{' '}</td></tr>);
                tdUnderOverTotalShots = []; 
              }
  
            }
        }

        let oddUnderOverShotsTarget = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Shots on Target')): null;
        let trUnderOverShotsTarget = [];
        let tdUnderOverShotsTarget = [];
        if(!empty(oddUnderOverShotsTarget)){
          oddUnderOverShotsTarget = orderUnderAndOver(oddUnderOverShotsTarget);
          for(let i=0; i < oddUnderOverShotsTarget.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUnderOverShotsTarget.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Shots on Target',oddUnderOverShotsTarget[i].marketType,oddUnderOverShotsTarget[i].factorExtra,"underovershotstarget" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverShotsTarget[i]) ? oddUnderOverShotsTarget[i].marketType=='Over' ? 'Más de' : oddUnderOverShotsTarget[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverShotsTarget[i]) ? oddUnderOverShotsTarget[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverShotsTarget[i].odd : this.props.convertOddToAmerican(oddUnderOverShotsTarget[i].odd)} </span>
                </Button></td>{tdUnderOverShotsTarget}</tr>);
                tdUnderOverShotsTarget = [];
              }else{
                tdUnderOverShotsTarget.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Shots on Target',oddUnderOverShotsTarget[i].marketType,oddUnderOverShotsTarget[i].factorExtra,"underovershotstarget" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverShotsTarget[i]) ? oddUnderOverShotsTarget[i].marketType=='Over' ? 'Más de' : oddUnderOverShotsTarget[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverShotsTarget[i]) ? oddUnderOverShotsTarget[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverShotsTarget[i].odd : this.props.convertOddToAmerican(oddUnderOverShotsTarget[i].odd)} </span>
                </Button></td>);
              }

              if(x==oddUnderOverShotsTarget.length && !empty(tdUnderOverShotsTarget)){
                trUnderOverShotsTarget.push(<tr>{tdUnderOverShotsTarget}<td colSpan={4-tdUnderOverShotsTarget.length}>{' '}</td></tr>);
                tdUnderOverShotsTarget = []; 
              }
  
            }
        }

        let oddUnderOverOffsides = !empty(events) ? events[0].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Under/Over Offsides')): null;
        let trUnderOverOffsides = [];
        let tdUnderOverOffsides = [];
        if(!empty(oddUnderOverOffsides)){
          oddUnderOverOffsides = orderUnderAndOver(oddUnderOverOffsides);
          for(let i=0; i < oddUnderOverOffsides.length; i++){
              let x = i+1;  
              if(x%2==0){
                trUnderOverOffsides.push(<tr><td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Offsides',oddUnderOverOffsides[i].marketType,oddUnderOverOffsides[i].factorExtra,"underoveroffsides" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverOffsides[i]) ? oddUnderOverOffsides[i].marketType=='Over' ? 'Más de' : oddUnderOverOffsides[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverOffsides[i]) ? oddUnderOverOffsides[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverOffsides[i].odd : this.props.convertOddToAmerican(oddUnderOverOffsides[i].odd)}</span>
                </Button></td>{tdUnderOverOffsides}</tr>);
                tdUnderOverOffsides = [];
              }else{
                tdUnderOverOffsides.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[0],'Under/Over Offsides',oddUnderOverOffsides[i].marketType,oddUnderOverOffsides[i].factorExtra,"underoveroffsides" );  } }>
                  <span className="sport-factor">{!empty(oddUnderOverOffsides[i]) ? oddUnderOverOffsides[i].marketType=='Over' ? 'Más de' : oddUnderOverOffsides[i].marketType=='Under' ? 'Menos de' : '' : ''}{' '}{!empty(oddUnderOverOffsides[i]) ? oddUnderOverOffsides[i].factorExtra : ''}</span>
                  <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverOffsides[i].odd : this.props.convertOddToAmerican(oddUnderOverOffsides[i].odd)}</span>
                </Button></td>);
              }

              if(x==oddUnderOverShotsTarget.length && !empty(tdUnderOverOffsides)){
                trUnderOverOffsides.push(<tr>{tdUnderOverOffsides}<td colSpan={4-tdUnderOverOffsides.length}>{' '}</td></tr>);
                tdUnderOverOffsides = []; 
              }
  
            }
        }

        let livescore = !empty(events[0].livescore) ? events[0].livescore : '';
        
        return (

                <div className='sport-event-container'>
                    <div className={'event-title'}>
                      <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventIdDetail('');  } }>Volver</Button> 
                      {!empty(events[0].inPlay) && !empty(events[0].status) && events[0].inPlay && events[0].status==4 ? <Badge variant='success'>En vivo</Badge> : ''}{' '}
                      
                      {date.format(new Date(events[0].eventDate),"DD/MM hh:mm A") } - {events[0].eventHome} Vs. {events[0].eventAway}
                      
                      {!empty(events[0].inPlay) && events[0].inPlay && !empty(livescore) && !empty(events[0].status) && events[0].status==4 ? 
                            <>
                            <span className='sport-result'>{' '}Resultado:{' '} 
                            { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                            - 
                            { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                            </>
                        : '' }
                    </div>

                    <Row className='button-odds-type'>
                        <Col xs={12}>
                          <Button variant="primary" size="sm" onClick={() => { this.props.changeOdds('D') } }>Decimal</Button> {' '}
                          <Button variant="primary" size="sm" onClick={() => { this.props.changeOdds('A') } }>Americano</Button>
                      </Col>
                    </Row>

                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'}>1</th>
                          <th className={'text-center'}>x</th>
                          <th className={'text-center'}>2</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                        <td className={'text-center'}>{!empty(oddHome) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[0]);  } }><span className="sport-factor">{events[0].eventHome}</span> <span className="sport-odd">{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</span></Button> : ''}</td>
                        <td className={'text-center'}>{!empty(oddDraw) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDraw(events[0]);  } }><span className="sport-factor">{'Empate'}</span> <span className="sport-odd">{showOdds == 'D' ? oddDraw[0].odd : this.props.convertOddToAmerican(oddDraw[0].odd)}</span></Button>: ''}</td>
                        <td className={'text-center'}>{!empty(oddAway) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[0]);  } }><span className="sport-factor">{events[0].eventAway}</span> <span className="sport-odd">{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</span></Button> : ''}</td>
                       </tr>
                      </tbody>
                    </Table>

                    {!empty(odd10MinuteResult) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('10minuteresult')}</th>
                        </tr>
                        <tr>
                          <th className={'text-center'}>1</th>
                          <th className={'text-center'}>x</th>
                          <th className={'text-center'}>2</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {td10MinuteResult1}
                          {td10MinuteResultX}
                          {td10MinuteResult2}
                        </tr>
                      </tbody>
                    </Table>
                    : null}

                    {!empty(odd10MinuteUnderOver) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('10minuteunderover')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tr10MinuteUnderOver}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(odd10MinuteUnderOverCorners) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('10minuteunderovercorners')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tr10MinuteUnderOverCorners}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddFirstPeriodWinner) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('firstperiodwinner',sportNameSelected,'es')}</th>
                        </tr>
                        <tr>
                          <th className={'text-center'}>1</th>
                          <th className={'text-center'}>x</th>
                          <th className={'text-center'}>2</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {tdFirstPeriodWinner1}
                          {tdFirstPeriodWinnerX}
                          {tdFirstPeriodWinner2}
                        </tr>
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddSecondPeriodWinner) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('secondperiodwinner',sportNameSelected,'es')}</th>
                        </tr>
                        <tr>
                          <th className={'text-center'}>1</th>
                          <th className={'text-center'}>x</th>
                          <th className={'text-center'}>2</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {tdSecondPeriodWinner1}
                          {tdSecondPeriodWinnerX}
                          {tdSecondPeriodWinner2}
                        </tr>
                      </tbody>
                    </Table>
                    : null}

                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'}>OVER</th>
                          <th className={'text-center'}>UNDER</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                        <td className={'text-center'}> {!empty(oddOver) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[0]);  } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)} </Button> : ''}</td>
                        <td className={'text-center'}>{!empty(oddUnder) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[0]);  } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : ''}</td>
                        </tr>
                      </tbody>
                    </Table>

                    {!empty(oddUnderOverHalfTime) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('underoverhalftime')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverHalfTime}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverFirstInning) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('underoverfirstinning')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverFirstInning}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOver) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('underover')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOver}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverOT) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('underoverot',sportNameSelected,'es')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverOT}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUOE) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('uoe')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUOE}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverGames) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('underovergames')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverGames}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUOEFirstPeriod) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('uoefirstperiod',sportNameSelected,'es')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUOEFirstPeriod}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUOESecondPeriod) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('uoesecondperiod',sportNameSelected,'es')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUOESecondPeriod}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverFirstPeriod) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('underoverfirstperiod',sportNameSelected,'es')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverFirstPeriod}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverSecondPeriod) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('underoversecondperiod',sportNameSelected,'es')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverSecondPeriod}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddAsianUnderOver) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType("asianunderover")}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trAsianUnderOver}
                      </tbody>
                    </Table>
                    : null}

                  {!empty(oddAsianUnderOverFirstPeriod) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType("asianunderoverfirstperiod",sportNameSelected,'es')}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trAsianUnderOverFirstPeriod}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverHomeTeam) && !empty(events[0].eventHome) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">Alta / Baja {events[0].eventHome}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverHomeTeam}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverHomeTeamOT) && !empty(events[0].eventHome) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">Alta / Baja con extratiempo {events[0].eventHome}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverHomeTeamOT}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverAwayTeamOT) && !empty(events[0].eventAway) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">Alta / Baja con extratiempo {events[0].eventAway}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverAwayTeamOT}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddUnderOverAwayTeam) && !empty(events[0].eventAway)  ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">Alta / Baja {events[0].eventAway}</th>
                        </tr>

                      </thead>
                      <tbody>
                        {trUnderOverAwayTeam}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddAsianHandicapFirstPeriod) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('asianhandicapfirstperiod')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trAsianHandicapFirstPeriod}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddAsianHandicap) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('asianhandicap')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trAsianHandicap}
                      </tbody>
                    </Table>
                    : null}

                    {/* {!empty(oddFirst5InningsAsianHandicap) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('first5inningsasianhandicap')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trFirst5InningsAsianHandicap}
                      </tbody>
                    </Table>
                    : null} */}

                    {!empty(oddAsianHandicapSets) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('asianhandicapsets')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trAsianHandicapSets}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddAsianHandicapGames) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('asianhandicapgames')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trAsianHandicapGames}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddAsianHandicapHalftime) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('asianhandicaphalftime')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trAsianHandicapHalftime}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddAsianHandicapOT) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('asianhandicapovertime')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trAsianHandicapOT}
                      </tbody>
                    </Table>
                    : null}

                    {!empty(oddAsianHandicapPoints) ? 
                    <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                        <tr>
                          <th className={'text-center'} colSpan="4">{translateType('asianhandicappoints')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trAsianHandicapPoints}
                      </tbody>
                    </Table>
                    : null}


                    {!empty(oddBothTeamsToScore) ? 
                      <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                      <tr>
                        <th colSpan={2}>
                          {translateType('both')}
                        </th>
                      </tr>
                      </thead>
                    <tbody>
                      <tr>
                        {tdBothTeamsToScoreYes}
                        {tdBothTeamsToScoreNo}
                      </tr>
                      </tbody>
                    </Table>
                      : null}
                    
                    {!empty(oddFirstBothTeamsToScore) ? 
                      <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                      <tr>
                        <th colSpan={2}>
                          {translateType('bothfirst')}
                        </th>
                      </tr>
                      </thead>
                    <tbody>
                      <tr>
                        {tdFirstBothTeamsToScoreYes}
                        {tdFirstBothTeamsToScoreNo}
                      </tr>
                      </tbody>
                    </Table>
                      : null}

                      {!empty(oddSecondBothTeamsToScore) ? 
                      <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                      <tr>
                        <th colSpan={2}>
                          {translateType('bothsecond')}
                        </th>
                      </tr>
                      </thead>
                    <tbody>
                      <tr>
                        {tdSecondBothTeamsToScoreYes}
                        {tdSecondBothTeamsToScoreNo}
                      </tr>
                      </tbody>
                    </Table>
                      : null}

                      {!empty(odd1x2BothTeamsToScore) ? 
                      <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                      <tr>
                        <th colSpan={2}>
                        {translateType('1x2bothteamstoscore')}
                        </th>
                      </tr>
                      </thead>
                    <tbody>
                        {tr1x2BothTeamsToScore}
                      </tbody>
                    </Table>
                      : null}

                      {!empty(oddFirst1x2BothTeamsToScore) ? 
                      <Table striped bordered hover responsive className="table table-sm sport-detail">
                      <thead>
                      <tr>
                        <th colSpan={2}>
                        {translateType('first1x2bothteamstoscore')}
                        </th>
                      </tr>
                      </thead>
                    <tbody>
                        {trFirst1x2BothTeamsToScore}
                      </tbody>
                    </Table>
                      : null}

                    {!empty(oddDoubleChance) ? 
                        <Table striped bordered hover responsive className="table table-sm sport-detail">
                        <thead>
                        <tr>
                          <th colSpan={3}>
                            {translateType("doublechance")}
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={3}>
                          1X = Casa y empate 12 = Casa y visitante X2 = Empate y visitante 
                          </th>
                        </tr>
                        </thead>
                      <tbody>
                        <tr>
                          {tdDoubleChance1X}
                          {tdDoubleChance12}
                          {tdDoubleChanceX2}
                        </tr>
                        </tbody>
                      </Table>
                        : null}

                        {!empty(oddDoubleChanceHT) ? 
                        <Table striped bordered hover responsive className="table table-sm sport-detail">
                        <thead>
                        <tr>
                          <th colSpan={3}>
                            {translateType("doublechanceht")}
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={3}>
                          1X = Casa y empate 12 = Casa y visitante X2 = Empate y visitante 
                          </th>
                        </tr>
                        </thead>
                      <tbody>
                        <tr>
                          {tdDoubleChanceHT1X}
                          {tdDoubleChanceHT12}
                          {tdDoubleChanceHTX2}
                        </tr>
                        </tbody>
                      </Table>
                        : null}

                        {!empty(oddDoubleChanceFirstPeriod) ? 
                        <Table striped bordered hover responsive className="table table-sm sport-detail">
                        <thead>
                        <tr>
                          <th colSpan={3}>
                            {translateType("doublechancefirstperiod",sportNameSelected,'es')}
                          </th>
                        </tr>
                        <tr>
                          <th colSpan={3}>
                          1X = Casa y empate 12 = Casa y visitante X2 = Empate y visitante 
                          </th>
                        </tr>
                        </thead>
                      <tbody>
                        <tr>
                          {tdDoubleChanceFirstPeriod1X}
                          {tdDoubleChanceFirstPeriod12}
                          {tdDoubleChanceFirstPeriodX2}
                        </tr>
                        </tbody>
                      </Table>
                        : null}

                          {!empty(oddDrawNoBet) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("drawnobet")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdDrawNoBetHome}
                              {tdDrawNoBetAway}
                            </tr>
                            </tbody>
                          </Table>
                            : null}    

                            {!empty(oddDrawNoBetOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("drawnobetot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdDrawNoBetOTHome}
                              {tdDrawNoBetOTAway}
                            </tr>
                            </tbody>
                          </Table>
                            : null}      

                            {!empty(oddFirstPeriodWinnerHA) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("firstperiodwinnerha")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdFirstPeriodWinnerHAHome}
                              {tdFirstPeriodWinnerHAAway}
                            </tr>
                            </tbody>
                          </Table>
                            : null}                 

                          {!empty(oddExactGoals) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("exactgoals")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trExactGoals}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddNumberOfSets) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("numberofsets")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trNumberOfSets}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddExactGoalsFirst) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("numbergoalsfirst")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trExactGoalsFirst}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddExactGoalsSecond) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("numbergoalssecond")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trExactGoalsSecond}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddHomeExactGoals) && !empty(events[0].eventHome) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("numbergoalshome")}{' '}{events[0].eventHome}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trHomeExactGoals}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddAwayExactGoals) && !empty(events[0].eventAway) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("numbergoalsaway")}{' '}{events[0].eventAway}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trAwayExactGoals}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddWinningMarginTeamsFirstPeriod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("winningmarginteamsfirstperiod",sportNameSelected,'es')}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trWinningMarginTeamsFirstPeriod}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddWinningMarginFirstPeriod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("winningmarginfirstperiod",sportNameSelected,'es')}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trWinningMarginFirstPeriod}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddWinningMarginFirst) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("winningmarginfirst")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trWinningMarginFirst}
                            </tbody>
                          </Table>
                            : null}

                            

                            {!empty(oddWinningMarginExact) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("winningmarginexact")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trWinningMarginExact}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddWinningMarginOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("winningmarginot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trWinningMarginOT}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(odd3WayWinningMarginOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("3waywinningmarginot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {tr3WayWinningMarginOT}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddWinningMarginRanges) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("winningmarginranges")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trWinningMarginRanges}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddWinningMarginTeamsAny) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("winningmarginteamsany")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trWinningMarginTeamsAny}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddCorrectScoreFirstPeriod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={6}>
                                {translateType("correctscorefirstperiod",sportNameSelected,'es')}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trCorrectScoreFirstPeriod}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddCorrectScore) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={6}>
                                {translateType("correctscore")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trCorrectScore}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddCorrectScoreOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={6}>
                                {translateType("correctscoreot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trCorrectScoreOT}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddGoalsRange) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={6}>
                                {translateType("goalsrange")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trGoalsRange}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddHighestScoringHalf) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("highestscoringhalf")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                              <tr>
                                {tdHighestScoringHalf1}
                                {tdHighestScoringHalf2}
                                {tdHighestScoringHalfX}
                              </tr>
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddHalfHomeTeamMoreScore) && !empty(events[0].eventHome) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("halfhometeammorescore")}{' '}{events[0].eventHome}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                              <tr>
                                {tdHalfHomeTeamMoreScore1}
                                {tdHalfHomeTeamMoreScore2}
                                {tdHalfHomeTeamMoreScoreX}
                              </tr>
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddHalfAwayTeamMoreScore) && !empty(events[0].eventAway) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("halfawayteammorescore")}{' '}{events[0].eventAway}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                              <tr>
                                {tdHalfAwayTeamMoreScore1}
                                {tdHalfAwayTeamMoreScore2}
                                {tdHalfAwayTeamMoreScoreX}
                              </tr>
                            </tbody>
                          </Table>
                            : null}
                          
                          {!empty(oddFirstPeriodRaceTo) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                              {translateType("firstperiodraceto")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trFirstPeriodRaceTo}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddFirstHalfRaceTo) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                              {translateType("firsthalfraceto")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trFirstHalfRaceTo}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddSecondHalfRaceToOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                              {translateType("secondhalfracetoot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trSecondHalfRaceToOT}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddRaceToOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                              {translateType("racetoot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trRaceToOT}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddRaceTo20Points) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("raceto20points")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdRaceTo20PointsHome}
                              {tdRaceTo20PointsAway}
                            </tr>
                            </tbody>
                          </Table>
                            : null}  

                            {!empty(oddAsianUnderOverCorners) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                                {translateType("asianunderovercorners")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trAsianUnderOverCorners}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(odd1X2Corners) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="4">{translateType('1x2corners')}</th>
                              </tr>
                              <tr>
                                <th className={'text-center'}>1</th>
                                <th className={'text-center'}>x</th>
                                <th className={'text-center'}>2</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {td1X2Corners1}
                                {td1X2CornersX}
                                {td1X2Corners2}
                              </tr>
                            </tbody>
                          </Table>
                          : null}
                                
                          {!empty(oddTotalCorners) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                                {translateType("totalcorners")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trTotalCorners}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddMultipleCorners) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                                {translateType("multiplecorners")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trMultipleCorners}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddUnderOverCornersFirst) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                                {translateType("underovercornersfirst")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trUnderOverCornersFirst}
                            </tbody>
                          </Table>
                            : null}
                          
                          {!empty(oddCornersUOE) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                                {translateType("cornersuoe")} Alta / Baja / Exactamente
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trCornersUOE}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddFirstHalfCornersUOE) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                                {translateType("firsthalfcornersuoe")} Alta / Baja / Exactamente
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trFirstHalfCornersUOE}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddRaceToCorners) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                              {translateType("racestocorners")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trRaceToCorners}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddCornersHandicap) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                              {translateType("cornershandicap")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trCornersHandicap}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddFirstMatchCorner) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="2">{translateType('firstmatchcorner')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {tdFirstMatchCorner1}
                                {tdFirstMatchCorner2}
                              </tr>
                            </tbody>
                          </Table>
                          : null}

                          {!empty(oddLastMatchCorner) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="2">{translateType('lastmatchcorner')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {tdLastMatchCorner1}
                                {tdLastMatchCorner2}
                              </tr>
                            </tbody>
                          </Table>
                          : null}

                            {!empty(oddCornersRange) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("cornersrange")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trCornersRange}
                            </tbody>
                          </Table>
                            : null}


                          {!empty(oddOddEven) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("oddeven")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenOdd}
                              {tdoddOddEvenEven}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                          {!empty(oddOddEvenIncludingOvertime) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("oddevenot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenOTOdd}
                              {tdoddOddEvenOTEven}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                            {!empty(oddOddEvenHome) && !empty(events[0].eventHome) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("oddevenhome")}{' '}{events[0].eventHome}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenOddHome}
                              {tdoddOddEvenEvenHome}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                            {!empty(oddOddEvenAway) && !empty(events[0].eventAway) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("oddevenaway")}{' '}{events[0].eventAway}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenOddAway}
                              {tdoddOddEvenEvenAway}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                          {!empty(oddOddEvenCorners) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("oddevencorners")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenCornersOdd}
                              {tdoddOddEvenCornersEven}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                            {!empty(oddTotalFoulsCommitted) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                                {translateType("totalfoulscommitted")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trTotalFoulsCommitted}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddFirstTeamToScore) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("firstteamtoscore")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdFirstTeamToScore1}
                              {tdFirstTeamToScore2}
                              {tdFirstTeamToScoreNoGoal}
                            </tr>
                            </tbody>
                          </Table>
                            : null}
                          
                          {!empty(oddLastTeamToScore) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("lastteamtoscore")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdLastTeamToScore1}
                              {tdLastTeamToScore2}
                              {tdLastTeamToScoreNoGoal}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddLastTeamToScoreOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("lastteamtoscoreot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdLastTeamToScoreOT1}
                              {tdLastTeamToScoreOT2}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddOddEvenFirstPeriod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("firstperiododdeven",sportNameSelected,'es')}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenOddFirstPeriod}
                              {tdoddOddEvenEvenFirstPeriod}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                            {!empty(oddOddEvenSecondPeriod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("secondperiododdeven")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenOddSecondPeriod}
                              {tdoddOddEvenEvenSecondPeriod}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                          {!empty(oddOddEvenThirdPeriod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("thirdperiododdeven")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenOddThirdPeriod}
                              {tdoddOddEvenEvenThirdPeriod}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                          {!empty(oddOddEvenFourthPeriod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("fourthperiododdeven")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdoddOddEvenOddFourthPeriod}
                              {tdoddOddEvenEvenFourthPeriod}
                            </tr>
                            </tbody>
                          </Table>
                          : null}

                            {!empty(odd12HalfTime) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("12halftime")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {td12HalfTime1}
                              {td12HalfTime2}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                            {!empty(odd1x2HalfTime) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("1x2halftime")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {td1x2HalfTime1}
                              {td1x2HalfTimeX}
                              {td1x2HalfTime2}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddHTFT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("htft")}
                              </th>
                            </tr>
                            <tr>
                              <th colSpan={3}>
                              1/2: Casa/Visitante, 2/1: Visitante/Casa, 1/1: Casa/Casa, 2/2: Visitante/Visitante, X/1: Empate/Casa, X/2: Empate/Visitante, X/X: Empate/Empate 
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trHTFT}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddHTFTOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("htftot")}
                              </th>
                            </tr>
                            <tr>
                              <th colSpan={3}>
                              1/2: Casa/Visitante, 2/1: Visitante/Casa, 1/1: Casa/Casa, 2/2: Visitante/Visitante, X/1: Empate/Casa, X/2: Empate/Visitante, X/X: Empate/Empate 
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trHTFTOT}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddFirstPlayer) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("firstplayertoscore")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trFirstPlayer}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddLastPlayer) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("lastplayertoscore")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trLastPlayer}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerScoreAnytime) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("playertoscoreanytime")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerScoreAnytime}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerScore2Goals) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("playertoscore2goals")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerScore2Goals}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddPlayerScore3Goals) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("playertoscore3goals")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerScore3Goals}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddTeamFirstPlayer) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                               {translateType("firstplayertoscore")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trTeamFirstPlayer}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddTeamLastPlayer) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("lastplayertoscore")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trTeamLastPlayer}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddFirstGoalTime) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("firstgoaltime")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trFirstGoalTime}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerToBeBooked) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("playertobebooked")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerToBeBooked}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerToBeSentOff) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("playertobesentoff")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerToBeSentOff}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddFirstGoalMethod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("firstgoalmethod")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trFirstGoalMethod}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddHighestScoringPeriod) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("highestscoringperiod")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trHighestScoringPeriod}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddWillBeAnOwnGoal) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('willbeanowngoal')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdWillBeAnOwnGoalYes}
                            {tdWillBeAnOwnGoalNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                          {!empty(oddBothScoreFirstHalf) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={4}>
                              {translateType('bothscorefirsthalf')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          {trBothScoreFirstHalf}
                          </tbody>
                        </Table>
                          : null}

                          {!empty(oddBothScoreFirstPeriod) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={4}>
                              {translateType('bothscorefirstperiod')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          {trBothScoreFirstPeriod}
                          </tbody>
                        </Table>
                          : null}

                          {!empty(oddRaceTo) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                              {translateType("raceto")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trRaceTo}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerAssists) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerassists")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerAssists}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerShots) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayershots")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerShots}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddToScoreAPenalty) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("toscoreapenalty")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdToScoreAPenaltyHome}
                              {tdToScoreAPenaltyAway}
                            </tr>
                            </tbody>
                          </Table>
                            : null}   

                            {!empty(oddPlayerPowerPlayPoints) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerpowerplaypoints")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerPowerPlayPoints}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddFirstCard) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("firstcard")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdFirstCard1}
                              {tdFirstCard2}
                              {tdFirstCardNoCard}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddWillTheGameGoToOT) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('willthegamegotoot',sportNameSelected,'es')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdWillTheGameGoToOTYes}
                            {tdWillTheGameGoToOTNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                          {!empty(oddAsianUnderOverCards) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={4}>
                                {translateType("asianunderovercards")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            {trAsianUnderOverCards}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddAsianHandicapCards) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="4">{translateType('asianhandicapcards')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {trAsianHandicapCards}
                            </tbody>
                          </Table>
                          : null}

                          {!empty(odd10MinuteUnderOverCards) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="4">{translateType('10minuteunderovercards')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tr10MinuteUnderOverCards}
                            </tbody>
                          </Table>
                          : null}

                          {!empty(oddUnderOverCards) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="4">{translateType('underovercards')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {trUnderOverCards}
                            </tbody>
                          </Table>
                          : null}

                            {!empty(oddTeamToWinTheMostPeriods) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("teamtowinthemostperiods")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdTeamToWinTheMostPeriods1}
                              {tdTeamToWinTheMostPeriodsX}
                              {tdTeamToWinTheMostPeriods2}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerPointsRebounds) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerpointsrebounds")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerPointsRebounds}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerPointsAssists) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerpointsassists")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerPointsAssists}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerAssistsRebounds) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayersassistsrebounds")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerAssistsRebounds}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddFirstPeriodExtraPoints) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('firstperiodextrapoints')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdFirstPeriodExtraPointsYes}
                            {tdFirstPeriodExtraPointsNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                            {!empty(oddPlayerPoints) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerpoints")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerPoints}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerTurnovers) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayersturnovers")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerTurnovers}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerRebounds) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayersrebounds")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerRebounds}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerSteals) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerssteals")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerSteals}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerStealsBlocks) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayersstealsblocks")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerStealsBlocks}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerBlocks) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayersblocks")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerBlocks}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddWillARedCardBeShown) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('willaredcardbeshown')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdWillARedCardBeShownYes}
                            {tdWillARedCardBeShownNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                          {!empty(oddWillAPenaltyBeAwarded) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('willapenaltybeawarded')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdWillAPenaltyBeAwardedYes}
                            {tdWillAPenaltyBeAwardedNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                          {!empty(oddWillFirstScoringTeamWin) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('willfirstscoringteamwin')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdWillFirstScoringTeamWinYes}
                            {tdWillFirstScoringTeamWinNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                          {!empty(oddPlayerDoubleDouble) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("playerdoubledouble")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerDoubleDouble}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerShotsOnTarget) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayersshotsontarget")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerShotsOnTarget}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddWillGameGoToShootout) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('willgamegotoshootout')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdWillGameGoToShootoutYes}
                            {tdWillGameGoToShootoutNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                            {!empty(oddUnderOverBreakPoints) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("underoverbreakpoints")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trUnderOverBreakPoints}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddUnderOverTieBreakMatch) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("underovertiebreakmatch")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trUnderOverTieBreakMatch}
                            </tbody>
                          </Table>
                            : null}

                            

                            {!empty(oddToQualify) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("toqualify")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdToQualifyHome}
                              {tdToQualifyAway}
                            </tr>
                            </tbody>
                          </Table>
                            : null}  

                            {!empty(oddPlayerTripleDouble) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("playertripledouble")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerTripleDouble}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddWillGameDecidedExtraTime) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('willgamedecidedextratime')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdWillGameDecidedExtraTimeYes}
                            {tdWillGameDecidedExtraTimeNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                            {!empty(oddCupWinner) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={2}>
                                {translateType("cupwinner")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdCupWinnerHome}
                              {tdCupWinnerAway}
                            </tr>
                            </tbody>
                          </Table>
                            : null} 
  
                            {!empty(oddTeamWithHighestScoringInning) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("teamwithhighestscoringinning")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdTeamWithHighestScoringInning1}
                              {tdTeamWithHighestScoringInningX}
                              {tdTeamWithHighestScoringInning2}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddARunFirstInning) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('arunfirstinning')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                          <tr>
                            {tdARunFirstInningYes}
                            {tdARunFirstInningNo}
                          </tr>
                          </tbody>
                        </Table>
                          : null}

                            {!empty(oddUnderOverFirst5Innings) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("underoverfirst5innings")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trUnderOverFirst5Innings}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerTotalBases) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayertotalbases")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerTotalBases}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerHomeRuns) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerhomeruns")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerHomeRuns}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerSingles) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayersingles")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerSingles}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerDoubles) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerdoubles")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerDoubles}
                            </tbody>
                          </Table>
                            : null}


                           {!empty(oddPlayer3PointMade) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayer3points")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayer3PointMade}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerRuns) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerruns")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerRuns}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPlayerStolenBases) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayerstolenbases")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPlayerStolenBases}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddUOPlayerTriples) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uoplayertriples")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trUOPlayerTriples}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddUOPitcherStrikeouts) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uopitcherstrikeouts")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trUOPitcherStrikeouts}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddUOHitsOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uohits")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trUOHitsOT}
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddPitcherRecordWin) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                          <thead>
                          <tr>
                            <th colSpan={2}>
                              {translateType('pitcherrecordwin')}
                            </th>
                          </tr>
                          </thead>
                        <tbody>
                            {trPitcherRecordWin}
                          </tbody>
                        </Table>
                          : null}

                            {!empty(oddPitcherRunsEarned) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uopitcherrunsearned")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPitcherRunsEarned}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddPitcherHitsAllowed) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("uopitcherhitsallowed")}
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                              {trPitcherHitsAllowed}
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddMostHitsFirstInning) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("mosthitsfirstinning")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdMostHitsFirstInning1}
                              {tdMostHitsFirstInningX}
                              {tdMostHitsFirstInning2}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                            {!empty(oddMostHitsOT) ? 
                            <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                            <tr>
                              <th colSpan={3}>
                                {translateType("mosthitsot")}
                              </th>
                            </tr>
                            </thead>
                          <tbody>
                            <tr>
                              {tdMostHitsOT1}
                              {tdMostHitsOTX}
                              {tdMostHitsOT2}
                            </tr>
                            </tbody>
                          </Table>
                            : null}

                          {!empty(oddUnderOverTotalShots) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="4">{translateType('underovertotalshots')}</th>
                              </tr>

                            </thead>
                            <tbody>
                              {trUnderOverTotalShots}
                            </tbody>
                          </Table>
                          : null}

                          {!empty(oddUnderOverShotsTarget) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="4">{translateType('underovershotstarget')}</th>
                              </tr>

                            </thead>
                            <tbody>
                              {trUnderOverShotsTarget}
                            </tbody>
                          </Table>
                          : null}

                          {!empty(oddUnderOverOffsides) ? 
                          <Table striped bordered hover responsive className="table table-sm sport-detail">
                            <thead>
                              <tr>
                                <th className={'text-center'} colSpan="4">{translateType('underoveroffsides')}</th>
                              </tr>

                            </thead>
                            <tbody>
                              {trUnderOverOffsides}
                            </tbody>
                          </Table>
                          : null}


                </div>
            
        );
    }
}

const mapToProps = ({
    account,
    ticketoffice,
    ticketInfoSport,
    ticketssports,
    user,
    sportsnames,
    currentTimestamp,
    events,
    sportVideoEvents,
    usersGamification
}) => ({
    account,
    ticketoffice,
    ticketInfoSport,
    ticketssports,
    user,
    sportsnames,
    currentTimestamp,
    events,
    sportVideoEvents,
    usersGamification
});

const connectedSportPageDetail = connect(mapToProps, actions)(SportPageDetail);
export { connectedSportPageDetail as SportPageDetail };
 