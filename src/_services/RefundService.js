import HandlerGraph from "../_helpers/HandlerGraphql";
import empty from "is-empty";

const localIpUrl = require("local-ip-url");
const { detect } = require("detect-browser");
const browser = detect();

class RefundService {
  static async refundTicket({ confirm } = { confirm }) {
    let query = `mutation{
      procRefundTicket(
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

    return response.data.data.procRefundTicket;
  }

  static async refundTicketElInmejorableInh({ confirm } = { confirm }) {
    let query = `mutation{
      procRefundTicketofficeInh(
        input:{
          pConfirm:"${confirm}"
          pTokenValue:"_tokensId"
          pUsername: "${localStorage.getItem("username")}",
          pIpaddress: "${localIpUrl("public", "ipv4")}",
          pUseragent: "${browser.name}"
        }
      )
      {
        result{
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

    return response.data.data.procRefundTicketofficeInh;
  }
}

export default RefundService;
