import config from "config";
import empty from "is-empty";
import LoadingActions from "./LoadingActions";
import ResultService from "../_services/ResultService";
import ErrorActions from "./ErrorActions";
import { toast } from "react-toastify";

class ResultActions {
  static handler(store, params) {
    return new ResultActions[params.action](store, params.params);
  }

  static async getAll(store, {} = {}) {
    let results = {};
    let errorMessage = new Error(
      "No se pudo cargar la información de los resultados"
    );

    store.setState({
      loading: LoadingActions.show(store)
    });

    try {
      results = await ResultService.getAll({});
    } catch (error) {
      //console.log("getAll: Error:Original::", error)
      ErrorActions.handlerWarning(store, errorMessage);
    }

    store.setState({
      results,
      loading: LoadingActions.hide(store)
    });
  }
}

export default ResultActions;
