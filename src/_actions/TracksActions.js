import LoadingActions from './LoadingActions';
import TracksService  from '../_services/TracksService';
import { history } from '../_helpers/history';
import empty from 'is-empty';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import ErrorActions from './ErrorActions'

class TracksActions {

    static handler(store, params){
        return new TracksActions[params.action](store, params.params);
    }

    static clearTracks(store){
        store.setState({
            tracks: {}
        })
    }


    static redirect (key){

      let route = '';

      if (route != ''){
          history.push(route);
      }

    }

    static async getAll(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

      let responseService = {};
      let tracks = {};
      let totalResults= 0;
      let redirect = '';

      store.setState({
          tracks,
          totalResults,
          loading : LoadingActions.show(store)
      })

      try { 

          responseService = await TracksService.getAll({params});
          tracks = responseService.nodes;
          totalResults = responseService.totalCount;

          if ( responseService.nodes.length == 0 ){
              redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
          } 
          
      } catch (error) {
          ErrorActions.handlerError(store, error);
      }

      store.setState({
          tracks,
          totalResults,
          loading : LoadingActions.hide(store)
      })

      TracksActions.redirect(redirect);
      
  }

  static async getAllInh(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

    let responseService = {};
    let tracksInh = {};
    let totalResults= 0;
    let redirect = '';

    store.setState({
        tracksInh,
        totalResults,
        loading : LoadingActions.show(store)
    })

    try { 

        responseService = await TracksService.getAllInh({params});
        tracksInh = responseService.nodes;
        totalResults = responseService.totalCount;

        if ( responseService.nodes.length == 0 ){
            redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
        } 
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        tracksInh,
        totalResults,
        loading : LoadingActions.hide(store)
    })

    TracksActions.redirect(redirect);
    
   }

} 

export default TracksActions;