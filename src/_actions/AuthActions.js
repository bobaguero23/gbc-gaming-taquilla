import LoadingActions from "./LoadingActions";
import AuthService from "../_services/AuthService";
import { history } from "../_helpers/history";
import { isOnly5y6, isOnlyPollaElArca,isSaleSports,isSaleNacionalElInmejorable } from "../_helpers/lib";
import { GBC_HOME, isGbcGaming } from "../_helpers/product";
import empty from "is-empty";
import jwt_decode from "jwt-decode";
import ErrorActions from "./ErrorActions";
import DeviceInfo from "../_helpers/deviceInfo";

class AuthActions {
  static handler(store, params) {
    return new AuthActions[params.action](store, params.params);
  }

  static isLogged() {
    return !empty(localStorage.getItem("token"));
  }

  static meData() {
    let user = {};

    try {
      let tokenUser = localStorage.getItem("tokenUser");
      user = JSON.parse(tokenUser);
    } catch (error) {
      ErrorActions.handlerWarning(store, error);
    }
    return user;
  }

  static getDateBD = async (store) =>{

    let dateBD = null
    try { 
        dateBD = await AuthService.getDateBD();
    } catch (error) {
        ErrorActions.handlerError(store, error);
    }

    store.setState(  {
        dateBD
    })


  }

  static me(store) {
    let user = {};

    try {
      let tokenUser = localStorage.getItem("tokenUser");
      user = JSON.parse(tokenUser);
      if (empty(user.token)) {
        AuthActions.logout(store);
        throw new Error("Información de Usuario Invalida");
      }
    } catch (error) {
      ErrorActions.handlerWarning(store, error);
    }

    store.setState({
      user
    });
  }

  static logout(store) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenUser");
    localStorage.removeItem("recaptcha");
    history.push("/login");

    return {
      user: {},
      loading: LoadingActions.hide(store)
    };
  }

  static async login(store, { token } = {}) {
    let user = {};
    let redirect = "";

    store.setState({
      user,
      loading: LoadingActions.show(store)
    });

    try {
      // Collect device info for location tracking
      const { macAddress, geoLocation, ipAddress, publicIpAddress } = await DeviceInfo.getAll();
      const userToken = await AuthService.login({ token, macAddress, geoLocation, ipAddress, publicIpAddress });

      if (!empty(userToken)) {
        let decoded = jwt_decode(userToken);

        

        if(isGbcGaming()){
          redirect = GBC_HOME;
        }else if(isOnly5y6(decoded.ticket_offices_id)){
          redirect = "/5y6";
        }else if (decoded.currency_code=='VES' && isOnlyPollaElArca(decoded.centers_id)){
          redirect = "/lotteries-cocks";
        }else if (decoded.currency_code=='VES' && parseInt(decoded.centers_id)===177){
          redirect = "/nacional-elinmejorable";
        }else if (decoded.currency_code=='VES'){
          redirect = "/nacional";
        }else if(decoded.centers_id=='177' 
                && decoded.currency_code=='USD'){
          redirect = "/nacional-dolares";
        }else{
          redirect = "/";
        }
        user = {
          ...decoded,
          token: token
        };

        localStorage.setItem("token", userToken);
        localStorage.setItem("tokenUser", JSON.stringify(user));
      } else {
        AuthActions.logout(store);
        throw new Error("Token Invalido por favor verifique");

      }
    } catch (error) {
      AuthActions.logout(store);
      ErrorActions.handlerWarning(store, error);
    }

    store.setState({
      user,
      loading: LoadingActions.hide(store)
    });

    if (!empty(redirect)) {
      history.push(redirect);
    }
  }

  static async loginTicketOffice(store, { token,ticket_office_id } = {}) {
    let user = {};
    let redirect = "";

    store.setState({
      user,
      loading: LoadingActions.show(store)
    });

    try {
      // Collect device info for location tracking
      const { macAddress, geoLocation, ipAddress, publicIpAddress } = await DeviceInfo.getAll();
      const userToken = await AuthService.loginTicketOffice({ token, ticketOfficeId: ticket_office_id, macAddress, geoLocation, ipAddress, publicIpAddress });

      if (!empty(userToken)) {
        let decoded = jwt_decode(userToken);

        

        if(isGbcGaming()){
          redirect = GBC_HOME;
        }else if(isOnly5y6(decoded.ticket_offices_id)){
          redirect = "/5y6";
        }else if (decoded.currency_code=='VES'){
          redirect = "/nacional";
        }else{
          redirect = "/";
        }
        user = {
          ...decoded,
          token: token
        };

        localStorage.setItem("token", userToken);
        localStorage.setItem("tokenUser", JSON.stringify(user));
      } else {
        AuthActions.logout(store);
        throw new Error("Token Invalido por favor verifique");

      }
    } catch (error) {
      AuthActions.logout(store);
      ErrorActions.handlerWarning(store, error);
    }

    store.setState({
      user,
      loading: LoadingActions.hide(store)
    });

    if (!empty(redirect)) {
      history.push(redirect);
    }
  }

  static async loginUserPass(store, { username, password } = {}) {
    let user = {};
    let redirect = "";

    store.setState({
      user,
      loading: LoadingActions.show(store)
    });

    try {
      // Collect device info for location tracking
      const { macAddress, geoLocation, ipAddress, publicIpAddress } = await DeviceInfo.getAll();
      const userToken = await AuthService.loginUserPass({ username, password, macAddress, geoLocation, ipAddress, publicIpAddress });

      if (!empty(userToken)) {
        let decoded = jwt_decode(userToken);

        user = {
          ...decoded,
        };

        localStorage.setItem("token", userToken);
        localStorage.setItem("tokenUser", JSON.stringify(user));

        if(isGbcGaming()){
          redirect = GBC_HOME;
        }else if(isOnly5y6(decoded.ticket_offices_id)){
          redirect = "/5y6";
        }else if (decoded.currency_code=='VES' && isOnlyPollaElArca(decoded.centers_id)){
          redirect = "/lotteries-cocks";
        }else if (decoded.currency_code=='VES'){
          redirect = "/nacional";
        }else if(decoded.centers_id=='53' 
                && decoded.currency_code=='USD'
                && isSaleSports(decoded.ticket_offices_id)){
          redirect = "/sports";
        }else if(decoded.centers_id=='53' 
                && decoded.currency_code=='USD'){
          redirect = "/nacional-dolares";
        }else{
          redirect = "/";
        }
        
        
      } else {
        AuthActions.logout(store);
        throw new Error("Datos de Sesión Invalidos por favor verifique");

      }
    } catch (error) {
      AuthActions.logout(store);
      ErrorActions.handlerWarning(store, error);
    }

    store.setState({
      user,
      loading: LoadingActions.hide(store)
    });

    if (!empty(redirect)) {
      history.push(redirect);
    }
  }
}

export default AuthActions;
