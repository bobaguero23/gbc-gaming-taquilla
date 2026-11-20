import React from "react";
import { connect } from "redux-zero/react";
import gql from "graphql-tag";
import { Subscription } from "react-apollo";
import { SportPage } from "./SportPage";
import actions from "../_actions";
import empty from "is-empty";
import AuthActions from "../_actions/AuthActions";
import Loading from "../_components/Loading";
import PrintProvider, { NoPrint } from 'react-easy-print';
import { SportPageDetail } from "./SportPageDetail";
import { translateDescription,translateType } from '../_helpers/libSport';
import {Row, Col, Badge, Image} from 'react-bootstrap';
import Dialog from 'react-bootstrap-dialog';
import {MyTicket} from '../_components/SportsForm/MyTicket';
import {MyTickets} from '../_components/SportsForm/MyTickets';
import {NavHeader} from '../_components/NavHeader';
import { clearLocalStorage, formatNumber,getAppConfig} from '../_helpers/lib';
import ButtonsPaySport from '../_components/ButtonsPaySport';
import ComponentToPrintSellSport from '../_components/ComponentToPrintSellSport';
import ComponentToPrintPaySport from '../_components/ComponentToPrintPaySport';
import { isOnly5y6,isSaleSports } from "../_helpers/lib";
import { history } from '../_helpers/history';

class SportPageRT extends React.Component {

  constructor(props) {
        
      super(props);
      this.state = {
          loading: 1,
          sportNameSelected   :  'Soccer',
          filterDateState     :  '',
          filterLeague        : '',
          eventIdSelected   : '',
          subscriptionData : [],
          activeKey           : '',
          ticketValue         : 0,
          ticketCombinations  : 0,
          valueUnits          : !empty(this.props.ticketoffice) ? this.props.ticketoffice[0].valueUnits: null,
          channel             : 0,
          specialKey          : null,
          eventModalShow : false,
          eventModalSelected : {},
          sellform : {
            events  : [],
            riskMultiple:0,
            totalToPayMultiple : 0
          },
          showOdds: 'A'
      };

    }

