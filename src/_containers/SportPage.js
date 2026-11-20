import React from 'react';
import { connect } from "redux-zero/react";
import {EventsTable2} from '../_components/SportsForm/EventsTable2';

import empty from 'is-empty';
import actions from '../_actions';
import { Alert} from 'react-bootstrap';

let intervalSports;

class SportPage extends React.Component {

    constructor(props) {
        
        super(props);
        this.state = {
            activeKey           : '',
            ticketValue         : 0,
            ticketCombinations  : 0,
            valueUnits          : !empty(this.props.ticketoffice) ? this.props.ticketoffice[0].valueUnits: null,
            channel             : 0,
            specialKey          : null,
            sportNameSelected   : this.props.sportNameSelected,
            sellform : {
                events  : [],
                riskMultiple:0,
                totalToPayMultiple : 0
            },
            eventModalShow : false,
            eventModalSelected : {}
        };

    }

    onClickSportName = (sportName) =>{
        if(this.state.sportNameSelected  == sportName){
            return true;
        }
        localStorage.removeItem('tabActiveKeySport');
        this.setState({
            sportNameSelected: sportName
        });
    }

    componentDidMount() {
        intervalSports = setTimeout(() => {
                this.props.SportsActions({action: 'getAllVSportsCountBySportnameOpen'});
        }, 30000)
    }

    componentWillUnmount(){
        if(!empty(intervalSports)){
            clearInterval(intervalSports);
        }
    }
 
    render() {
        const { eventModalShow, eventModalSelected} = this.state;
        let {valueUnits} = this.state;
        const {loading, events, sportVideoEventsBySportName, ticketoffice, sportVideoEvents, sportVideoEventsBySportNameAndDates, inPlay} = this.props;

        if(!empty(ticketoffice)){
            valueUnits = ticketoffice[0].valueUnits;
        }

        if(empty(events) || (empty(sportVideoEventsBySportName))){
            return null;
        }

        return (

                <div>
                    <EventsTable2
                    loading={loading}
                    dateBD={this.props.dateBD}
                    inPlay={this.props.inPlay}
                    sportVideoEventsBySportName = {this.props.sportVideoEventsBySportName}
                    sportVideoEventsBySportNameAndDates = {this.props.sportVideoEventsBySportNameAndDates}
                    sportVideoEventsBySportNameAndDatesLeagues={this.props.sportVideoEventsBySportNameAndDatesLeagues}
                    events = {this.props.events} 
                    totalEvents = {this.props.totalEvents} 
                    eventTvList={sportVideoEvents} 
                    eventModalSelected={eventModalSelected}
                    eventModalShow={eventModalShow}
                    onChangeEventModalShow={this.props.onChangeEventModalShow}
                    onChangeEventModalHide={this.props.onChangeEventModalHide}
                    handleTvEventChange={this.props.onChangeTvEvent}
                    sportNameSelected={this.props.sportNameSelected}
                    onClickSportName={this.props.onClickSportName}
                    onClickSetFilterLeague={this.props.onClickSetFilterLeague}
                    onClickSetFilterDateState={this.props.onClickSetFilterDateState}
                    filterDateState = {this.props.filterDateState}
                    filterLeague = {this.props.filterLeague}
                    onClickEventHome={this.props.onClickEventHome}
                    onClickEventAway={this.props.onClickEventAway}
                    onClickEventDraw={this.props.onClickEventDraw}
                    onClickEventOver={this.props.onClickEventOver}
                    onClickEventUnder={this.props.onClickEventUnder}
                    onClickEventFactorExtra={this.props.onClickEventFactorExtra}
                    onClickEventFactorExtraAsian={this.props.onClickEventFactorExtraAsian}
                    onClickEventMarketType={this.props.onClickEventMarketType}
                    onClickEventFactorExtraMarketTypeDetail={this.props.onClickEventFactorExtraMarketTypeDetail}
                    onClickEventIdDetail = {this.props.onClickEventIdDetail}
                    showOdds={this.props.showOdds}
                    changeOdds={this.props.changeOdds}
                    convertOddToAmerican={this.props.convertOddToAmerican}
                    />
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
    usersGamification,
    sportVideoEventsBySportNameAndDates,
    sportVideoEventsBySportNameAndDatesLeagues
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
    usersGamification,
    sportVideoEventsBySportNameAndDates,
    sportVideoEventsBySportNameAndDatesLeagues
});

const connectedSportPage = connect(mapToProps, actions)(SportPage);
export { connectedSportPage as SportPage };
 