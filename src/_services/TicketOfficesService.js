import HandlerGraph from '../_helpers/HandlerGraphql'
import empty from 'is-empty';

class TicketOfficesService {


    static async me({params} = {params}) {

        let query = `
        query 
        {
            allTicketOffices(
            condition: {id: "_ticketOfficesId"}
            ) {
                nodes {
                    id
                    name
                    valueUnits
                    valueUnitsInh
                    currencyCode
                  	centerByCentersId
                    {
                      id
                      name
                      centersCurrencyConfigurationsByCentersId(condition:{currencyCode:"USD"}){
                        nodes{
                          cockAccumulated
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

        return response.data.data.allTicketOffices;

        
    }

    static async currentTimestamp({params} = {params}) {

        let query = `
        query{
            currentTimestamp
        }`;

        const response =  await HandlerGraph.sendRequest({
            query
        });

        if (!empty(response.data.errors)){
            throw new Error(response.data.errors[0].message)
        }

        return response.data.data.currentTimestamp;

        
    }

    static async getAllTicketOfficesMovements({ params }) {
        const LIMIT_NEW = 1000;
        let offset = 0;
        let orderBy = 'CREATED_AT_DESC';
        let limit = LIMIT_NEW;

        if (!empty(params)) {
            offset = (!empty(params.page) ? TicketOfficesService.getOffset({page: params.page}) : offset);
            orderBy = (!empty(params.orderBy) ? params.orderBy : orderBy);
        }

        let query = `query{
        allTicketOfficesMovements(first: ${limit}, offset: ${offset}, orderBy: ${orderBy}
        condition:{tokensId:"${params.id}"}
        ) {
            nodes {
            amount
            balance
            centerByCentersId {
                name
            }
            createdAt
            description
            credit
            debit
            reference
            typeMovement
            tokensId
            ticketOfficeByTicketOfficesId {
                id
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

        return response.data.data.allTicketOfficesMovements;

        
      }


}

export default TicketOfficesService;