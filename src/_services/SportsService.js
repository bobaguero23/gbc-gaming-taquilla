import HandlerGraph from '../_helpers/HandlerGraphql'
import empty from 'is-empty';
import AuthActions from '../_actions/AuthActions'

class SportsService {

    static getOffset({page} = {page}){
        let result = (((empty(page)) || (page == 1)) ? 0 : ( parseInt(page - 1) * parseInt(LIMIT)))
        return result;
    }

    static async getAllSportsName({params} = {params}) {
        let query = `query{
          allVSportNames(first:100){
            nodes{
              sportName
            }
          }
        }`;

        const response =  await HandlerGraph.sendRequest({
            query
        });

        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data.allVSportNames;

        
    }


  static async getAllVSportsCountBySportnameOpen({params} = {params}) {
    let query = `query{
      allVSportsCountBySportnameOpens(first:20){
       nodes{
         sportName
         count
       }
     }
    }`;

    const response =  await HandlerGraph.sendRequest({
        query
    });

    if (!empty(response.data.errors)){
        throw new Error(response.data.errors[0].message)
    }

    return response.data.data.allVSportsCountBySportnameOpens;

    
}

static async getAllVSportsCountBySportnameOpenAndDates({params}) {
  let query = `query {
    allVSportsEventsOpenedWeekBySports(
      filter:{
        sportName: {
          equalTo: "${params.sportName}"
        }
      }
      first: 7
    ){
      nodes{
        case
        eventToday
      }
    }
  }`;

  const response =  await HandlerGraph.sendRequestSports({
      query
  });

  if (!empty(response.data.errors)){
      throw new Error(response.data.errors[0].message)
  }

  return response.data.data.allVSportsEventsOpenedWeekBySports;

  
}

static async getAllVSportsCountBySportnameOpenAndDatesLeagues({params}) {
  let query = `query {
  allVSportsEventsOpenedWeekBySportsLeagues(
    filter:{
      sportName: {
        equalTo: "${params.sportName}"
      }
      eventToday:{
        equalTo: "${params.eventToday}"
      }
    }
    first: 50
  ){
    nodes{
      league
      count
    }
  }
}`;

  const response =  await HandlerGraph.sendRequestSports({
      query
  });

  if (!empty(response.data.errors)){
      throw new Error(response.data.errors[0].message)
  }

  return response.data.data.allVSportsEventsOpenedWeekBySportsLeagues;

  
}


}

export default SportsService;