    getEvents = (sportNameSelected,dateBD) => {
        
        //console.log('sportNameSelected::::',sportNameSelected);
        if(sportNameSelected == 'Todos') sportNameSelected = ''
        let oddDetails = '';

        if(sportNameSelected=='Soccer'){
            oddDetails = `["Home","Away","Draw","under","over","handicapOver/handicapUnder","1st Period Winner","UnderOver 1st Period","asianHandicap1stPeriod/asianHandicap1stPeriod"]`; 
        }else if(sportNameSelected=='Baseball'){
            oddDetails = `["Home","Away","under","over","handicapOvertimeOver/handicapOvertimeUnder","1st 5 Innings Winner - 12","UnderOver 5 Innings"]`; 
        }else if(sportNameSelected=='Basketball'){
            oddDetails = `["handicapOvertimeOver/handicapOvertimeUnder","under","over","Home","Away","handicapOverHalfTime/handicapUnderHalfTime","12 Halftime","UnderOver Halftime"]`; 
        }else if(sportNameSelected=='American Football'){
            oddDetails = `["handicapOvertimeOver/handicapOvertimeUnder","under","over","Home","Away","handicapOverHalfTime/handicapUnderHalfTime","12 Halftime","UnderOver Halftime"]`; 
        }else if(sportNameSelected=='Tennis'){
            oddDetails = `["Home","Away","UnderOver Games","UnderOver Sets"]`; 
        }else if(sportNameSelected=='Boxing' || sportNameSelected=='MMA'){
            oddDetails = `["Home","Away","UnderOver Rounds"]`; 
        }else if(sportNameSelected=='Ice-hockey'){
            oddDetails = `["Home","Away","Draw","under","over","handicapOver/handicapUnder","12 Including Overtime"]`; 
        }else if(sportNameSelected=='Volleyball'){
            oddDetails = `["Home","Away","under","over","UnderOver Sets","1st Period Winner Home/Away"]`; 
        }else if(sportNameSelected=='Table Tennis'){
            oddDetails = `["Home","Away","UnderOver Sets"]`; 
        }
        
        let sportName = (!empty(sportNameSelected) ? `sportName:{equalTo:"${sportNameSelected}"}` : '' );

        let query = '';

        const { inPlay, sportVideoEventsBySportNameAndDates } = this.props;

        let { filterDateState, filterLeague } = this.state;

        if(!empty(sportVideoEventsBySportNameAndDates) && empty(filterDateState)){
            filterDateState = sportVideoEventsBySportNameAndDates[0].eventToday;
        }

        let filterLeagueQuery = '';
        let filterDateStateQuery = '';
        let filterStatusQuery = `status : {in: [1]}`;
        let filterInPlayQuery = '';

        if( inPlay === true) {
            filterStatusQuery = `status : {in: [4]}`;
            filterInPlayQuery = `inPlay: {equalTo: true}`
            filterDateStateQuery = `eventToday: {equalTo:"${dateBD.today}"}`;
            oddDetails = `["Home","Away","Draw","under","over","handicapOver/handicapUnder","1st Period Winner","UnderOver 1st Period","asianHandicap1stPeriod/asianHandicap1stPeriod","handicapOvertimeOver/handicapOvertimeUnder","1st 5 Innings Winner - 12","UnderOver 5 Innings","handicapOvertimeOver/handicapOvertimeUnder","handicapOverHalfTime/handicapUnderHalfTime","12 Halftime","UnderOver Halftime"]`;
            sportName='';
        }

        if(!empty(filterDateState)){
            filterDateStateQuery = `eventToday: {equalTo:"${filterDateState}"}`;
        }

        if(!empty(filterLeague)){
            filterLeagueQuery = `league: {equalTo: "${filterLeague}"}`;

            if(filterLeague === 'Destacado'){
                filterLeagueQuery = `inPlay: {equalTo: true}`
            }
        }


        if(sportNameSelected=='Soccer'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsSoccerPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsSoccerPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='Baseball'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    extraData
                    eventsOddsBaseballPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsBaseballPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='Basketball'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsBasketballPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsBasketballPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='American Football'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsAmericanFootballPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsAmericanFootballPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='Tennis'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsTennisPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsTennisPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='Boxing'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsBoxingPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsBoxingPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='MMA'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsMmaPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsMmaPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='Ice-hockey'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsIceHockeyPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsIceHockeyPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='Volleyball'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsVolleyballPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsVolleyballPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }else if(sportNameSelected=='Table Tennis'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                ${filterStatusQuery}
                ${filterInPlayQuery}
                ${filterDateStateQuery}
                ${filterLeagueQuery}
                ${sportName}
                }
                first: 1000
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    status
                    inPlay
                    livescore
                    eventsOddsTableTennisPrematchesByEventId(orderBy: [MARKET_ASC, ODD_DESC] filter: {
                        oddDetails: {in:${oddDetails}}
                        extraBetsId: { isNull: false }
                        status: { equalTo: 1 }
                    } first: 30){
                    nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                    }
                    }
                }
                edges{
                    node{
                    id
                    eventsOddsTableTennisPrematchesByEventId(first: 1000 filter: {
                        status: { equalTo: 1 }
                    }){
                        totalCount
                    }
                    }
                }
                }
            }`;
        }

      return query;
    };
  
    getEventDetailsById = (sportNameSelected,id) => {

        let query = '';
  
        if(sportNameSelected=='Soccer'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsSoccerPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                      }
                    }
                  }
                }
              }`;
        }else if(sportNameSelected=='Baseball'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsBaseballPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                      }
                    }
                  }
                }
              }`;
            
        }else if(sportNameSelected=='Basketball'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsBasketballPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                      }
                    }
                  }
                }
              }`;
        }else if(sportNameSelected=='American Football'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsAmericanFootballPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                      }
                    }
                  }
                }
              }`;
        }else if(sportNameSelected=='Tennis'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsTennisPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                      }
                    }
                  }
                }
              }`;
        }else if(sportNameSelected=='Boxing'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsBoxingPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                      }
                    }
                  }
                }
              }`;
        }else if(sportNameSelected=='MMA'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsMmaPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                      }
                    }
                  }
                }
              }`;
        }else if(sportNameSelected=='Ice-hockey'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsIceHockeyPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                        extraBetsId
                      }
                    }
                  }
                }
              }`;
        }else if(sportNameSelected=='Volleyball'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsVolleyballPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                      }
                    }
                  }
                }
              }`;
        }else if(sportNameSelected=='Table Tennis'){
            query = gql`subscription{
                allEvents(filter:{
                enabled: {equalTo:true}
                eventValidated: {equalTo:true}
                status : {in: [1,4]}
                id : {equalTo: "${id}"}
                inPlay:{in:[true,false]}
                }
                first: 1
                orderBy:[EVENT_DATE_ASC, LEAGUE_ASC]
                ){
                  nodes{
                    id
                    idEvent
                    eventName
                    sportName
                    eventDate
                    league
                    eventHome
                    eventAway
                    inPlay
                    livescore
                    status
                    eventsOddsTableTennisPrematchesByEventId(orderBy: [MARKET_ASC, ODD_ORDER_ASC] filter: {
                        status: { equalTo: 1 }
                        extraBetsId: { isNull: false }
                      } first: 1000){
                      nodes{
                        id
                        factor
                        oddDetails
                        oddOrder
                        oddSource
                        odd
                        market
                        marketType
                        factorExtra
                        marketTypeDetail
                      }
                    }
                  }
                }
              }`;
        }

        return query;
    };

  componentDidMount(){
    this.props.AuthActions({action: 'me', params : {}});
  }

  componentDidUpdate(prevProps) {
       

    if(prevProps.sportVideoEventsBySportNameAndDates !== this.props.sportVideoEventsBySportNameAndDates){

         if(!empty(this.props.sportVideoEventsBySportNameAndDates)){
             let { filterDateState } = this.state;

             if(!empty(this.props.sportVideoEventsBySportNameAndDates) && empty(filterDateState)){
                 filterDateState = this.props.sportVideoEventsBySportNameAndDates[0].eventToday;
             }

             this.props.SportsActions({action: 'getAllEventsBySportsAndDatesLeagues', params: { sportName : this.state.sportNameSelected, eventToday: filterDateState }});

         }
        
    }

    if(prevProps.sportVideoEventsBySportNameAndDatesLeagues !== this.props.sportVideoEventsBySportNameAndDatesLeagues){
         if(!empty(this.props.sportVideoEventsBySportNameAndDatesLeagues)){
             if(!empty(this.props.sportVideoEventsBySportNameAndDatesLeagues)){
                 if(empty(this.state.filterLeague)){
                     this.setState({
                         filterLeague: this.props.sportVideoEventsBySportNameAndDatesLeagues[0].league
                     })
                 }
             }
             
         }
    }

 }

  componentWillMount() {    
      this.props.SportsActions({action: 'getAllVSportsCountBySportnameOpen'});  
      this.props.SportsActions({action: 'getAllEventsBySportsAndDates', params: { sportName : this.state.sportNameSelected }});
      this.props.TicketsActions({action: 'getMyTicketsSportsInterval'});
      this.props.AuthActions({action: 'getDateBD'});

      let userData = AuthActions.meData();
      let ticket_offices_id =  (!empty(userData)) ? userData.ticket_offices_id : '';
      let centers_id =  (!empty(userData)) ? userData.centers_id : '';
      let currency_code =  (!empty(userData)) ? userData.currency_code : '';
      // TAQUILLAS SOLO 5 y 6
      if(isOnly5y6(ticket_offices_id)){
        history.push('/5y6');
      }    

      if(parseInt(centers_id) == 170){
        history.push('/lotteries-cocks');
      }

      if(parseInt(centers_id) === 177
        && currency_code ==='VES'){
          history.push('/nacional-elinmejorable');
      }

      if(parseInt(centers_id) === 177
        && currency_code ==='COP'){
          history.push('/nacional-elinmejorable');
      }

      
      if(parseInt(centers_id) === 177
        && currency_code ==='USD'){
          history.push('/nacional-dolares');
      }

      // TAQUILLAS NACIONALES
      if(parseInt(centers_id) !== 177 && parseInt(centers_id) !== 170 && currency_code ==='VES'){
        history.push('/nacional');
      }

     
      if(centers_id == '164'){
        history.push('/horses-hipicawin');
      }

      // TAQUILLAS ARGENTINAS
      if(currency_code =='ARS'){
        history.push('/horses-argentinos');
      }

      // TAQUILLAS USD, SI SON INMEJORABLE Y NO SON SPORTS
      if(currency_code =='USD' 
      && centers_id=='53' 
      && !isSaleSports(ticket_offices_id)){
        history.push('/cocks');
      }

      

  }

  updateSportName = (sportName) => {
    this.setState({
      loading: 1,
      sportNameSelected : sportName,
      filterDateState: '',
      filterLeague: ''
    });
    this.props.SportsActions({action: 'getAllEventsBySportsAndDates', params: { sportName : sportName }});
  }

  onClickSetFilterLeague = (league) => {
    this.setState({
        filterLeague : league,
    });
  }

  onClickSetFilterDateState = (filterDateState) => {
      //console.log('onClickSetFilterDateState::filterDateState::', filterDateState)
      this.setState({ 
          filterDateState : filterDateState,
          filterLeague: ''
      });

      this.props.SportsActions({action: 'getAllEventsBySportsAndDatesLeagues', params: { sportName : this.state.sportNameSelected, eventToday: filterDateState }});
  } 

  convertOddToAmerican(decimal){
    let odds2 = '';
    let odds2pre = 0;
    if(parseFloat(decimal) >= 2) {
        odds2pre = (decimal*100)-100;
        odds2pre = Math.round(odds2pre);
        odds2 = "+" + odds2pre.toString(); 
    }else {
        odds2pre = 100/(parseFloat(decimal)-1);
        odds2pre = Math.round(odds2pre);
        odds2 = "-" + odds2pre.toString();
    }
    return odds2;
    }

    confirmSubmitIndividual = (e) => {
        e.preventDefault();
        let { sellform,showOdds,sportNameSelected } = this.state;
        let {user} = this.props;
        const appConfig = getAppConfig();
        let eventsSelected = sellform.events;
        let currencyCode = user.currency_code;
        eventsSelected.sort((a,b) => a.key - b.key);
        let individual = [];
        let riskTotal = 0;
        let totalToPay = 0;
        let date = require('date-and-time');
  
        for(let k=0;k<eventsSelected.length;k++){
            let eventFilter = eventsSelected[k].eventSource;
            riskTotal += eventsSelected[k].risk;
            totalToPay += eventsSelected[k].totalToPay;
            individual.push(
                <>
                    <Row className={'sport-ticket-selection'}>
  
                        <Col xl={12} className={'sport-ticket-event-name event-date text-left'}>
                            {date.format(new Date(eventFilter.eventDate),"DD/MM hh:mm A") }
                        </Col>
  
                        <Col xl={12} className={'sport-ticket-event-name text-left'}>
                            {eventFilter.eventName}
                        </Col>
  
                        <Col xl={12} className={'sport-ticket-bet-type text-left'}>
                            {translateType(eventsSelected[k].type,sportNameSelected,'es')}
                        </Col>
  
                        <Col xl={8} className={'sport-ticket-bet-type-selection text-left'}>
                              {translateDescription(eventsSelected[k].type,eventFilter.eventHome,eventFilter.eventAway,eventsSelected[k].factor,eventsSelected[k].marketType,eventsSelected[k].factorExtra,eventsSelected[k].marketTypeDetail)}
                        </Col>
                        <Col xl={4} className={'sport-ticket-bet-odd-selection'}>
                            <Badge variant={'success'}>{showOdds == 'D' ? eventsSelected[k].odd : this.convertOddToAmerican(eventsSelected[k].odd)} </Badge>
                        </Col>
                    </Row>
                    {
                    (eventsSelected.length > 1) ?
                    <Row>
                        <Col xl={12}>
                        <b>Riesgo: {formatNumber(currencyCode,eventsSelected[k].risk)}</b>
                        </Col>
                        <Col xl={12}>
                            <b>Ganancia Potencial: {formatNumber(currencyCode,eventsSelected[k].totalToPay)}</b>
                        </Col>
                    </Row>
                    : null
                    }
  
                    {((eventsSelected.length - 1) == k) ?
                    <>
                    <hr/>
                    <Row>
                        <Col xl={12}>
                        <b>Riesgo Total: {formatNumber(currencyCode,riskTotal)}</b>
                        </Col>
                        <Col xl={12}>
                            <b>Ganancia Potencial Total: {formatNumber(currencyCode,totalToPay)}</b>
                        </Col>
                    </Row>
                    </> : null    
                    }
                    
                </>
            );
  
        }
  
        let bodyHtml = (<div align="center">
                {appConfig.logo && <Image src={appConfig.logo} className="ticketLogo" />}
            <br />
            Resumen de la jugada:
        <br /> 
        {individual}
        </div>); 
  
        if(!empty(individual) 
        ){
            document.body.classList.remove('modal-open-ticket'); 
            document.body.classList.add('modal-open-ticket');
            this.dialog.show({
              className: 'confirm-ticket',
              title: 'Confirmar',
              body: bodyHtml,
              actions: [
                  Dialog.CancelAction(() => {
                    document.body.classList.remove('modal-open-ticket'); 
                  }),
                  Dialog.OKAction(() => {
                      document.body.classList.remove('modal-open-ticket'); 
                      this.handleSubmitIndividual();
                  })
              ]
            })
        } else {
            toast.warn('Debe seleccionar al menos un evento',{position: toast.POSITION.TOP_CENTER}); 
        }
        
      }
      
      confirmSubmitIndividualFast = () => {
        let { sellform,showOdds,sportNameSelected } = this.state;
        let {user} = this.props;
        const appConfig = getAppConfig();
        let eventsSelected = sellform.events;
        let currencyCode = user.currency_code;
        eventsSelected.sort((a,b) => a.key - b.key);
        let individual = [];
        let riskTotal = 0;
        let totalToPay = 0;
        let date = require('date-and-time');
  
        for(let k=0;k<eventsSelected.length;k++){
            let eventFilter = eventsSelected[k].eventSource;
            riskTotal += eventsSelected[k].risk;
            totalToPay += eventsSelected[k].totalToPay;
            individual.push(
                <>
                    <Row className={'sport-ticket-selection'}>
  
                        <Col xl={12} className={'sport-ticket-event-name event-date text-left'}>
                            {date.format(new Date(eventFilter.eventDate),"DD/MM hh:mm A") }
                        </Col>
  
                        <Col xl={12} className={'sport-ticket-event-name text-left'}>
                            {eventFilter.eventName}
                        </Col>
  
                        <Col xl={12} className={'sport-ticket-bet-type text-left'}>
                            {translateType(eventsSelected[k].type,sportNameSelected,'es')}
                        </Col>
  
                        <Col xl={8} className={'sport-ticket-bet-type-selection text-left'}>
                              {translateDescription(eventsSelected[k].type,eventFilter.eventHome,eventFilter.eventAway,eventsSelected[k].factor,eventsSelected[k].marketType,eventsSelected[k].factorExtra,eventsSelected[k].marketTypeDetail)}
                        </Col>
                        <Col xl={4} className={'sport-ticket-bet-odd-selection'}>
                            <Badge variant={'success'}>{showOdds == 'D' ? eventsSelected[k].odd : this.convertOddToAmerican(eventsSelected[k].odd)} </Badge>
                        </Col>
                    </Row>
                    {
                    (eventsSelected.length > 1) ?
                    <Row>
                        <Col xl={12}>
                        <b>Riesgo: {formatNumber(currencyCode,eventsSelected[k].risk)}</b>
                        </Col>
                        <Col xl={12}>
                            <b>Ganancia Potencial: {formatNumber(currencyCode,eventsSelected[k].totalToPay)}</b>
                        </Col>
                    </Row>
                    : null
                    }
  
                    {((eventsSelected.length - 1) == k) ?
                    <>
                    <hr/>
                    <Row>
                        <Col xl={12}>
                        <b>Riesgo Total: {formatNumber(currencyCode,riskTotal)}</b>
                        </Col>
                        <Col xl={12}>
                            <b>Ganancia Potencial Total: {formatNumber(currencyCode,totalToPay)}</b>
                        </Col>
                    </Row>
                    </> : null    
                    }
                    
                </>
            );
  
        }
  
        let bodyHtml = (<div align="center">
                {appConfig.logo && <Image src={appConfig.logo} className="ticketLogo" />}
            <br />
            Resumen de la jugada:
        <br /> 
        {individual}
        </div>); 
  
        if(!empty(individual) 
        ){
            document.body.classList.remove('modal-open-ticket'); 
            document.body.classList.add('modal-open-ticket');
            this.dialog.show({
              className: 'confirm-ticket',
              title: 'Confirmar',
              body: bodyHtml,
              actions: [
                  Dialog.CancelAction(() => {
                    document.body.classList.remove('modal-open-ticket'); 
                  }),
                  Dialog.OKAction(() => {
                      document.body.classList.remove('modal-open-ticket'); 
                      this.handleSubmitIndividual();
                  })
              ]
            })
        } else {
            toast.warn('Debe seleccionar al menos un evento',{position: toast.POSITION.TOP_CENTER}); 
        }
        
      }
  
      confirmSubmitMultipleFast = () => {
        let { sellform,showOdds,sportNameSelected } = this.state;
        let {user} = this.props;
        const appConfig = getAppConfig();

        let eventsSelected = sellform.events;
        let currencyCode = user.currency_code;
        eventsSelected.sort((a,b) => a.key - b.key);
        let multiple = [];
        let date = require('date-and-time');

        for(let k=0;k<eventsSelected.length;k++){
            let eventFilter = eventsSelected[k].eventSource;
            
            multiple.push(
                <>
                    <Row className={'sport-ticket-selection'}>
                        <Col xl={12} className={'sport-ticket-event-name event-date text-left'}>
                            {date.format(new Date(eventFilter.eventDate),"DD/MM hh:mm A") }
                        </Col>
                        <Col xl={12} className={'sport-ticket-event-name text-left'}>
                            {eventFilter.eventName}
                        </Col>

                        <Col xl={12} className={'sport-ticket-bet-type text-left'}>
                            {translateType(eventsSelected[k].type,sportNameSelected,'es')}
                        </Col>

                        <Col xl={8} className={'sport-ticket-bet-type-selection text-left'}>
                            {translateDescription(eventsSelected[k].type,eventFilter.eventHome,eventFilter.eventAway,eventsSelected[k].factor,eventsSelected[k].marketType,eventsSelected[k].factorExtra,eventsSelected[k].marketTypeDetail)}
                        </Col>
                        <Col xl={4} className={'sport-ticket-bet-odd-selection'}>
                            <Badge variant={'success'}>{showOdds == 'D' ? eventsSelected[k].odd : this.convertOddToAmerican(eventsSelected[k].odd)}</Badge>
                        </Col>
                    </Row>
                </>
            );

        }

        multiple.push(<Row>
            <Col xl={12}>
            <b>Riesgo Total: {formatNumber(currencyCode,sellform.riskMultiple)}</b>
            </Col>
            <Col xl={12}>
                <b>Ganancia Potencial Total: {formatNumber(currencyCode,sellform.totalToPayMultiple)}</b>
            </Col>
        </Row>);

        let bodyHtml = (<div align="center">
            {appConfig.logo && <Image src={appConfig.logo} className="ticketLogo" />}
            <br />
            Resumen de la jugada:
        <br /> 
        {multiple}
        </div>); 

        if(!empty(multiple) 
        ){
            document.body.classList.remove('modal-open-ticket'); 
            document.body.classList.add('modal-open-ticket');
            this.dialog.show({
            className: 'confirm-ticket',
            title: 'Confirmar',
            body: bodyHtml,
            actions: [
                Dialog.CancelAction(() => {
                    document.body.classList.remove('modal-open-ticket'); 
                }),
                Dialog.OKAction(() => {
                    document.body.classList.remove('modal-open-ticket'); 
                    this.handleSubmitMultiple();
                })
            ]
            })
        } else {
            toast.warn('Debe seleccionar al menos un evento',{position: toast.POSITION.TOP_CENTER}); 
        }
            
      }

      confirmSubmitMultiple = (e) => {
          e.preventDefault();
          let { sellform,showOdds,sportNameSelected } = this.state;
          let {user} = this.props;
          const appConfig = getAppConfig();
  
          let eventsSelected = sellform.events;
          let currencyCode = user.currency_code;
          eventsSelected.sort((a,b) => a.key - b.key);
          let multiple = [];
          let date = require('date-and-time');
  
          for(let k=0;k<eventsSelected.length;k++){
              let eventFilter = eventsSelected[k].eventSource;
              
              multiple.push(
                  <>
                      <Row className={'sport-ticket-selection'}>
                          <Col xl={12} className={'sport-ticket-event-name event-date text-left'}>
                              {date.format(new Date(eventFilter.eventDate),"DD/MM hh:mm A") }
                          </Col>
                          <Col xl={12} className={'sport-ticket-event-name text-left'}>
                              {eventFilter.eventName}
                          </Col>
  
                          <Col xl={12} className={'sport-ticket-bet-type text-left'}>
                              {translateType(eventsSelected[k].type,sportNameSelected,'es')}
                          </Col>
  
                          <Col xl={8} className={'sport-ticket-bet-type-selection text-left'}>
                              {translateDescription(eventsSelected[k].type,eventFilter.eventHome,eventFilter.eventAway,eventsSelected[k].factor,eventsSelected[k].marketType,eventsSelected[k].factorExtra,eventsSelected[k].marketTypeDetail)}
                          </Col>
                          <Col xl={4} className={'sport-ticket-bet-odd-selection'}>
                              <Badge variant={'success'}>{showOdds == 'D' ? eventsSelected[k].odd : this.convertOddToAmerican(eventsSelected[k].odd)}</Badge>
                          </Col>
                      </Row>
                  </>
              );
  
          }
  
          multiple.push(<Row>
              <Col xl={12}>
              <b>Riesgo Total: {formatNumber(currencyCode,sellform.riskMultiple)}</b>
              </Col>
              <Col xl={12}>
                  <b>Ganancia Potencial Total: {formatNumber(currencyCode,sellform.totalToPayMultiple)}</b>
              </Col>
          </Row>);
  
          let bodyHtml = (<div align="center">
              {appConfig.logo && <Image src={appConfig.logo} className="ticketLogo" />}
              <br />
              Resumen de la jugada:
          <br /> 
          {multiple}
          </div>); 
  
          if(!empty(multiple) 
          ){
              document.body.classList.remove('modal-open-ticket'); 
              document.body.classList.add('modal-open-ticket');
              this.dialog.show({
                className: 'confirm-ticket',
                title: 'Confirmar',
                body: bodyHtml,
                actions: [
                    Dialog.CancelAction(() => {
                      document.body.classList.remove('modal-open-ticket'); 
                    }),
                    Dialog.OKAction(() => {
                        document.body.classList.remove('modal-open-ticket'); 
                        this.handleSubmitMultiple();
                    })
                ]
              })
          } else {
              toast.warn('Debe seleccionar al menos un evento',{position: toast.POSITION.TOP_CENTER}); 
          }
          
      }
  
      handleSubmitIndividual = () => {
  
          const {account} = this.props
          let { sellform } = this.state;
          let eventsSelected = sellform.events;
          let {user} = this.props;
          const appConfig = getAppConfig();  
          let currencyCode = user.currency_code;
          let eventsIdSend = '';
  
          let total = 0;
          for(let k=0;k<eventsSelected.length;k++){
              total +=eventsSelected[k].risk;
          }
  
          let errorValidation = '';
    
          if(empty(sellform.events)){
              errorValidation = 'Debe seleccionar algun evento';
          }
  
          if(parseFloat(total) <= 0){
              errorValidation = 'Debe colocar el riesgo';
          }
  
          if(empty(errorValidation)){
  
              for(let k=0;k<eventsSelected.length;k++){
                  eventsIdSend+='{eventId:@' + eventsSelected[k].eventId + '@,eventOddId:@' + eventsSelected[k].eventOddId +  '@,odd:'+eventsSelected[k].odd +',eventType:@'+eventsSelected[k].type+'@,risk:'+eventsSelected[k].risk+',factor:'+eventsSelected[k].factor+',market:@'+eventsSelected[k].market+'@,marketType:@'+eventsSelected[k].marketType+'@,factorExtra:@'+eventsSelected[k].factorExtra+'@,marketTypeDetail:@'+eventsSelected[k].marketTypeDetail+'@,inPlay:'+eventsSelected[k].inPlay+'},';
              }
  
              let newEventsId = [eventsIdSend.substr(0,(eventsIdSend.length-1))];
              let sellformAction = {
                  ...sellform,
                  amount: parseFloat(total),
                  ticketType: 'INDIVIDUAL',
                  eventsId : newEventsId
              }
  
              this.props.SellActions({action: 'sellTicketSport', params : { sellform: sellformAction }}  );
              this.setState({
                  sellform : {
                      events  : [],
                      riskMultiple:0,
                      totalToPayMultiple : 0
                  }
              });
          }else {
              toast.warn(errorValidation,{position: toast.POSITION.TOP_CENTER});
          }
  
      }
  
      handleSubmitMultiple = () => {
  
          const {account, ticketoffice} = this.props
          let { sellform } = this.state;
          let eventsSelected = sellform.events;
          let {user} = this.props;
          const appConfig = getAppConfig();  
          let currencyCode = user.currency_code;

          let eventsIdSend = '';
  
          let total = 0;
  
          total = parseFloat(sellform.riskMultiple);
  
          let errorValidation = '';
    
          if(empty(sellform.events)){
              errorValidation = 'Debe seleccionar algun evento';
          }
  
          if(parseFloat(total) <= 0){
              errorValidation = 'Debe colocar el riesgo';
          }
  
          if(empty(errorValidation)){
  
              for(let k=0;k<eventsSelected.length;k++){
                  eventsIdSend+='{eventId:@' + eventsSelected[k].eventId + '@,eventOddId:@' + eventsSelected[k].eventOddId + '@,odd:'+eventsSelected[k].odd+',eventType:@'+eventsSelected[k].type+'@,risk:'+eventsSelected[k].risk+',factor:'+eventsSelected[k].factor+',market:@'+eventsSelected[k].market+'@,marketType:@'+eventsSelected[k].marketType+'@,factorExtra:@'+eventsSelected[k].factorExtra+'@,marketTypeDetail:@'+eventsSelected[k].marketTypeDetail+'@,inPlay:'+eventsSelected[k].inPlay+'},';
              }
  
              let newEventsId = [eventsIdSend.substr(0,(eventsIdSend.length-1))];
              let sellformAction = {
                  ...sellform,
                  amount: parseFloat(sellform.riskMultiple),
                  ticketType: 'MULTIPLE',
                  eventsId : newEventsId
              }
  
              this.props.SellActions({action: 'sellTicketSport', params : { sellform: sellformAction }}  );
  
              this.setState({
                  sellform : {
                      events  : [],
                      riskMultiple:0,
                      totalToPayMultiple : 0
                  }
              });
  
          }else{
              toast.warn(errorValidation,{position: toast.POSITION.TOP_CENTER});
          }
  
      }
  
      onChangeRisk = (e, event) => {
          let { name, value } = e.target;
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
  
          value = empty(value) ? 0 : value;
  
          for(let k in arrayEvents){
              if(arrayEvents[k].key === event.key ){
                  arrayEvents[k] ={
                      ...event,
                      risk:parseFloat(value), 
                      totalToPay:parseFloat(value)*parseFloat(event.odd)
                  };
              }
          }
          
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents
              }
          })
          
      }

      onChangeRiskFast = (e, event) => {
        let { name, value } = e.target;
        let {sellform} = this.state;
        let arrayEvents = sellform.events;

        value = empty(value) ? 0 : value;

        for(let k in arrayEvents){
            if(arrayEvents[k].key === event.key ){
                arrayEvents[k] ={
                    ...event,
                    risk:parseFloat(value), 
                    totalToPay:parseFloat(value)*parseFloat(event.odd)
                };
            }
        }
        
        this.setState({
            ...this.state,
            sellform:{
                ...this.state.sellform,
                events: arrayEvents
            }
        }, () => this.confirmSubmitIndividualFast() )
        
      }
  
      onChangeRiskMultiple = (e) => {
          let { name, value } = e.target;
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let totalToPayMultiple = 1;
  
          value = empty(value) ? 0 : value;
          
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
  
          totalToPayMultiple *= parseFloat(value);
      
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  totalToPayMultiple,
                  riskMultiple:parseFloat(value)
              }
          })
          
      }

      onChangeRiskMultipleFast = (e) => {
        let { name, value } = e.target;
        let {sellform} = this.state;
        let arrayEvents = sellform.events;
        let totalToPayMultiple = 1;

        value = empty(value) ? 0 : value;
        
        for(let k=0;k<arrayEvents.length;k++){
            totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
        }

        totalToPayMultiple *= parseFloat(value);
    

        this.setState({
            ...this.state,
            sellform:{
                ...this.state.sellform,
                totalToPayMultiple,
                riskMultiple:parseFloat(value)
            }
        },  () => this.confirmSubmitMultipleFast())

        
      }
  
      onClickEventHome = (event) => {
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          const oddHome =  event.eventsOddsByEventId.nodes.filter((eodds) => String(eodds.oddDetails).toUpperCase() === 'HOME');
          let eventSelect = {};
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type=='home'))){
              eventSelect = {eventId:event.idEvent, eventSource: event, eventOddId: !empty(oddHome[0]) ? oddHome[0].id : '', odd:!empty(oddHome[0]) ? oddHome[0].odd : 0, type:"home", key:(arrayEvents.length + 1), risk:0,factor:!empty(oddHome[0]) ? oddHome[0].factor : 0,marketType:!empty(oddHome[0]) ? oddHome[0].marketType : null,market:!empty(oddHome[0]) ? oddHome[0].market : null, factorExtra:null,marketTypeDetail:null,inPlay: (event.status == 4 ? true : false ) }
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onClickEventAway = (event) => {
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let eventSelect = {};
  
          const oddAway =  event.eventsOddsByEventId.nodes.filter((eodds) => String(eodds.oddDetails).toUpperCase() === 'AWAY');
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type=='away'))){
              eventSelect = {eventId:event.idEvent,eventSource: event, eventOddId: !empty(oddAway[0]) ? oddAway[0].id : '', odd:!empty(oddAway[0]) ? oddAway[0].odd : 0, type:"away", key:(arrayEvents.length + 1),risk:0, factor:!empty(oddAway[0]) ? oddAway[0].factor : 0,marketType:!empty(oddAway[0]) ? oddAway[0].marketType : null,market:!empty(oddAway[0]) ? oddAway[0].market : null, factorExtra:null,marketTypeDetail:null,inPlay: (event.status == 4 ? true : false )}
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onClickEventDraw = (event) => {
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let eventSelect = {};
          const oddDraw =  event.eventsOddsByEventId.nodes.filter((eodds) => String(eodds.oddDetails).toUpperCase() === 'DRAW');
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type=='draw'))){
              eventSelect = {eventId:event.idEvent, eventSource: event, eventOddId: !empty(oddDraw[0]) ? oddDraw[0].id : '', odd:!empty(oddDraw[0]) ? oddDraw[0].odd : 0, type:"draw", key:(arrayEvents.length + 1),risk:0,factor:!empty(oddDraw[0]) ? oddDraw[0].factor : 0,marketType:!empty(oddDraw[0]) ? oddDraw[0].marketType : null,market:!empty(oddDraw[0]) ? oddDraw[0].market : null, factorExtra:null,marketTypeDetail:null,inPlay: (event.status == 4 ? true : false )}
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onClickEventOver = (event) => {
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let eventSelect = {};
          const oddOver =  event.eventsOddsByEventId.nodes.filter((eodds) => String(eodds.oddDetails).toUpperCase() === 'OVER');
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type=='over'))){
              eventSelect = {eventId:event.idEvent, eventSource: event, eventOddId: !empty(oddOver[0]) ? oddOver[0].id : '', odd:!empty(oddOver[0]) ? oddOver[0].odd : 0, type:"over", key:(arrayEvents.length + 1),risk:0,factor:!empty(oddOver[0]) ? oddOver[0].factor : 0,marketType:!empty(oddOver[0]) ? oddOver[0].marketType : null,market:!empty(oddOver[0]) ? oddOver[0].market : null, factorExtra:null,marketTypeDetail:null,inPlay: (event.status == 4 ? true : false )}
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onClickEventUnder = (event) => {
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let eventSelect = {};
          const oddUnder =  event.eventsOddsByEventId.nodes.filter((eodds) => String(eodds.oddDetails).toUpperCase() === 'UNDER');
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type=='under'))){
              eventSelect = {eventId:event.idEvent,eventSource: event, eventOddId: !empty(oddUnder[0]) ? oddUnder[0].id : '', odd:!empty(oddUnder[0]) ? oddUnder[0].odd : 0, type:"under", key:(arrayEvents.length + 1),risk:0,factor:!empty(oddUnder[0]) ? oddUnder[0].factor : 0,marketType:!empty(oddUnder[0]) ? oddUnder[0].marketType : null,market:!empty(oddUnder[0]) ? oddUnder[0].market : null, factorExtra:null,marketTypeDetail:null,inPlay: (event.status == 4 ? true : false )}
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onClickDeleteEvent = (event) => {
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
  
          if(!empty(arrayEvents.find((t) => t.key==event.key))){
              arrayEvents = arrayEvents.filter((t) => (t.key !== event.key));
          }
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents
              }
          })
          
      }
  
      onClickDeleteEventMultiple = (event) => {
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let totalToPayMultiple = 1;
  
          if(!empty(arrayEvents.find((t) => t.key==event.key))){
              arrayEvents = arrayEvents.filter((t) => (t.key !== event.key));
          }
  
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
  
          totalToPayMultiple *= parseFloat(sellform.riskMultiple);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onChangeEventModalShow = (event) =>{
          //console.log("onChangeEventModalShow:::", event)
          document.body.classList.add('modal-open-event'); 
          document.body.classList.remove('modal-open-ticket'); 
          this.setState({ eventModalShow: true, eventModalSelected: event });
      }
  
      onClickEventMarketType = (event, market,marketType,type) => {
          
          //console.log(event, marketType);
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let eventSelect = {};
          const oddEventMarketType =  event.eventsOddsByEventId.nodes.filter((eodds) => eodds.market === market && String(eodds.marketType).toUpperCase() === marketType.toUpperCase());
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type==type))){
              eventSelect = {eventId:event.idEvent, eventSource: event, eventOddId: !empty(oddEventMarketType[0]) ? oddEventMarketType[0].id : '', odd:!empty(oddEventMarketType[0]) ? oddEventMarketType[0].odd : 0, type:type, key:(arrayEvents.length + 1),risk:0,factor:!empty(oddEventMarketType[0]) ? oddEventMarketType[0].factor : 0,marketType:!empty(oddEventMarketType[0]) ? oddEventMarketType[0].marketType : null,market:!empty(oddEventMarketType[0]) ? oddEventMarketType[0].market : null, factorExtra:null,marketTypeDetail:null,inPlay: (event.status == 4 ? true : false )}
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onClickEventFactorExtra = (event,market,marketType,factorExtra,type) => {
          
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let eventSelect = {};
          const oddFactorExtra  =  event.eventsOddsByEventId.nodes.filter((eodds) => eodds.market === market && String(eodds.marketType).toUpperCase() === marketType.toUpperCase() && String(eodds.factorExtra).toUpperCase() === factorExtra.toUpperCase());
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type==type))){
              eventSelect = {eventId:event.idEvent, eventSource: event, eventOddId: !empty(oddFactorExtra[0]) ? oddFactorExtra[0].id : '', odd:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].odd : 0, type:type, key:(arrayEvents.length + 1),risk:0,factor:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].factor : 0,marketType:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].marketType : null,market:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].market : null,factorExtra:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].factorExtra : null,marketTypeDetail:null,inPlay: (event.status == 4 ? true : false )}
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          PrivateSportsRoute
      }
  
      onClickEventFactorExtraMarketTypeDetail = (event,market,marketType,factorExtra,type,marketTypeDetail) => {
          
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let eventSelect = {};
          const oddFactorExtraMarketTypeDetail  =  event.eventsOddsByEventId.nodes.filter((eodds) => eodds.market === market && String(eodds.marketType).toUpperCase() === marketType.toUpperCase() && String(eodds.factorExtra).toUpperCase() === factorExtra.toUpperCase() && String(eodds.marketTypeDetail).toUpperCase() === marketTypeDetail.toUpperCase());
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type==type))){
              eventSelect = {eventId:event.idEvent, eventSource: event, eventOddId: !empty(oddFactorExtraMarketTypeDetail[0]) ? oddFactorExtraMarketTypeDetail[0].id : '', odd:!empty(oddFactorExtraMarketTypeDetail[0]) ? oddFactorExtraMarketTypeDetail[0].odd : 0, type:type, key:(arrayEvents.length + 1),risk:0,factor:!empty(oddFactorExtraMarketTypeDetail[0]) ? oddFactorExtraMarketTypeDetail[0].factor : 0,marketType:!empty(oddFactorExtraMarketTypeDetail[0]) ? oddFactorExtraMarketTypeDetail[0].marketType : null,market:!empty(oddFactorExtraMarketTypeDetail[0]) ? oddFactorExtraMarketTypeDetail[0].market : null,factorExtra:!empty(oddFactorExtraMarketTypeDetail[0]) ? oddFactorExtraMarketTypeDetail[0].factorExtra : null,marketTypeDetail:!empty(oddFactorExtraMarketTypeDetail[0]) ? oddFactorExtraMarketTypeDetail[0].marketTypeDetail : null,inPlay: (event.status == 4 ? true : false )}
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onClickEventFactorExtraAsian = (event,market,marketType,factorExtra,type) => {
          
          let {sellform} = this.state;
          let arrayEvents = sellform.events;
          let eventSelect = {};
          
          const oddFactorExtra  =  event.eventsOddsByEventId.nodes.filter((eodds) => eodds.market === market && String(eodds.marketType).toUpperCase() === marketType.toUpperCase() && String(eodds.factorExtra.split(' ')[0]).toUpperCase() === factorExtra.toUpperCase());
  
          if(empty(arrayEvents.find((t) => t.eventId == event.idEvent && t.type==type))){
              eventSelect = {eventId:event.idEvent, eventSource: event, eventOddId: !empty(oddFactorExtra[0]) ? oddFactorExtra[0].id : '', odd:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].odd : 0, type:type, key:(arrayEvents.length + 1),risk:0,factor:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].factor : 0,marketType:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].marketType : null,market:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].market : null,factorExtra:!empty(oddFactorExtra[0]) ? oddFactorExtra[0].factorExtra.split(' ')[0] : null,marketTypeDetail:null,inPlay: (event.status == 4 ? true : false )}
              // Agrego al arreglo
              arrayEvents.push(eventSelect);
          }
  
          // Calculo del Rick Multiple
          let totalToPayMultiple = 1;
          for(let k=0;k<arrayEvents.length;k++){
              totalToPayMultiple *= parseFloat(arrayEvents[k].odd);
          }
          totalToPayMultiple *= (!empty(sellform.riskMultiple) ? parseFloat(sellform.riskMultiple) : 0);
  
          this.setState({
              ...this.state,
              sellform:{
                  ...this.state.sellform,
                  events: arrayEvents,
                  totalToPayMultiple
              }
          })
          
      }
  
      onChangeEventModalHide = () =>{
          this.setState({ eventModalShow: false, eventModalSelected: {} });
      }
  
      onClickEventIdDetail = (eventId) => {
          this.setState({
              loading: 1,
              eventIdSelected : eventId,
              subscriptionData: { allEvents: {nodes:[]}}
          });
      }
  
      changeOdds = (odd) =>{
          this.setState({ 
              showOdds: odd
          })
      }
  
      render(){
          const { sellform, channel, loading, subscriptionData, eventIdSelected, sportNameSelected, filterDateState,showOdds,filterLeague} = this.state;
          const {ticketoffice,ticketInfoSport,payInfoSport,sportVideoEventsBySportNameAndDates, sportVideoEventsBySportNameAndDatesLeagues} = this.props;
          const {dateBD} = this.props;

          if(empty(dateBD)){
                return ('Cargando....');
          } 
        
          let userData = AuthActions.meData();
          let currencyCode =  (!empty(userData)) ? userData.currency_code : '';
  
          return(
            <>
            <div id="wrapper">
            {(!empty(ticketInfoSport) ?
            <ComponentToPrintSellSport {...this.props} /> : null)}
            {(!empty(payInfoSport) ?
            <ComponentToPrintPaySport {...this.props} /> : null)}

            <NavHeader />
            <Row className={'sports-container'}>
              <Col xl={12} className={'container-app-events'}>
                  <div id="wrapper">
                    <PrintProvider>
                        <NoPrint>
                          <Dialog className="confirm-dialog" ref={(component) => { this.dialog = component }} />
                          <Loading loading={loading} />
  
                          <Row className={'form-sport'}>
                            <Col xl={3} className={'col-sell-l'}>
                                <Row>
  
                                    <Col xl={12} className={'col-ticket pos2'}>
                                        <div className="col-12 col-md-12 col-xl-12">
                                            <ButtonsPaySport specialKey={this.state.specialKey} />
                                        </div>
                                        
                                        <MyTicket 
                                        ticketoffice={ticketoffice}
                                        sellform={sellform} 
                                        currencyCode={currencyCode}
                                        confirmSubmitIndividual={this.confirmSubmitIndividual}
                                        confirmSubmitMultiple={this.confirmSubmitMultiple}
                                        onChangeRiskMultipleFast={this.onChangeRiskMultipleFast}
                                        onClickDeleteEvent={this.onClickDeleteEvent}
                                        onClickDeleteEventMultiple={this.onClickDeleteEventMultiple}
                                        onChangeRisk={(e, event) => this.onChangeRisk(e, event)}
                                        onChangeRiskFast={(e, event) => this.onChangeRiskFast(e, event)}
                                        onChangeRiskMultiple={this.onChangeRiskMultiple}
                                        showOdds={showOdds}
                                        convertOddToAmerican={this.convertOddToAmerican}
                                        changeOdds={this.changeOdds}
                                        sportNameSelected={sportNameSelected}
                                       />


  
                                    </Col>

                                    <Col xl={12} className={'col-my-bets pos3'}>
                                      <MyTickets />
                                    </Col>
                                      
                                </Row>
                            </Col>
  
                            <Col xl={9} className={'col-sell-r'}>
                                
  
                              {(empty(eventIdSelected)) ? 

                                        (
                                            ((!empty(sportVideoEventsBySportNameAndDates) 
                                            && (!empty(sportVideoEventsBySportNameAndDatesLeagues)))
                                            
                                        ) ?
  
                                      <Subscription subscription={this.getEvents(sportNameSelected,dateBD)} 
                                      onSubscriptionData={(data) =>{
                                      this.setState({
                                          loading: 0,
                                          subscriptionData: !empty(data) ? data.subscriptionData.data : { allEvents: {nodes:[]}},
                                      })
                                      }}>
                                          {({ data, loading }) =>
                                              !empty(subscriptionData) &&
                                              !empty(subscriptionData.allEvents) ?
                                              (
                                                  <SportPage
                                                  loading={loading}
                                                  dateBD={dateBD}
                                                  sportVideoEventsBySportName={this.props.sportVideoEventsBySportName}
                                                  sportVideoEventsBySportNameAndDates={this.props.sportVideoEventsBySportNameAndDates}
                                                  sportVideoEventsBySportNameAndDatesLeagues={this.props.sportVideoEventsBySportNameAndDatesLeagues}
                                                  events={subscriptionData.allEvents.nodes}
                                                  totalEvents={subscriptionData.allEvents.edges}
                                                  onChangeTvEvent={this.onChangeTvEvent}
                                                  confirmSubmitIndividual ={this.confirmSubmitIndividual}
                                                  confirmSubmitIndividualFree={this.confirmSubmitIndividualFree}
                                                  handleSubmitMultiple={this.handleSubmitMultiple}
                                                  handleSubmitIndividual={this.handleSubmitIndividual}
                                                  handleSubmitIndividualFree={this.handleSubmitIndividualFree}
                                                  onChangeRisk={this.onChangeRisk}
                                                  onChangeRiskMultiple={this.onChangeRiskMultiple}
                                                  onClickEventHome={this.onClickEventHome}
                                                  onClickEventAway={this.onClickEventAway}
                                                  onClickEventDraw={this.onClickEventDraw}
                                                  onClickEventOver={this.onClickEventOver}
                                                  onClickEventUnder={this.onClickEventUnder}
                                                  onClickEventFactorExtra={this.onClickEventFactorExtra}
                                                  onClickEventFactorExtraAsian={this.onClickEventFactorExtraAsian}
                                                  onClickEventMarketType={this.onClickEventMarketType}
                                                  onClickEventFactorExtraMarketTypeDetail={this.onClickEventFactorExtraMarketTypeDetail}
                                                  onClickDeleteEvent={this.onClickDeleteEvent}
                                                  onClickDeleteEventMultiple={this.onClickDeleteEventMultiple}
                                                  onChangeEventModalShow={this.onChangeEventModalShow}
                                                  onChangeEventModalHide={this.onChangeEventModalHide}
                                                  onClickEventIdDetail={this.onClickEventIdDetail}
                                                  showOdds={showOdds}
                                                  changeOdds={this.changeOdds}
                                                  onClickSportName={this.updateSportName} 
                                                  sportNameSelected={sportNameSelected}
                                                  convertOddToAmerican={this.convertOddToAmerican}
                                                  onClickSetFilterDateState={this.onClickSetFilterDateState}
                                                  filterDateState={filterDateState}
                                                  filterLeague={filterLeague} 
                                                  onClickSetFilterLeague={this.onClickSetFilterLeague}
                                                  />
                                              ) : (
                                              (!loading) ?
                                              <div className="messageError">
                                                  <p>Ya existe una sesión activa, si desea utilizar esta pantalla debe volver a darle click a la opción de <b>Deportes</b> en el menú superior.</p>
                                              </div> : null
                                              )
                                          }
                                      </Subscription>

                                    : '')
                              
                                  :
  
                                  <Subscription subscription={this.getEventDetailsById(sportNameSelected,eventIdSelected)} 
                                      onSubscriptionData={(data) =>{
                                          this.setState({
                                              loading: 0,
                                              subscriptionData: !empty(data) ? data.subscriptionData.data : { allEvents: {nodes:[]}},
                                          })
                                      }}>
                                          {({ data, loading }) =>
                                              !empty(subscriptionData) &&
                                              !empty(subscriptionData.allEvents) &&
                                              !empty(subscriptionData.allEvents.nodes) ?
                                              (
                                                  <SportPageDetail
                                                  events={subscriptionData.allEvents.nodes}
                                                  totalEvents={subscriptionData.allEvents.nodes.length}
                                                  confirmSubmitIndividual ={this.confirmSubmitIndividual}
                                                  handleSubmitMultiple={this.handleSubmitMultiple}
                                                  handleSubmitIndividual={this.handleSubmitIndividual}
                                                  onChangeRisk={this.onChangeRisk}
                                                  onChangeRiskMultiple={this.onChangeRiskMultiple}
                                                  onClickEventHome={this.onClickEventHome}
                                                  onClickEventAway={this.onClickEventAway}
                                                  onClickEventDraw={this.onClickEventDraw}
                                                  onClickEventOver={this.onClickEventOver}
                                                  onClickEventUnder={this.onClickEventUnder}
                                                  onClickEventFactorExtra={this.onClickEventFactorExtra}
                                                  onClickEventFactorExtraAsian={this.onClickEventFactorExtraAsian}
                                                  onClickEventMarketType={this.onClickEventMarketType}
                                                  onClickEventFactorExtraMarketTypeDetail={this.onClickEventFactorExtraMarketTypeDetail}
                                                  onClickDeleteEvent={this.onClickDeleteEvent}
                                                  onClickDeleteEventMultiple={this.onClickDeleteEventMultiple}
                                                  updateSportName={this.updateSportName} 
                                                  onClickEventIdDetail={this.onClickEventIdDetail}
                                                  sportNameSelected={sportNameSelected} 
                                                  showOdds={showOdds}
                                                  convertOddToAmerican={this.convertOddToAmerican}
                                                  changeOdds={this.changeOdds}
                                                  filterLeague={filterLeague}
                                                  />
                                              ) : (
                                                  (!loading) ?
                                                  <div className="messageError">
                                                  <p>Ya existe una sesión activa, si desea utilizar esta pantalla debe volver a darle click a la opción de <b>Deportes</b> en el menú superior.</p>
                                                  </div> : null
                                              )
                                              }
                                      </Subscription>
  
                              }
  
                               
  
  
                                
                            </Col>
  
                            
  
  
                          </Row>
  
                        </NoPrint>
                    </PrintProvider>
                  </div>
              </Col>
            </Row>  
            </div>        
          </>
          );
    }
  }

const mapToProps = ({ account, ticketoffice, ticketInfo, ticketssports, user,sportVideoEventsBySportName,ticketInfoSport,payInfoSport,dateBD, sportVideoEventsBySportNameAndDates, sportVideoEventsBySportNameAndDatesLeagues }) => ({
  account,
  ticketoffice,
  ticketInfo,
  ticketssports,
  user,
  sportVideoEventsBySportName,
  ticketInfoSport,
  payInfoSport,
  dateBD,
  sportVideoEventsBySportNameAndDates, 
  sportVideoEventsBySportNameAndDatesLeagues
});

const connectedSportPageRT = connect(mapToProps, actions)(SportPageRT);
export { connectedSportPageRT as SportPageRT };
