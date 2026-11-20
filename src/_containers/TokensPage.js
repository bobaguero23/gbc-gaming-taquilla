import React from 'react';
import { connect } from "redux-zero/react";
import { withRouter } from 'react-router-dom'
import actions from '../_actions';
import empty from 'is-empty';

import ErrorBoundary from '../_components/ErrorBoundary';
import {NavHeaderNacional} from '../_components/NavHeaderNacional';

//List
import TokensList from '../_components/Tokens/List';
import TokensFilterDate from '../_components/Tokens/FormDateFilter';
import TokensView from '../_components/Tokens/View';
import TokensTicketsOfficeMovementsList from '../_components/Tokens/ListTicketOfficesMovements';

import {Tabs, Tab} from 'react-bootstrap';

import { history } from '../_helpers/history';

import PrintProvider, { Print, NoPrint } from 'react-easy-print';



class TokensPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false
        };
    }

    onLoadList = ({ params }) => {
        this.props.TokensActions({ action: 'getAll', params: {params} });
    }
    
    componentWillMount(){
        this.props.TokensActions({ action: 'clearTokens'});
    }

    handlerTabSelection(key){
        
        if(key == 'add') {
            history.push('/ticketoffices-rules/add')
        }
     
    }

    loadTokensList = () => {
        return this.props.location.pathname.match(/(\/tokens)$|(\/tokens\/page\/.+)$/)
    }

    loadTokensView = () => {
        return this.props.location.pathname.match(/(\/tokens\/details\/.+)$/)
    }

    loadTokensTicketOfficesMovementsList = () => {
        return this.props.location.pathname.match(/(\/tokens\/ticketsoffices-movements\/.+)$/)
    }
    
    render() {

        const {user} = this.props;
       
        return (
                    <PrintProvider>
                    <NoPrint>
                        <div id="wrapper">
                            <NavHeaderNacional />
                             <div id="page-wrapper-full">

                            <ErrorBoundary>

                                
                                {(this.loadTokensList()) ? 
                                <>
                                <Tabs defaultActiveKey="" id="noanim-tab-example">
                                    <Tab eventKey="filter" title="Filtros">
                                        <TokensFilterDate {...this.props} onLoadList={this.onLoadList} />
                                    </Tab>
                                   
                                </Tabs>
                                    
                                <TokensList {...this.props} onLoadList={this.onLoadList} />
                                </>
                                : ''}

                                {(this.loadTokensView()) ? <TokensView {...this.props}  /> : ''}

                                {(this.loadTokensTicketOfficesMovementsList()) ? <TokensTicketsOfficeMovementsList {...this.props}  /> : ''}
                            
                            </ErrorBoundary>
                            
                            </div>
                        </div>
                        </NoPrint>
                    </PrintProvider>
        );
    }
}

const mapToProps = ({ 
    user,
    loading,
    tokens,
    totalResults,
    LoadingActions, 
    AuthActions,
    tokendetail,
    ticketofficesmovements
}) => ({
    user,
    loading,
    tokens,
    totalResults,
    LoadingActions, 
    AuthActions,
    tokendetail,
    ticketofficesmovements

});

const connectedTokensPage = withRouter(connect(mapToProps, actions)(TokensPage));
export { connectedTokensPage as TokensPage }; 