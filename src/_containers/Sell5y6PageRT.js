import React from "react";
import { connect } from "redux-zero/react";
import gql from "graphql-tag";
import { Subscription } from "react-apollo";
import { Sell5y6Page } from "./Sell5y6Page";
import actions from "../_actions";
import empty from "is-empty";
import AuthActions from "../_actions/AuthActions";
import Loading from "../_components/Loading";
import { history } from '../_helpers/history';
import PrintProvider, { NoPrint } from 'react-easy-print';
import { clearLocalStorage } from "../_helpers/lib";

class Sell5y6PageRT extends React.Component {
  getTracks = () =>{

    const {user} = this.props;
    let demoTrack = '999999999';
    // if(!empty(user) && (user.email == 'demo@')){
    //   demoTrack = 999999999;
    // }

    const queryString = `
    subscription {
    allTracks(
    filter:{
      deleted: {equalTo:false }
      enabled: {equalTo:true}
      enabledTrack: {equalTo:true}    
      id : { in: ["9101","9102","9100","${demoTrack}"] }
    } 
  ){
    nodes{
      id
      trackName
      trackType
      racingAmericanasChannelId
      turfClass
      racesByTracksId(
        filter:{
          raceToday:{
            greaterThanOrEqualTo:"_today"
          } 
          deleted:{equalTo:false} }
          orderBy:[RACE_DATE_ASC]
        )
      {
        nodes{
          id
          statusId
          raceNumber
          raceDate
          raceDateDefault
          resultsByRacesId{
            nodes{
              win
              place
              show
              position
              horsesRaceByHorsesRacesId{
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
          resultsExoticsByRacesId{
            nodes{
              winningNumber
              wagerTypeByWagerTypeId{
                name
              }
              payoffAmount
              baseAmount
            }
          }

          resultsInhsByRacesId(orderBy:[POSITION_ASC]){
            nodes{
              id
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
          
          resultsExoticsInhsByRacesId{
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
          
          horsesRacesByRacesId(
            filter:{deleted:{equalTo:false}
            raceToday:{greaterThanOrEqualTo:"_today"}}
            orderBy:[PROGRAM_NUMBER_STRIPPED_ASC]
            )
          {
            nodes{
              id
              horsesId
              programNumber
              statusId
              racesId
              horseByHorsesId
              {
                id
                horseName
              }
              
            }
          }
        }
      }
      racesPoolsByTracksId(
      filter: {
            deleted:{equalTo:false}
            raceDate:{greaterThanOrEqualTo:"_today"}
            wagerTypeId: { in: ["10", "11", "12","14","27","29"] }
            }
      orderBy:[WAGER_TYPE_ID_ASC]){
        nodes{
          id
          racesId
          raceList
          minimumWagerAmount
          raceByRacesId{
            id
            statusId
          }
          wagerTypeId
          wagerTypeByWagerTypeId
          {
            id
            name
            description
          }
        }
      }
    }
    ,totalCount
  }
  }`;
    const query = gql`${queryString}`;
    return query;
  };

  constructor(props) {
        
    super(props);
    this.state = {
        trackSelected : 0
    };

  }

  componentDidMount(){
    this.props.AuthActions({action: 'me', params : {}});
    let {user} = this.props;
    let currency_code = user.currency_code;
    let centers_id =  (!empty(userData)) ? userData.centers_id : '';

    if(currency_code!='USD'){
      history.push('/');
    }

    if(centers_id === '177'
      && currency_code =='VES'){
        history.push('/nacional-elinmejorable');
    }

    if(centers_id === '177'
      && currency_code =='USD'){
        history.push('/nacional-dolares');
    }
  }

    render(){
      let {user} = this.props;
      let currency_code = user.currency_code;
      let centers_id = user.centers_id;
      let ticket_offices_id = user.ticket_offices_id;
      let trackSelected = this.state.trackSelected;


        return(
          <>
          <PrintProvider>
            <NoPrint>
            <Subscription subscription={this.getTracks()}>
            {({ data, loading }) =>
              !loading ? (
                !empty(data) &&
                !empty(data.allTracks) &&
                !empty(data.allTracks.nodes) ? (
                  <Sell5y6Page tracks={data.allTracks.nodes} {...this.props} currencyCode ={currency_code} />
                ) : (
                  <div className="messageError">
                    <p>Ya existe una sesión activa, si desea utilizar esta pantalla refresca la misma</p>
                    <p>{clearLocalStorage()}</p>
                  </div>
                )
              ) : (
                <Loading loading={1} />
              )
              }
            </Subscription>
            </NoPrint>
        </PrintProvider>
        </>
        );
  }
}

const mapToProps = ({ account, ticketoffice, ticketInfo, tickets, user }) => ({
  account,
  ticketoffice,
  ticketInfo,
  tickets,
  user,
});

const connectedSellPageRT = connect(mapToProps, actions)(Sell5y6PageRT);
export { connectedSellPageRT as Sell5y6PageRT };
