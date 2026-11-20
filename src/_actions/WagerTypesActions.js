import LoadingActions from './LoadingActions';
import WagerTypesService  from '../_services/WagerTypesService';
import { history } from '../_helpers/history';
import empty from 'is-empty';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import ErrorActions from './ErrorActions'

class WagerTypesActions {

    static handler(store, params){
        return new WagerTypesActions[params.action](store, params.params);
    }

    static clearWagerTypes(store){
        store.setState({
            wagertypes: {}
        })
    }


    static redirect (key){

      let route = '';

      if (key == 'EMPTY_LIST' || 
          key == 'AFTER_SAVE') {
          route = "/wagertypes";
      }

      if (route != ''){
          history.push(route);
      }

    }

    static async getAll(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

      let responseService = {};
      let wagertypes = {};
      let totalResults= 0;
      let redirect = '';

      store.setState({
          wagertypes,
          totalResults,
          loading : LoadingActions.show(store)
      })

      try { 

          responseService = await WagerTypesService.getAll({params});
          wagertypes = responseService.nodes;
          totalResults = responseService.totalCount;

          if ( responseService.nodes.length == 0 ){
              redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
          } 
          
      } catch (error) {
          ErrorActions.handlerError(store, error);
      }

      store.setState({
          wagertypes,
          totalResults,
          loading : LoadingActions.hide(store)
      })

      WagerTypesActions.redirect(redirect);
      
  }

  static async getAllInh(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

    let responseService = {};
    let wagertypes = {};
    let totalResults= 0;
    let redirect = '';

    store.setState({
        wagertypes,
        totalResults,
        loading : LoadingActions.show(store)
    })

    try { 

        responseService = await WagerTypesService.getAllInh({params});
        wagertypes = responseService.nodes;
        totalResults = responseService.totalCount;

        if ( responseService.nodes.length == 0 ){
            redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
        } 
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        wagertypes,
        totalResults,
        loading : LoadingActions.hide(store)
    })

    WagerTypesActions.redirect(redirect);
    
    }

    static async getAllCocks(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

        let responseService = {};
        let cocks = {};
        let totalResults= 0;
        let redirect = '';
    
        store.setState({
            cocks,
            totalResults,
            loading : LoadingActions.show(store)
        })
    
        try { 
    
            responseService = await WagerTypesService.getAllCocks({params});
            cocks = responseService.nodes;
            totalResults = responseService.totalCount;
    
            if ( responseService.nodes.length == 0 ){
                redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
            } 
            
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }
    
        store.setState({
            cocks,
            totalResults,
            loading : LoadingActions.hide(store)
        })
    
        WagerTypesActions.redirect(redirect);
        
        }

        static async getAllPicksINH(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

            let responseService = {};
            let wagertypesINH = {};
            let totalResults= 0;
            let redirect = '';
      
            store.setState({
                wagertypesINH,
                totalResults,
                loading : LoadingActions.show(store)
            })
      
            try { 
                  responseService = await WagerTypesService.getAllPicksINH({params: params});
                  wagertypesINH = responseService.nodes;
                  totalResults = responseService.totalCount;
      
                  if ( responseService.nodes.length == 0 ){
                      redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
                  } 
                
            } catch (error) {
                console.log("error:::", error)
                ErrorActions.handlerError(store, error);
            }
      
            store.setState({
                wagertypesINH,
                totalResults,
                loading : LoadingActions.hide(store)
            })
      
            WagerTypesActions.redirect(redirect);
            
        }

        static async getLotteryCockActive(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

            let responseService = {};
            let lottery_cock = {};
            let totalResults= 0;
        
            store.setState({
                lottery_cock,
                totalResults,
                loading : LoadingActions.show(store)
            })
        
            try { 
        
                responseService = await WagerTypesService.getLotteryCockActive({params});
                lottery_cock = !empty(responseService) && !empty(responseService.nodes) ? responseService.nodes[0] : {};
                totalResults = responseService.totalCount;
        
                
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
        
            store.setState({
                lottery_cock,
                totalResults,
                loading : LoadingActions.hide(store)
            })
        
            
        }

        static async getCockActiveElInmejorable(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

            let responseService = {};
            let cock = {};
            let totalResults= 0;
        
            store.setState({
                cock,
                totalResults,
                loading : LoadingActions.show(store)
            })
        
            try { 
        
                responseService = await WagerTypesService.getCockActiveElInmejorable({params});
                cock = !empty(responseService) && !empty(responseService.nodes) ? responseService.nodes[0] : {};
                totalResults = responseService.totalCount;
        
                
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
        
            store.setState({
                cock,
                totalResults,
                loading : LoadingActions.hide(store)
            })
        
            
        }

        static async getAllInhSelect(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

            let responseService = {};
            let wagertypes = {};
            let totalResults= 0;
            let redirect = '';
        
            store.setState({
                wagertypes,
                totalResults,
                loading : LoadingActions.show(store)
            })
        
            try { 
        
                responseService = await WagerTypesService.getAllInhSelect({params});
                wagertypes = responseService.nodes;
                totalResults = responseService.totalCount;
        
                if ( responseService.nodes.length == 0 ){
                    redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
                } 
                
            } catch (error) {
                ErrorActions.handlerError(store, error);
            }
        
            store.setState({
                wagertypes,
                totalResults,
                loading : LoadingActions.hide(store)
            })
        
            WagerTypesActions.redirect(redirect);
            
        }


} 

export default WagerTypesActions;