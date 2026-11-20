import LoadingActions from './LoadingActions';
import TicketsService  from '../_services/TicketsService';
import { history } from '../_helpers/history';
import empty from 'is-empty';
import ErrorActions from './ErrorActions'

class TicketsActions {

    static handler(store, params){
        return new TicketsActions[params.action](store, params.params);
    }

    static clearTickets(store){
        store.setState({
            tickets: {}
        })
    }

    static getMyTicketsInterval = async (store, {redirectEmptyList, params} = {redirectEmptyList, params}) => {

        let responseService = {};
        let tickets = {};
        let balance = store.getState().balance;
  
        store.setState({
            loading : LoadingActions.show(store),
            balance
        })
  
        try { 
  
            responseService = await TicketsService.getMyTickets({params});
            tickets = responseService.nodes;
            let responseBalance = await TicketsService.getBalance({ params: {} });
            balance = responseBalance.nodes;

  
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }
  
        store.setState({
            tickets,
            loading : LoadingActions.hide(store),
            balance,
        })
        
    }

    static getMyHeaderCocksTicketsInterval = async (store, {redirectEmptyList, params} = {redirectEmptyList, params}) => {

        let responseService = {};
        let ticketsCocks = {};
        let balance = store.getState().balance;
  
        store.setState({
            loading : LoadingActions.show(store),
            balance
        })
  
        try { 
  
            responseService = await TicketsService.getMyHeaderTicketsCocks({params});
            ticketsCocks = responseService.nodes;
            let responseBalance = await TicketsService.getBalance({ params: {} });
            balance = responseBalance.nodes;

  
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }
  
        store.setState({
            ticketsCocks,
            loading : LoadingActions.hide(store),
            balance,
        })
        
    }

    static getMyTicketsSportsInterval = async (store, {redirectEmptyList, params} = {redirectEmptyList, params}) => {

        let responseService = {};
        let ticketssports = {};
        let balance = store.getState().balance;
  
        store.setState({
            loading : LoadingActions.show(store),
            balance
        })
  
        try { 
  
            responseService = await TicketsService.getMyTicketsSports({params});
            ticketssports = responseService.nodes;
            let responseBalance = await TicketsService.getBalance({ params: {} });
            balance = responseBalance.nodes;

  
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }
  
        store.setState({
            ticketssports,
            loading : LoadingActions.hide(store),
            balance,
        })
        
    }


    static async getMyTickets(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

      //console.log('REVISAR PARAMS ACTIONS', params);
      let responseService = {};
      let tickets = {};
      let totalResults= 0;
      let redirect = '';


      store.setState({
          totalResults,
          loading : LoadingActions.show(store),
      })

      try { 

          responseService = await TicketsService.getMyTickets({params});
          tickets = responseService.nodes;
          totalResults = responseService.totalCount;

      } catch (error) {
          ErrorActions.handlerError(store, error);
      }

      store.setState({
          tickets,
          totalResults,
          loading : LoadingActions.hide(store)
      })
      
  }

