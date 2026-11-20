import React from 'react';
import empty from 'is-empty';
import { connect } from "redux-zero/react";
import actions from "../../_actions";
import {Alert,Button, Col, Table, Row, Badge, Tab} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {translateType} from '../../_helpers/libSport';
import Select from 'react-select'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

let date = require('date-and-time');

/** Robert no quitar si se utilizan */
import footballIcon from '../../_images/football.svg'
import baseballicon from '../../_images/baseball.svg'
import basketballIcon from '../../_images/basketball.svg'
import americanFootballIcon from '../../_images/american-football.svg'
import tennisIcon from '../../_images/tennis.svg'
import boxingIcon from '../../_images/boxing.svg'
import artesMixtasIcon from '../../_images/artesmixtas.svg'
import hockeyIcon from '../../_images/hockey.svg'
import dotaIcon from '../../_images/dota-2.svg'
import csIcon from '../../_images/cs.svg'
import voleyballIcon from '../../_images/volleyball.svg'
import tableTennisIcon from '../../_images/table-tennis.svg'

const sportsTranslate=[
    {
        name: 'soccer',
        sportName : 'Soccer',
        sportNameEs : 'Fútbol',
        icon: '/src/_images/football.svg'
    },
    {
        name: 'baseball',
        sportName : 'Baseball',
        sportNameEs : 'Béisbol',
        icon: '/src/_images/baseball.svg'
    },
    {
        name: 'basketball',
        sportName : 'Basketball',
        sportNameEs : 'Baloncesto',
        icon: '/src/_images/basketball.svg'
    },
    {
        name: 'american-football',
        sportName : 'American Football',
        sportNameEs : 'NFL',
        icon: '/src/_images/american-football.svg'
    },
    {
        name: 'tennis',
        sportName : 'Tennis',
        sportNameEs : 'Tenis',
        icon: '/src/_images/tennis.svg'
    },
    {
        name: 'boxing',
        sportName : 'Boxing',
        sportNameEs : 'Boxeo',
        icon: '/src/_images/boxing.svg'
    },
    {
        name: 'mma',
        sportName : 'MMA',
        sportNameEs : 'MMA',
        icon: '/src/_images/artesmixtas.svg'
    },
    {
        name: 'hockey',
        sportName : 'Ice-hockey',
        sportNameEs : 'Ice Hockey',
        icon: '/src/_images/hockey.svg'
    },
    {
        name: 'hockey',
        sportName : 'Hockey',
        sportNameEs : 'Hockey',
        icon: '/src/_images/hockey.svg'
    },
    {
        name: 'dota',
        sportName : 'Dota',
        sportNameEs : 'Dota',
        icon: '/src/_images/dota-2.svg'
    },
    {
        name: 'cs',
        sportName : 'CS:GO',
        sportNameEs : 'CS:GO',
        icon: '/src/_images/cs.svg'
    },
    {
        name: 'volleyball',
        sportName : 'Volleyball',
        sportNameEs : 'Vóleibol',
        icon: '/src/_images/volleyball.svg'
    },
    {
        name: 'tennis',
        sportName : 'Table Tennis',
        sportNameEs : 'Tenis de Mesa',
        icon: '/src/_images/table-tennis.svg'
    }
]

