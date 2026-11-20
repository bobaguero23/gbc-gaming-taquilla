import React from "react";
import { connect } from "redux-zero/react";
import { Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavDropdown,Badge } from "react-bootstrap";
import ResultsDialog from "../_components/ResultsDialog";
import actions from "../_actions";
import empty from 'is-empty'
import {getAppConfig, isOnly5y6} from "../_helpers/lib";
import { isGbcGaming } from "../_helpers/product";

class NavHeaderNacional extends React.Component {
  constructor() {
    super();
  }

  componentDidMount(){
    this.props.AuthActions({action: 'me', params : {}});
  }


  handleLogout = () => {
    this.props.AuthActions({action: 'logout', params : {}});
  };

  render() {
    const appConfig = getAppConfig();
    let {user, balance, ticketoffice} = this.props;
    
    let amountSold = 0;
    let amountPaid = 0;
    let amountBalance = 0;
    let amountRefund = 0;
    let currencyCode = 'USD';
    let ticket_office_id = 0;
    let center_id = 0;
    if(!empty(balance)){
        
        amountSold = balance[0].sold;
        amountPaid = balance[0].paid;
        amountRefund = balance[0].refund;
        amountBalance = balance[0].balance;
    }

    if(!empty(ticketoffice)){
      currencyCode = ticketoffice[0].currencyCode;
      ticket_office_id = ticketoffice[0].id;
      center_id = ticketoffice[0].centerByCentersId.id;
    }

    

    return (
      <Navbar className="bg-light justify-content-between">
        <LinkContainer to="/">
          <Navbar.Brand>
            {appConfig.logo ? (
              <Image src={appConfig.logo} width="160px" height="auto" id="image-logo" />
            ) : (
              <span style={{fontWeight:'bold',fontSize:'14px'}}>{appConfig.appName}</span>
            )}
          </Navbar.Brand>
          
        </LinkContainer>
          <div>Balance de la taquilla: Monto Vendido: <Badge variant={'success'}>{new Intl.NumberFormat("de-DE", {style: "currency", currency: (currencyCode) }).format(amountSold)}</Badge> Monto Retirado: <Badge variant={'danger'}>{new Intl.NumberFormat("de-DE", {style: "currency", currency: (currencyCode) }).format(amountRefund)}</Badge> Monto Pagado: <Badge variant={'danger'}>{new Intl.NumberFormat("de-DE", {style: "currency", currency: (currencyCode) }).format(amountPaid)}</Badge> Balance: <Badge variant={((amountBalance >=0) ? 'success' : 'danger')}>{new Intl.NumberFormat("de-DE", {style: "currency", currency: (currencyCode) }).format(amountBalance)}</Badge></div>
        <Nav>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/">
                <Nav.Link>Vender Tickets</Nav.Link>
              </LinkContainer>
              {!empty(currencyCode) && currencyCode ==='VES' ?
              <NavDropdown title="Tickets vendidos" id="basic-nav-dropdown">
              <NavDropdown.Item><LinkContainer to="/tickets-inh">
                <Nav.Link>Tickets INH</Nav.Link>
              </LinkContainer></NavDropdown.Item>
                {!empty(center_id) && center_id===177 ? 
                <NavDropdown.Item><LinkContainer to="/tickets-wager-types-inh">
                <Nav.Link>Total de Tickets de INH</Nav.Link>
                </LinkContainer></NavDropdown.Item>
                : null}
                <NavDropdown.Item><LinkContainer to="/tokens">
                <Nav.Link>Listado de Turnos</Nav.Link>
                </LinkContainer></NavDropdown.Item>
              </NavDropdown>
              : null}
              {!empty(currencyCode) && currencyCode ==='COP' ?
              <NavDropdown title="Tickets vendidos" id="basic-nav-dropdown">
              <NavDropdown.Item><LinkContainer to="/tickets-inh">
                <Nav.Link>Tickets INH</Nav.Link>
              </LinkContainer></NavDropdown.Item>
                <NavDropdown.Item><LinkContainer to="/tickets-wager-types-inh">
                <Nav.Link>Total de Tickets de INH</Nav.Link>
                </LinkContainer></NavDropdown.Item>
                <NavDropdown.Item><LinkContainer to="/tokens">
                <Nav.Link>Listado de Turnos</Nav.Link>
                </LinkContainer></NavDropdown.Item>
              </NavDropdown>
              : null}
              {!empty(currencyCode) && currencyCode ==='USD' ?  
              <NavDropdown title="Tickets vendidos" id="basic-nav-dropdown">
                <NavDropdown.Item><LinkContainer to="/tickets-inh">
                  <Nav.Link>Tickets INH</Nav.Link>
                </LinkContainer></NavDropdown.Item>
                {!isGbcGaming() ? <NavDropdown.Item><LinkContainer to="/tickets-stalls">
                <Nav.Link>Tickets Puestos y Tablas</Nav.Link>
                </LinkContainer></NavDropdown.Item> : null}
                <NavDropdown.Item><LinkContainer to="/tickets-wager-types-inh">
                <Nav.Link>Total de Tickets de INH</Nav.Link>
                </LinkContainer></NavDropdown.Item>
                {!isGbcGaming() ? <NavDropdown.Item><LinkContainer to="/tickets-summary-stalls">
                <Nav.Link>Total de Tickets de Puestos y Tablas</Nav.Link>
                </LinkContainer></NavDropdown.Item> : null}
                <NavDropdown.Item><LinkContainer to="/tokens">
                <Nav.Link>Listado de Turnos</Nav.Link>
                </LinkContainer></NavDropdown.Item>
                </NavDropdown>
               : null}
              <Nav.Link>Turno: {user.token}</Nav.Link>
              <LinkContainer to="/" onClick={this.handleLogout}>
                <Nav.Link>Cerrar Taquilla</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = ({ user,balance,ticketoffice }) => ({
  user,
  balance,
  ticketoffice
});

const connectedNavHeaderNacional = connect(mapStateToProps, actions)(NavHeaderNacional);
export { connectedNavHeaderNacional as NavHeaderNacional };
