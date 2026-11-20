import LoadingActions from './LoadingActions';
import TokensService  from '../_services/TokensService';
import { history } from '../_helpers/history';
import empty from 'is-empty';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import ErrorActions from './ErrorActions'

class TokensActions {

    static handler(store, params){
        return new TokensActions[params.action](store, params.params);
    }

    static clearTokens(store){
        store.setState({
            tokens: {}
        })
    }
    

    static redirect (key){

      let route = '';

      if (key == 'EMPTY_LIST' || 
          key == 'AFTER_SAVE') {
          route = "/tokens";
      }

      if (key == 'AFTER_SAVE_RULES') {
        route = "/tokens-rules";
      }

      if (key == 'DELETE') {
        route = "/tokens-rules/page/1";
      }

      if (route != ''){
          history.push(route);
      }

    }

    static async getTokenBalance(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

      let responseService = {};
      let tokenbalance = 0;
      let redirect = '';

      store.setState({
          tokenbalance,
          loading : LoadingActions.show(store)
      })

      try { 

          responseService = await TokensService.getTokenBalance({params});
          tokenbalance = responseService;
          
          
      } catch (error) {
          ErrorActions.handlerError(store, error);
      }

      store.setState({
          tokenbalance,
          loading : LoadingActions.hide(store)
      })

      TokensActions.redirect(redirect);
      
  }

  static async getTokenInfo(store, { params }) {

    let responseService = {};
    let tokendetail = {};
    let redirect = '';

    store.setState({
        tokendetail,
        loading : LoadingActions.show(store)
    })

    try { 

        responseService = await TokensService.getTokenInfo({params});
        tokendetail = responseService.nodes;
        
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        tokendetail,
        loading : LoadingActions.hide(store)
    })

    TokensActions.redirect(redirect);
    
  }

  static async getAll(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

    let responseService = {};
    let redirect = '';
    let tokens = {}
    let totalResults = 0;

    store.setState({
        totalResults,
        tokens,
        loading : LoadingActions.show(store)
    })

    try { 

        responseService = await TokensService.getAll({params});
        tokens = !empty(responseService.nodes) ? responseService.nodes : {};
        totalResults = responseService.totalCount;
        
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        tokens,
        totalResults,
        loading : LoadingActions.hide(store)
    })

    TokensActions.redirect(redirect);
    
  }

} 

export default TokensActions;