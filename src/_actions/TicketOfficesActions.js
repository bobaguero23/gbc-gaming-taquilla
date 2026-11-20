import LoadingActions from './LoadingActions';
import TicketOfficesService  from '../_services/TicketOfficesService';
import { history } from '../_helpers/history';
import empty from 'is-empty';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import ErrorActions from './ErrorActions'

class TicketOfficesActions {

    static handler(store, params){
        return new TicketOfficesActions[params.action](store, params.params);
    }

    static clearTicketOffices(store){
        store.setState({
            ticketoffices: {}
        })
    }

    static redirect (key){

      let route = '';

      if (key == 'EMPTY_LIST' || 
          key == 'AFTER_SAVE') {
          route = "/ticketoffices";
      }

      if (route != ''){
          history.push(route);
      }

    }

    static async me(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

      let responseService = {};
      let ticketoffice = {};
      let totalResults= 0;
      let redirect = '';

      store.setState({
        ticketoffice,
          totalResults,
          loading : LoadingActions.show(store)
      })

      try { 

          responseService = await TicketOfficesService.me({params});
          ticketoffice = responseService.nodes;
          totalResults = responseService.totalCount;

      } catch (error) {
          ErrorActions.handlerError(store, error);
      }

      store.setState({
          ticketoffice,
          totalResults,
          loading : LoadingActions.hide(store)
      })

      TicketOfficesActions.redirect(redirect);
      
  }

  static async currentTimestamp(store, {params} = {params}) {
    let currentTimestamp = {};
    let redirect = '';

    store.setState({      
        currentTimestamp,
        loading : LoadingActions.show(store)
    })

    try { 

        currentTimestamp = await TicketOfficesService.currentTimestamp({params});

    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        currentTimestamp,
        loading : LoadingActions.hide(store)
    })

    
    }

    static async getAllTicketOfficesMovements(store, {params} = {params}) {

        let responseService = {};
        let ticketofficesmovements = {};
        let totalResults= 0;
        let redirect = '';
    
        store.setState({
            ticketofficesmovements,
            totalResults,
            loading : LoadingActions.show(store)
        })
    
        try { 
    
            responseService = await TicketOfficesService.getAllTicketOfficesMovements({params});
            ticketofficesmovements = responseService.nodes;
            totalResults = responseService.totalCount;
            
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }
    
        store.setState({
            ticketofficesmovements,
            totalResults,
            loading : LoadingActions.hide(store)
        })
    
        TicketOfficesActions.redirect(redirect);
        
    }


} 

export default TicketOfficesActions;