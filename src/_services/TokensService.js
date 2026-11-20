import HandlerGraph from '../_helpers/HandlerGraphql';
import HandlerBackend from "../_helpers/HandlerBackend";
import empty from 'is-empty';
import { LIMIT, LIMIT_NEW } from '../_helpers/Pagination';
const localIpUrl = require('local-ip-url');
const { detect } = require('detect-browser');
const browser = detect();
import moment from "moment";

class TokensService {

    static getOffset({page} = {page}){
        let result = (((empty(page)) || (page == 1)) ? 0 : ( parseInt(page - 1) * parseInt(LIMIT)))
        return result;
    }

    static async getTokenBalance({ params }) {

        let offset = 0;
        let orderBy = 'NAME_ASC';
        let limit = 5000;

        if (!empty(params)) {
            offset = (!empty(params.page) ? TokensService.getOffset({page: params.page}) : offset);
            orderBy = (!empty(params.orderBy) ? params.orderBy : orderBy);
        }

        let query = `query {
    allVTokensDetails(
    first:1
      condition:{tokensId:"${params.id}"}
    )
    {
      nodes{
        balance
      }
    }
  }`;

        const response =  await HandlerGraph.sendRequest({
            query
        });

        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data.allVTokensDetails.nodes[0].balance || 0;

        
    }

    static async getTokenInfo({params}) {

    let query = `query {
    allVTokensDetailsV2S(
       first:1
       condition:{tokensId:"${params.id}"}
    )
    {
      nodes{
        funds
        deposit
        soldWin
        paidWin
        refundWin
        balanceWin
        soldFixed
        paidFixed
        refundFixed
        balanceFixed
        soldStall
        paidStall
        refundStall
        balanceStall
        withdrawal
        payable
        closemoney
        balance
        ticketOffices
        tokenValue
      }
    }
  }`;

        const response =  await HandlerGraph.sendRequest({
            query
        });

        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data.allVTokensDetailsV2S;

        
    }

    static async getAll({params}) {
        let offset = 0;
        let orderBy = "CREATED_DESC";
        let limit = (!empty(params) && (!empty(params.limit))) ? ((params.limit == 'all') ? 500 : params.limit) : LIMIT;
        let ticketOffice = `ticketOfficesId: "_ticketOfficesId"`;
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

        let filter = '';
        if (
            !empty(date)
        ) {
            filter = `filter:{
            ${date}
          }`;
        }
        
      let query = `query {
      allTokens(offset: ${offset}
            first: ${limit}
            orderBy: ${orderBy}
            condition:{
              ${ticketOffice}
            }
            ${filter}){
        nodes{
            id
            value 
            created
            tokensStatusByTokensStatusId{
              id
              description
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
  
          return response.data.data.allTokens;
  
          
      }

    

}

export default TokensService;