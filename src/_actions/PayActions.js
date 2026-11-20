import config from "config";
import empty from "is-empty";
import LoadingActions from "./LoadingActions";
import PayService from "../_services/PayService";
import TicketsService from "../_services/TicketsService";
import ErrorActions from "./ErrorActions";
import SellService from "../_services/SellService";

class PayActions {
  static handler(store, params) {
    return new PayActions[params.action](store, params.params);
  }

  static async payTicket(store, { confirm } = { confirm }) {
    let payInfo = {};
    let ticketInfo = {};
    let errorMessage = new Error(
      "Ocurrió un error al intentar pagar el ticket"
    );

    let balance = store.getState().balance;

    store.setState({
      loading: LoadingActions.show(store),
      ticketInfo,
      balance
    });

    try {
      let resultTicket = await PayService.payTicket({ confirm });
      if (resultTicket.result.vEndCode == "00000") {
        let ticketId = resultTicket.result.vTicketIdPaid;
        payInfo = await PayService.getTicketById({ id: ticketId });
        let responseBalance = await TicketsService.getBalance({ params: {} });
        balance = responseBalance.nodes;
      } else {
        let errorMessage = new Error(resultTicket.result.vMessage);
        ErrorActions.handlerWarning(store, errorMessage);
      }
    } catch (error) {
      //console.log("payTicket: Error:Original::", error)
      ErrorActions.handlerWarning(store, errorMessage);
    }

    //console.log("payInfo:::",payInfo)

    store.setState({
      payInfo,
      ticketInfo,
      balance,
      loading: LoadingActions.hide(store)
    });
  }

  static async payTicketInh(store, { confirm } = { confirm }) {
    let payInfoInh = {};
    let payInfo = {};
    let ticketInfo = {};
    let errorMessage = new Error(
      "Ocurrió un error al intentar pagar el ticket"
    );

    let balance = store.getState().balance;

    store.setState({
      loading: LoadingActions.show(store),
      ticketInfo,
      payInfo,
      balance
    });

    try {
      let resultTicket = await PayService.payTicketInh({ confirm });
      if (resultTicket.result.vEndCode == "00000") {
        let ticketId = resultTicket.result.vTicketIdPaid;
        payInfoInh = await PayService.getTicketByIdInh({ id: ticketId });
        let responseBalance = await TicketsService.getBalance({ params: {} });
         balance = responseBalance.nodes;
      } else {
        let errorMessage = new Error(resultTicket.result.vMessage);
        ErrorActions.handlerWarning(store, errorMessage);
      }
    } catch (error) {
      //console.log("payTicket: Error:Original::", error)
      ErrorActions.handlerWarning(store, errorMessage);
    }

    //console.log("payInfo:::",payInfo)

    store.setState({
      payInfoInh,
      payInfo,
      ticketInfo,
      balance,
      loading: LoadingActions.hide(store)
    });
  }

  static async payTicketSport(store, { confirm } = { confirm }) {
    let payInfoInh = {};
    let payInfo = {};
    let payInfoSport = {};
    let ticketInfo = {};
    let errorMessage = new Error(
      "Ocurrió un error al intentar pagar el ticket"
    );

    let balance = store.getState().balance;

    store.setState({
      loading: LoadingActions.show(store),
      ticketInfo,
      payInfo,
      payInfoSport,
      balance
    });

    try {
      let resultTicket = await PayService.payTicketSport({ confirm });
      if (resultTicket.result.vEndCode == "00000") {
        let ticketId = resultTicket.result.vTicketIdPaid;
        payInfoSport = await PayService.getTicketSportById({ id: ticketId });
        let responseBalance = await TicketsService.getBalance({ params: {} });
         balance = responseBalance.nodes;
      } else {
        let errorMessage = new Error(resultTicket.result.vMessage);
        ErrorActions.handlerWarning(store, errorMessage);
      }
    } catch (error) {
      //console.log("payTicket: Error:Original::", error)
      ErrorActions.handlerWarning(store, errorMessage);
    }

    //console.log("payInfo:::",payInfo)

    store.setState({
      payInfoInh,
      payInfo,
      payInfoSport,
      ticketInfo,
      balance,
      loading: LoadingActions.hide(store)
    });
  }

  static async payTicketCock(store, { confirm } = { confirm }) {
    let payInfoCock = {};
    let ticketInfo = {};
    let errorMessage = new Error(
      "Ocurrió un error al intentar pagar el ticket"
    );

    let balance = store.getState().balance;

    store.setState({
      loading: LoadingActions.show(store),
      ticketInfo,
      balance
    });

    try {
      let resultTicket = await PayService.payTicketCock({ confirm });
      if (resultTicket.result.vEndCode == "00000") {
        let ticketId = resultTicket.result.vTicketIdPaid;
        payInfoCock = await SellService.getHeaderTicketCockById({ id: ticketId });
        let responseBalance = await TicketsService.getBalance({ params: {} });
        balance = responseBalance.nodes;
      } else {
        let errorMessage = new Error(resultTicket.result.vMessage);
        ErrorActions.handlerWarning(store, errorMessage);
      }
    } catch (error) {
      //console.log("payTicket: Error:Original::", error)
      ErrorActions.handlerWarning(store, errorMessage);
    }

    //console.log("payInfo:::",payInfo)

    store.setState({
      payInfoCock,
      ticketInfo,
      balance,
      loading: LoadingActions.hide(store)
    });
  }
}

export default PayActions;
