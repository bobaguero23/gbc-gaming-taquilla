import LoadingActions from './LoadingActions';
import RacesService  from '../_services/RacesService';
import { history } from '../_helpers/history';
import empty from 'is-empty';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import ErrorActions from './ErrorActions'

class RacesActions {

    static handler(store, params){
        return new RacesActions[params.action](store, params.params);
    }

    static clearRaces(store){
        store.setState({
            races: {}
        })
    }


    static redirect (key){

      let route = '';

      if (route != ''){
          history.push(route);
      }

    }

    static async getAllWithMarksByCenter(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

      let responseService = {};
      let racesMarks = {};
      let totalResults= 0;
      let redirect = '';

      store.setState({
          racesMarks,
          totalResults,
          loading : LoadingActions.show(store)
      })

      try { 

          responseService = await RacesService.getAllWithMarksByCenter({params});
          racesMarks = responseService.nodes;
          totalResults = responseService.totalCount;

          if ( responseService.nodes.length == 0 ){
              redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
          } 
          
      } catch (error) {
          ErrorActions.handlerError(store, error);
      }

      store.setState({
          racesMarks,
          totalResults,
          loading : LoadingActions.hide(store)
      })

      RacesActions.redirect(redirect);
      
  }

  static async getAllWithAuctionsByCenter(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

    let responseService = {};
    let racesAuctions = {};
    let totalResults= 0;
    let redirect = '';

    if(!empty(params.notClean)){
        store.setState({
            loading : LoadingActions.show(store)
        })    
    }else{
        store.setState({
            racesAuctions,
            totalResults,
            loading : LoadingActions.show(store)
        })
    }


    try { 

        responseService = await RacesService.getAllWithAuctionsByCenter({params});
        racesAuctions = responseService.nodes;
        totalResults = responseService.totalCount;

        if ( responseService.nodes.length == 0 ){
            redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
        } 
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        racesAuctions,
        totalResults,
        loading : LoadingActions.hide(store)
    })

    RacesActions.redirect(redirect);
    
}

static async getAllWithStallsByCenter(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

    let responseService = {};
    let racesStalls = {};
    let totalResults= 0;
    let redirect = '';

    store.setState({
        racesStalls,
        totalResults,
        loading : LoadingActions.show(store)
    })

    try { 

        responseService = await RacesService.getAllWithStallsByCenter({params});
        racesStalls = responseService.nodes;
        totalResults = responseService.totalCount;

        if ( responseService.nodes.length == 0 ){
            redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
        } 
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        racesStalls,
        totalResults,
        loading : LoadingActions.hide(store)
    })

    RacesActions.redirect(redirect);
    
}

static async getAllByCenter(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

    let responseService = {};
    let racesVersus = {};
    let totalResults= 0;
    let redirect = '';

    store.setState({
        racesVersus,
        totalResults,
        loading : LoadingActions.show(store)
    })

    try { 

        responseService = await RacesService.getAllByCenter({params});
        racesVersus = responseService.nodes;
        totalResults = responseService.totalCount;

        if ( responseService.nodes.length == 0 ){
            redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
        } 
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        racesVersus,
        totalResults,
        loading : LoadingActions.hide(store)
    })

    RacesActions.redirect(redirect);
    
}

static async getNextRacesNacionales(store, {params} = {params}) {

    let responseService = {};
    let allNextRacesNacionales = [];
    let redirect = '';

    try { 
        params = empty(params) ? {} : params;
        params.user = store.getState().user;
        responseService = await RacesService.getNextRacesNacionales({params});
        allNextRacesNacionales = responseService.nodes;
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        allNextRacesNacionales
    })

    RacesActions.redirect(redirect);
    
}

static async getNextRacesHsip(store, {params} = {params}) {

    let responseService = {};
    let allNextRacesHsip = [];
    let redirect = '';

    try { 
        params = empty(params) ? {} : params;
        params.user = store.getState().user;
        responseService = await RacesService.getNextRacesHsip({params});
        allNextRacesHsip = responseService.nodes;
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        allNextRacesHsip
    })

    RacesActions.redirect(redirect);
    
}

static async getNextRaces(store, {params} = {params}) {

    let responseService = {};
    let allNextRaces = [];
    let redirect = '';

    try { 

        responseService = await RacesService.getNextRaces({params});
        allNextRaces = responseService.nodes;
        
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState({
        allNextRaces
    })

    RacesActions.redirect(redirect);
    
}


} 

export default RacesActions;