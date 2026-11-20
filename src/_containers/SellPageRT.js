import React from "react";
import { connect } from "redux-zero/react";
import gql from "graphql-tag";
import { Subscription } from "react-apollo";
import { SellPage } from "./SellPage";
import actions from "../_actions";
import empty from "is-empty";
import AuthActions from "../_actions/AuthActions";
import Loading from "../_components/Loading";
import { history } from '../_helpers/history';
import PrintProvider, { NoPrint } from 'react-easy-print';
import { clearLocalStorage, isOnly5y6 } from "../_helpers/lib";

class SellPageRT extends React.Component {
    getTracks = ({centers_id,currency_code, trackSelected} = {centers_id,currency_code,trackSelected}) =>{
        
      if(centers_id==166){
        centers_id=135;
      }
      
        let enabled = 'enabledTrack: {equalTo:true}';
        let trackId = (!empty(trackSelected) ? `id : { in: ["${trackSelected}"] }` : null );
        let query = '';
      
      if(empty(trackSelected) || trackSelected==0){

      query = gql`
        subscription {
          allTracks(
            filter:{
              id : { notIn: ["9101","9102","9100"] }
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
          ticketOfficesFreeCocksByTracksId(filter:{
            raceToday:{equalTo:"_today"}  
            centersId:{equalTo:"${centers_id}"}
            status:{in: [1]}
          }
          
          ){
            nodes{
              id
              firstPlace
              secondPlace
              thirdPlace
              description
            }
          }
          racesByTracksId(
            filter:{raceToday:{equalTo:"_today"} 
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
              resultsByRacesId(orderBy:[POSITION_ASC]){
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
              horsesRacesByRacesId(
                filter:{deleted:{equalTo:false}
                raceToday:{equalTo:"_today"}}
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
                raceDate:{equalTo:"_today"}
              wagerTypeId: { in: ["10", "11", "12","13","14","27","28"] }
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
  
  }

  componentDidMount(){
    this.props.AuthActions({action: 'me', params : {}});
  }

  componentWillMount() {
    let userData = AuthActions.meData();
    let centers_id =  (!empty(userData)) ? userData.centers_id : '';
    let ticket_offices_id =  (!empty(userData)) ? userData.ticket_offices_id : '';
    let currency_code =  (!empty(userData)) ? userData.currency_code : '';
    //console.log(centers_id);
    // TAQUILLAS SOLO 5 y 6
    if(isOnly5y6(ticket_offices_id)){
      history.push('/5y6');
    }    

    // TAQUILLAS NACIONALES
    if(currency_code =='VES' && parseInt(centers_id)!==177){
      history.push('/nacional');
    }

    if(parseInt(centers_id) === 177
      && currency_code ==='VES'){
        history.push('/nacional-elinmejorable');
    }
    
    if(parseInt(centers_id) === 177
      && currency_code ==='USD'){
        history.push('/nacional-dolares');
    }

     // TAQUILLAS NACIONALES
     if(currency_code =='ARS'){
      history.push('/horses-argentinos');
    }
    
    if(centers_id == '164'){
      history.push('/horses-hipicawin');
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
                  <SellPage tracks={data.allTracks.nodes} {...this.props} updateTracksId={this.updateTracksId} trackSelected={trackSelected} currencyCode ={currency_code}/>
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

const connectedSellPageRT = connect(mapToProps, actions)(SellPageRT);
export { connectedSellPageRT as SellPageRT };
