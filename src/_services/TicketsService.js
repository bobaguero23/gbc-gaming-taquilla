import HandlerGraph from '../_helpers/HandlerGraphql'
import empty from 'is-empty';
import moment from 'moment';
import { LIMIT } from "../_helpers/Pagination";
import HandlerBackend from "../_helpers/HandlerBackend";

class TicketsService {

    static getOffset({page} = {page}){
        let result = (((empty(page)) || (page == 1)) ? 0 : ( parseInt(page - 1) * parseInt(LIMIT)))
        return result;
    }


    static async getMyTickets({params} = {params}) {
        //console.log('REVISAR PARAMS', {params});
        
        let query = `query{
          allTickets(condition:{
            centersId: "_centersId"
            ticketOfficesId: "_ticketOfficesId"
            } filter:{statusId:{notIn:"7"} created : { greaterThanOrEqualTo: "_today" }} first:10 orderBy:CREATED_DESC){
            nodes{
              id
              created
              confirm
              ticketsStallsByTicketsId{
                nodes{
                  stallsTypeByStallsTypesId{
                    stallName
                  }
                }
              }
              ticketsDetailsByTicketsId(orderBy:RACES_ID_ASC){
                nodes{
                  place
                  horsesRaceByHorsesRacesId{
                   ticketsStallsByHorsesRacesId{
                     nodes{
                       stallsTypeByStallsTypesId{
                         stallName
                       }
                     }
                   }
                   raceByRacesId{
                     raceNumber
                   }
                   programNumber
                   horseByHorsesId{
                     horseName
                   }
                   trackByTracksId{
                     trackName
                   }
                   }
                 }
              }
              ticketOfficeByTicketOfficesId{
                currencyCode
              }
              wagerTypeByWagerTypeId{
                id
                name
              }
              amount
              ticketsStatusByStatusId{
                name
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

        return response.data.data.allTickets;

        
    }

    static async getMyHeaderTicketsCocks({params} = {params}) {
      //console.log('REVISAR PARAMS', {params});
      
      let query = `query{
        allHeaderTicketsCocks(condition:{
          centersId: "_centersId"
          ticketOfficesId: "_ticketOfficesId"
          } filter:{statusId:{notIn:"7"} created : { greaterThanOrEqualTo: "_today" }} first:10 orderBy:CREATED_DESC){
            nodes{
              id
              created
              confirm
              units
              amount
              numberCombinations
              playInText
              trackByTracksId{
                trackName
              }
              ticketOfficeByTicketOfficesId{
                id
                name
                currencyCode
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

      return response.data.data.allHeaderTicketsCocks;

      
  }

    static async getMyTicketsSports({params} = {params}) {
      //console.log('REVISAR PARAMS', {params});
      
      let query = `query{
        procMyAllTicketsSportsTicketOffices(pResultLimit:200){
          ticket
          ticketDetails
          status
          currencyName
        }
      }`;

      const response =  await HandlerGraph.sendRequest({
          query
      });

      if (!empty(response.data.errors)){
          throw new Error(response.data.errors[0].message)
      }
      
      let result = {
        nodes: response.data.data.procMyAllTicketsSportsTicketOffices
      }

      return result;

      
  }

    static async getMyTicketsINH({params} = {params}) {
      //console.log('REVISAR PARAMS', {params});
      let query = `query {
        allTicketsInhs(
          condition: { ticketOfficeId: "_ticketOfficesId" }
          filter: {
            status: { in: [2,3,10,11] }
            raceDate: { greaterThanOrEqualTo: "_today" }
          }
          first: 10
          orderBy: CREATED_AT_DESC
        ) {
          nodes {
            id
            createdAt
            confirm
            idTransactionInh
            trackName
            currencyCode
            ticketsDetailsInhsByTicketId(orderBy: [RACE_ID_ASC,PLACE_ASC]) {
              nodes {
                raceNumber
                horseNumber
                horsesRaceByHorseRaceId{
                  id
                  programNumber
                  horseByHorsesId{
                    horseName
                  }
                  raceByRacesId{
                    id
                    raceNumber
                  }
                }
              }
            }
            wagerTypeByWagerTypeId {
              name
              description
            }
            ticketAmount
            status
          }
        }
      }
    `;

      const response =  await HandlerGraph.sendRequest({
          query
      });

      if (!empty(response.data.errors)){
          throw new Error(response.data.errors[0].message)
      }

      return response.data.data.allTicketsInhs;

      
  }

  static async getBalance({params} = {params}) {

    let query = `
    query {
        allVTokensDetails(
          condition:{tokensId:"_tokenId"}
        )
        {
          nodes{
            sold
            paid
            refund
            balance
          }
        }
      }
    `;

    const response =  await HandlerGraph.sendRequest({
        query
    });

    if (!empty(response.data.errors)){
        throw new Error(response.data.errors[0].message)
    }

    return response.data.data.allVTokensDetails;

    
}

static async getMyTicketsHSIP({params} = {params}) {
  //console.log('REVISAR PARAMS', {params});
  let query = `query {
    allTicketsHsips(
      condition: { ticketOfficeId: "_ticketOfficesId" }
      filter: {
        status: { in: [1,2,3,10,11] }
        raceDate: { greaterThanOrEqualTo: "_today" }
      }
      first: 10
      orderBy: CREATED_AT_DESC
    ) {
      nodes {
        id
        createdAt
        confirm
        idTransactionHsip
        trackName
        currencyCode
        ticketsHsipDetailsByTicketId(orderBy: [RACE_ID_ASC,PLACE_ASC]) {
          nodes {
            raceNumber
            horseNumber
            horsesRaceByHorseRaceId{
              id
              programNumber
              horseByHorsesId{
                horseName
              }
              raceByRacesId{
                id
                raceNumber
              }
            }
          }
        }
        wagerTypeByWagerTypeId {
          name
          description
        }
        ticketAmount
        status
      }
    }
  }
`;

  const response =  await HandlerGraph.sendRequest({
      query
  });

  if (!empty(response.data.errors)){
      throw new Error(response.data.errors[0].message)
  }

  return response.data.data.allTicketsHsips;

  
}

static async getAllTicketsProcFreeCocksById({params}) {
  let query = `query{
    procTicketOfficesTicketsFreeCocks(pCockId:"${params.cock_id}" first:5000){
      nodes{
        userId
        confirm
        userAlias
        raceNumber1
        programNumber1
        raceNumber2
        programNumber2
        raceNumber3
        programNumber3
        raceNumber4
        programNumber4
        raceNumber5
        programNumber5
        raceNumber6
        programNumber6
        totalPoints
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

    return response.data.data.procTicketOfficesTicketsFreeCocks;
}

static async getAllTicketsProcCocksById({params}) {
  let query = `query{
    procTicketsCocksNew(pCockId:"${params.cock_id}" first:10000){
      nodes{
        userId
        confirm
        userAlias
        raceNumber1
        programNumber1
        raceNumber2
        programNumber2
        raceNumber3
        programNumber3
        raceNumber4
        programNumber4
        raceNumber5
        programNumber5
        raceNumber6
        programNumber6
        raceNumber7
        programNumber7
        raceNumber8
        programNumber8
        totalPoints
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

    return response.data.data.procTicketsCocksNew;
}

 static async getMyTicketsAnimals({params} = {params}) {
  //console.log('REVISAR PARAMS', {params});
  let query = `query{
    allTicketsAnimals(condition: { 
      ticketOfficesId: "_ticketOfficesId" }
        filter: {
          statusId: { in: ["1","2","3","10","11"] }
        }
        first: 10
        orderBy: CREATED_DESC){
      nodes{
        id
        created
        confirm
        ticketsAnimalsCocksByTicketsAnimalsId{
          nodes{
            userAlias
          }
        }
        ticketsAnimalsDetailsByTicketsId{
          nodes{
            id
            lotteryNumber
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

  return response.data.data.allTicketsAnimals;

  
 }

 static async getAllTicketsElInmejorableINH({ params }) {
  let query = {};
  params.limit = LIMIT;

  //console.log(params);
  let path = `/elinmejorable/all-tickets-inh`;
  const response = await HandlerBackend.sendRequest({
      query,path,params:params
  });

  if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
  }
  
   
  return response.data.tickets.oData.data;
  }

  static async getSummary({ params }) {
    let offset = 0;
    let orderBy = "SOLD_DESC";
    let limit = (!empty(params) && (!empty(params.limit))) ? ((params.limit == 'all') ? 500 : params.limit) : LIMIT;

    let ticketOffice = !empty(params.ticketoffice_id)
        ? `ticketOfficesId: "${params.ticketoffice_id}"`
        : "";
    let date = "";
    let dateformat = require("date-and-time");
    let p_date_from = "_currentDate";
    let p_date_until = "_currentDate";
    if (empty(params.date_from) && empty(params.date_until)) {
        date = `and: [
      {created : { greaterThanOrEqualTo: "${p_date_from} 00:00:00"}}
      {created : { lessThanOrEqualTo: "${p_date_until} 23:59:59"}}
      ]`;
    } else if (!empty(params.date_from) && !empty(params.date_until)) {
        let momentDateFrom = moment(params.date_from).format(
            "YYYY-MM-DD 00:00:00"
        );
        let momentDateUntil = moment(params.date_until).format(
            "YYYY-MM-DD 23:59:59"
        );
        date = `and: [
      {created : { greaterThanOrEqualTo: "${momentDateFrom}"}}
      {created : { lessThanOrEqualTo: "${momentDateUntil}"}}
      ]`;
    } else if (!empty(params.date_from) && empty(params.date_until)) {
        let momentDateFrom = moment(params.date_from).format(
            "YYYY-MM-DD 00:00:00"
        );
        date = `created : { greaterThanOrEqualTo: "${momentDateFrom}" }`;
    }

    if (!empty(params)) {
        offset = !empty(params.page)
            ? TicketsService.getOffset({ page: params.page })
            : offset;
        orderBy = !empty(params.orderBy) ? params.orderBy : orderBy;
    }

    let query = `query
  {
    allVTicketsSellersSummaries(
      offset:${offset}
      first:${limit}
      condition:{
      ${ticketOffice}
      }
      filter:
      { 
        ${date}
      }
      orderBy: ${orderBy}
    )
    {
      nodes
      {
        centers
        ticketOffices
        year
        month
        created
        daysOfWeekName
        sold
        canceled
        payable
        paid
        profit
        currencyCode
      }
      totalCount
    }
  }
`;

    const response = await HandlerGraph.sendRequest({
        query,
    });

    if (!empty(response.data.errors)) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data.data.allVTicketsSellersSummaries;
}

static async getAll({ params }) {
  let query = {};
  params.limit = LIMIT;

  let path = `/elinmejorable/all-tickets-stalls`;
  const response = await HandlerBackend.sendRequest({
      query,path,params:params
  });

  if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
  }
  
   
  return response.data.tickets.oData.data;
}

static async getTotalSalesByWagerTypesINH({ params }) {
  let offset = 0;
  let orderBy = "TICKET_OFFICES_DESC";
  let limit = (!empty(params) && (!empty(params.limit))) ? ((params.limit == 'all') ? 500 : params.limit) : LIMIT;

  let ticketOffice = !empty(params.ticketoffice_id)
      ? `ticketOfficeId: "${params.ticketoffice_id}"`
      : "";
  let wagerTypeId = !empty(params.wagertype_id)
      ? `wagerTypeId: "${params.wagertype_id}"`
      : "";
  let date = "";
  let dateformat = require("date-and-time");
  let p_date_from = "_currentDate";
  let p_date_until = "_currentDate";
  if (empty(params.date_from) && empty(params.date_until)) {
      date = `and: [
{created : { greaterThanOrEqualTo: "${p_date_from} 00:00:00"}}
{created : { lessThanOrEqualTo: "${p_date_until} 23:59:59"}}
]`;
  } else if (!empty(params.date_from) && !empty(params.date_until)) {
      let momentDateFrom = moment(params.date_from).format(
          "YYYY-MM-DD 00:00:00"
      );
      let momentDateUntil = moment(params.date_until).format(
          "YYYY-MM-DD 23:59:59"
      );
      date = `and: [
{created : { greaterThanOrEqualTo: "${momentDateFrom}"}}
{created : { lessThanOrEqualTo: "${momentDateUntil}"}}
]`;
  } else if (!empty(params.date_from) && empty(params.date_until)) {
      let momentDateFrom = moment(params.date_from).format(
          "YYYY-MM-DD 00:00:00"
      );
      date = `created : { greaterThanOrEqualTo: "${momentDateFrom}" }`;
  }

  if (!empty(params)) {
      offset = !empty(params.page)
          ? TicketsService.getOffset({ page: params.page })
          : offset;
      orderBy = !empty(params.orderBy) ? params.orderBy : orderBy;
  }

  let query = `query{
allVTicketsSellersSummaryByWinInhs(
offset:${offset}
condition:{
${ticketOffice}
${wagerTypeId}
}
filter:
{ 
  ${date}
}
orderBy: ${orderBy}
first:${limit}
)
{
nodes
{
  centers
  ticketOffices
  created
  name
  sold
  canceled
  payable
  paid
  profit
  currencyCode
}
totalCount
}
}
`;

  const response = await HandlerGraph.sendRequest({
      query,
  });

  if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
  }

  return response.data.data.allVTicketsSellersSummaryByWinInhs;
}

static async getSummaryStalls({ params }) {
  let offset = 0;
  let orderBy = "SOLD_DESC";
  let limit = (!empty(params) && (!empty(params.limit))) ? ((params.limit == 'all') ? 500 : params.limit) : LIMIT;

  let date = "";
  let dateformat = require("date-and-time");
  let p_date_from = "_currentDate";
  let p_date_until = "_currentDate";
  if (empty(params.date_from) && empty(params.date_until)) {
      date = `and: [
    {created : { greaterThanOrEqualTo: "${p_date_from} 00:00:00"}}
    {created : { lessThanOrEqualTo: "${p_date_until} 23:59:59"}}
    ]`;
  } else if (!empty(params.date_from) && !empty(params.date_until)) {
      let momentDateFrom = moment(params.date_from).format(
          "YYYY-MM-DD 00:00:00"
      );
      let momentDateUntil = moment(params.date_until).format(
          "YYYY-MM-DD 23:59:59"
      );
      date = `and: [
    {created : { greaterThanOrEqualTo: "${momentDateFrom}"}}
    {created : { lessThanOrEqualTo: "${momentDateUntil}"}}
    ]`;
  } else if (!empty(params.date_from) && empty(params.date_until)) {
      let momentDateFrom = moment(params.date_from).format(
          "YYYY-MM-DD 00:00:00"
      );
      date = `created : { greaterThanOrEqualTo: "${momentDateFrom}" }`;
  }

  if (!empty(params)) {
      offset = !empty(params.page)
          ? TicketsService.getOffset({ page: params.page })
          : offset;
      orderBy = !empty(params.orderBy) ? params.orderBy : orderBy;
  }

  let query = `query
{
  allVTicketsSellersSummaryStalls(
    offset:${offset}
    first:${limit}
    filter:{ 
      ${date}
    }
    orderBy: ${orderBy}
  )
  {
    nodes
    {
      centers
      ticketOffices
      year
      month
      created
      daysOfWeekName
      sold
      canceled
      payable
      paid
      profit
      currencyCode
      wagerTypeName
    }
    totalCount
  }
}
`;

  const response = await HandlerGraph.sendRequest({
      query,
  });

  if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
  }

  return response.data.data.allVTicketsSellersSummaryStalls;
}


}

export default TicketsService;