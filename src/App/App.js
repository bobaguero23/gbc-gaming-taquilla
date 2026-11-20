import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'redux-zero/react';
import PrintProvider, { NoPrint } from 'react-easy-print';
import {
  faBell,
  faFilePdf,
  faFileAlt,
  faArrowCircleRight,
  faArrowCircleLeft,
  faPlayCircle,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { ToastContainer } from 'react-toastify';
// history is now used in index.js
import { PrivateRoute } from '../_components/PrivateRoute';
import { PrivateSportsRoute } from '../_components/PrivateSportsRoute';
import { SellPageRT } from '../_containers/SellPageRT';
import { SellArgentinoPageRT } from '../_containers/SellArgentinoPageRT';
import { SellHipicaWinPageRT } from '../_containers/SellHipicaWinPageRT';
import { Sell5y6PageRT } from '../_containers/Sell5y6PageRT';
import { SellNacionalPageRT } from '../_containers/SellNacionalPageRT';
import { SellNacionalDolaresPageRT } from '../_containers/SellNacionalDolaresPageRT';
import { SellNacionalElInmejorablePageRT } from '../_containers/SellNacionalElInmejorablePageRT';
import { LotteryCockPollaElArcaPage } from '../_containers/LotteryCockPollaElArcaPage';
import { CocksPage } from '../_containers/CocksPage';
import { SportPageRT } from '../_containers/SportPageRT';
import { TicketsPage } from '../_containers/TicketsPage';
import { LoginPage } from '../_containers/LoginPage';
import { TokensPage } from '../_containers/TokensPage';

import actions from '../_actions';
import { isGbcGaming } from '../_helpers/product';

import Loading from '../_components/Loading';
import Footer from '../_components/Footer';
import UpdateNotifier from '../_components/UpdateNotifier';

// TOAST
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

// Font
import '../_fonts/OpenSans-Regular.ttf';

// Styles
import './App.css';
import './TicketToPrint.css';
import '../_themes/form-sport.css';

import '../_assets/css/app-animals-cocks.css';
import { Sell5y6NacionalPageRT } from '../_containers/Sell5y6PageNacionalRT';

library.add(
  faBell,
  faFilePdf,
  faFileAlt,
  faArrowCircleRight,
  faArrowCircleLeft,
  faPlayCircle,
  faLock,
);
class App extends React.Component {
  componentDidMount() {
    // In the new multi-BrowserView approach, SELECTED_HOST is set by electron.js
    // for each partition. No need to redirect to /setup.
  }

  render() {
    const { loading } = this.props;
    return (
      <PrintProvider>
        <NoPrint>
          <div className="container dashboard">
            <UpdateNotifier />
            <ToastContainer />
            <Loading loading={loading} />
            {isGbcGaming() ? (
              <React.Fragment>
                <PrivateRoute exact path="/" component={SellNacionalElInmejorablePageRT} />
                <PrivateRoute exact path="/nacional-elinmejorable" component={SellNacionalElInmejorablePageRT} />
                <PrivateRoute exact path="/tickets-inh" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-inh/page/:page" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-wager-types-inh" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-wager-types-inh/page/:page" component={TicketsPage} />
                <PrivateRoute exact path="/tokens" component={TokensPage} />
                <PrivateRoute exact path="/tokens/page/:page" component={TokensPage} />
                <PrivateRoute exact path="/tokens/details/:id" component={TokensPage} />
                <PrivateRoute exact path="/tokens/ticketsoffices-movements/:id" component={TokensPage} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <PrivateSportsRoute exact path="/" component={SellNacionalElInmejorablePageRT} />
                <PrivateRoute exact path="/horses" component={SellPageRT} />
                <PrivateRoute exact path="/horses-hipicawin" component={SellHipicaWinPageRT} />
                <PrivateRoute exact path="/horses-argentinos" component={SellArgentinoPageRT} />
                <PrivateRoute exact path="/5y6" component={Sell5y6NacionalPageRT} />
                <PrivateRoute exact path="/nacional" component={SellNacionalPageRT} />
                <PrivateRoute exact path="/nacional-dolares" component={SellNacionalDolaresPageRT} />
                <PrivateRoute exact path="/nacional-elinmejorable" component={SellNacionalElInmejorablePageRT} />
                <PrivateRoute exact path="/tickets-inh" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-inh/page/:page" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-stalls" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-stalls/page/:page" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-wager-types-inh" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-wager-types-inh/page/:page" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-summary-stalls" component={TicketsPage} />
                <PrivateRoute exact path="/tickets-summary-stalls/page/:page" component={TicketsPage} />
                <PrivateSportsRoute exact path="/sports" component={SportPageRT} />
                <PrivateRoute exact path="/lotteries-cocks" component={LotteryCockPollaElArcaPage} />
                <PrivateRoute exact path="/cocks" component={CocksPage} />
                <PrivateRoute exact path="/tokens" component={TokensPage} />
                <PrivateRoute exact path="/tokens/page/:page" component={TokensPage} />
                <PrivateRoute exact path="/tokens/details/:id" component={TokensPage} />
                <PrivateRoute exact path="/tokens/ticketsoffices-movements/:id" component={TokensPage} />
              </React.Fragment>
            )}
            <Route path="/setup" component={require('../_containers/SetupPage').default} />
            <Route path="/login" component={LoginPage} />
            <Footer />
          </div>
        </NoPrint>
      </PrintProvider>
    );
  }
}

const mapToProps = ({ user, loading }) => ({ user, loading });
const connectedApp = connect(mapToProps, actions)(withRouter(App));
export default connectedApp;
