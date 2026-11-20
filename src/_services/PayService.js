import HandlerGraph from "../_helpers/HandlerGraphql";
import empty from "is-empty";

const localIpUrl = require("local-ip-url");
const { detect } = require("detect-browser");
const browser = detect();

class PayService {
  static async payTicket({ confirm } = { confirm }) {
    let query = `mutation{
      procPayTicketGraph(
        input:{
          pConfirm:"${confirm}"
          pNumber:"0"
          pUsersId:"_userId"
          pTokenValue:"_tokensId"
          pUsername: "${localStorage.getItem("username")}",
          pIpaddress: "${localIpUrl("public", "ipv4")}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdPaid
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

    return response.data.data.procPayTicketGraph;
  }

  static async payTicketCock({ confirm } = { confirm }) {
    let query = `mutation{
      procPayTicketCock(
        input:{
          pConfirm:"${confirm}"
          pNumber:"0"
          pUsersId:"_userId"
          pTokenValue:"_tokensId"
          pUsername: "${localStorage.getItem("username")}",
          pIpaddress: "${localIpUrl("public", "ipv4")}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdPaid
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

    return response.data.data.procPayTicketCock;
  }

  static async payTicketInh({ confirm } = { confirm }) {
    let query = `mutation{
      procPayTicketInh(
        input:{
          pConfirm:"${confirm}"
          pUsersId:"_userId"
          pTokenValue:"_tokensId"
          pUsername: "${localStorage.getItem("username")}",
          pIpaddress: "${localIpUrl("public", "ipv4")}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdPaid
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

    return response.data.data.procPayTicketInh;
  }

  static async getTicketById({ id } = { id }) {
    let query = `query{
      allTickets(condition:{id:"${id}",ticketOfficesId:"_ticketOfficesId"})
      {
        nodes{
          created
          confirm
          totalToPay
          ticketOfficeByTicketOfficesId{
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

  static async payTicketSport({ confirm } = { confirm }) {
    let query = `mutation{
      procPayTicketSportTicketOffices(
        input:{
          pConfirm:"${confirm}"
          pNumber:"0"
          pUsersId:"_userId"
          pTokenValue:"_tokensId"
          pUsername: "${localStorage.getItem("username")}",
          pIpaddress: "${localIpUrl("public", "ipv4")}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
          vTicketIdPaid
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

    return response.data.data.procPayTicketSportTicketOffices;
  }

  static async getTicketSportById({ id } = { id }) {
    let query = `query{
      allTicketsSports(condition:{id:"${id}",ticketOfficesId:"_ticketOfficesId"})
      {
        nodes{
          created
          confirm
          totalToPay
          ticketOfficeByTicketOfficesId{
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


  static async getTicketByIdInh({ id } = { id }) {
    let query = `query{
      allTicketsInhs(condition:{id:"${id}"
        })
      {
        nodes{
          createdAt
          confirm
          ticketTotalToPay
          ticketOfficeByTicketOfficeId{
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
}

export default PayService;
