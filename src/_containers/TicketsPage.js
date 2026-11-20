import React from 'react';
import { connect } from "redux-zero/react";
import { withRouter } from 'react-router-dom'
import actions from '../_actions';
import empty from 'is-empty';

import ErrorBoundary from '../_components/ErrorBoundary';
import {NavHeaderNacional} from '../_components/NavHeaderNacional';

//List
import TicketsListElInmejorableINH from '../_components/Tickets/ListElInmejorableINH';
import TicketsStallsList from '../_components/Tickets/ListStalls';
import TicketsSummaryWagerTypesINH from '../_components/Tickets/ListSummaryWagerTypesINH';
import TicketsSummaryList from '../_components/Tickets/ListSummary';
//Filters
import TicketsSummaryWagerTypesINHFormFilter from '../_components/Tickets/FormSummaryWagerTypesFilterINH';
import TicketsFormElInmejorableINHFilter from '../_components/Tickets/FormFilterElInmejorableINH';
import TicketsStallsFormFilter from '../_components/Tickets/FormFilterStalls';


import {Tabs, Tab} from 'react-bootstrap';

import {parseUrlParams} from '../_helpers/lib';


class TicketsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            filterKey: '',
            params: {},
        };
    }

    componentWillReceiveProps(newProps){

      let params = this.state.params;
      params.page = newProps.match.params.page

      
      if( newProps.match.params.page != this.props.match.params.page) {
          params = parseUrlParams(params,this.props.location.search);
          
      }

      
    }

    onLoadListTicketsElInmejorableFisicaINH = ({ params }) => {
      this.props.TicketsActions({ action: 'clearTickets'});
      params.type = "fisica";
      this.props.TicketsActions({ action: 'getAllTicketsElInmejorableINH', params: {params} });
    }

    
    onLoadListSubagentWagerTypeINH = ({ params }) => {
        this.props.TicketsActions({ action: 'clearTickets'});
        this.props.TicketsActions({ action: 'getTotalSalesByWagerTypesINH', params: {params} });
    }

    onLoadListStalls = ({ params }) => {
        this.props.TicketsActions({ action: 'clearTickets'});
        this.props.TicketsActions({ action: 'getAll', params: {params} });
    }

    

    onLoadListSummaryStalls = ({ params }) => {
        this.props.TicketsActions({ action: 'clearTickets'});
        this.props.TicketsActions({ action: 'getSummaryStalls', params: {params} });
    }

    loadTicketsElInmejorableFisicaList = () => {
        return this.props.location.pathname.match(/(\/tickets-inh$)|(\/tickets-inh\/page\/.+)$/)
    }

    loadTicketsSummaryWagerTypesINH = () => {
        return this.props.location.pathname.match(/(\/tickets-wager-types-inh)$|(\/tickets-wager-types-inh\/page\/.+)$/)
    }

    loadTicketsStallsList = () => {
        return this.props.location.pathname.match(/(\/tickets-stalls$)|(\/tickets-stalls\/page\/.+)$/)
    }

    loadTicketsSummaryStallsList = () => {
        return this.props.location.pathname.match(/(\/tickets-summary-stalls)$|(\/tickets-summary-stalls\/page\/.+)$/)
    }

    componentWillMount(){
        this.props.TicketsActions({ action: 'clearTickets'});
        const userProps = this.props.user;
        this.props.TicketOfficesActions({action: 'me', params: {params:userProps}});
    }

    toggleFilter = (k) =>{
        this.setState({
            filterKey: (empty(this.state.filterKey)) ? k : ''
        })
    }
    
    render() {

        let user = this.props.user;

        
        return (
                        
                        <div id="wrapper">
                            <NavHeaderNacional />
                             <div id="page-wrapper-full">

                            <ErrorBoundary>

                              {(this.loadTicketsElInmejorableFisicaList()) ? 
                                <>
                                  <Tabs defaultActiveKey="" activeKey={this.state.filterKey} onSelect={this.toggleFilter} id="noanim-tab-example">
                                      <Tab eventKey="filter" title="Filtros">
                                          <TicketsFormElInmejorableINHFilter {...this.props} onLoadList={this.onLoadListTicketsElInmejorableFisicaINH} type="fisica" />
                                      </Tab>
                                  </Tabs>
                                  
                                  <TicketsListElInmejorableINH {...this.props} onLoadList={this.onLoadListTicketsElInmejorableFisicaINH} />
                                </>
                               : ''}

                                
                                {(this.loadTicketsSummaryWagerTypesINH()) ? 
                                <>
                                <Tabs defaultActiveKey="" activeKey={this.state.filterKey} onSelect={this.toggleFilter} id="noanim-tab-example">
                                    <Tab eventKey="filter" title="Filtros">
                                        <TicketsSummaryWagerTypesINHFormFilter {...this.props} onLoadList={this.onLoadListSubagentWagerTypeINH} />
                                    </Tab>
                                </Tabs>
                                
                                <TicketsSummaryWagerTypesINH {...this.props} onLoadList={this.onLoadListSubagentWagerTypeINH} />
                                </>
                                : ''}

                                {(this.loadTicketsStallsList()) ? 
                                <>
                                  <Tabs defaultActiveKey="" activeKey={this.state.filterKey} onSelect={this.toggleFilter} id="noanim-tab-example">
                                      <Tab eventKey="filter" title="Filtros">
                                          <TicketsStallsFormFilter {...this.props} onLoadList={this.onLoadListStalls} />
                                      </Tab>
                                  </Tabs>
                                  
                                  <TicketsStallsList {...this.props} onLoadList={this.onLoadListStalls} />
                                </>
                               : ''}

                                {(this.loadTicketsSummaryStallsList()) ? 
                                <>
                                <Tabs defaultActiveKey="" activeKey={this.state.filterKey} onSelect={this.toggleFilter} id="noanim-tab-example">
                                    <Tab eventKey="filter" title="Filtros">
                                        <TicketsSummaryWagerTypesINHFormFilter {...this.props} onLoadList={this.onLoadListSummaryStalls} />
                                    </Tab>
                                </Tabs>
                                    
                                <TicketsSummaryList {...this.props} onLoadList={this.onLoadListSummaryStalls} />
                                </>
                                : ''}
    
                            </ErrorBoundary>
                            
                            </div>
                        </div>
        );
    }
}

const mapToProps = ({ 
    user,
    loading,
    tickets,
    ticket,
    ticketsINH,
    tickets_details,
    wagertypes,
    ticketstatus,
    totalResults,
    totalResultsTickets,
    LoadingActions, 
    AuthActions,
    tracks,
    races,
    ticketsWagerTypesINH,
    totalResultsINH,
    tracksInh
}) => ({
    user,
    loading,
    tickets,
    ticket,
    ticketsINH,
    tickets_details,
    wagertypes,
    ticketstatus,
    totalResults,
    totalResultsTickets,
    LoadingActions, 
    AuthActions,
    tracks,
    races,
    ticketsWagerTypesINH,
    totalResultsINH,
    tracksInh
});

const connectedTicketsPage = withRouter(connect(mapToProps, actions)(TicketsPage));
export { connectedTicketsPage as TicketsPage }; 