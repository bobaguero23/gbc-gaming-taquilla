import HandlerGraph from '../_helpers/HandlerGraphql'
import empty from 'is-empty';
import { LIMIT } from '../_helpers/Pagination'

class TicketStatusService {

    static getOffset({page} = {page}){
        let result = (((empty(page)) || (page == 1)) ? 0 : ( parseInt(page - 1) * parseInt(LIMIT)))
        return result;
    }

    static async getAll({ params }) {

        let offset = 0;
        let orderBy = 'NAME_ASC';
        let limit = (!empty(params) && (!empty(params.limit))) ? ((params.limit == 'all') ? 500 : params.limit) : LIMIT;

        if (!empty(params)) {
            offset = (!empty(params.page) ? TicketStatusService.getOffset({page: params.page}) : offset);
            orderBy = (!empty(params.orderBy) ? params.orderBy : orderBy);
        }

        let query = `
        query
        {
          allTicketsStatuses(first: ${limit})
          {
            nodes
            {
              id
              name
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

        return response.data.data.allTicketsStatuses;

        
    }

    static async getAllAnimals({ params }) {

      let offset = 0;
      let orderBy = 'NAME_ASC';
      let limit = (!empty(params) && (!empty(params.limit))) ? ((params.limit == 'all') ? 500 : params.limit) : LIMIT;

      if (!empty(params)) {
          offset = (!empty(params.page) ? TicketStatusService.getOffset({page: params.page}) : offset);
          orderBy = (!empty(params.orderBy) ? params.orderBy : orderBy);
      }

      let query = `
      query
      {
        allTicketsAnimalsStatuses(first: ${limit})
        {
          nodes
          {
            id
            name
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

      return response.data.data.allTicketsAnimalsStatuses;

      
   }


}

export default TicketStatusService;