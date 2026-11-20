import config from "config";
import empty from "is-empty";
import LoadingActions from "./LoadingActions";
import RefundService from "../_services/RefundService";
import TicketsService from "../_services/TicketsService";
import ErrorActions from "./ErrorActions";
import { toast } from "react-toastify";

class RefundActions {
  static handler(store, params) {
    return new RefundActions[params.action](store, params.params);
  }

  static async refundTicket(store, { confirm } = { confirm }) {
    let errorMessage = new Error("Ocurrio un error al anular el ticket");

    let tickets = store.getState().tickets;
    let balance = store.getState().balance;
    
    
    store.setState({
     
      loading: LoadingActions.show(store),
      balance
    });

    try {
      let resultTicket = await RefundService.refundTicket({ confirm });
      let responseTickets = await TicketsService.getMyTickets({ params: {} });
      tickets = responseTickets.nodes;
      let responseBalance = await TicketsService.getBalance({ params: {} });
      balance = responseBalance.nodes;
      if (resultTicket.result.vEndCode == "00000") {
        toast.success(`El ticket ${confirm} fue anulado exitosamente`, {
          position: toast.POSITION.TOP_CENTER
        });
       
      } else {
        let errorMessage = new Error(resultTicket.result.vMessage);
        ErrorActions.handlerWarning(store, errorMessage);
      }
    } catch (error) {
      //console.log("payTicket: Error:Original::", error)
      ErrorActions.handlerWarning(store, errorMessage);
    }

    store.setState({
      loading: LoadingActions.hide(store),
      balance,
      tickets
    });
  }

  static async refundTicketElInmejorableInh(store, { confirm } = { confirm }) {
    let errorMessage = new Error("Ocurrio un error al anular el ticket");
    let ticketsINH = {};
    let responseService = {};
    let params = {};

    let balance = store.getState().balance;

    store.setState({
      ticketsINH,
      loading: LoadingActions.show(store),
      balance
    });

    try {
      let resultTicket = await RefundService.refundTicketElInmejorableInh({ confirm });
      let responseBalance = await TicketsService.getBalance({ params: {} });
      balance = responseBalance.nodes;
      if (resultTicket.result.vEndCode == "00000") {
        toast.success(`El ticket ${confirm} fue anulado exitosamente`, {
          position: toast.POSITION.TOP_CENTER
        });
        responseService = await TicketsService.getMyTicketsINH({params});
        ticketsINH = responseService.nodes;
      } else {
        let errorMessage = new Error(resultTicket.result.vMessage);
        ErrorActions.handlerWarning(store, errorMessage);
      }
    } catch (error) {
      //console.log("payTicket: Error:Original::", error)
      ErrorActions.handlerWarning(store, errorMessage);
    }

    store.setState({
      ticketsINH,
      loading: LoadingActions.hide(store),
      balance
    });
  }
}

export default RefundActions;
