import HandlerGraph from '../_helpers/HandlerGraphql'
import empty from 'is-empty';

class RacesService {

    static getOffset({page} = {page}){
        let result = (((empty(page)) || (page == 1)) ? 0 : ( parseInt(page - 1) * parseInt(LIMIT)))
        return result;
    }

    static async getNextRaces({params} = {params}){

      let query = `query{
        allRaces(
          filter:{
                statusId:{
                  equalTo:"1"
                }
                raceToday: {
                      equalTo:"_today"
                }
                trackByTracksId: {
                  enabledBetpredator: {
                    equalTo: true
                  }
                }
          }, orderBy:RACE_DATE_ASC, first:30
        ){
          nodes{
            id
            raceNumber
            raceToday
            statusId
            raceDate
            trackByTracksId{
              id
              trackName
              enabledCustomers
              enabledBetpredator
            }
            
          }
        }
      }`;

      const response =  await HandlerGraph.sendRequest({
          query
      });

      if (!empty(response.data.errors)){
          throw new Error(response.data.errors[0].message)
      }

      return response.data.data.allRaces;

    }

    static async getNextRacesNacionales({params} = {params}){

      let query = `query{
        allRaces(
          filter:{
                statusId:{
                  equalTo:"1"
                }
                raceToday: {
                    greaterThanOrEqualTo:"_today"
                }
                trackByTracksId: {
                  enabledBetpredator: {
                    equalTo: true
                  }
                  id:{
                    in:["9101","9102","9100"]
                  }
                }
          }, orderBy:RACE_DATE_ASC, first:30
        ){
          nodes{
            id
            raceNumber
            raceToday
            statusId
            raceDate
            trackByTracksId{
              id
              trackName
              enabledCustomers
              enabledBetpredator
            }
            
          }
        }
      }`;

      const response =  await HandlerGraph.sendRequest({
          query
      });

      if (!empty(response.data.errors)){
          throw new Error(response.data.errors[0].message)
      }

      return response.data.data.allRaces;

    }

    static async getNextRacesHsip({params} = {params}){

      let query = `query{
        allRaces(
          filter:{
                statusId:{
                  equalTo:"1"
                }
                raceToday: {
                    greaterThanOrEqualTo:"_today"
                }
                trackByTracksId: {
                  enabled: {
                    equalTo: true
                  }
                  id:{
                    in:["203424","203433"]
                  }
                }
          }, orderBy:RACE_DATE_ASC, first:30
        ){
          nodes{
            id
            raceNumber
            raceToday
            statusId
            raceDate
            trackByTracksId{
              id
              trackName
            }
            
          }
        }
      }`;

      const response =  await HandlerGraph.sendRequest({
          query
      });

      if (!empty(response.data.errors)){
          throw new Error(response.data.errors[0].message)
      }

      return response.data.data.allRaces;

    }

    static async getAllWithMarksByCenter({params} = {params}) {

        let query = `
        query{
            allRaces(condition: {raceToday: "_today"
            tracksId:"${params.tracksId}"
            statusId:"1"
            }) {
              nodes {
                id
                raceNumber
                raceDate
                horsesRacesByRacesId(condition:{statusId:"1"})
                {
                  nodes
                  {
                    id
                    programNumber
                    statusId
                    horseByHorsesId
                    {
                      horseName
                    }
                  }
                }
                marksByRacesId(condition:{centersId:"_centersId" status:1
                }) {
                  nodes {
                    totalToPay
                    marksDetailsByMarksId(orderBy:POSITION_ASC) {
                      nodes {
                        position
                        marksStatusId
                        horsesRaceByHorsesRacesId {
                          id
                          programNumber
                          statusId
                          horseByHorsesId {
                            horseName
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }`;

        const response =  await HandlerGraph.sendRequest({
            query
        });

        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data.allRaces;

        
    }

    static async getAllWithAuctionsByCenter({params} = {params}) {

      let query = `
      query{
        allRaces(condition: {raceToday: "_today"
        tracksId:"${params.tracksId}"
        statusId:"1"
        }) {
          nodes {
            id
            raceNumber
            raceDate
            auctionsByRacesId(condition:{ticketOfficesId:"_ticketOfficesId" status:1
            }) {
              nodes {
                id
                totalToPay
                currencyCode
                valueIncrement
                auctionDetailsByAuctionId (orderBy:HORSES_RACES_ID_ASC) {
                  nodes {
                    auctionId
                    customer
                    offered
                    horsesRaceByHorsesRacesId {
                      id
                      statusId
                      programNumber
                      horseByHorsesId {
                        horseName
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`;

      const response =  await HandlerGraph.sendRequest({
          query
      });

      if (!empty(response.data.errors)){
          throw new Error(response.data.errors[0].message)
      }

      return response.data.data.allRaces;

      
  }

  static async getAllWithStallsByCenter({params} = {params}) {

    let query = `
    query{
      allRaces(condition: {raceToday: "_today"
      tracksId:"${params.tracksId}"
      statusId:"1"
      }) {
        nodes {
          id
          raceNumber
          raceDate
          stallsByRacesId(condition:{centersId:"_centersId" status:1
          }) {
            nodes {
              id
              totalToPay
              stallsDetailsByStallsId (orderBy:HORSES_RACES_ID_ASC) {
                nodes {
                  stallsId
                  stallsTypeByStallsTypesId
                  {
                    stallName
                  }
                  horsesRaceByHorsesRacesId {
                    id
                    statusId
                    programNumber
                    horseByHorsesId {
                      horseName
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`;

    const response =  await HandlerGraph.sendRequest({
        query
    });

    if (!empty(response.data.errors)){
        throw new Error(response.data.errors[0].message)
    }

    return response.data.data.allRaces;

    
}

static async getAllByCenter({params} = {params}) {

  let query = `
  query{
    allRaces(condition: {raceToday: "_today", tracksId: "${params.tracksId}", statusId: "1"}) {
      nodes {
        id
        raceNumber
        raceDate
        horsesRacesByRacesId(condition: {statusId: "1"}) {
          nodes {
            id
            programNumber
            statusId
            horseByHorsesId {
              horseName
            }
          }
        }
        
      }
    }
  }`;

  const response =  await HandlerGraph.sendRequest({
      query
  });

  if (!empty(response.data.errors)){
      throw new Error(response.data.errors[0].message)
  }

  return response.data.data.allRaces;

  
}


}

export default RacesService;