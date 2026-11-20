import React from 'react';
import empty from 'is-empty';
import { connect } from "redux-zero/react";
import actions from "../../_actions";
import {Alert,Button, Col, Table, Row, Badge, Tab} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {translateType} from '../../_helpers/libSport';

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
        name: 'baseball',
        sportName : 'Baseball',
        sportNameEs : 'Béisbol',
        icon: '/src/_images/baseball.svg'
    },
    {
        name: 'soccer',
        sportName : 'Soccer',
        sportNameEs : 'Fútbol',
        icon: '/src/_images/football.svg'
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

class EventsTable extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            filterSportState: this.props.sportNameSelected,
            filterSportStateChange: false, 
            filterLeagueState: '',
            filterEventNameState: '',
            filterDateState: 'today',
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
        
        events.map((event) => {
            if(empty(eventsBySports[event.sportName])){
                eventsBySports[event.sportName] = [];
            }
            eventsBySports[event.sportName].push(event);
        })

        for(let s of sportsTranslate){
            if(empty(filterEventsCountByDate[s.sportName])){
                filterEventsCountByDate[s.sportName] = [];
                filterEventsCountByDate[s.sportName]['all'] = 0;
                filterEventsCountByDate[s.sportName]['next'] = 0;
                filterEventsCountByDate[s.sportName]['today'] = 0;
                filterEventsCountByDate[s.sportName]['inplay'] = 0;
            }
        }

        Object.keys(eventsBySports).map((sportName) => {

                if(empty(filterEventsCountByDate[sportName])){
                    filterEventsCountByDate[sportName] = [];
                    filterEventsCountByDate[sportName]['all'] = 0;
                    filterEventsCountByDate[sportName]['next'] = 0;
                    filterEventsCountByDate[sportName]['today'] = 0;
                    filterEventsCountByDate[sportName]['inplay'] = 0;
                }
                
                // Games all
                filterEventsCountByDate[sportName]['all'] = eventsBySports[sportName].length;

                // Games next
                const eventsNext = eventsBySports[sportName].filter((event) => date.format(new Date(event.eventDate),"DD/MM/YYYY") != date.format(new Date(),"DD/MM/YYYY") )
                filterEventsCountByDate[sportName]['next'] = eventsNext.length;

                // Games today
                const eventsToday = eventsBySports[sportName].filter((event) => date.format(new Date(event.eventDate),"DD/MM/YYYY") == date.format(new Date(),"DD/MM/YYYY") )
                filterEventsCountByDate[sportName]['today'] = eventsToday.length;

                // Games InPlay
                const eventsInPlay = eventsBySports[sportName].filter((event) => event.status === 4 && event.inPlay === true )
                filterEventsCountByDate[sportName]['inplay'] = eventsInPlay.length;
        })

        if(willMount === true){
            let filterDateState = 'today';

            // today to next
            if(filterEventsCountByDate[this.props.sportNameSelected]['today'] == 0){
                filterDateState = 'next';
            }
    
            // all empty
            if(filterEventsCountByDate[this.props.sportNameSelected]['all'] == 0){
                filterDateState = 'all';
            }
    
            // today to next
            if(filterEventsCountByDate[this.props.sportNameSelected]['inplay'] > 0){
                filterDateState = 'inplay';
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
        this.setState({ 
            filterDateState
        });
    }

    loadFiltersSports = (filters) =>{
        let {filterSportState, filterLeagueState, filterEventsCountByDate} = this.state;
        let sports = [];
        let filterDateState = this.state.filterDateState;

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

        dateFilter.push(<li key={`filter-date-inplay`} className={(filterDateState == 'inplay') ? `active`: ''} onClick={() => {
            this.onClickSetFilterDateState('inplay')
        }}>
            <span className='sport-filter-text'>{`En Vivo (${filterEventsCountByDate[filterSportState]['inplay']})`}</span>
        </li>)

        dateFilter.push(<li key={`filter-date-today`} className={(filterDateState == 'today') ? `active`: ''} onClick={() => {
            this.onClickSetFilterDateState('today')
        }}>
            <span className='sport-filter-text'>{`Hoy (${filterEventsCountByDate[filterSportState]['today']})`}</span>
        </li>)
        dateFilter.push(<li key={`filter-date-next`} className={(filterDateState == 'next') ? `active`: ''} onClick={() => {
            this.onClickSetFilterDateState('next')
        }}>
            <span className='sport-filter-text'>{`Próximos días (${filterEventsCountByDate[filterSportState]['next']})`}</span>
        </li>)
        dateFilter.push(<li key={`filter-date-all`} className={(filterDateState == 'all') ? `active`: ''} onClick={() => {
            this.props.onClickSetFilterDateState('all')
        }}>
            <span className='sport-filter-text'>{`Todos (${filterEventsCountByDate[filterSportState]['all']})`}</span>
        </li>)

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
                leagues: ['International - FIFA World Cup 2022','England - Premier League', 'Spain - LaLiga', , 'Italy - Serie A', 'France - Ligue 1', 'Germany - Bundesliga']
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
        const filterDateState = this.state.filterDateState;
        let {showOdds, sportNameSelected} = this.props;

        let totalEvents = [];

        if(!empty(alltotalEvents)){
            alltotalEvents.map((e) => {
                totalEvents[e.node.id] = e.node.eventsOddsByEventId.totalCount;
            })
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
            const showOpenLeagues = 40;

            for(let k=0;k<events.length;k++){

                if(events[k].status==2 && events[k].inPlay==false){
                    return;
                }

                // Filter Logic

                if(!empty(filterDateState)){

                    if( filterDateState == 'today' && 
                        date.format(new Date(events[k].eventDate),"DD/MM/YYYY") != date.format(new Date(),"DD/MM/YYYY")){
                            continue;
                    }

                    if( filterDateState == 'next' && 
                        date.format(new Date(events[k].eventDate),"DD/MM/YYYY") == date.format(new Date(),"DD/MM/YYYY")){
                            continue;
                    }

                    if( filterDateState == 'inplay' && 
                        (events[k].status != 4)){
                            continue;
                    }
                }

                if(!empty(filterSportState)){

                    if(!empty(filterLeagueState)){

                        if(filterLeagueState != events[k].league){
                            continue;
                        }

                    }

                }

                let oddHome = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Home'));
                let oddDraw = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Draw'));
                let oddAway = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='Away'));
                let oddOver = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='over'));
                let oddUnder = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.oddDetails=='under'));
                let odd10MinuteResult = events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='10 Minute Result'));
                

                let button10MinuteResult1 = []; 
                let button10MinuteResultX = []; 
                let button10MinuteResult2 = []; 
                if(!empty(odd10MinuteResult)){

                for(let i=0; i < odd10MinuteResult.length; i++){
                    if(odd10MinuteResult[i].marketType=='1' && empty(button10MinuteResult1)){
                        button10MinuteResult1.push(!empty(odd10MinuteResult) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '10 Minute Result',odd10MinuteResult[i].marketType,'10minuteresult');  } }> {showOdds == 'D' ? odd10MinuteResult[i].odd : this.props.convertOddToAmerican(odd10MinuteResult[i].odd)} </Button> : '')
                    }
                    if(odd10MinuteResult[i].marketType=='X'  && empty(button10MinuteResultX)){
                        button10MinuteResultX.push(!empty(odd10MinuteResult) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '10 Minute Result',odd10MinuteResult[i].marketType,'10minuteresult');  } }> {showOdds == 'D' ? odd10MinuteResult[i].odd : this.props.convertOddToAmerican(odd10MinuteResult[i].odd)}</Button> : '')
                    }
                    if(odd10MinuteResult[i].marketType=='2' && empty(button10MinuteResult2)){
                        button10MinuteResult2.push(!empty(odd10MinuteResult) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '10 Minute Result',odd10MinuteResult[i].marketType,'10minuteresult');  } }> {showOdds == 'D' ? odd10MinuteResult[i].odd : this.props.convertOddToAmerican(odd10MinuteResult[i].odd)}</Button> : '')
                    }
                }

                }

                let oddFirstPeriodWinner = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Winner')): null;
        
                let buttonFirstPeriodWinner1 = []; 
                let buttonFirstPeriodWinnerX = []; 
                let buttonFirstPeriodWinner2 = []; 
                if(!empty(oddFirstPeriodWinner)){

                for(let i=0; i < oddFirstPeriodWinner.length; i++){
                    if(oddFirstPeriodWinner[i].marketType=='1' && empty(buttonFirstPeriodWinner1)){
                    buttonFirstPeriodWinner1.push(!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : '')
                    }
                    if(oddFirstPeriodWinner[i].marketType=='X'  && empty(buttonFirstPeriodWinnerX)){
                    buttonFirstPeriodWinnerX.push(!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : '')
                    }
                    if(oddFirstPeriodWinner[i].marketType=='2' && empty(buttonFirstPeriodWinner2)){
                    buttonFirstPeriodWinner2.push(!empty(oddFirstPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '1st Period Winner',oddFirstPeriodWinner[i].marketType,'firstperiodwinner');  } }> {showOdds == 'D' ? oddFirstPeriodWinner[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinner[i].odd)}</Button> : '')
                    }
                }

                }

                let oddSecondPeriodWinner = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='2nd Period Winner')): null;

                
                let buttonSecondPeriodWinner1 = []; 
                let buttonSecondPeriodWinnerX = []; 
                let buttonSecondPeriodWinner2 = []; 
                if(!empty(oddSecondPeriodWinner)){

                for(let i=0; i < oddSecondPeriodWinner.length; i++){
                    if(oddSecondPeriodWinner[i].marketType=='1' && empty(buttonSecondPeriodWinner1)){
                    buttonSecondPeriodWinner1.push(!empty(oddSecondPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '2nd Period Winner',oddSecondPeriodWinner[i].marketType,'secondperiodwinner');  } }> {showOdds == 'D' ? oddSecondPeriodWinner[i].odd : this.props.convertOddToAmerican(oddSecondPeriodWinner[i].odd)} </Button> : '')
                    }
                    if(oddSecondPeriodWinner[i].marketType=='X'  && empty(buttonSecondPeriodWinnerX)){
                    buttonSecondPeriodWinnerX.push(!empty(oddSecondPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '2nd Period Winner',oddSecondPeriodWinner[i].marketType,'secondperiodwinner');  } }> {showOdds == 'D' ? oddSecondPeriodWinner[i].odd : this.props.convertOddToAmerican(oddSecondPeriodWinner[i].odd)}</Button> : '')
                    }
                    if(oddSecondPeriodWinner[i].marketType=='2' && empty(buttonSecondPeriodWinner2)){
                    buttonSecondPeriodWinner2.push(!empty(oddSecondPeriodWinner) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k], '2nd Period Winner',oddSecondPeriodWinner[i].marketType,'secondperiodwinner');  } }> {showOdds == 'D' ? oddSecondPeriodWinner[i].odd : this.props.convertOddToAmerican(oddSecondPeriodWinner[i].odd)}</Button> : '')
                    }
                }

                }

                let oddBothTeamsToScore = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score')): null;
        
                let buttonBothTeamsToScoreYes = [];
                let buttonBothTeamsToScoreNo = [];

                if(!empty(oddBothTeamsToScore)){
                for(let i=0; i < oddBothTeamsToScore.length; i++){
                    if(oddBothTeamsToScore[i].marketType=='Yes' && empty(buttonBothTeamsToScoreYes)){
                    buttonBothTeamsToScoreYes.push(!empty(oddBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Both Teams To Score',oddBothTeamsToScore[i].marketType,'both');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddBothTeamsToScore[i].odd)}</Button> : '')
                    }
                    if(oddBothTeamsToScore[i].marketType=='No' && empty(buttonBothTeamsToScoreNo)){
                    buttonBothTeamsToScoreNo.push(!empty(oddBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Both Teams To Score',oddBothTeamsToScore[i].marketType,'both');  } }><span className="sport-factor">{!empty(oddBothTeamsToScore[i]) ? oddBothTeamsToScore[i].marketType : ''}</span> {showOdds == 'D' ? oddBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddBothTeamsToScore[i].odd)}</Button> : '')
                    }
                }
                }

                let oddFirstBothTeamsToScore = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score 1st Half')): null;
                
                let buttonFirstBothTeamsToScoreYes = [];
                let buttonFirstBothTeamsToScoreNo = [];

                if(!empty(oddFirstBothTeamsToScore)){
                for(let i=0; i < oddFirstBothTeamsToScore.length; i++){
                    if(oddFirstBothTeamsToScore[i].marketType=='Yes' && empty(buttonFirstBothTeamsToScoreYes)){
                    buttonFirstBothTeamsToScoreYes.push(!empty(oddFirstBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Both Teams To Score 1st Half',oddFirstBothTeamsToScore[i].marketType,'bothfirst');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddFirstBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddFirstBothTeamsToScore[i].odd)}</Button> : '')
                    }
                    if(oddFirstBothTeamsToScore[i].marketType=='No' && empty(buttonFirstBothTeamsToScoreNo)){
                    buttonFirstBothTeamsToScoreNo.push(!empty(oddFirstBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Both Teams To Score 1st Half',oddFirstBothTeamsToScore[i].marketType,'bothfirst');  } }><span className="sport-factor">{!empty(oddFirstBothTeamsToScore[i]) ? oddFirstBothTeamsToScore[i].marketType : ''}</span> {showOdds == 'D' ? oddFirstBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddFirstBothTeamsToScore[i].odd)}</Button> : '')
                    }
                }
                }

                let oddSecondBothTeamsToScore = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Both Teams To Score 2nd Half')): null;
                
                let buttonSecondBothTeamsToScoreYes = [];
                let buttonSecondBothTeamsToScoreNo = [];

                if(!empty(oddSecondBothTeamsToScore)){
                for(let i=0; i < oddSecondBothTeamsToScore.length; i++){
                    if(oddSecondBothTeamsToScore[i].marketType=='Yes' && empty(buttonSecondBothTeamsToScoreYes)){
                    buttonSecondBothTeamsToScoreYes.push(!empty(oddSecondBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Both Teams To Score 2nd Half',oddSecondBothTeamsToScore[i].marketType,'bothsecond');  } }><span className="sport-factor">Sí</span> {showOdds == 'D' ? oddSecondBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddSecondBothTeamsToScore[i].odd)}</Button> : '')
                    }
                    if(oddSecondBothTeamsToScore[i].marketType=='No' && empty(buttonSecondBothTeamsToScoreNo)){
                    buttonSecondBothTeamsToScoreNo.push(!empty(oddSecondBothTeamsToScore) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Both Teams To Score 2nd Half',oddSecondBothTeamsToScore[i].marketType,'bothsecond');  } }><span className="sport-factor">{!empty(oddSecondBothTeamsToScore[i]) ? oddSecondBothTeamsToScore[i].marketType : ''}</span> {showOdds == 'D' ? oddSecondBothTeamsToScore[i].odd : this.props.convertOddToAmerican(oddSecondBothTeamsToScore[i].odd)}</Button> : '')
                    }
                }
                }

                let oddRaceTo20Points = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Race To 20 Points')): null;
                let buttonRaceTo20PointsHome = []; 
                let buttonRaceTo20PointsAway = []; 
                if(!empty(oddRaceTo20Points)){

                for(let i=0; i < oddRaceTo20Points.length; i++){
                    if(oddRaceTo20Points[i].marketType=='1' && empty(buttonRaceTo20PointsHome)){
                    buttonRaceTo20PointsHome.push(!empty(oddRaceTo20Points) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Race To 20 Points',oddRaceTo20Points[i].marketType,'raceto20points');  } }> {showOdds == 'D' ? oddRaceTo20Points[i].odd : this.props.convertOddToAmerican(oddRaceTo20Points[i].odd)} </Button> : '')
                    }
                    if(oddRaceTo20Points[i].marketType=='2' && empty(buttonRaceTo20PointsAway)){
                    buttonRaceTo20PointsAway.push(!empty(oddRaceTo20Points) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Race To 20 Points',oddRaceTo20Points[i].marketType,'raceto20points');  } }>{showOdds == 'D' ? oddRaceTo20Points[i].odd : this.props.convertOddToAmerican(oddRaceTo20Points[i].odd)}</Button> : '')
                    }
                }

                }

                let oddFirstPeriodWinnerHA = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Winner Home/Away')): null;
                let buttonFirstPeriodWinnerHAHome = []; 
                let buttonFirstPeriodWinnerHAAway = []; 
                if(!empty(oddFirstPeriodWinnerHA)){

                for(let i=0; i < oddFirstPeriodWinnerHA.length; i++){
                    if(oddFirstPeriodWinnerHA[i].marketType=='1' && empty(buttonFirstPeriodWinnerHAHome)){
                    buttonFirstPeriodWinnerHAHome.push(!empty(oddFirstPeriodWinnerHA) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'1st Period Winner Home/Away',oddFirstPeriodWinnerHA[i].marketType,'firstperiodwinnerha');  } }> {showOdds == 'D' ? oddFirstPeriodWinnerHA[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinnerHA[i].odd)} </Button> : '')
                    }
                    if(oddFirstPeriodWinnerHA[i].marketType=='2' && empty(buttonFirstPeriodWinnerHAAway)){
                    buttonFirstPeriodWinnerHAAway.push(!empty(oddFirstPeriodWinnerHA) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'1st Period Winner Home/Away',oddFirstPeriodWinnerHA[i].marketType,'firstperiodwinnerha');  } }>{showOdds == 'D' ? oddFirstPeriodWinnerHA[i].odd : this.props.convertOddToAmerican(oddFirstPeriodWinnerHA[i].odd)} </Button> : '')
                    }
                }

                }

                let odd12HalfTime = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='12 Halftime')): null;
  
                let button12HalfTime1 = []; 
                let button12HalfTime2 = []; 
                if(!empty(odd12HalfTime)){

                for(let i=0; i < odd12HalfTime.length; i++){
                    if(odd12HalfTime[i].marketType=='1' && empty(button12HalfTime1)){
                    button12HalfTime1.push(!empty(odd12HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'12 Halftime',odd12HalfTime[i].marketType,"12halftime");  } }> {showOdds == 'D' ? odd12HalfTime[i].odd : this.props.convertOddToAmerican(odd12HalfTime[i].odd)} </Button> : '')
                    }
                    if(odd12HalfTime[i].marketType=='2'  && empty(button12HalfTime2)){
                    button12HalfTime2.push(!empty(odd12HalfTime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'12 Halftime',odd12HalfTime[i].marketType,"12halftime");  } }>{showOdds == 'D' ? odd12HalfTime[i].odd : this.props.convertOddToAmerican(odd12HalfTime[i].odd)}</Button> : '')
                    }
                }

                }

                let oddOddEvenIncludingOvertime = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Odd/Even Including Overtime')): null;
                let buttonoddOddEvenOTOdd = [];
                let buttonoddOddEvenOTEven = [];

                if(!empty(oddOddEvenIncludingOvertime)){
                for(let i=0; i < oddOddEvenIncludingOvertime.length; i++){
                    if(oddOddEvenIncludingOvertime[i].marketType=='Odd' && empty(buttonoddOddEvenOTOdd)){
                    buttonoddOddEvenOTOdd.push(!empty(oddOddEvenIncludingOvertime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Odd/Even Including Overtime',oddOddEvenIncludingOvertime[i].marketType,"oddevenot");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenIncludingOvertime[i].odd : this.props.convertOddToAmerican(oddOddEvenIncludingOvertime[i].odd)} </Button> : '')
                    }
                    if(oddOddEvenIncludingOvertime[i].marketType=='Even' && empty(buttonoddOddEvenOTEven)){
                    buttonoddOddEvenOTEven.push(!empty(oddOddEvenIncludingOvertime) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Odd/Even Including Overtime',oddOddEvenIncludingOvertime[i].marketType,"oddevenot");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenIncludingOvertime[i].odd : this.props.convertOddToAmerican(oddOddEvenIncludingOvertime[i].odd)}</Button> : '')
                    }
                }
                }

                let oddOddEven = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='Odd/Even')): null;
                let buttonoddOddEvenOdd = [];
                let buttonoddOddEvenEven = [];

                if(!empty(oddOddEven)){
                for(let i=0; i < oddOddEven.length; i++){
                    if(oddOddEven[i].marketType=='Odd' && empty(buttonoddOddEvenOdd)){
                    buttonoddOddEvenOdd.push(!empty(oddOddEven) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Odd/Even',oddOddEven[i].marketType,"oddeven");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEven[i].odd : this.props.convertOddToAmerican(oddOddEven[i].odd)}</Button> : '')
                    }
                    if(oddOddEven[i].marketType=='Even' && empty(buttonoddOddEvenEven)){
                    buttonoddOddEvenEven.push(!empty(oddOddEven) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'Odd/Even',oddOddEven[i].marketType,"oddeven");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEven[i].odd : this.props.convertOddToAmerican(oddOddEven[i].odd)}</Button> : '')
                    }
                }
                }

                let oddOddEvenFirstPeriod = !empty(events) ? events[k].eventsOddsByEventId.nodes.filter(eventsOdds => (eventsOdds.market=='1st Period Odd/Even')): null;
                let buttonoddOddEvenOddFirstPeriod = [];
                let buttonoddOddEvenEvenFirstPeriod = [];
        
                if(!empty(oddOddEvenFirstPeriod)){
                  for(let i=0; i < oddOddEvenFirstPeriod.length; i++){
                    if(oddOddEvenFirstPeriod[i].marketType=='Odd' && empty(buttonoddOddEvenOddFirstPeriod)){
                      buttonoddOddEvenOddFirstPeriod.push(!empty(oddOddEvenFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'1st Period Odd/Even',oddOddEvenFirstPeriod[i].marketType,"firstperiododdeven");  } }><span className="sport-factor">Impar</span> {showOdds == 'D' ? oddOddEvenFirstPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenFirstPeriod[i].odd)} </Button> : '')
                    }
                    if(oddOddEvenFirstPeriod[i].marketType=='Even' && empty(buttonoddOddEvenEvenFirstPeriod)){
                      buttonoddOddEvenEvenFirstPeriod.push(!empty(oddOddEvenFirstPeriod) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventMarketType(events[k],'1st Period Odd/Even',oddOddEvenFirstPeriod[i].marketType,"firstperiododdeven");  } }><span className="sport-factor">Par</span> {showOdds == 'D' ? oddOddEvenFirstPeriod[i].odd : this.props.convertOddToAmerican(oddOddEvenFirstPeriod[i].odd)}</Button> : '')
                    }
                  }
                }
                
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

                const detailParams = {
                    id : events[k].id
                }

                // check if has extra odds
                let findExtraOdds =  (!empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] > 4 : events[k].eventsOddsByEventId.nodes.length > 4);

                let livescore = !empty(events[k].livescore) ? events[k].livescore : '';

                let timeLive = !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.Time) && !isNaN(livescore.Scoreboard.Time)  ? parseInt(livescore.Scoreboard.Time) / 60 : ''; 

                if(timeLive<0){
                    timeLive = !empty(livescore.Scoreboard) && !empty(livescore.Scoreboard.CurrentPeriod) && !isNaN(livescore.Scoreboard.CurrentPeriod)  ? parseInt(livescore.Scoreboard.CurrentPeriod) : ''; 
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
                            <tr>
                                <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                <td className='text-center'>{translateType('home')}</td>
                                <td className='text-center'>{translateType('under')}</td>
                                <td className='text-center'>{translateType('10minuteresult')}</td>
                                <td className='text-center'>{translateType('firstperiodwinner')}</td>
                                <td className='text-center'>{translateType('secondperiodwinner')}</td>
                                <td className='text-center'>{translateType('both')}</td>
                                <td className='text-center'>{translateType('bothfirst')}</td>
                                <td className='text-center'>{translateType('bothsecond')}</td>
                                <td className='text-center'>Más apuestas</td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                               
                                {/* 2 */}
                                <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>

                                {/* 3*/}
                                <td>{button10MinuteResult1}</td>

                                {/* 4*/}
                                <td>{buttonFirstPeriodWinner1}</td>

                                {/* 5*/}
                                <td>{buttonSecondPeriodWinner1}</td>

                                {/* 6*/}
                                <td>{buttonBothTeamsToScoreYes}</td>

                                {/* 7*/}
                                <td>{buttonFirstBothTeamsToScoreYes}</td>

                                {/* 8*/}
                                <td>{buttonSecondBothTeamsToScoreYes}</td>

                                {/* 9*/}
                                <td rowSpan={'3'}>
                                    {(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }
                                </td>

                            </tr>
                            <tr>
                                <td>(X)</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddDraw[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDraw(events[k]) } }>{showOdds == 'D' ? oddDraw[0].odd : this.props.convertOddToAmerican(oddDraw[0].odd)}</Button>: sportNameSelected!='Baseball' && sportNameSelected!='Basketball'  ? <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button> : ''}</td>
                               
                                {/* 2 */}
                                <td></td>

                                {/* 3 */}
                                <td>{button10MinuteResultX}</td>

                                {/* 4*/}
                                <td>{buttonFirstPeriodWinnerX}</td>

                                {/* 5*/}
                                <td>{buttonSecondPeriodWinnerX}</td>

                                {/* 6*/}

                                <td></td>

                                {/* 7*/}
                                <td></td>

                                {/* 8*/}
                                <td></td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                
                                {/* 1 */}
                                <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                
                                {/* 2 */}
                                <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>

                                {/* 3 */}
                                <td>{button10MinuteResult2}</td>

                                {/* 4*/}
                                <td>{buttonFirstPeriodWinner2}</td>

                                {/* 5*/}
                                <td>{buttonSecondPeriodWinner2}</td>

                                {/* 6*/}
                                <td>{buttonBothTeamsToScoreNo}</td>

                                {/* 7*/}
                                <td>{buttonFirstBothTeamsToScoreNo}</td>

                                {/* 8*/}
                                <td>{buttonSecondBothTeamsToScoreNo}</td>
                            </tr>
                        </Table>
                    </td>
                   
                    </tr>);
                }else if(sportNameSelected=='Baseball'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td style={{width: '300px'}}>
                            <Table className='sport_event_table_odds'>
                                <tr>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center hide-sm'>{translateType('under')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td rowSpan={'3'}>
                                    {(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                </tr>
                            </Table>
                    </td>
                    </tr>);
                }else if(sportNameSelected=='Basketball'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                    <td style={{width: '300px'}}>
                            <Table className='sport_event_table_odds'>
                                <tr>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center hide-sm'>{translateType('under')}</td>
                                    <td className='text-center hide-sm'>{translateType('raceto20points')}</td>
                                    <td className='text-center hide-sm'>{translateType('firstperiodwinnerha')}</td>
                                    <td className='text-center hide-sm'>{translateType('12halftime')}</td>
                                    <td className='text-center hide-sm'>{translateType('oddevenot')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td> {!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonRaceTo20PointsHome}</td>
                                    <td>{buttonFirstPeriodWinnerHAHome}</td>
                                    <td>{button12HalfTime1}</td>
                                    <td>{buttonoddOddEvenOTOdd}</td>
                                    <td rowSpan={'3'}>
                                    {(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td> {!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonRaceTo20PointsAway}</td>
                                    <td>{buttonFirstPeriodWinnerHAAway}</td>
                                    <td>{button12HalfTime2}</td>
                                    <td>{buttonoddOddEvenOTEven}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='American Football'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td style={{width: '300px'}}>
                            <Table className='sport_event_table_odds'>
                                <tr>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center hide-sm'>{translateType('under')}</td>
                                    <td className='text-center hide-sm'>{translateType('firstperiodwinnerha')}</td>
                                    <td className='text-center hide-sm'>{translateType('1x2halftime')}</td>
                                    <td className='text-center hide-sm'>{translateType('oddevenot')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td> {!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonFirstPeriodWinnerHAHome}</td>
                                    <td>{button12HalfTime1}</td>
                                    <td>{buttonoddOddEvenOTOdd}</td>
                                    <td rowSpan={'3'}> 
                                        {(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonFirstPeriodWinnerHAAway}</td>
                                    <td>{button12HalfTime2}</td>
                                    <td>{buttonoddOddEvenOTEven}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='Tennis'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td>
                            <Table>
                                <tr>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center hide-sm'>{translateType('under')}</td>
                                    <td className='text-center hide-sm'>{translateType('firstperiodwinnerha',sportNameSelected)}</td>
                                    <td className='text-center hide-sm'>{translateType('oddeven')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonFirstPeriodWinnerHAHome}</td>
                                    <td>{buttonoddOddEvenOdd}</td>
                                    <td rowSpan={'3'}>{(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonFirstPeriodWinnerHAAway}</td>
                                    <td>{buttonoddOddEvenEven}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='Boxing'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td>
                            <Table>
                                <tr>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td rowSpan={'3'}>{(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='MMA'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td>
                            <Table>
                                <tr>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                    <td className='text-center'>A Ganar</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td rowSpan={'3'}>{(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='Ice-hockey'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                        <td>
                            <Table>
                                <tr>
                                    <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                    <td className='text-center'>{translateType('home')}</td>
                                    <td className='text-center hide-sm'>{translateType('under')}</td>
                                    <td className='text-center'>{translateType('firstperiodwinner')}</td>
                                    <td className='text-center hide-sm'>{translateType('oddevenot')}</td>
                                    <td className='text-center'>Más apuestas</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                    <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonFirstPeriodWinner1}</td>
                                    <td>{buttonoddOddEvenOTOdd}</td>
                                    <td rowSpan={'3'}>{(findExtraOdds) ? 
                                        <Button variant="primary" size="sm" onClick={() => { 
                                            this.props.onClickEventIdDetail(events[k].id);
                                        }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                        </Button> : null }</td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(X) Empate</td>
                                    <td> {!empty(oddDraw[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventDraw(events[k]) } }>{showOdds == 'D' ? oddDraw[0].odd : this.props.convertOddToAmerican(oddDraw[0].odd)}</Button>: sportNameSelected!='Baseball' && sportNameSelected!='Basketball'  ? <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button> : ''}</td>
                                    <td></td>
                                    <td>{buttonFirstPeriodWinnerX}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                    <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                    <td>{buttonFirstPeriodWinner2}</td>
                                    <td>{buttonoddOddEvenOTEven}</td>
                                </tr>
                            </Table>
                        </td>
                    </tr>);
                }else if(sportNameSelected=='Volleyball'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                    <td>
                        <Table>
                            <tr>
                                <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                <td className='text-center'>A Ganar</td>
                                <td className='text-center hide-sm'>{translateType('under')}</td>
                                <td className='text-center'>{translateType('firstperiodwinnerha',sportNameSelected)}</td>
                                <td className='text-center'>{translateType('firstperiododdeven',sportNameSelected)}</td>
                                <td className='text-center hide-sm'>{translateType('oddeven')}</td>
                                <td className='text-center'>Más apuestas</td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{buttonFirstPeriodWinnerHAHome}</td>
                                <td>{buttonoddOddEvenOddFirstPeriod}</td>
                                <td>{buttonoddOddEvenOdd}</td>
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
                                <td>{buttonFirstPeriodWinnerHAAway}</td>
                                <td>{buttonoddOddEvenEvenFirstPeriod}</td>
                                <td>{buttonoddOddEvenEven}</td>
                            </tr>
                        </Table>
                    </td>
                </tr>);
                }else if(sportNameSelected=='Table Tennis'){
                    trEvents.push(<tr key={Math.random()} className={(selectedLeagueToShow === events[k].league || countLeagues < showOpenLeagues) ? 'selected-league-show-events' : 'selected-league-hide-events'}>
                    <td>
                        <Table>
                            <tr>
                                <td>{date.format(new Date(events[k].eventDate),"DD/MM hh:mmA") }</td>
                                <td className='text-center'>A Ganar</td>
                                <td className='text-center hide-sm'>{translateType('under')}</td>
                                <td className='text-center hide-sm'>{translateType('firstperiodwinnerha',sportNameSelected)}</td>
                                <td className='text-center hide-sm'>{translateType('firstperiododdeven',sportNameSelected)}</td>
                                <td className='text-center hide-sm'>{translateType('oddeven')}</td>
                                <td className='text-center'>Más apuestas</td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(1) {events[k].eventHome}</td>
                                <td>{!empty(oddHome[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventHome(events[k]) } }>{showOdds == 'D' ? oddHome[0].odd : this.props.convertOddToAmerican(oddHome[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{!empty(oddOver[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventOver(events[k]) } }><span className="sport-factor">(+{!empty(oddOver[0]) ? oddOver[0].factor : ''})</span> {showOdds == 'D' ? oddOver[0].odd : this.props.convertOddToAmerican(oddOver[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{buttonFirstPeriodWinnerHAHome}</td>
                                <td>{buttonoddOddEvenOddFirstPeriod}</td>
                                <td>{buttonoddOddEvenOdd}</td>
                                <td rowSpan={'3'}>{(findExtraOdds) ? 
                                    <Button variant="primary" size="sm" onClick={() => { 
                                        this.props.onClickEventIdDetail(events[k].id);
                                    }}> +{!empty(events[k].id) && !empty(totalEvents[events[k].id]) ? totalEvents[events[k].id] : events[k].eventsOddsByEventId.nodes.length }
                                    </Button> : null }</td>
                            </tr>
                            <tr>
                                <td style={{width: '250px'}}>(2) {events[k].eventAway}</td>
                                <td>{!empty(oddAway[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventAway(events[k]) } }>{showOdds == 'D' ? oddAway[0].odd : this.props.convertOddToAmerican(oddAway[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{!empty(oddUnder[0]) ? <Button variant="primary" size="sm" onClick={() => { this.props.onClickEventUnder(events[k]) } }><span className="sport-factor">(-{!empty(oddUnder[0]) ? oddUnder[0].factor : ''})</span> {showOdds == 'D' ? oddUnder[0].odd : this.props.convertOddToAmerican(oddUnder[0].odd)}</Button> : <Button variant="primary" size="sm"><FontAwesomeIcon icon="lock" /></Button>}</td>
                                <td>{buttonFirstPeriodWinnerHAAway}</td>
                                <td>{buttonoddOddEvenEvenFirstPeriod}</td>
                                <td>{buttonoddOddEvenEven}</td>
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
                                    {trEvents}    
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
 const connectedEventsTable = connect(mapToProps, actions)(EventsTable);
 export { connectedEventsTable as EventsTable };