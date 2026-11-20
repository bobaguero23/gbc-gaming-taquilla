import HandlerGraph from '../_helpers/HandlerGraphql'
import empty from 'is-empty';
import AuthActions from '../_actions/AuthActions'

class WagerTypesService {

    static getOffset({page} = {page}){
        let result = (((empty(page)) || (page == 1)) ? 0 : ( parseInt(page - 1) * parseInt(LIMIT)))
        return result;
    }

    static async getAll({params} = {params}) {

        let currencyCode = 'VES';
        let userData = AuthActions.meData();
            
        if(!empty(userData)){
            currencyCode = userData.currency_code;
        }
        
        let query = `
        query
        {
            allWagerTypes(condition:{deleted:false, enabled:true, statusId:"1"})
            {
            nodes
            {
                id
                name
                wagerTypesValueUnitsByWagerTypeId(condition:{currencyCode: "${currencyCode}"}){
                    nodes{
                        valueUnit
                        currencyCode
                    }
                    }
                wagerTypesValueUnitsHsipsByWagerTypeId(condition: { currencyCode: "USD" }) {
                    nodes {
                        valueUnit
                        currencyCode
                    }
                    }
            }
            totalCount
            }
        }`;

        const response =  await HandlerGraph.sendRequest({
            query
        });

        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data.allWagerTypes;

        
    }

    static async getAllInh({params} = {params}) {

        let query = `
        query
        {
            allWagerTypes(condition:{deleted:false, enabledInh:true, statusId:"1"})
            {
            nodes
            {
                id
                name
                description
            }
            totalCount
            }
        }`;

        const response =  await HandlerGraph.sendRequest({
            query
        });

        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data.allWagerTypes;

        
    }

    static async getAllInhSelect({params} = {params}) {

      let query = `
      query
      {
          allWagerTypes(condition:{deleted:false, enabledInh:true})
          {
          nodes
          {
              id
              name
              description
          }
          totalCount
          }
      }`;

      const response =  await HandlerGraph.sendRequest({
          query
      });

      if (!empty(response.data.errors)){
          throw new Error(response.data.errors[0].message)
      }

      return response.data.data.allWagerTypes;

      
  }

    static async getAllCocks({params} = {params}) {

        let query = `query {
            allCocks(filter:{
                centersId:{equalTo:"_centersId"}
                status:{in: [1]}
              }
            first:4
            orderBy:CREATED_DESC)
            {
            nodes
            {
                id
                amount
                totalToPay
                accumulated
                secondPlace
                thirdPlace
                fourthPlace
                fifthPlace
                name
              	raceToday
                message
                priority
                trackByTracksId{
                  id
                  trackName
                }
                
            }
            totalCount
            }
        }`;

        const response =  await HandlerGraph.sendRequest({
            query
        });

        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data.allCocks;

        
    }

    static async getAllPicksINH({params} = {params}) {

        let currencyCode = 'VES';
        let userData = AuthActions.meData();
            
        if(!empty(userData)){
            currencyCode = userData.currency_code;
        }
    
        let query = `
        query
        {
            allWagerTypes(condition:{deleted:false, enabled:true})
            {
            nodes
            {
                id
                name
                description
                wagerTypesValueUnitsByWagerTypeId(condition:{currencyCode: "${currencyCode}"}){
                    nodes{
                        valueUnit
                        currencyCode
                    }
                    }
                wagerTypesValueUnitsHsipsByWagerTypeId(condition: { currencyCode: "USD" }) {
                    nodes {
                        valueUnit
                        currencyCode
                    }
                    }
            }
            totalCount
            }
        }`;
    
        const response =  await HandlerGraph.sendRequest({
            query
        });
    
        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }
    
        return response.data.data.allWagerTypes;
    
       }

       static async getAllLotteryCocks({params} = {params}) {

        let query = `{
          allAnimalsLotteriesCocks(
            filter: {centersId: {in: ["_centersId"]}
            status: {in: [1]}}
            first: 4
            orderBy: CREATED_DESC
          ) {
            nodes {
              id
              amount
              firstPlace
              secondPlace
              thirdPlace
              lotteryCockName
              lotteryId
              lotteryToday
              totalToPay
            }
            totalCount
          }
          
        }`;
      
        const response =  await HandlerGraph.sendRequest({
            query
        });
      
        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }
      
        return response.data.data.allAnimalsLotteriesCocks;
      
        
      }
      
      static async getLotteryCockActive({params} = {params}) {
        let id = '';
        if(!empty(params.lottery_cock_id)){
          id = `id:{equalTo:"${params.lottery_cock_id}"}`;
        }
      
        let query = `{
          allAnimalsLotteriesCocks(
            filter: {centersId: {in: ["_centersId"]}
            status: {in: [1]}
            lotteryToday : {equalTo:"_today"}}
            ${id}
          ) {
            nodes {
              id
              amount
              firstPlace
              secondPlace
              thirdPlace
              lotteryCockName
              lotteryToday
              lotteryId
              totalToPay
            }
            totalCount
          }
          
        }`;
      
        const response =  await HandlerGraph.sendRequest({
            query
        });
      
        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }
      
        return response.data.data.allAnimalsLotteriesCocks;
      
        
      }

      static async getCockActiveElInmejorable({params} = {params}) {
        let id = '';
        if(!empty(params.cock_id)){
          id = `id:{equalTo:"${params.cock_id}"}`;
        }
        let raceToday = `_today`;
        if(!empty(params.cock)){
          raceToday = params.cock[0].raceToday;
        }
        
        let query = `query {
            allCocks(filter:{
                centersId:{equalTo:"53"}
                status:{in: [1]}
                raceToday : {equalTo:"${raceToday}"}
                ${id}
              }
            first:4
            orderBy:CREATED_DESC)
            {
            nodes
            {
                id
                amount
                totalToPay
                accumulated
                secondPlace
                thirdPlace
                fourthPlace
                fifthPlace
                jackpot
                jackpot28
                name
                raceToday
                message
                priority
                trackByTracksId{
                  id
                  trackName
                  racesByTracksId(
                    first:100
                  filter:{  
                  raceToday:{equalTo:"${raceToday}"} 
                  deleted:{equalTo:false} }
                  orderBy:[RACE_DATE_ASC]
                  )
                {
                nodes{
                  id
                  statusId
                  raceNumber
                  raceDate
                  raceDateDefault
  
                  horsesRacesByRacesId(
                    first:100
                    orderBy:[ID_ASC]
                    )
                  {
                          nodes{
                            id
                            horsesId
                            programNumber
                            statusId
                            odd
                            jockey
                            trainer
                            horseByHorsesId
                            {
                              id
                              horseName
                            }
  
                          }
                        }
                      }
                    }
                  
                  racesPoolsByTracksId(first:100
                  filter: {
                        deleted:{equalTo:false}
                        raceDate:{equalTo:"${raceToday}"}
                      wagerTypeId: { in: ["27"] }
                        }
                  orderBy:[WAGER_TYPE_ID_ASC])
                  {
                    nodes{
                      id
                      racesId
                      raceList
                      minimumWagerAmount
                      raceByRacesId{
                        id
                        statusId
                      }
                      wagerTypeByWagerTypeId
                      {
                        id
                        name
                      }
                    }
                  }
                  
                  
                }
            }
            totalCount
            }
        }`;
  
        const response =  await HandlerGraph.sendRequest({
            query
        });
  
        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }
  
        return response.data.data.allCocks;
  
        
      }



}

export default WagerTypesService;