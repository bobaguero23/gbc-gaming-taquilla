import HandlerGraph from "../_helpers/HandlerGraphql";
import HandlerBackend from "../_helpers/HandlerBackend";
import empty from "is-empty";

const localIpUrl = require("local-ip-url");
const { detect } = require("detect-browser");
const browser = detect();

class SellService {
  static async sellTicket({ sellform } = { sellform }) {
    let query = `mutation{
      procSellTicketGraph(
        input:{
          pTokenValue:"_tokensId"
          pWagerTypeId:"${sellform.wagerTypeId}"
          pUnits:${sellform.units}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId)
            .replace(/"/g, "")
            .replace(/\@/g, '"')}
          pUsername: "${localStorage.getItem("username")}",
          pIpaddress: "${localIpUrl("public", "ipv4")}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
        }
        
      }
      
    }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellTicketGraph;
  }

  static async sellInhTicket({ sellform } = { sellform }) {
    let query = `mutation{
      procSellTicketInhTicketOffice(
        input:{
          pTokenValue:"_tokensId"
          pTrackId:"${sellform.trackId}"
          pTrackName:"${sellform.trackName}"
          pRaceDate:"${sellform.raceDate}"
          pWagerTypeId:"${sellform.wagerTypeId}"
          pUnits:${sellform.units}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`;

    //console.log('query::::::::::::',query);

    const response = await HandlerBackend.sendRequest({
      path:'/elinmejorable/sellticketinh',
      method: 'post',
      query
    });
  
    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }
  
  
    return (!empty(response.data.data.procSellTicketInhTicketOffice) ? response.data.data.procSellTicketInhTicketOffice : null);

  }

  static async sellInhDolaresTicket({ sellform } = { sellform }) {
    let query = `mutation{
      procSellTicketInhTicketOffice(
        input:{
          pTokenValue:"_tokensId"
          pTrackId:"${sellform.trackId}"
          pTrackName:"${sellform.trackName}"
          pRaceDate:"${sellform.raceDate}"
          pWagerTypeId:"${sellform.wagerTypeId}"
          pUnits:${sellform.units}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`;

    //console.log('query::::::::::::',query);

    const response = await HandlerBackend.sendRequest({
      path:'/elinmejorable/sellticketdolaresinh',
      method: 'post',
      query
    });
  
    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }
  
  
    return (!empty(response.data.data.procSellTicketInhTicketOffice) ? response.data.data.procSellTicketInhTicketOffice : null);

  }

  static async sellInhElInmejorableTicket({ sellform } = { sellform }) {
    let query = `mutation{
      procSellTicketInhTicketOffice(
        input:{
          pTokenValue:"_tokensId"
          pTrackId:"${sellform.trackId}"
          pTrackName:"${sellform.trackName}"
          pRaceDate:"${sellform.raceDate}"
          pWagerTypeId:"${sellform.wagerTypeId}"
          pUnits:${sellform.units}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`;

    //console.log('query::::::::::::',query);

    const response = await HandlerBackend.sendRequest({
      path:'/elinmejorable/sellticketelinmejorableinh',
      method: 'post',
      query
    });
  
    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }
  
  
    return (!empty(response.data.data.procSellTicketInhTicketOffice) ? response.data.data.procSellTicketInhTicketOffice : null);

  }

  static async getTicketById({ id } = { id }) {
    let query = `query{
      allTickets(condition:{id:"${id}",ticketOfficesId:"_ticketOfficesId"})
      {
        nodes{
          created
          confirm
          ticketsStallsByTicketsId{
            nodes{
              stallsTypeByStallsTypesId{
                stallName
              }
            }
          }
          units
          amount
          wagerTypeByWagerTypeId{
            id
            name
          }
          ticketOfficeByTicketOfficesId{
            name
            valueUnits
            valueUnitsInh
            valueUnitsInh56
            currencyCode
          }
          ticketsDetailsByTicketsId
          {
            nodes{
              place
              horsesRaceByHorsesRacesId{
                programNumber
                horseByHorsesId{
                  horseName
                }
                raceByRacesId
                {
                  raceNumber
                }
                trackByTracksId{
                  trackName
                }
              }
            }
          }
        }
      }
    }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return !empty(response.data.data) ? response.data.data : null;
  }

  static async getHeaderTicketCockById({ id } = { id }) {
    let query = `query{
      allHeaderTicketsCocks(condition:{id:"${id}",ticketOfficesId:"_ticketOfficesId"} first:1)
      {
        nodes{
          created
          confirm
          units
          amount
          numberCombinations
          playInText
          totalToPay
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

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return !empty(response.data.data) ? response.data.data : null;
  }

  static async getTicketINHById({ id,status } = { id,status }) {
    let cStatus = '';

    if(!empty(status)){
      cStatus = `status:${status}`;
    }
    let query = `query {
      allTicketsInhs(
        condition: { id:"${id}" 
          ${cStatus}
        }
        ) {
        nodes {
          createdAt
          confirm
          idTransactionInh
          trackName
          currencyCode
          ticketUnits
          raceDate
          ticketOfficeByTicketOfficeId{
            name
          }
          ticketsDetailsInhsByTicketId(orderBy: [RACE_ID_ASC,PLACE_ASC]) {
            nodes {
              raceNumber
              horseNumber
              place
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
            id
            name
            description
          }
          ticketAmount
          status
        }
      }
    }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return !empty(response.data.data) ? response.data.data : null;
  }

  static async getTicketHsipById({ id,status } = { id,status }) {
    let cStatus = '';

    if(!empty(status)){
      cStatus = `status:${status}`;
    }
    let query = `query {
      allTicketsHsips(
        condition: { id:"${id}" 
          ${cStatus}
        }
        ) {
        nodes {
          createdAt
          confirm
          idTransactionHsip
          trackName
          currencyCode
          ticketUnits
          raceDate
          ticketOfficeByTicketOfficeId{
            name
          }
          ticketsHsipDetailsByTicketId(orderBy: [RACE_ID_ASC,PLACE_ASC]) {
            nodes {
              raceNumber
              horseNumber
              place
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
            id
            name
            description
          }
          ticketAmount
          status
        }
      }
    }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return !empty(response.data.data) ? response.data.data : null;
  }

  static async getAllDataBySellNoInterval({} = {}) {
    let query = `query
    {
      allTokens(condition:{value:"_tokensId",ticketOfficesId:"_ticketOfficesId"})
      {
        nodes{
          userBySellerId{
            username
          }
          centerByCentersId
          {
            name
          }
          ticketOfficeByTicketOfficesId{
            id
            name
            subdomain
            valueUnits
            valueUnitsInh
            valueUnitsInh56
            currencyCode
            specialKey
          }
        }
      }
      allWagerTypes(condition:{deleted:false, enabled:true, statusId:"1"})
      {
        nodes
        {
          id
          name
        }
      }
    }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data;
  }

  static async getAllDataBySell({} = {}) {
    let query = `query{
          allTracks(condition:{deleted:false,enabled:true}  
            filter:
              {
                id : { notIn: ["9101","9102","9100"] }
              }       
          ){
            nodes{
              id
              trackName
              racesByTracksId(
                condition:{raceToday:"_today",deleted:false,statusId:"1"}
                orderBy:[RACE_DATE_ASC]
                )
              {
                nodes{
                  id
                  raceNumber
                  raceDate
                  horsesRacesByRacesId(
                    condition:{deleted:false,raceToday:"_today"}
                    )
                  {
                    nodes{
                      id
                      horsesId
                      programNumber
                      statusId
                      horseByHorsesId
                      {
                        id
                        horseName
                      }
                      
                    }
                  }
                }
              }
              racesPoolsByTracksId(condition:{raceDate:"_today",deleted:false}
              filter: {
              wagerTypeId: { in: ["10", "11", "12","13","14"] }
              }
              orderBy:[WAGER_TYPE_ID_ASC])
              {
                nodes{
                  id
                  racesId
                  raceList
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
            ,totalCount
          }
          allVTicketsSellers(
            first: 10
            orderBy:CREATED_DESC
            condition:{
            centersId: "_centersId"
            ticketOfficesId: "_ticketOfficesId"
            }
            filter:{
              created : { greaterThanOrEqualTo: "_today" }
              statusId : { notIn : ["7"] }
            }
          )
          {
            nodes
            {
              ticketOffices
              number
              confirm
              wagerType
              stallName
              created
              units
              amount
              totalToPay
              ticketsStatus
              horseName
              raceNumber
              trackName
              currencyCode
              usersId
            }
            totalCount
          }
        }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data;
  }

  static async getAllDataINHBySell({} = {}) {
    let query = `query{
          allTracks(condition:{deleted:false,enabled:true}  
            filter:
              {
                id : { in: ["9101","9102","9100"] }
              }       
          ){
            nodes{
              id
              trackName
              racesByTracksId(
                condition:{raceToday:"_today",deleted:false,statusId:"1"}
                orderBy:[RACE_DATE_ASC]
                )
              {
                nodes{
                  id
                  raceNumber
                  raceDate
                  horsesRacesByRacesId(
                    condition:{deleted:false,raceToday:"_today"}
                    )
                  {
                    nodes{
                      id
                      horsesId
                      programNumber
                      statusId
                      horseByHorsesId
                      {
                        id
                        horseName
                      }
                      
                    }
                  }
                }
              }
              racesPoolsByTracksId(condition:{raceDate:"_today",deleted:false}
              filter: {
              wagerTypeId: { in: ["10", "11", "12","13","14"] }
              }
              orderBy:[WAGER_TYPE_ID_ASC])
              {
                nodes{
                  id
                  racesId
                  raceList
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
            ,totalCount
          }
        }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data;
  }

  static allTracks = async() => {

    let enabled = 'enabledTrack:true';
    let query = `query{
        allTracks(
          condition:{
            deleted:false
            enabled:true
            ${enabled}}        
          filter:
          {
            id : { notIn: ["9101","9102","9100"] }
          } 
          orderBy:TRACK_NAME_ASC
        ){
          nodes{
            id
            trackName
            trackType
            racingAmericanasChannelId
            turfClass
          }
          ,totalCount
        }
      }`

    const response =  await HandlerGraph.sendRequest({
        query
    });

    if (!empty(response.data.errors)){
        throw new Error(response.data.errors[0].message)
    }

    return response.data.data.allTracks.nodes;
    
  }

  static async getAllDataINHValidas({} = {}) {
    let query = `query{
      procRacesInhValidas(pDate:"_today")
      {
        nodes
        {
          racesId
          raceDate
          raceNumber
          racesStatusId
          tracksId
          horsesRacesId
          programNumber
          horseName
          horsesRacesStatusId
        }
      }
    }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data;
  }


  static async getAllDataINHBySellNoInterval({} = {}) {
    let query = `query{
      allTokens(condition:{value:"_tokensId",ticketOfficesId:"_ticketOfficesId"})
      {
        nodes{
          userBySellerId{
            username
          }
          centerByCentersId
          {
            name
          }
          ticketOfficeByTicketOfficesId{
            id
            name
            subdomain
            valueUnits
            valueUnitsInh
            valueUnitsInh56
            currencyCode
            specialKey
          }
        }
      }
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

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data;
  }

  static  sellMarkTicket = async (sellform) => {

    let query = `mutation{
      procSellTicketMarkTicketOffices(
        input:{
          pTokenValue:"_tokensId"
          pWagerTypeId:"22"
          pUnits:${sellform.amount}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellTicketMarkTicketOffices;
    
  }

  static  sellStallTicket = async (sellform) => {

    let query = `mutation{
      procSellTicketStallTicketOffices(
        input:{
          pTokenValue:"_tokensId"
          pWagerTypeId:"24"
          pStallId:"${sellform.stall_id}"
          pUnits:${sellform.amount}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellTicketStallTicketOffices;
    
  }

  static  sellMacuareTicket = async (sellform) => {

    let query = `mutation{
      procSellTicketMacuareTicketOffices(
        input:{
          pTokenValue:"_tokensId"
          pWagerTypeId:"28"
          pUnits:${sellform.amount}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellTicketMacuareTicketOffices;
    
  }

  static getOnlyTracksINH = async() => {

    let query = `query{
        allTracks(
          condition:{
            deleted:false
            enabledTrack:true
            }        
          filter:
          {
            id : { in: ["9101","9102","9100"] }
          } 
          orderBy:TRACK_NAME_ASC
        ){
          nodes{
            id
            trackName
            trackType
            racingAmericanasChannelId
            turfClass
          }
          ,totalCount
        }
      }`

    const response =  await HandlerGraph.sendRequest({
        query
    });

    if (!empty(response.data.errors)){
        throw new Error(response.data.errors[0].message)
    }

    return response.data.data.allTracks.nodes;
    
  }

  static  sellCockTicket = async (sellform) => {

    let query = `mutation{
      procSellTicketMultipleCockIdTicketOffices(
        input:{
          pTokenValue:"_tokensId"
          pWagerTypeId:"27"
          pUnits:${sellform.units}
          pAmount:${sellform.amount}
          pCockId:"${sellform.cockId}"
          pNumberCombinations:"${sellform.combinations}"
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellTicketMultipleCockIdTicketOffices;
    
  }

  static  sellFreeCockTicket = async (sellform) => {

    let query = `mutation{
      procSellTicketFreeCockTicketOffices(
        input:{
          pTokenValue:"_tokensId"
          pWagerTypeId:"27"
          pUnits:0
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${sellform.username}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellTicketFreeCockTicketOffices;
    
  }

  static  sellFixedTabledTicket = async (sellform) => {

    let query = `mutation{
      procSellTicketFixedTablesTicketOffices(
        input:{
          pTokenValue:"_tokensId"
          pWagerTypeId:"21"
          pFixedTablesId:"${sellform.fixed_table_id}"
          pUnits:${sellform.units}
          pAmount:${sellform.amount}
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellTicketFixedTablesTicketOffices;
    
  }

  static allTracksListInh = async() => {
      
    let query = `query{
        allTracks(
          condition:{
            deleted:false
            enabled:true
          }
          filter:
          {
            id : { in: ["9101","9102","9100"] }
          } 
          orderBy:TRACK_NAME_ASC
        ){
          nodes{
            id
            trackName
            trackType
            racingAmericanasChannelId
            turfClass
          }
          ,totalCount
        }
      }`;
  
    const response =  await HandlerGraph.sendRequest({
        query
    });
  
    if (!empty(response.data.errors)){
        throw new Error(response.data.errors[0].message)
    }
  
    return response.data.data.allTracks.nodes;
    
  }

  static allTracksListHsip = async() => {
      
    let query = `query{
        allTracks(
          condition:{
            deleted:false
            enabled:true
          }
          filter:
          {
            id : { in: ["203424","203433"] }
          } 
          orderBy:TRACK_NAME_ASC
        ){
          nodes{
            id
            trackName
            trackType
            racingAmericanasChannelId
            turfClass
          }
          ,totalCount
        }
      }`;
  
    const response =  await HandlerGraph.sendRequest({
        query
    });
  
    if (!empty(response.data.errors)){
        throw new Error(response.data.errors[0].message)
    }
  
    return response.data.data.allTracks.nodes;
    
  }

  static async sellTicketSport({ sellform } = { sellform }) {
    let query = `mutation{
      procSellSportsTicketOffices(
        input:{
          pTokenValue:"_tokensId"
          pAmount:${sellform.amount}
          pEventsDetails: ${JSON.stringify(sellform.eventsId).replace(/"/g,'').replace(/\@/g,'"')}
          pTicketType:"${sellform.ticketType}"
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
          vArrayTicketIdCreated
          vArrayConfirmCreated
          vArrayRiskCreated
        }
        
      }
      
    }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellSportsTicketOffices;
  }

  static async getTicketSportById(id) {
    let query = `query{
      procTicketsSportsTicketOfficesById(pId:"${id}"){
        ticket
        ticketDetails
        status
        currencyName
      }
    }`;

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    let result = {
      nodes: response.data.data.procTicketsSportsTicketOfficesById
    }

    return result;
  }

  static async sellHsipTicket({ sellform } = { sellform }) {
    let query = `mutation{
      procSellTicketHsipTicketOffice(
        input:{
          pTokenValue:"_tokensId"
          pTrackId:"${sellform.trackId}"
          pTrackName:"${sellform.trackName}"
          pRaceDate:"${sellform.raceDate}"
          pWagerTypeId:"${sellform.wagerTypeId}"
          pUnits:${sellform.units}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`;

    //console.log('query::::::::::::',query);

    const response = await HandlerBackend.sendRequest({
      path:'/hsip/selltickethsip',
      method: 'post',
      query
    });

    if (!empty(response.data.messageError)) {
      throw new Error(response.data.messageError);
    }
  
  
    return (!empty(response.data.data.procSellTicketHsipTicketOffice) ? response.data.data.procSellTicketHsipTicketOffice : null);

  }

  static async sellMacuareHsipTicket({ sellform } = { sellform }) {
    let query = `mutation{
      procSellTicketMacuareHsipTicketOffice(
        input:{
          pTokenValue:"_tokensId"
          pUnits:${sellform.units}
          pAmount:0
          pHorsesRacesList: ${JSON.stringify(sellform.horsesRacesId).replace(/"/g,'').replace(/\@/g,'"')}
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`;

    //console.log('query::::::::::::',query);

    const response = await HandlerBackend.sendRequest({
      path:'/hsip/sellticketmacuarehsip',
      method: 'post',
      query
    });

    //console.log('response>>>>>',response);
  
    if (!empty(response.data.messageError)) {
      throw new Error(response.data.messageError);
    }
  
  
    return (!empty(response.data.data.procSellTicketMacuareHsipTicketOffice) ? response.data.data.procSellTicketMacuareHsipTicketOffice : null);

  }

  static  sellCockTicketAnimal = async (sellform) => {

    let query = `mutation{
      procSellAnimalTicketCockTicketOffices(
        input:{
          pTokenValue:"_tokensId"
          pWagerTypeId:"2"
          pUnits:1
          pAmount:${sellform.amount}
          pNumbers: ${JSON.stringify(sellform.numbers).replace(/"/g,'').replace(/\@/g,'"')}
          pLotteryId:"${sellform.lotteryCock}"
          pUserAlias:"${sellform.userAlias}"
          pUsername: "${localStorage.getItem('username')}",
          pIpaddress: "${localIpUrl('public', 'ipv4')}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdCreated
          vMessage
          vEndCode
          vAmountCreated
          vConfirmCreated
        }
        
      }
      
    }`

    const response = await HandlerGraph.sendRequest({
      query
    });

    if (!empty(response.data.errors)) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.procSellAnimalTicketCockTicketOffices;
    
  }

  static async getTicketAnimalById({ id,status } = { id,status }) {
    let cStatus = '';

    if(!empty(status)){
      cStatus = `statusId:"${status}"`;
    }
    let query = `query{
      allTicketsAnimals(condition: { id:"${id}" 
      ${cStatus}
    }){
        nodes{
          id
          created
          confirm
          statusId
          ticketOfficeByTicketOfficesId{
            name
          }
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
  
    return !empty(response.data.data) ? response.data.data : null;
  
    
  }



}

export default SellService;
