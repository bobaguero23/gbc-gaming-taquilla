import React from "react";
import { connect } from "redux-zero/react";
import gql from "graphql-tag";
import { Subscription } from "react-apollo";
import { SellNacionalElInmejorablePage } from "./SellNacionalElInmejorablePage";
import actions from "../_actions";
import empty from "is-empty";
import AuthActions from "../_actions/AuthActions";
import Loading from "../_components/Loading";
import { history } from '../_helpers/history';
import PrintProvider, { NoPrint } from 'react-easy-print';
import { clearLocalStorage, isOnly5y6,isSaleNacionalElInmejorable } from "../_helpers/lib";
import { isGbcGaming } from "../_helpers/product";

class SellNacionalElInmejorablePageRT extends React.Component {
    getTracks = ({centers_id,currency_code, trackSelected} = {centers_id,currency_code,trackSelected}) =>{
        
        
        let enabled = 'enabledTrack: {equalTo:true}';
        let trackId = (!empty(trackSelected) && trackSelected > 0 ? `id : { in: ["${trackSelected}"] }` : 'id : { in: ["9101","9102","9100"] }' );
        let query = '';

      //console.log('TRACK SELECTED:::::::::::',trackSelected);
      
      /*
      if(empty(trackSelected) || trackSelected==0){

      query = gql`
        subscription {
          allTracks(
            filter:{
              id : { in: ["9101","9102","9100"] }
              deleted: {equalTo:false }
              enabled: {equalTo:true}
              ${enabled}     
            } 
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


      return query;
      }
      */

     query = gql`
        subscription {
        allTracks(
        filter:{
          deleted: {equalTo:false }
          enabled: {equalTo:true}
          ${enabled}     
          ${trackId}
        } 
      ){
        nodes{
          id
          trackName
          trackType
          racingAmericanasChannelId
          turfClass
          macuaresByTracksId(filter:{
            raceToday:{equalTo:"_today"}  
            centersId:{equalTo:"${centers_id}"}
            status:{in: [1]}
          }
          
          ){
            nodes{
              id
              macuareName
              multiplier
            }
          }
          cocksByTracksId(filter:{
            raceToday:{equalTo:"_today"}  
            centersId:{equalTo:"${centers_id}"}
            status:{in: [1]}
          }
          
          ){
            nodes{
              id
              amount
              totalToPay
              accumulated
              secondPlace
            }
          }
          racesByTracksId(
            filter:{raceToday:{greaterThanOrEqualTo:"_today"} 
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
              stallsByRacesId(condition:{centersId:"${centers_id}" status:1
          }) {
            nodes {
              id
              totalToPay
              stallsDetailsByStallsId (orderBy:HORSES_RACES_ID_ASC) {
                nodes {
                  stallsId
                  horsesRacesId
                  stallsTypeByStallsTypesId{
                    stallName
                  }
                }
                }
              }
            }
              marksByRacesId(condition:{centersId:"${centers_id}" status:1
                }) {
                  nodes {
                    totalToPay
                    marksDetailsByMarksId(orderBy:POSITION_ASC) {
                      nodes {
                        position
                        marksStatusId
                        horsesRacesId
                      }
                    }
                  }
                }
              auctionsByRacesId(
                filter:{
                  centersId:{equalTo:"${centers_id}"}
                  currencyCode:{equalTo:"${currency_code}"}
                  status:{equalTo:1}
                }
              ) {
              nodes {
                id
                totalToPay
                currencyCode
                valueIncrement
                accumulated
                auctionDetailsByAuctionId(orderBy:[HORSES_RACES_ID_ASC]){
                  nodes {
                    auctionId
                    customer
                    customerAlias
                    offered
                    status
                    horsesRacesId
                  }
                }
              }
            }
            fixedTablesByRacesId(
                filter:{
                  centersId:{equalTo:"${centers_id}"}
                  currencyCode:{equalTo:"USD"}
                  status:{equalTo:1}
                }
              ){
                nodes{
                  id
                  totalToPay
                  currencyCode
                  fixedTablesDetailsByFixedTableId(orderBy:[HORSES_RACES_ID_ASC]){
                    nodes{
                      id
                      fixedTableValue
                      fixedTableLimit
                      horsesRacesId
                    }
                  }
                }
              }
              resultsInhsByRacesId(orderBy:[POSITION_ASC]){
                nodes{
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
                    description
                  }
                }
              }
              horsesRacesByRacesId(
                filter:{deleted:{equalTo:false}
                raceToday:{greaterThanOrEqualTo:"_today"}
              
                }
                orderBy:[ID_ASC]
                )
              {
                nodes{
                  id
                  horsesId
                  programNumber
                  statusId
                  odd
                  jockey
                  trainer
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
            orderBy:[WAGER_TYPE_ID_ASC])
          {
            nodes{
              id
              racesId
              raceList
              minimumWagerAmount
              raceByRacesId{
                id
                statusId
              }
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

    return query;
  };

  constructor(props) {
        
    super(props);
    this.state = {
        trackSelected : 0
    };

  }

  updateTracksId = (trackId) => {

    this.setState({
      trackSelected : trackId
    });

    //console.log('updateTracksId::::::::::',trackId);
  
  }

  componentDidMount(){
    this.props.AuthActions({action: 'me', params : {}});
  }

  componentWillMount() {
    let userData = AuthActions.meData();
    let ticket_offices_id =  (!empty(userData)) ? userData.ticket_offices_id : '';
    let centers_id =  (!empty(userData)) ? userData.centers_id : '';
    let currency_code =  (!empty(userData)) ? userData.currency_code : '';
    if (isGbcGaming()) {
      return;
    }

    // TAQUILLAS SOLO 5 y 6
    if(isOnly5y6(ticket_offices_id)){
      history.push('/5y6');
    }    
    
    if(parseInt(centers_id) === 177
      && currency_code =='VES'){
        history.push('/nacional-elinmejorable');
    }

    if(parseInt(centers_id) === 177
      && currency_code =='COP'){
        history.push('/nacional-elinmejorable');
    }

    if(parseInt(centers_id) === 177
      && currency_code =='USD'){
        history.push('/nacional-dolares');
    }
    
    // TAQUILLAS NACIONALES
    if(currency_code =='VES' 
      && parseInt(centers_id) !== 177){
      history.push('/nacional');
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
            <Subscription subscription={this.getTracks({centers_id,ticket_offices_id,currency_code,trackSelected})}>
            {({ data, loading }) =>
              !loading ? (
                !empty(data) &&
                !empty(data.allTracks) &&
                !empty(data.allTracks.nodes) ? (
                  <SellNacionalElInmejorablePage tracks={data.allTracks.nodes} {...this.props} updateTracksId={this.updateTracksId} trackSelected={trackSelected} currencyCode ={currency_code}/>
                ) : isGbcGaming() ? (
                  <SellNacionalElInmejorablePage tracks={[]} {...this.props} updateTracksId={this.updateTracksId} trackSelected={trackSelected} currencyCode ={currency_code}/>
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

const connectedSellNacionalPageRT = connect(mapToProps, actions)(SellNacionalElInmejorablePageRT);
export { connectedSellNacionalPageRT as SellNacionalElInmejorablePageRT };
