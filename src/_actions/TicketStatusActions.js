import LoadingActions from './LoadingActions';
import TicketStatusService  from '../_services/TicketStatusService';
import { history } from '../_helpers/history';
import ErrorActions from './ErrorActions' 

class TicketStatusActions {

    static handler(store, params){
        return new TicketStatusActions[params.action](store, params.params);
    }

    static clearTicketStatus(store){
        store.setState({
            ticketstatus: {}
        })
    }


    static redirect (key){

      let route = '';

      if (key == 'EMPTY_LIST' || 
          key == 'AFTER_SAVE') {
          route = "/ticketstatus";
      }

      if (route != ''){
          history.push(route);
      }

    }

    static async getAll(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

      let responseService = {};
      let ticketstatus = {};
      let totalResults= 0;
      let redirect = '';

      store.setState({
          ticketstatus,
          totalResults,
          loading : LoadingActions.show(store)
      })

      try { 

          responseService = await TicketStatusService.getAll({params});
          ticketstatus = responseService.nodes;
          totalResults = responseService.totalCount;

          if ( responseService.nodes.length == 0 ){
              redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
          } 
          
      } catch (error) {
          ErrorActions.handlerError(store, error);
      }

      store.setState({
          ticketstatus,
          totalResults,
          loading : LoadingActions.hide(store)
      })

      TicketStatusActions.redirect(redirect);
      
  }

   static async getAllAnimals(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

    let responseService = {};
    let ticketstatusanimals = {};
    let totalResults= 0;
    let redirect = '';

    store.setState({
        ticketstatusanimals,
        totalResults,
        loading : LoadingActions.show(store)
    })

    try { 

        responseService = await TicketStatusService.getAllAnimals({params});
        ticketstatusanimals = responseService.nodes;
        totalResults = responseService.totalCount;

        if ( responseService.nodes.length == 0 ){
            redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
        } 
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        ticketstatusanimals,
        totalResults,
        loading : LoadingActions.hide(store)
    })

    TicketStatusActions.redirect(redirect);
    
}


} 

export default TicketStatusActions;