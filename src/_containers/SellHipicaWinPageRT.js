import React from "react";
import { connect } from "redux-zero/react";
import { SellHipicaWinPage } from "./SellHipicaWinPage";
import actions from "../_actions";
import empty from "is-empty";
import AuthActions from "../_actions/AuthActions";
import Loading from "../_components/Loading";
import { history } from '../_helpers/history';
import PrintProvider, { NoPrint } from 'react-easy-print';
import { isOnly5y6 } from "../_helpers/lib";

class SellHipicaWinPageRT extends React.Component {

  constructor(props) {
        
    super(props);
    this.state = {
        trackSelected : 0
    };

  }

  shouldComponentUpdate(nextProps, nextState) {

    
    if (this.state.trackSelected == nextState.trackSelected 
        && this.props.tracksrt == nextProps.tracksrt
        && this.props.user == nextProps.user
        && this.props.account == nextProps.account
        && this.props.ticketInfo == nextProps.ticketInfo
        && this.props.payInfo == nextProps.payInfo) {
      return false;
    }   

    if (this.state.trackSelected != nextState.trackSelected 
        && !empty(nextState.trackSelected)) {
      let that = this;
      let channelName = `races:enabled_betsamerica:${nextState.trackSelected}`
      //console.log("channelName::", channelName)

      that.props.SellActions({ action: "setTracksRtEmpty", params: null });

      that.props.socketRaces.on(channelName, function (data) {
          
          let params = {};
          let trackChannel = channelName.split(':');
          //console.log("data:::",that.state.trackSelected, trackChannel, channelName,  JSON.stringify(data))

          if(trackChannel[2] != that.state.trackSelected){
            return null;
          }

          if(!empty(data)){
            params = {
              params: {
                tracks: data
              }
            }
          } 

          that.props.SellActions({ action: "setTracksRt", params: params });
      });
      
      that.props.socketRaces.on("disconnect", function (data) {
          console.log("data:::", JSON.stringify(data))
      });
      
      that.props.socketRaces.emit('races:join', channelName);
    }


    return true;
   }

  

  updateTracksId = (trackId) => {

    this.setState({
      trackSelected : trackId
    }, () => {
      localStorage.removeItem('tabActiveKey');
    });
    
  }

  componentDidMount(){
    this.props.AuthActions({action: 'me', params : {}});
  }

  componentWillMount() {
    let userData = AuthActions.meData();
    let ticket_offices_id =  (!empty(userData)) ? userData.ticket_offices_id : '';
    let currency_code =  (!empty(userData)) ? userData.currency_code : '';
    // TAQUILLAS SOLO 5 y 6
    if(isOnly5y6(ticket_offices_id)){
      history.push('/5y6');
    }    

    // TAQUILLAS NACIONALES
    if(currency_code =='VES'){
      history.push('/nacional');
    }

  }

    render(){
      let {tracksrt,user} = this.props;
      let trackSelected = this.state.trackSelected;
      const { loading } = this.state;
      let currency_code = user.currency_code;

      
        return(
          <>
          <PrintProvider>
            <NoPrint>
            {  !loading ? 
                <SellHipicaWinPage tracks={!empty(tracksrt) && !empty(tracksrt.data) && !empty(tracksrt.data.allTracks) ? tracksrt.data.allTracks.nodes :[]} {...this.props} updateTracksId={this.updateTracksId} trackSelected={trackSelected} currencyCode={currency_code} />
              
              : (
              <Loading loading={1} />
            )
          }
            </NoPrint>
        </PrintProvider>
        </>
        );
  }
}

const mapToProps = ({ account, ticketoffice, ticketInfo, tickets, user,tracksrt }) => ({
  account,
  ticketoffice,
  ticketInfo,
  tickets,
  user,
  tracksrt
});

const connectedSellPageRT = connect(mapToProps, actions)(SellHipicaWinPageRT);
export { connectedSellPageRT as SellHipicaWinPageRT };
