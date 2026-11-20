import LoadingActions from './LoadingActions';
import SportsService  from '../_services/SportsService';
import { history } from '../_helpers/history';
import empty from 'is-empty';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import ErrorActions from './ErrorActions'

class SportsActions {

    static handler(store, params){
        return new SportsActions[params.action](store, params.params);
    }

    static clearSports(store){
        store.setState({
            sports: {}
        })
    }


    static redirect (key){

      let route = '';

      if (key == 'EMPTY_LIST' || 
          key == 'AFTER_SAVE') {
          route = "/sports";
      }

      if (route != ''){
          history.push(route);
      }

    }

    static getTranslateSportNameByName(language, name){
        const sportsNames = [
            {
                name: "American Football",
                translation : [
                    {
                        language: 'ES',
                        name : 'Fútbol Americano'
                    }
                ]
            },
            {
                name: "Basketball",
                translation : [
                    {
                        language: 'ES',
                        name : 'Básquetbol'
                    }
                ]
            },
            {
                name: "Soccer",
                translation : [
                    {
                        language: 'ES',
                        name : 'Fútbol'
                    }
                ]
            },
            {
                name: "Baseball",
                translation : [
                    {
                        language: 'ES',
                        name : 'Béisbol'
                    }
                ]
            }
        ]

        let sport =  sportsNames.find((s) => s.name == name)
        let sportName = !empty(sport) ? sport.translation.map((t) => t.language == language ? t.name : null) : '';
        return !empty(sportName) ? sportName[0] : '';

    }

    static async getAllSportsName(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

      let responseService = {};
      let sportsnames = [];
      let totalResults= 0;
      let redirect = '';

      sportsnames.push({
          sportName: 'Todos',
          sportNameES : 'Todos'
      })

      store.setState({
          sportsnames,
          totalResults,
          loading : LoadingActions.show(store)
      })

      try { 
            responseService = await SportsService.getAllSportsName({params: params});
            sportsnames.push(...responseService.nodes);

            sportsnames = sportsnames.map((s) => {
                s.sportNameES = SportsActions.getTranslateSportNameByName('ES', s.sportName);
                return s;
            })

            totalResults = responseService.totalCount;

            if ( responseService.nodes.length == 0 ){
                redirect = (redirectEmptyList != null) ? redirectEmptyList : 'EMPTY_LIST';
            } 
          
      } catch (error) {
          console.log("error:::", error)
          ErrorActions.handlerError(store, error);
      }

      store.setState({
          sportsnames,
          totalResults,
          loading : LoadingActions.hide(store)
      })

      SportsActions.redirect(redirect);
      
  }


    static async getAllVSportsCountBySportnameOpen(store, {redirectEmptyList, params} = {redirectEmptyList, params}) {

        let responseService = {};
        let sportVideoEventsBySportName = [];

        try { 
            responseService = await SportsService.getAllVSportsCountBySportnameOpen({params: params});
            sportVideoEventsBySportName = responseService.nodes;
            
        } catch (error) {
            console.log("error:::", error)
            ErrorActions.handlerError(store, error);
        }

        store.setState({
            sportVideoEventsBySportName,
            loading : LoadingActions.hide(store)
        })
    }

    static async getAllEventsBySportsAndDatesLeagues(store, params) {

        //console.log('getAllEventsBySportsAndDatesLeagues:: params::', params)

        let responseService = {};
        let sportVideoEventsBySportNameAndDatesLeagues = [];

        try { 

            store.setState({
                sportVideoEventsBySportNameAndDatesLeagues,
                loading : LoadingActions.show(store)
            })

            responseService = await SportsService.getAllVSportsCountBySportnameOpenAndDatesLeagues({params: params});
            sportVideoEventsBySportNameAndDatesLeagues = responseService.nodes;
            
        } catch (error) {
            console.log("error:::", error)
            ErrorActions.handlerError(store, error);
        }

        store.setState({
            sportVideoEventsBySportNameAndDatesLeagues,
            loading : LoadingActions.hide(store)
        })
    }

    static async getAllEventsBySportsAndDates(store, params) {

        //console.log('getAllEventsBySportsAndDates:: params::', params)

        let responseService = {};
        let sportVideoEventsBySportNameAndDates = [];

        try { 

            store.setState({
                sportVideoEventsBySportNameAndDates,
                loading : LoadingActions.show(store)
            })

            responseService = await SportsService.getAllVSportsCountBySportnameOpenAndDates({params: params});
            sportVideoEventsBySportNameAndDates = responseService.nodes;
            
        } catch (error) {
            console.log("error:::", error)
            ErrorActions.handlerError(store, error);
        }

        store.setState({
            sportVideoEventsBySportNameAndDates,
            loading : LoadingActions.hide(store)
        })
    }

} 

export default SportsActions;