  static getMyTicketsINH = async (store, {redirectEmptyList, params} = {redirectEmptyList, params}) => {

    let responseService = {};
    let ticketsINH = {};
    let totalResults= 0;
    let redirect = '';
    let balance = store.getState().balance;


    store.setState({
        totalResults,
    })

    try { 

        responseService = await TicketsService.getMyTicketsINH({params});
        ticketsINH = responseService.nodes;
        let responseBalance = await TicketsService.getBalance({ params: {} });
        balance = responseBalance.nodes;
        totalResults = responseService.totalCount;

    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        ticketsINH,
        totalResults,
        balance
    })
    
    }

    static getMyTicketsHSIP = async (store, {redirectEmptyList, params} = {redirectEmptyList, params}) => {

        let responseService = {};
        let ticketsHSIP = {};
        let totalResults= 0;
        let redirect = '';
        let balance = store.getState().balance;
    
    
        store.setState({
            totalResults,
        })
    
        try { 
    
            responseService = await TicketsService.getMyTicketsHSIP({params});
            ticketsHSIP = responseService.nodes;
            let responseBalance = await TicketsService.getBalance({ params: {} });
            balance = responseBalance.nodes;
            totalResults = responseService.totalCount;
    
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }
    
        store.setState({
            ticketsHSIP,
            totalResults,
            balance
        })
        
        }

        static async getAllTicketsProcFreeCocksById(store, {params} = {params}) {

        
            let responseService = {};
            let freeCocksTickets = {};
            let totalCocksById= 0;
            let redirect = '';
        
            store.setState({
                totalCocksById,
                loading : LoadingActions.show(store),
            })
        
            try { 
        
                responseService = await TicketsService.getAllTicketsProcFreeCocksById({params});
                freeCocksTickets = responseService.nodes;
                totalCocksById = responseService.totalCount;
        
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
        
            store.setState({
                freeCocksTickets,
                totalCocksById,
                loading : LoadingActions.hide(store)
            })
            
        }

        static async getAllTicketsProcCocksById(store, {params} = {params}) {

        
            let responseService = {};
            let cocksTickets = {};
            let totalCocksById= 0;
            let redirect = '';
        
            store.setState({
                totalCocksById,
                loading : LoadingActions.show(store),
            })
        
            try { 
        
                responseService = await TicketsService.getAllTicketsProcCocksById({params});
                cocksTickets = responseService.nodes;
                totalCocksById = responseService.totalCount;
        
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
        
            store.setState({
                cocksTickets,
                totalCocksById,
                loading : LoadingActions.hide(store)
            })
            
        }

        static getMyTicketsAnimals = async (store, {redirectEmptyList, params} = {redirectEmptyList, params}) => {

            let responseService = {};
            let ticketsAnimals = {};
            let totalResults= 0;
            let redirect = '';
            let balance = store.getState().balance;
        
        
            store.setState({
                totalResults,
            })
        
            try { 
        
                responseService = await TicketsService.getMyTicketsAnimals({params});
                ticketsAnimals = responseService.nodes;
                let responseBalance = await TicketsService.getBalance({ params: {} });
                balance = responseBalance.nodes;
                totalResults = responseService.totalCount;
        
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
        
            store.setState({
                ticketsAnimals,
                totalResults,
                balance
            })
            
        }

        static async getAllTicketsElInmejorableINH(
            store,
            { redirectEmptyList, params } = { redirectEmptyList, params }
        ) {
            let responseService = {};
            let ticketsINH = {};
            let totalResultsINH = 0;
            let redirect = "";
    
            store.setState({
                totalResultsINH,
                loading: LoadingActions.show(store),
            });
    
            try {
                responseService = await TicketsService.getAllTicketsElInmejorableINH(
                    { params }
                );
                ticketsINH = responseService.rows;
                totalResultsINH = responseService.totalCount;
    
                if (responseService.rows.length == 0) {
                    redirect =
                        redirectEmptyList != null
                            ? redirectEmptyList
                            : "EMPTY_LIST_INH_INMEJORABLE";
                }
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
    
            store.setState({
                ticketsINH,
                totalResultsINH,
                loading: LoadingActions.hide(store),
            });
    
            //TicketsActions.redirect(redirect);
        }

        static async getSummary(
            store,
            { redirectEmptyList, params } = { redirectEmptyList, params }
        ) {
            let responseService = {};
            let tickets = {};
            let totalResults = 0;
            let redirect = "";
    
            store.setState({
                totalResults,
                loading: LoadingActions.show(store),
            });
    
            try {
                responseService = await TicketsService.getSummary({ params });
                tickets = responseService.nodes;
                totalResults = responseService.totalCount;
    
                if (responseService.nodes.length == 0) {
                    redirect =
                        redirectEmptyList != null
                            ? redirectEmptyList
                            : "EMPTY_LIST_SUMMARY";
                }
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
    
            store.setState({
                tickets,
                totalResults,
                loading: LoadingActions.hide(store),
            });
    
            TicketsActions.redirect(redirect);
        }

        static async getAll(
            store,
            { redirectEmptyList, params } = { redirectEmptyList, params }
        ) {
            let responseService = {};
            let tickets = {};
            let totalResultsTickets = 0;
            let redirect = "";
    
            store.setState({
                totalResultsTickets,
                loading: LoadingActions.show(store),
            });
    
            try {
                responseService = await TicketsService.getAll({ params });
                tickets = responseService.rows;
                totalResultsTickets = responseService.totalCount;
    
                if (responseService.rows.length == 0) {
                    redirect =
                        redirectEmptyList != null
                            ? redirectEmptyList
                            : "EMPTY_LIST";
                }
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
    
            store.setState({
                tickets,
                totalResultsTickets,
                loading: LoadingActions.hide(store),
            });
    
            //TicketsActions.redirect(redirect);
        }

        static async getTotalSalesByWagerTypesINH(
            store,
            { redirectEmptyList, params } = { redirectEmptyList, params }
        ) {
            let responseService = {};
            let ticketsWagerTypesINH = {};
            let redirect = "";
    
            store.setState({
                ticketsWagerTypesINH,
                loading: LoadingActions.show(store),
            });
    
            try {
                responseService = await TicketsService.getTotalSalesByWagerTypesINH(
                    { params }
                );
                ticketsWagerTypesINH = responseService.nodes;
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
    
            store.setState({
                ticketsWagerTypesINH,
                loading: LoadingActions.hide(store),
            });
    
            TicketsActions.redirect(redirect);
        }

        static async getSummaryStalls(
            store,
            { redirectEmptyList, params } = { redirectEmptyList, params }
        ) {
            let responseService = {};
            let tickets = {};
            let totalResults = 0;
            let redirect = "";
    
            store.setState({
                totalResults,
                loading: LoadingActions.show(store),
            });
    
            try {
                responseService = await TicketsService.getSummaryStalls({ params });
                tickets = responseService.nodes;
                totalResults = responseService.totalCount;
    
                if (responseService.nodes.length == 0) {
                    redirect =
                        redirectEmptyList != null
                            ? redirectEmptyList
                            : "EMPTY_LIST_SUMMARY";
                }
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
    
            store.setState({
                tickets,
                totalResults,
                loading: LoadingActions.hide(store),
            });
    
            TicketsActions.redirect(redirect);
        }


} 

export default TicketsActions;