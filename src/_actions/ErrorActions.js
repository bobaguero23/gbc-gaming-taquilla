import empty from 'is-empty';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser'

class ErrorActions {

    static handler(store, params){
        return new ErrorActions[params.action](store, params.params);
    }

    static handlerWarning(store, error){
        toast.warn(error.message,{position: toast.POSITION.TOP_CENTER});
    }

    static handlerError(store, error){
        toast.error(error.message,{position: toast.POSITION.TOP_CENTER});
    }

}

export default ErrorActions;