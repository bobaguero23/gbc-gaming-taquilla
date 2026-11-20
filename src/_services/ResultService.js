import HandlerGraph from "../_helpers/HandlerGraphql";
import empty from "is-empty";

const localIpUrl = require("local-ip-url");
const { detect } = require("detect-browser");
const browser = detect();

class ResultService {
  static async getAll({} = {}) {
    let query = `query{
      allTracks(condition:{deleted:false})
      {
        nodes
        {
          id
          trackName
          racesByTracksId(condition:{raceToday:"_today"}
          orderBy:[RACE_NUMBER_ASC])
          {
            nodes{
              raceNumber
              resultsByRacesId(orderBy:[POSITION_ASC]){
                nodes
                {
                  id
                  position
                  win
                  place
                  show
                  horsesRaceByHorsesRacesId{
                    programNumber
                    horseByHorsesId
                    {
                      horseName
                    }
                  }
                }
              }
              resultsExoticsByRacesId{
                nodes{
                  id
                  winningNumber
                  payoffAmount
                  baseAmount
                  wagerTypeByWagerTypeId
                  {
                    name
                  }
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

    return response.data.data;
  }
}

export default ResultService;