class EventsTable2 extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            filterSportState: this.props.sportNameSelected,
            filterSportStateChange: false, 
            filterLeagueState: '',
            filterEventNameState: '',
            //filterDateState: '',
            filterEventsCountByDate: [],
            selectedLeagueToShow: ''
        }
    }

    componentWillMount(){
        this.calculateEventsCount(this.props.events, true)
    }
    

    calculateEventsCount(events, willMount){
        let eventsBySports = [];
        let filterEventsCountByDate = [];

        if(willMount === true){
            let filterDateState = '';

            if(!empty(this.props.sportVideoEventsBySportNameAndDates) && filterDateState === ''){
                filterDateState = this.props.sportVideoEventsBySportNameAndDates[0].eventToday;
            }
    
            this.setState({ 
                filterDateState
            })
        }

        this.setState({
            filterSportState: this.props.sportNameSelected,
            filterEventsCountByDate: filterEventsCountByDate
        })
    }

    componentDidUpdate(prevProps, prevState){

        if(JSON.stringify(this.props.events) == JSON.stringify(prevProps.events)){
            return false;
        }

        if(JSON.stringify(this.props.events) != JSON.stringify(prevProps.events)){
            const {events} = this.props;
            let willMount = false;
            if( this.state.filterSportStateChange === true){
                willMount = true;
                this.setState({ 
                    filterSportStateChange: false
                })
            }
            this.calculateEventsCount(events, willMount);
        }
         
    }

    onClickSetFilterDateState = (filterDateState) => {
        // this.setState({ 
        //     filterDateState
        // });

        this.props.onClickSetFilterDateState(filterDateState);
    }

    loadFiltersSports = (filters) =>{
        let {filterSportState, filterLeagueState, filterEventsCountByDate} = this.state;
        let sports = [];
        let filterDateState = this.props.filterDateState;

        for(let s of sportsTranslate){

            let findCountSport = {};
            if(!empty(this.props.sportVideoEventsBySportName)){
                let sportCount = this.props.sportVideoEventsBySportName;
                findCountSport = sportCount.find((sport) => sport.sportName == s.sportName)
                if(empty(findCountSport) && (s.sportName !== 'InPlay')){
                    continue;
                }
            }

            //console.log('this.props.sportNameSelected', this.props.sportNameSelected, s.sportName);
            sports.push(
            <li key={`filter-${s.name}-${Math.random()}`} className={(this.props.sportNameSelected === s.sportName) ? `active`: ''} onClick={() => {
                this.props.onClickSportName(s.sportName)    
                this.setState({
                    filterSportState: s.sportName,
                    filterSportStateChange: true,
                })            
            }}>
                 <span className='sport-filter-icon'>
                    <img src={s.icon}></img>
                </span>
                <span className='sport-filter-text'>{s.sportNameEs} {!empty(findCountSport) ? `(${findCountSport.count})` : ''}</span>
            </li>)
        }

        let dateFilter = [];
        let leaguesOptions = [];

        if(!empty(this.props.sportVideoEventsBySportNameAndDates) && filterDateState === ''){
                filterDateState = this.props.sportVideoEventsBySportNameAndDates[0].eventToday;
        }

        if(!empty(this.props.sportVideoEventsBySportNameAndDates)){
            this.props.sportVideoEventsBySportNameAndDates.forEach((eventDate) => {
                dateFilter.push(<li key={`filter-date-${eventDate.eventToday}`} className={(filterDateState == eventDate.eventToday) ? `active`: ''} onClick={() => {
                    this.onClickSetFilterDateState(eventDate.eventToday)
                }}>
                    <span className='sport-filter-text'>{ this.props.dateBD.today === eventDate.eventToday ? `Hoy`  :`${eventDate.case}`}</span>
                </li>)
            })


            if(this.props.inPlay === true){
                dateFilter= [];
            }
        }

        
        if(!empty(this.props.sportVideoEventsBySportNameAndDatesLeagues)){
            this.props.sportVideoEventsBySportNameAndDatesLeagues.forEach((eventLeague) => {
                leaguesOptions.push({
                    label: eventLeague.league,
                    value: eventLeague.league
                })
            })

            if(this.props.inPlay === true){
                leaguesOptions= [];
            }
        }

        return(
            <Row className={'sports-filters'}>
                <Col xl={12} className={'sports-name-filter'}>
                    <ul>
                        {sports}
                    </ul>
                    
                </Col>

                <Col xl={12} className={'sports-date-filter'}>
                    <ul>
                        {dateFilter}
                    </ul>
                    
                </Col>

                { (!empty(leaguesOptions)) ?
                <Col xl={8} className={'sports-league-filter'}>

                    <p><b>Filtro de Ligas</b></p>
                    <Select className={'leagues-dropdown'} placeholder={'Ligas'} options={leaguesOptions} value={(!empty(this.props.filterLeague) ? { label: this.props.filterLeague, value: this.props.filterLeague } : '')} 
                    onChange={(e) => {
                        //console.log('e::leagues', e)
                        this.props.onClickSetFilterLeague(e.value)
                    }
                    } />
                    <p> <br/> </p>
                    
                </Col>
                : ''}

                
                
            </Row>
        )
    
    }

    showRulesBySport(){

        let messageRule = '';
        const {sportNameSelected} = this.props;


        if(sportNameSelected === 'Soccer'){
            messageRule= ( '- Los juegos de Fútbol NO incluyen extratiempo, todos se deciden en 90 minutos, a menos que se indique lo contrario. Importante:A partir del 19 de Abril de 2022, si un evento se suspende, automaticamente será recalculado el monto del ticket (Si la jugada es múltiple) o devuelto el dinero si la jugada es individual.');
        }

        if(sportNameSelected === 'Ice-hockey'){
            messageRule= ( 'Los juegos de Hockey NO incluyen extratiempo, todos se deciden en 60 minutos o el tiempo reglamentario (No son válidos tiempo extra, ni penalty), a menos que se indique lo contrario.');
        }

        if(sportNameSelected === 'Basketball'){
            messageRule= ( 'Ahora los logros de los juegos de Basketball a ganar incluyen extratiempo');
        }

        if(sportNameSelected === 'Baseball'){
            messageRule= ( 'Los juegos de Beisbol SI incluyen extrainnings.');
        }


        if(empty(messageRule)){
            return null;
        }

        return (<Alert key="alert-video" variant="warning">
                    <b>Importante:</b> {messageRule}
                </Alert>)
    }

    onShowEventsByLeague(league){
        const {selectedLeagueToShow} = this.state;
        this.setState({ 
            selectedLeagueToShow: (selectedLeagueToShow === league) ? '' : league
        })
    }

    orderEventsByImportantLeagues(sport, events){
        const leaguesOrderBySports = [
            {
                sport: 'Baseball',
                leagues: ['United States - MLB']
            },
            {
                sport: 'Basketball',
                leagues: ['United States - NBA']
            },
            {
                sport: 'Soccer',
                leagues: ['England - Premier League', 'Spain - LaLiga','Italy - Serie A', 'France - Ligue 1', 'Germany - Bundesliga','Spain - Supercopa', 'Spain - Copa del Rey','International - UEFA Champions League','International - UEFA Europa League']
            },
            {
                sport: 'Ice-hockey',
                leagues: ['United States - NHL']
            },
        ];
        let arrayEventsPrimary = [];
        let arrayEventsNoPrimary = [];

        const leaguesOrder = leaguesOrderBySports.find((e) => e.sport === sport);

        if(empty(leaguesOrder)){
            return events;
        }

        arrayEventsPrimary = events.filter((e) => leaguesOrder.leagues.includes(e.league));
        arrayEventsNoPrimary = events.filter((e) => !leaguesOrder.leagues.includes(e.league));

        return arrayEventsPrimary.concat(arrayEventsNoPrimary);

    }

    render() {
        let trEvents=[];
        let allEvents = this.props.events;
        let alltotalEvents = this.props.totalEvents;
        let league = '';
        let filters = {};
        let filterLeagues = [];
        let filterEvents = [];
        let allEventsBySportAndLeague = [];

        let {filterSportState, filterLeagueState, selectedLeagueToShow} = this.state;
        const filterDateState = this.props.filterDateState;
        let {showOdds, sportNameSelected} = this.props;

        let totalEvents = [];

        
        if(!empty(alltotalEvents)){
                if(sportNameSelected=='Soccer'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsSoccerPrematchesByEventId) ? e.node.eventsOddsSoccerPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='Baseball'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsBaseballPrematchesByEventId) ? e.node.eventsOddsBaseballPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='Basketball'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsBasketballPrematchesByEventId) ? e.node.eventsOddsBasketballPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='American Football'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsAmericanFootballPrematchesByEventId) ? e.node.eventsOddsAmericanFootballPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='Tennis'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsTennisPrematchesByEventId) ? e.node.eventsOddsTennisPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='Boxing'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsBoxingPrematchesByEventId) ? e.node.eventsOddsBoxingPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='MMA'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsMmaPrematchesByEventId) ? e.node.eventsOddsMmaPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='Ice-hockey'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsIceHockeyPrematchesByEventId) ? e.node.eventsOddsIceHockeyPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='Volleyball'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsVolleyballPrematchesByEventId) ? e.node.eventsOddsVolleyballPrematchesByEventId.totalCount: 0;
                    });
                }else if(sportNameSelected=='Table Tennis'){
                    alltotalEvents.map((e) => {
                        totalEvents[e.node.id] = !empty(e.node) && !empty(e.node.eventsOddsTableTennisPrematchesByEventId) ? e.node.eventsOddsTableTennisPrematchesByEventId.totalCount: 0;
                    });
                }
            
        }

        if(!empty(allEvents)){

            // Events by league
            allEvents.map((e) => {

                // Filters
                if(empty(filterLeagues[e.sportName])){
                    filterLeagues[e.sportName] = [];
                }

                if(!filterLeagues[e.sportName].find((l) => l == e.league) ){
                    filterLeagues[e.sportName].push(e.league);
                }
                
                filterEvents[e.id] = e.eventName;

                // All events by sport name
                if(empty(allEventsBySportAndLeague[e.sportName])){
                    allEventsBySportAndLeague[e.sportName] = [];
                }
                allEventsBySportAndLeague[e.sportName].push(e);
                allEventsBySportAndLeague[e.sportName] = allEventsBySportAndLeague[e.sportName].sort((a, b) => {
                    if (a.league === b.league) {
                        return b.eventDate - a.eventDate;
                     }
                     return a.league > b.league ? 1 : -1;
                })

                // Order ligas Destacadas por Deportes
                allEventsBySportAndLeague[e.sportName]=this.orderEventsByImportantLeagues(e.sportName, allEventsBySportAndLeague[e.sportName]);
                
            })

            const events = !empty(allEventsBySportAndLeague[this.props.sportNameSelected]) ? allEventsBySportAndLeague[this.props.sportNameSelected] : [];
            let countLeagues = 0;
            const showOpenLeagues = 5;
            let obj = {
                nodes:[] 
            };

            for(let k=0;k<events.length;k++){

                    if(sportNameSelected=='Soccer'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsSoccerPrematchesByEventId) && !empty(events[k].eventsOddsSoccerPrematchesByEventId.nodes) ? events[k].eventsOddsSoccerPrematchesByEventId : obj;
                    }else if(sportNameSelected=='Baseball'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsBaseballPrematchesByEventId) && !empty(events[k].eventsOddsBaseballPrematchesByEventId.nodes) ? events[k].eventsOddsBaseballPrematchesByEventId : obj;
                    }else if(sportNameSelected=='Basketball'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsBasketballPrematchesByEventId) && !empty(events[k].eventsOddsBasketballPrematchesByEventId.nodes) ? events[k].eventsOddsBasketballPrematchesByEventId : obj;
                    }else if(sportNameSelected=='American Football'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsAmericanFootballPrematchesByEventId) && !empty(events[k].eventsOddsAmericanFootballPrematchesByEventId.nodes) ? events[k].eventsOddsAmericanFootballPrematchesByEventId : obj;
                    }else if(sportNameSelected=='Tennis'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsTennisPrematchesByEventId) && !empty(events[k].eventsOddsTennisPrematchesByEventId.nodes) ? events[k].eventsOddsTennisPrematchesByEventId : obj;
                    }else if(sportNameSelected=='Boxing'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsBoxingPrematchesByEventId) && !empty(events[k].eventsOddsBoxingPrematchesByEventId.nodes) ? events[k].eventsOddsBoxingPrematchesByEventId : obj;
                    }else if(sportNameSelected=='MMA'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsMmaPrematchesByEventId) && !empty(events[k].eventsOddsMmaPrematchesByEventId.nodes) ? events[k].eventsOddsMmaPrematchesByEventId : obj;
                    }else if(sportNameSelected=='Ice-hockey'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsIceHockeyPrematchesByEventId) && !empty(events[k].eventsOddsIceHockeyPrematchesByEventId.nodes) ? events[k].eventsOddsIceHockeyPrematchesByEventId : obj;
                    }else if(sportNameSelected=='Volleyball'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsVolleyballPrematchesByEventId) && !empty(events[k].eventsOddsVolleyballPrematchesByEventId.nodes) ? events[k].eventsOddsVolleyballPrematchesByEventId : obj;
                    }else if(sportNameSelected=='Table Tennis'){
                        events[k].eventsOddsByEventId = !empty(events[k].eventsOddsTableTennisPrematchesByEventId) && !empty(events[k].eventsOddsTableTennisPrematchesByEventId.nodes) ? events[k].eventsOddsTableTennisPrematchesByEventId : obj;
                    }

                

                

                if(events[k].status==2 && events[k].inPlay==false){
                    return;
                }

                
                const detailParams = {
                    id : events[k].id
                }

                // check if has extra odds
                let findExtraOdds =  (!empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] > 4 : !empty(events[k].eventsOddsByEventId.nodes) ? events[k].eventsOddsByEventId.nodes.length > 4 : false);

                let livescore = !empty(events[k].livescore) ? events[k].livescore : '';

                let timeLive = !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Time) && !isNaN(livescore.Scoreboard.Time)  ? parseInt(livescore.Scoreboard.Time) / 60 : ''; 

                if(timeLive<0){
                    timeLive = !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.CurrentPeriod) && !isNaN(livescore.Scoreboard.CurrentPeriod)  ? parseInt(livescore.Scoreboard.CurrentPeriod) : ''; 
                }

                let oddHome = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Home'));
                let oddDraw = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Draw'));
                let oddAway = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Away'));
                let oddOver = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='over'));
                let oddUnder = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='under'));

                if(league != events[k].league){
                    league = events[k].league;
                    countLeagues ++;
    
                    const eventsCountByLeagueAll = events.filter((e) => e.league === events[k].league).length;
                    const eventsCountByLeagueNext = events.filter((e) => e.league === events[k].league && date.format(new Date(e.eventDate),"DD/MM/YYYY") != date.format(new Date(),"DD/MM/YYYY")).length;
                    const eventsCountByLeagueToday = events.filter((e) => e.league === events[k].league && date.format(new Date(e.eventDate),"DD/MM/YYYY") == date.format(new Date(),"DD/MM/YYYY")).length;
    
                    let eventsByDateState = eventsCountByLeagueAll;
                    if(filterDateState === 'next')  eventsByDateState = eventsCountByLeagueNext;
                    if(filterDateState === 'today')  eventsByDateState = eventsCountByLeagueToday;
    
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'sport-league active' : 'sport-league'} onClick={() => {
                            this.onShowEventsByLeague(events[k].league);
                        }}>
                          <td className={'pl-10'}>{events[k].league}({eventsByDateState})</td>
                        </tr>);
                       
                }
                

                let oddFirstPeriodWinner = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Winner')): null;
        
                let buttonFirstPeriodWinner1 = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonFirstPeriodWinnerX = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonFirstPeriodWinner2 = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddFirstPeriodWinner)){

                for(let i=0; i < oddFirstPeriodWinner.length; i++){
                    if(oddFirstPeriodWinner[i].marketType=='1'){
                        buttonFirstPeriodWinner1 = [];
                        buttonFirstPeriodWinner1.push(!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : '')
                    }

                    if(oddFirstPeriodWinner[i].marketType=='X'){
                        buttonFirstPeriodWinnerX = [];
                        buttonFirstPeriodWinnerX.push(!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : '')
                    }

                    if(oddFirstPeriodWinner[i].marketType=='2'){
                        buttonFirstPeriodWinner2 = [];
                        buttonFirstPeriodWinner2.push(!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : '')
                    }
                } 

                }
                
                
                let oddFirstPeriodWinnerHA = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Winner Home/Away')): null;
                let buttonFirstPeriodWinnerHAHome = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonFirstPeriodWinnerHAAway = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>);
                if(!empty(oddFirstPeriodWinnerHA)){

                for(let i=0; i < oddFirstPeriodWinnerHA.length; i++){
                    if(oddFirstPeriodWinnerHA[i].marketType=='1'){
                        buttonFirstPeriodWinnerHAHome = []; 
                        buttonFirstPeriodWinnerHAHome.push(!empty(oddFirstPeriodWinnerHA) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'1st Period Winner Home/Away',oddFirstPeriodWinnerHA[i].marketType,'firstperiodwinnerha');  } }> {showOdds == 'D' ? oddFirstPeriodWinnerHA[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinnerHA[i].odd)} </Button> : '')
                    }
                    if(oddFirstPeriodWinnerHA[i].marketType=='2'){
                        buttonFirstPeriodWinnerHAAway = []; 
                        buttonFirstPeriodWinnerHAAway.push(!empty(oddFirstPeriodWinnerHA) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'1st Period Winner Home/Away',oddFirstPeriodWinnerHA[i].marketType,'firstperiodwinnerha');  } }>{showOdds == 'D' ? oddFirstPeriodWinnerHA[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinnerHA[i].odd)} </Button> : '')
                    }
                }

                }

                let oddHandicapOverHandicapUnder = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='handicapOver/handicapUnder')): null;
  
                let button1HandicapOverHandicapUnder = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let button2HandicapOverHandicapUnder = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddHandicapOverHandicapUnder)){

                    for(let i=0; i < oddHandicapOverHandicapUnder.length; i++){
                        let factorExtra = !empty(oddHandicapOverHandicapUnder[i].factorExtra) ? oddHandicapOverHandicapUnder[i].factorExtra.split(' ') : [];
                        let factorExtraOriginal = !empty(oddHandicapOverHandicapUnder[i].factorExtra) ? oddHandicapOverHandicapUnder[i].factorExtra.split(' ') : [];
                        factorExtra[0] = !empty(factorExtra[0]) && !isNaN(factorExtra[0]) ? parseFloat(factorExtra[0]) < 0 ? factorExtra[0] : `+${factorExtra[0]}` : factorExtra[0];
                        if(oddHandicapOverHandicapUnder[i].marketType=='1'){
                            button1HandicapOverHandicapUnder = []; 
                            button1HandicapOverHandicapUnder.push(!empty(oddHandicapOverHandicapUnder) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[k],'handicapOver/handicapUnder',oddHandicapOverHandicapUnder[i].marketType,factorExtraOriginal[0],"asianhandicap"); } }><span className="sport-factor">({!empty(oddHandicapOverHandicapUnder[i]) ? factorExtra[0] : ''})</span> <span className="sport-odd">{showOdds == 'D' ? oddHandicapOverHandicapUnder[i].odd : this.props.convertOddToAmerican(oddHandicapOverHandicapUnder[i].odd)}</span></Button> : '')
                        }
                        if(oddHandicapOverHandicapUnder[i].marketType=='2'){
                            button2HandicapOverHandicapUnder = []; 
                            button2HandicapOverHandicapUnder.push(!empty(oddHandicapOverHandicapUnder) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[k],'handicapOver/handicapUnder',oddHandicapOverHandicapUnder[i].marketType,factorExtraOriginal[0],"asianhandicap"); } }><span className="sport-factor">({!empty(oddHandicapOverHandicapUnder[i]) ? factorExtra[0] : ''})</span> <span className="sport-odd">{showOdds == 'D' ? oddHandicapOverHandicapUnder[i].odd : this.props.convertOddToAmerican(oddHandicapOverHandicapUnder[i].odd)}</span></Button> : '')
                        }
                    }

                }

                let oddHandicapOvertimeOverHandicapOvertimeUnder = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='handicapOvertimeOver/handicapOvertimeUnder')): null;
  

                let button1HandicapOvertimeOverHandicapOvertimeUnder = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let button2HandicapOvertimeOverHandicapOvertimeUnder = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddHandicapOvertimeOverHandicapOvertimeUnder)){
                    for(let i=0; i < oddHandicapOvertimeOverHandicapOvertimeUnder.length; i++){
                        let factorExtra = !empty(oddHandicapOvertimeOverHandicapOvertimeUnder[i].factorExtra) ? oddHandicapOvertimeOverHandicapOvertimeUnder[i].factorExtra.split(' ') : [];
                        let factorExtraOriginal = !empty(oddHandicapOvertimeOverHandicapOvertimeUnder[i].factorExtra) ? oddHandicapOvertimeOverHandicapOvertimeUnder[i].factorExtra.split(' ') : [];
                        factorExtra[0] = !empty(factorExtra[0]) && !isNaN(factorExtra[0]) ? parseFloat(factorExtra[0]) < 0 ? factorExtra[0] : `+${factorExtra[0]}` : factorExtra[0];
                        if(oddHandicapOvertimeOverHandicapOvertimeUnder[i].marketType=='1'){
                            button1HandicapOvertimeOverHandicapOvertimeUnder = []; 
                            button1HandicapOvertimeOverHandicapOvertimeUnder.push(!empty(oddHandicapOvertimeOverHandicapOvertimeUnder) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[k],'handicapOvertimeOver/handicapOvertimeUnder',oddHandicapOvertimeOverHandicapOvertimeUnder[i].marketType,factorExtraOriginal[0],"asianhandicapovertime"); } }>(<span className="sport-factor">{!empty(oddHandicapOvertimeOverHandicapOvertimeUnder[i]) ? factorExtra[0] : ''})</span> <span className="sport-odd">{showOdds == 'D' ? oddHandicapOvertimeOverHandicapOvertimeUnder[i].odd : this.props.convertOddToAmerican(oddHandicapOvertimeOverHandicapOvertimeUnder[i].odd)}</span></Button> : '')
                        }
                        if(oddHandicapOvertimeOverHandicapOvertimeUnder[i].marketType=='2'){
                            button2HandicapOvertimeOverHandicapOvertimeUnder = []; 
                            button2HandicapOvertimeOverHandicapOvertimeUnder.push(!empty(oddHandicapOvertimeOverHandicapOvertimeUnder) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[k],'handicapOvertimeOver/handicapOvertimeUnder',oddHandicapOvertimeOverHandicapOvertimeUnder[i].marketType,factorExtraOriginal[0],"asianhandicapovertime"); } }><span className="sport-factor">({!empty(oddHandicapOvertimeOverHandicapOvertimeUnder[i]) ? factorExtra[0] : ''})</span> <span className="sport-odd">{showOdds == 'D' ? oddHandicapOvertimeOverHandicapOvertimeUnder[i].odd : this.props.convertOddToAmerican(oddHandicapOvertimeOverHandicapOvertimeUnder[i].odd)}</span></Button> : '')
                        }
                    }

                }


                let oddUnderOverFirstPeriod = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='UnderOver 1st Period')): null;
                let buttonOverFirstPeriod = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonUnderFirstPeriod = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddUnderOverFirstPeriod)){
                    for(let i=0; i < oddUnderOverFirstPeriod.length; i++){
                        let x = i+1;  
                        if(oddUnderOverFirstPeriod[i].marketType=='Over'){
                            buttonOverFirstPeriod = [];
                            buttonOverFirstPeriod.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver 1st Period',oddUnderOverFirstPeriod[i].marketType,oddUnderOverFirstPeriod[i].factorExtra,"underoverfirstperiod" );  } }>
                            <span className="sport-factor">(+{!empty(oddUnderOverFirstPeriod[i]) ? oddUnderOverFirstPeriod[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverFirstPeriod[i].odd : this.props.convertOddToAmerican(oddUnderOverFirstPeriod[i].odd)}</span>
                            </Button>);
                        }
                        if(oddUnderOverFirstPeriod[i].marketType=='Under'){
                            buttonUnderFirstPeriod = [];
                            buttonUnderFirstPeriod.push(<td className={'text-center'}><Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver 1st Period',oddUnderOverFirstPeriod[i].marketType,oddUnderOverFirstPeriod[i].factorExtra,"underoverfirstperiod" );  } }>
                            <span className="sport-factor">(-{!empty(oddUnderOverFirstPeriod[i]) ? oddUnderOverFirstPeriod[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverFirstPeriod[i].odd : this.props.convertOddToAmerican(oddUnderOverFirstPeriod[i].odd)}</span>
                            </Button></td>);
                        }
            
                    }
                }

                let odd12HalfTime = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='12 Halftime')): null;
  
                let button12HalfTime1 = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let button12HalfTime2 = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(odd12HalfTime)){

                for(let i=0; i < odd12HalfTime.length; i++){
                    if(odd12HalfTime[i].marketType=='1'){
                        button12HalfTime1 = []; 
                        button12HalfTime1.push(!empty(odd12HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'12 Halftime',odd12HalfTime[i].marketType,"12halftime");  } }> {showOdds == 'D' ? odd12HalfTime[i].odd : this.props.convertOddToAmerican(odd12HalfTime[i].odd)} </Button> : '')
                    }
                    if(odd12HalfTime[i].marketType=='2'){
                        button12HalfTime2 = []; 
                        button12HalfTime2.push(!empty(odd12HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'12 Halftime',odd12HalfTime[i].marketType,"12halftime");  } }>{showOdds == 'D' ? odd12HalfTime[i].odd : this.props.convertOddToAmerican(odd12HalfTime[i].odd)}</Button> : '')
                    }
                }

                }

                let oddHandicapOverHandicapUnderFirstPeriod = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='asianHandicap1stPeriod/asianHandicap1stPeriod')): null;
  
                let button1HandicapOverHandicapUnderFirstPeriod = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let button2HandicapOverHandicapUnderFirstPeriod = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddHandicapOverHandicapUnderFirstPeriod)){

                    for(let i=0; i < oddHandicapOverHandicapUnderFirstPeriod.length; i++){
                        let factorExtra = !empty(oddHandicapOverHandicapUnderFirstPeriod[i].factorExtra) ? oddHandicapOverHandicapUnderFirstPeriod[i].factorExtra.split(' ') : [];
                        if(oddHandicapOverHandicapUnderFirstPeriod[i].marketType=='1'){
                            button1HandicapOverHandicapUnderFirstPeriod = []; 
                            button1HandicapOverHandicapUnderFirstPeriod.push(!empty(oddHandicapOverHandicapUnderFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[k],'asianHandicap1stPeriod/asianHandicap1stPeriod',oddHandicapOverHandicapUnderFirstPeriod[i].marketType,factorExtra[0],"asianhandicapfirstperiod"); } }><span className="sport-factor">{!empty(oddHandicapOverHandicapUnderFirstPeriod[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddHandicapOverHandicapUnderFirstPeriod[i].odd : this.props.convertOddToAmerican(oddHandicapOverHandicapUnderFirstPeriod[i].odd)}</span></Button> : '')
                        }
                        if(oddHandicapOverHandicapUnderFirstPeriod[i].marketType=='2'){
                            button2HandicapOverHandicapUnderFirstPeriod = []; 
                            button2HandicapOverHandicapUnderFirstPeriod.push(!empty(oddHandicapOverHandicapUnderFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[k],'asianHandicap1stPeriod/asianHandicap1stPeriod',oddHandicapOverHandicapUnderFirstPeriod[i].marketType,factorExtra[0],"asianhandicapfirstperiod"); } }><span className="sport-factor">{!empty(oddHandicapOverHandicapUnderFirstPeriod[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddHandicapOverHandicapUnderFirstPeriod[i].odd : this.props.convertOddToAmerican(oddHandicapOverHandicapUnderFirstPeriod[i].odd)}</span></Button> : '')
                        }
                    }

                }

                let oddFirst5InningsWinner = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st 5 Innings Winner - 12')): null;
        
                let buttonFirst5InningsWinner1 = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonFirst5InningsWinner2 = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddFirst5InningsWinner)){

                    for(let i=0; i < oddFirst5InningsWinner.length; i++){
                        if(oddFirst5InningsWinner[i].marketType=='1'){
                            buttonFirst5InningsWinner1 = [];
                            buttonFirst5InningsWinner1.push(!empty(oddFirst5InningsWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '1st 5 Innings Winner - 12',oddFirst5InningsWinner[i].marketType,'first5inningswinnerot');  } }> {showOdds == 'D' ? oddFirst5InningsWinner[i].odd : this.props.convertOddToAmerican(oddFirst5InningsWinner[i].odd)}</Button> : '')
                        }

                        if(oddFirst5InningsWinner[i].marketType=='2'){
                            buttonFirst5InningsWinner2 = [];
                            buttonFirst5InningsWinner2.push(!empty(oddFirst5InningsWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '1st 5 Innings Winner - 12',oddFirst5InningsWinner[i].marketType,'first5inningswinnerot');  } }> {showOdds == 'D' ? oddFirst5InningsWinner[i].odd : this.props.convertOddToAmerican(oddFirst5InningsWinner[i].odd)}</Button> : '')
                        }
                    } 

                }

                let oddUnderOver5Innings = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='UnderOver 5 Innings')): null;
                let buttonOver5Innings = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonUnder5Innings = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddUnderOver5Innings)){
                    for(let i=0; i < oddUnderOver5Innings.length; i++){
                        let x = i+1;  
                        if(oddUnderOver5Innings[i].marketType=='Over'){
                            buttonOver5Innings = [];
                            buttonOver5Innings.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver 5 Innings',oddUnderOver5Innings[i].marketType,oddUnderOver5Innings[i].factorExtra,"underoverfirst5innings" );  } }>
                            <span className="sport-factor">(+{!empty(oddUnderOver5Innings[i]) ? oddUnderOver5Innings[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOver5Innings[i].odd : this.props.convertOddToAmerican(oddUnderOver5Innings[i].odd)}</span>
                            </Button>);
                        }
                        if(oddUnderOver5Innings[i].marketType=='Under'){
                            buttonUnder5Innings = [];
                            buttonUnder5Innings.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver 5 Innings',oddUnderOver5Innings[i].marketType,oddUnderOver5Innings[i].factorExtra,"underoverfirst5innings" );  } }>
                            <span className="sport-factor">(-{!empty(oddUnderOver5Innings[i]) ? oddUnderOver5Innings[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOver5Innings[i].odd : this.props.convertOddToAmerican(oddUnderOver5Innings[i].odd)}</span>
                            </Button>);
                        }
            
                    }
                }

                let oddHandicapOverHalfTimeHandicapUnderHalfTime = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='handicapOverHalfTime/handicapUnderHalfTime')): null;
  
                let button1HandicapOverHalfTimeHandicapUnderHalfTime = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let button2HandicapOverHalfTimeHandicapUnderHalfTime = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddHandicapOverHalfTimeHandicapUnderHalfTime)){

                    for(let i=0; i < oddHandicapOverHalfTimeHandicapUnderHalfTime.length; i++){
                        let factorExtra = !empty(oddHandicapOverHalfTimeHandicapUnderHalfTime[i].factorExtra) ? oddHandicapOverHalfTimeHandicapUnderHalfTime[i].factorExtra.split(' ') : [];
                        if(oddHandicapOverHalfTimeHandicapUnderHalfTime[i].marketType=='1'){
                            button1HandicapOverHalfTimeHandicapUnderHalfTime = []; 
                            button1HandicapOverHalfTimeHandicapUnderHalfTime.push(!empty(oddHandicapOverHalfTimeHandicapUnderHalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[k],'handicapOverHalfTime/handicapUnderHalfTime',oddHandicapOverHalfTimeHandicapUnderHalfTime[i].marketType,factorExtra[0],"asianhandicaphalftime"); } }><span className="sport-factor">{!empty(oddHandicapOverHalfTimeHandicapUnderHalfTime[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddHandicapOverHalfTimeHandicapUnderHalfTime[i].odd : this.props.convertOddToAmerican(oddHandicapOverHalfTimeHandicapUnderHalfTime[i].odd)}</span></Button> : '')
                        }
                        if(oddHandicapOverHalfTimeHandicapUnderHalfTime[i].marketType=='2'){
                            button2HandicapOverHalfTimeHandicapUnderHalfTime = []; 
                            button2HandicapOverHalfTimeHandicapUnderHalfTime.push(!empty(oddHandicapOverHalfTimeHandicapUnderHalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtraAsian(events[k],'handicapOverHalfTime/handicapUnderHalfTime',oddHandicapOverHalfTimeHandicapUnderHalfTime[i].marketType,factorExtra[0],"asianhandicaphalftime"); } }><span className="sport-factor">{!empty(oddHandicapOverHalfTimeHandicapUnderHalfTime[i]) ? factorExtra[0] : ''}</span> <span className="sport-odd">{showOdds == 'D' ? oddHandicapOverHalfTimeHandicapUnderHalfTime[i].odd : this.props.convertOddToAmerican(oddHandicapOverHalfTimeHandicapUnderHalfTime[i].odd)}</span></Button> : '')
                        }
                    }

                }

                let oddUnderOverHalfTime = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='UnderOver Halftime')): null;
                let buttonOverHalfTime = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonUnderHalfTime = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddUnderOverHalfTime)){
                    for(let i=0; i < oddUnderOverHalfTime.length; i++){
                        let x = i+1;  
                        if(oddUnderOverHalfTime[i].marketType=='Over'){
                            buttonOverHalfTime = [];
                            buttonOverHalfTime.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver Halftime',oddUnderOverHalfTime[i].marketType,oddUnderOverHalfTime[i].factorExtra,"underoverhalftime" );  } }>
                            <span className="sport-factor">(+{!empty(oddUnderOverHalfTime[i]) ? oddUnderOverHalfTime[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverHalfTime[i].odd : this.props.convertOddToAmerican(oddUnderOverHalfTime[i].odd)}</span>
                            </Button>);
                        }
                        if(oddUnderOverHalfTime[i].marketType=='Under'){
                            buttonUnderHalfTime = [];
                            buttonUnderHalfTime.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver Halftime',oddUnderOverHalfTime[i].marketType,oddUnderOverHalfTime[i].factorExtra,"underoverhalftime" );  } }>
                            <span className="sport-factor">(-{!empty(oddUnderOverHalfTime[i]) ? oddUnderOverHalfTime[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverHalfTime[i].odd : this.props.convertOddToAmerican(oddUnderOverHalfTime[i].odd)}</span>
                            </Button>);
                        }
            
                    }
                }

                let oddUnderOverGames = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='UnderOver Games')): null;
                let buttonOverGames = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonUnderGames = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddUnderOverGames)){
                    for(let i=0; i < oddUnderOverGames.length; i++){
                        let x = i+1;  
                        if(oddUnderOverGames[i].marketType=='Over'){
                            buttonOverGames = [];
                            buttonOverGames.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver Games',oddUnderOverGames[i].marketType,oddUnderOverGames[i].factorExtra,"underovergames" );  } }>
                            <span className="sport-factor">(+{!empty(oddUnderOverGames[i]) ? oddUnderOverGames[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverGames[i].odd : this.props.convertOddToAmerican(oddUnderOverGames[i].odd)}</span>
                            </Button>);
                        }
                        if(oddUnderOverGames[i].marketType=='Under'){
                            buttonUnderGames = [];
                            buttonUnderGames.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver Games',oddUnderOverGames[i].marketType,oddUnderOverGames[i].factorExtra,"underovergames" );  } }>
                            <span className="sport-factor">(-{!empty(oddUnderOverGames[i]) ? oddUnderOverGames[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverGames[i].odd : this.props.convertOddToAmerican(oddUnderOverGames[i].odd)}</span>
                            </Button>);
                        }
            
                    }
                }

                let oddUnderOverSets = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='UnderOver Sets')): null;
                let buttonOverSets = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonUnderSets = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddUnderOverSets)){
                    for(let i=0; i < oddUnderOverSets.length; i++){
                        let x = i+1;  
                        if(oddUnderOverSets[i].marketType=='Over'){
                            buttonOverSets = [];
                            buttonOverSets.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver Sets',oddUnderOverSets[i].marketType,oddUnderOverSets[i].factorExtra,"underoversets" );  } }>
                            <span className="sport-factor">(+{!empty(oddUnderOverSets[i]) ? oddUnderOverSets[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverSets[i].odd : this.props.convertOddToAmerican(oddUnderOverSets[i].odd)}</span>
                            </Button>);
                        }
                        if(oddUnderOverSets[i].marketType=='Under'){
                            buttonUnderSets = [];
                            buttonUnderSets.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver Sets',oddUnderOverSets[i].marketType,oddUnderOverSets[i].factorExtra,"underoversets" );  } }>
                            <span className="sport-factor">(-{!empty(oddUnderOverSets[i]) ? oddUnderOverSets[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverSets[i].odd : this.props.convertOddToAmerican(oddUnderOverSets[i].odd)}</span>
                            </Button>);
                        }
            
                    }
                }

                let oddUnderOverRounds = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='UnderOver Rounds')): null;
                let buttonOverRounds = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonUnderRounds = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddUnderOverRounds)){
                    for(let i=0; i < oddUnderOverRounds.length; i++){
                        let x = i+1;  
                        if(oddUnderOverRounds[i].marketType=='Over'){
                            buttonOverRounds = [];
                            buttonOverRounds.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver Rounds',oddUnderOverRounds[i].marketType,oddUnderOverRounds[i].factorExtra,"underoverrounds" );  } }>
                            <span className="sport-factor">(+{!empty(oddUnderOverRounds[i]) ? oddUnderOverRounds[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverRounds[i].odd : this.props.convertOddToAmerican(oddUnderOverRounds[i].odd)}</span>
                            </Button>);
                        }
                        if(oddUnderOverRounds[i].marketType=='Under'){
                            buttonUnderRounds = [];
                            buttonUnderRounds.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventFactorExtra(events[k],'UnderOver Rounds',oddUnderOverRounds[i].marketType,oddUnderOverRounds[i].factorExtra,"underoverrounds" );  } }>
                            <span className="sport-factor">(-{!empty(oddUnderOverRounds[i]) ? oddUnderOverRounds[i].factorExtra : ''})</span>
                            <span className="sport-odd">{'  '}{showOdds == 'D' ? oddUnderOverRounds[i].odd : this.props.convertOddToAmerican(oddUnderOverRounds[i].odd)}</span>
                            </Button>);
                        }
            
                    }
                }

                let oddDrawNoBetOT = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='12 Including Overtime')): null;
                let buttonDrawNoBetOTHome = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                let buttonDrawNoBetOTAway = (<Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>); 
                if(!empty(oddDrawNoBetOT)){

                    for(let i=0; i < oddDrawNoBetOT.length; i++){
                        if(oddDrawNoBetOT[i].marketType=='1'){
                            buttonDrawNoBetOTHome = [];
                            buttonDrawNoBetOTHome.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'12 Including Overtime',oddDrawNoBetOT[i].marketType,'drawnobetot');  } }> {showOdds == 'D' ? oddDrawNoBetOT[i].odd : this.props.convertOddToAmerican(oddDrawNoBetOT[i].odd)} </Button>)
                        }
                        if(oddDrawNoBetOT[i].marketType=='2'){
                            buttonDrawNoBetOTAway = [];
                            buttonDrawNoBetOTAway.push(<Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'12 Including Overtime',oddDrawNoBetOT[i].marketType,'drawnobetot');  } }> {showOdds == 'D' ? oddDrawNoBetOT[i].odd : this.props.convertOddToAmerican(oddDrawNoBetOT[i].odd)} </Button>)
                        }
                    }

                }

                if(sportNameSelected == 'Basketball' && !empty(livescore) 
                && !empty(livescore.Scoreboard) 
                && !empty(livescore.Scoreboard.CurrentPeriod)){
                    let minutes = Math.floor(timeLive);
                    let seconds = !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Time) && !isNaN(livescore.Scoreboard.Time) ? livescore.Scoreboard.Time % 60 : 0;
                    if(timeLive==0){
                        timeLive='Descanso';
                    }else{
                        timeLive = `C${livescore.Scoreboard.CurrentPeriod} ${minutes}:${seconds}`; 
                    }
                    
                }
                
                if(sportNameSelected=='Soccer'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                    <td style={{width: '300px'}}>
                        <Table className='sport_event_table_odds'>
                            <tr className='sport-league'>
                                <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}{sportNameSelected == 'Soccer' ? '\' ' : ''}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                </td>
                                <td className='text-center'>{translateType('home')}</td>
                                <td className='text-center'>{translateType('under')}</td>
                                <td className='text-center'>{translateType('asianhandicap')}</td>
                                <td className='text-center'>{translateType('firstperiodwinner','Soccer','es')}</td>
                                <td className='text-center'>{translateType('underoverfirstperiod','Soccer','es')}</td>    
                                <td className='text-center'>{translateType('asianhandicapfirstperiod','Soccer','es')}</td>                                
                                <td className='text-center'>Más apuestas</td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>
                                    (1) {events[k].eventHome}</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                               
                                {/* 2 */}
                                <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>

                                {/* 3*/}
                                <td>{button1HandicapOverHandicapUnder}</td>

                                {/* 4*/}
                                <td>{buttonFirstPeriodWinner1}</td>

                                {/* 5*/}
                                <td>{buttonOverFirstPeriod}</td>

                                {/* 6*/}
                                <td>{button1HandicapOverHandicapUnderFirstPeriod}</td>

                                {/* 7*/}
                                <td rowSpan={'3'}>
                                    {(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }
                                </td>

                            </tr>
                            <tr>
                                <td>(X) Empate</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddDraw[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDraw(events[k]) } }>{showOdds == 'D' ? oddDraw[0].odd : this.props.convertOddToAmerican(oddDraw[0].odd)}</Button>: sportNameSelected!='Baseball' && sportNameSelected!='Basketball'  ? <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button> : ''}</td>
                               
                                {/* 2 */}
                                <td></td>

                                {/* 3*/}
                                <td></td>

                                {/* 4*/}
                                <td>{buttonFirstPeriodWinnerX}</td>

                                {/* 5*/}

                                <td></td>

                                {/* 6*/}
                                <td></td>

                                {/* 7*/}
                                <td></td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                
                                {/* 2 */}
                                <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>

                                {/* 3*/}
                                <td>{button2HandicapOverHandicapUnder}</td>

                                {/* 4*/}
                                <td>{buttonFirstPeriodWinner2}</td>

                                {/* 5*/}
                                <td>{buttonUnderFirstPeriod}</td>

                                {/* 6*/}
                                <td>{button2HandicapOverHandicapUnderFirstPeriod}</td>

                                {/* 7*/}
                                <td></td>
                            </tr>
                        </Table>
                    </td>
                   
                    </tr>);
                }else if(sportNameSelected=='Baseball'){
                    let pitchers='';
                    let arrPitchers='';
                    let pitcherHome = '';
                    let pitcherAway = '';
                    if(!empty(events[k].extraData)
                    && (!empty(events[k].extraData.data))
                    && (!empty(events[k].extraData.data[0]))
                    && events[k].extraData.data[0].Name=='Pitchers'
                    ){
                        pitchers = events[k].extraData.data[0].Value;
                        arrPitchers = !empty(pitchers) ? pitchers.split(','): []; 
                        if(!empty(arrPitchers) && arrPitchers.length==2){
                            pitcherHome = arrPitchers[0];
                            pitcherAway = arrPitchers[1];
                        }
                    }

                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td style={{width: '300px'}}>
                            <Table className='sport_event_table_odds'>
                                <tr className='sport-league'>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive} Inning </span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                    </td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center hide-sm'>{translateType('under')}</td>
                                    <td className='text-center'>{translateType('asianhandicapovertime',sportNameSelected)}</td>
                                    <td className='text-center'>{translateType('first5inningswinner')}</td>
                                    <td className='text-center'>{translateType('underoverfirst5innings')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}
                                    {!empty(pitcherAway)? <><br />{pitcherAway}</>: null}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 3 RunLine */}
                                    <td>{button2HandicapOvertimeOverHandicapOvertimeUnder}</td>
                                    {/* 4 first5inningswinner */}
                                    <td>{buttonFirst5InningsWinner2}</td>
                                    {/* 5 underoverfirst5innings */}
                                    <td>{buttonUnder5Innings}</td>
                                    <td rowSpan={'3'}>
                                    {(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}
                                    {!empty(pitcherHome)? <><br />{pitcherHome}</>: null}</td>
                                    {/* 1 A Ganar*/}
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 2 Over/Under*/}
                                    <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 3 RunLine */}
                                    <td>{button1HandicapOvertimeOverHandicapOvertimeUnder}</td>
                                    {/* 4 first5inningswinner */}
                                    <td>{buttonFirst5InningsWinner1}</td>
                                    {/* 5 underoverfirst5innings */}
                                    <td>{buttonOver5Innings}</td>
                                </tr>
                            </Table>
                    </td>
                    </tr>);
                }else if(sportNameSelected=='Basketball'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                    <td style={{width: '300px'}}>
                            <Table className='sport_event_table_odds'>
                                <tr className='sport-league'>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                    </td>
                                    <td className='text-center'>{translateType('asianhandicap')}</td>
                                    <td className='text-center'>{translateType('under')}</td>
                                    <td className='text-center'>A Ganar con extratiempo</td>
                                    <td className='text-center'>{translateType('asianhandicaphalftime')}</td>
                                    <td className='text-center'>{translateType('underoverhalftime')}</td>
                                    <td className='text-center'>{translateType('12halftime')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    {/* 1 RunLine */}
                                    <td>{button1HandicapOvertimeOverHandicapOvertimeUnder}</td>
                                    {/* 2 Over/Under */}
                                    <td> {!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 3 A Ganar Con Extratiempo */}
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 4 RunLine Halftime */}
                                    <td>{button1HandicapOverHalfTimeHandicapUnderHalfTime}</td>
                                    {/* 5 Over/Under Halftime*/}
                                    <td>{buttonOverHalfTime}</td>
                                    {/* 6 12 Halftime*/}
                                    <td>{button12HalfTime1}</td>
                                    <td rowSpan={'2'}>
                                    {(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    {/* 1 RunLine */}
                                    <td>{button2HandicapOvertimeOverHandicapOvertimeUnder}</td>
                                    {/* 2 Over/Under */}
                                    <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 3 A Ganar Con Extratiempo */}
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 4 RunLine Halftime */}
                                    <td>{button2HandicapOverHalfTimeHandicapUnderHalfTime}</td>
                                    {/* 5 Over/Under Halftime*/}
                                    <td>{buttonUnderHalfTime}</td>
                                    {/* 6 12 Halftime*/}
                                    <td>{button12HalfTime2}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>); 
                }else if(sportNameSelected=='American Football'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                    <td style={{width: '300px'}}>
                            <Table className='sport_event_table_odds'>
                                <tr className='sport-league'>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                    </td>
                                    <td className='text-center'>{translateType('asianhandicap')}</td>
                                    <td className='text-center'>{translateType('under')}</td>
                                    <td className='text-center'>A Ganar con extratiempo</td>
                                    <td className='text-center'>{translateType('asianhandicaphalftime')}</td>
                                    <td className='text-center'>{translateType('underoverhalftime')}</td>
                                    <td className='text-center'>{translateType('12halftime')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    {/* 1 RunLine */}
                                    <td>{button1HandicapOvertimeOverHandicapOvertimeUnder}</td>
                                    {/* 2 Over/Under */}
                                    <td> {!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 3 A Ganar Con Extratiempo */}
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 4 RunLine Halftime */}
                                    <td>{button1HandicapOverHalfTimeHandicapUnderHalfTime}</td>
                                    {/* 5 Over/Under Halftime*/}
                                    <td>{buttonOverHalfTime}</td>
                                    {/* 6 12 Halftime*/}
                                    <td>{button12HalfTime1}</td>
                                    <td rowSpan={'2'}>
                                    {(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    {/* 1 RunLine */}
                                    <td>{button2HandicapOvertimeOverHandicapOvertimeUnder}</td>
                                    {/* 2 Over/Under */}
                                    <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 3 A Ganar Con Extratiempo */}
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    {/* 4 RunLine Halftime */}
                                    <td>{button2HandicapOverHalfTimeHandicapUnderHalfTime}</td>
                                    {/* 5 Over/Under Halftime*/}
                                    <td>{buttonUnderHalfTime}</td>
                                    {/* 6 12 Halftime*/}
                                    <td>{button12HalfTime2}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>); 
                }else if(sportNameSelected=='Tennis'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td>
                            <Table>
                                <tr className='sport-league'>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}{sportNameSelected == 'Soccer' ? '\' ' : ''}{sportNameSelected == 'Baseball' ? ' Inning' : ''}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                    </td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center hide-sm'>{translateType('underovergames')}</td>
                                    <td className='text-center hide-sm'>{translateType('underoversets')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonOverGames}</td>
                                    <td>{buttonOverSets}</td>
                                    <td rowSpan={'2'}>{(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonUnderGames}</td>
                                    <td>{buttonUnderSets}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='Boxing'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td>
                            <Table>
                                <tr className='sport-league'>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}{sportNameSelected == 'Soccer' ? '\' ' : ''}{sportNameSelected == 'Baseball' ? ' Inning' : ''}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                    </td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center'>{translateType('underoverrounds')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonOverRounds}</td>
                                    <td rowSpan={'2'}>{(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonUnderRounds}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='MMA'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td>
                            <Table>
                                <tr className='sport-league'>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}{sportNameSelected == 'Soccer' ? '\' ' : ''}{sportNameSelected == 'Baseball' ? ' Inning' : ''}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                    </td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center'>{translateType('underoverrounds')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonOverRounds}</td>
                                    <td rowSpan={'2'}>{(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonUnderRounds}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='Ice-hockey'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                    <td style={{width: '300px'}}>
                        <Table className='sport_event_table_odds'>
                            <tr className='sport-league'>
                                <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}{sportNameSelected == 'Soccer' ? '\' ' : ''}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                </td>
                                <td className='text-center'>{translateType('home')}</td>
                                <td className='text-center'>{translateType('under')}</td>
                                <td className='text-center'>{translateType('asianhandicap')}</td>
                                <td className='text-center'>{translateType('drawnobetot')}</td>
                                <td className='text-center'>Más apuestas</td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>
                                    (1) {events[k].eventHome}</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                               
                                {/* 2 */}
                                <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>

                                {/* 3*/}
                                <td>{button1HandicapOverHandicapUnder}</td>

                                {/* 4*/}
                                <td>{buttonDrawNoBetOTHome}</td>

                                {/* 5*/}
                                <td rowSpan={'3'}>
                                    {(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }
                                </td>

                            </tr>
                            <tr>
                                <td>(X) Empate</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddDraw[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDraw(events[k]) } }>{showOdds == 'D' ? oddDraw[0].odd : this.props.convertOddToAmerican(oddDraw[0].odd)}</Button>: sportNameSelected!='Baseball' && sportNameSelected!='Basketball'  ? <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button> : ''}</td>
                               
                                {/* 2 */}
                                <td></td>

                                {/* 3*/}
                                <td></td>

                                {/* 4*/}
                                <td></td>
                                                                
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                
                                {/* 2 */}
                                <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>

                                {/* 3*/}
                                <td>{button2HandicapOverHandicapUnder}</td>

                                {/* 4*/}
                                <td>{buttonDrawNoBetOTAway}</td>

                            </tr>
                        </Table>
                    </td>
                   
                    </tr>);
                }else if(sportNameSelected=='Volleyball'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                    <td>
                        <Table>
                            <tr className='sport-league'>
                                <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}{sportNameSelected == 'Soccer' ? '\' ' : ''}{sportNameSelected == 'Baseball' ? ' Inning' : ''}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                </td>
                                <td className='text-center'>A Ganar</td>
                                <td className='text-center hide-sm'>{translateType('under')}</td>
                                <td className='text-center hide-sm'>{translateType('underoversets')}</td>
                                <td className='text-center hide-sm'>{translateType('firstperiodwinnerha',sportNameSelected)}</td>
                                <td className='text-center'>Más apuestas</td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{buttonOverSets}</td>
                                <td>{buttonFirstPeriodWinnerHAHome}</td>
                                <td rowSpan={'3'}>{(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }</td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(1) {events[k].eventAway}</td>
                                <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{buttonUnderSets}</td>
                                <td>{buttonFirstPeriodWinnerHAAway}</td>
                            </tr>
                        </Table>
                    </td>
                </tr>);
                }else if(sportNameSelected=='Table Tennis'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td>
                            <Table>
                                <tr className='sport-league'>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }
                                    {!empty(events[k].inPlay) && !empty(events[k].status) && events[k].inPlay && events[k].status==4 ?  <><br /><Badge variant='success'>En vivo</Badge> </> : ''}
                                    {!empty(events[k].inPlay) && events[k].inPlay && !empty(livescore) && !empty(events[k].status) && events[k].status==4  ? 
                                    <>
                                    <span className='sport-current-period'>{' '}{timeLive}{sportNameSelected == 'Soccer' ? '\' ' : ''}{sportNameSelected == 'Baseball' ? ' Inning' : ''}</span>
                                    <span className='sport-result'>{' '}Resultado:{' '} 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[0]) && livescore.Scoreboard.Results[0].Position == '1' ? livescore.Scoreboard.Results[0].Value : ''} 
                                    - 
                                    { !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Results[1]) && livescore.Scoreboard.Results[1].Position =='2' ? livescore.Scoreboard.Results[1].Value : ''}</span> 
                                
                                    </>
                                    : '' }
                                    </td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center hide-sm'>{translateType('underoversets')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonOverSets}</td>
                                    <td rowSpan={'2'}>{(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonUnderSets}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }

                
               
            }

            
        }

        filters = {
            leagues : filterLeagues,
            events : filterEvents
        }

        return (
                <div className="table-responsive">
                    {(!empty(trEvents) ? 
                            <>
                            {this.loadFiltersSports(filters)}
                            {this.showRulesBySport()}
                            <Row className={'sport-row-factor-type'}>
                                <Col xl={12} className={'sport-col-factor-type'}>
                                   <Button variant="primary" size="sm" onClick={() => { this.props.changeOdds('D') } }>Decimal</Button> {' '}
                                   <Button variant="primary" size="sm" onClick={() => { this.props.changeOdds('A') } }>Americano</Button>
                                </Col>
                            </Row>
                            <Table hover className="table table-sm sport" responsive>
                                <tbody>
                                    {!this.props.loading ? trEvents : <>
                                        <Skeleton height={40} />
                                        <br/>
                                        <Skeleton count={15} height={60} />
                                    </>}    
                                </tbody>
                            </Table>
                            </>
                            : <>
                           {this.loadFiltersSports(filters)}
                            <Table hover className="table table-sm sport">
                                <tbody>
                                    <tr>
                                        <td>
                                            <p className="text-center mt-10">
                                                {
                                                this.props.loading ?  'Cargando Información...' :  
                                                
                                                (filterDateState == 'inplay') ? 'No existen eventos disponibles En Vivo, prueba la opción de Próximos días o de Todos.' : (filterDateState == 'today') ? 'No existen eventos disponibles para hoy, prueba la opción de Próximos días o de Todos.' : (filterDateState == 'next') ? 'No existen próximos eventos disponibles, prueba la opción de Todos.' : (filterDateState == 'all') ? 'No existen eventos disponibles.' : ''
                                                
                                                }
                                                
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            </>
                        
                    )}
               </div>
        );
    }
    
}

const mapToProps = ({ events }) => ({
    events,
 });
 const connectedEventsTable2 = connect(mapToProps, actions)(EventsTable2);
 export { connectedEventsTable2 as EventsTable2 }; 