import HandlerGraph from '../_helpers/HandlerGraphql'
import empty from 'is-empty';
import { LIMIT } from '../_helpers/Pagination';
import AuthActions from '../_actions/AuthActions'

class TracksService {

    static getOffset({page} = {page}){
        let result = (((empty(page)) || (page == 1)) ? 0 : ( parseInt(page - 1) * parseInt(LIMIT)))
        return result;
    }

    static async getAll({params}) {
        
        let offset = 0;
        let orderBy = 'NAME_ASC';
        let limit = (!empty(params) && (!empty(params.limit))) ? params.limit : 400;

        if (!empty(params)) {
            offset = (!empty(params.page) ? TracksService.getOffset({page: params.page}) : offset);
            orderBy = (!empty(params.orderBy) ? params.orderBy : orderBy);
        }

        let query = `
        query
        {
        allTracks(condition:{
          deleted:false
          enabled:true 
        }
        first: ${limit}
        orderBy: TRACK_NAME_ASC
        )
          {
            nodes
            {
              id
              trackName
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

        return response.data.data.allTracks;

        
    }

  static async getAllInh({ params }) {

      let offset = 0;
      let orderBy = 'NAME_ASC';
      let limit = (!empty(params) && (!empty(params.limit))) ? ((params.limit == 'all') ? 500 : params.limit) : LIMIT;

      if (!empty(params)) {
          offset = (!empty(params.page) ? TracksService.getOffset({page: params.page}) : offset);
          orderBy = (!empty(params.orderBy) ? params.orderBy : orderBy);
          //limit = ( params.limit == 'all') ? null : limit; 
      }

      let query = `
      query{
      allTracks(condition:{
        deleted:false
        enabled:true 
      }
      filter : {
        id: {in:["9101","9102","9100"]}
      }
      orderBy: TRACK_NAME_ASC
      first: 50
      )
        {
          nodes
          {
            id
            trackName
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

      return response.data.data.allTracks;

      
  }


}

export default TracksService;