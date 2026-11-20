import config from "config";
import empty from "is-empty";
import LoadingActions from "./LoadingActions";
import SellService from "../_services/SellService";
import TicketsService from "../_services/TicketsService";
import ErrorActions from "./ErrorActions";
import { toast } from "react-toastify";

class SellActions {
    static handler(store, params) {
        return new SellActions[params.action](store, params.params);
    }

    static async clearTicketInfo(store, {} = {}) {
        store.setState({
            ticketInfo: {},
            ticketInfoInh: {},
            ticketInfoSport: {},
            payInfo: {},
            payInfoInh: {},
            payInfoSport: {},
        });
    }

    static getAllTracks = async (store) => {
        let tracksList = {};

        store.setState({
            loading: LoadingActions.show(store),
        });

        try {
            tracksList = await SellService.allTracks();
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }

        store.setState({
            tracksList,
            loading: LoadingActions.hide(store),
        });
    };

    static  getOnlyTracksINH =  async (store) => {
        
        let tracksListINH = {}
        store.setState(  {
            loading: LoadingActions.show(store)
        })

        try { 
            tracksListINH = await SellService.getOnlyTracksINH();
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }

        store.setState(  {
            tracksListINH,
            loading: LoadingActions.hide(store)
        })

    }


    static async getAllDataBySell(store, {} = {}) {
        let alldata = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            loading: LoadingActions.show(store),
        });

        try {
            alldata = await SellService.getAllDataBySell({});
        } catch (error) {
            //console.log("getAllData: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        store.setState({
            alldata,
            loading: LoadingActions.hide(store),
        });
    }

    static  getAllTracksListInh =  async (store) => {
        
        let tracksList = [];

        store.setState(  {
            loading: LoadingActions.show(store)
        })

        try { 
            tracksList = await SellService.allTracksListInh();
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }

        store.setState(  {
            tracksList,
            loading: LoadingActions.hide(store)
        })

    }

    static  getAllTracksListHsip =  async (store) => {
        
        let tracksList = [];

        store.setState(  {
            loading: LoadingActions.show(store)
        })

        try { 
            tracksList = await SellService.allTracksListHsip();
        } catch (error) {
            ErrorActions.handlerError(store, error);
        }

        store.setState(  {
            tracksList,
            loading: LoadingActions.hide(store)
        })

    }

    static async getAllDataINHBySellNoInterval(store, {} = {}) {
        let alldatainhnointerval = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            loading: LoadingActions.show(store),
        });

        try {
            alldatainhnointerval = await SellService.getAllDataINHBySellNoInterval(
                {}
            );
        } catch (error) {
            //console.log("getAllData: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        store.setState({
            alldatainhnointerval,
            loading: LoadingActions.hide(store),
        });
    }

    static async getAllDataBySellNoInterval(store, {} = {}) {
        let alldatanointerval = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            loading: LoadingActions.show(store),
        });

        try {
            alldatanointerval = await SellService.getAllDataBySellNoInterval(
                {}
            );
        } catch (error) {
            //console.log("getAllDataBySellNoInterval: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        store.setState({
            alldatanointerval,
            loading: LoadingActions.hide(store),
        });
    }

    static async sellTicket(store, { sellform } = { sellform }) {
        let ticketInfo = {};
        let payInfo = {};
        let errorMessage = new Error(
            "No se pudo vender el ticket"
        );

        let tickets = store.getState().tickets;
        let balance = store.getState().balance;
        

        store.setState({
            ticketInfo,
            payInfo,
            balance,
            loading: LoadingActions.show(store),
        });

        try {
            let resultTicket = await SellService.sellTicket({ sellform });
            console.log('resultTicket',resultTicket);
            let ticketId = {};
            if(!empty(resultTicket.result) && !empty(resultTicket.result.vTicketIdCreated)){
                ticketId = resultTicket.result.vTicketIdCreated;
                ticketInfo = await SellService.getTicketById({ id: ticketId });
                let responseTickets = await TicketsService.getMyTickets({ params: {} });
                tickets = responseTickets.nodes;
                let responseBalance = await TicketsService.getBalance({ params: {} });
                balance = responseBalance.nodes;
            }else if(!empty(resultTicket.result.vMessage)){
                toast.warn(resultTicket.result.vMessage,{position: toast.POSITION.TOP_CENTER});
            }
            
        } catch (error) {
            errorMessage = !empty(error) && !empty(error.response) && !empty(error.response.data)
                           && !empty(error.response.data.data) 
                           && !empty(error.response.data.data.messageError) ? new Error(
                            error.response.data.data.messageError
                        )   : errorMessage;

            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfo)

        store.setState({
            ticketInfo,
            tickets,
            payInfo,
            balance,
            loading: LoadingActions.hide(store),
        });
    }

    static async sellInhTicket(store, { sellform } = { sellform }) {
        let ticketInfoInh = {};
        let params = {};
        let errorMessage = new Error(
            "No se pudo vender o totalizar el ticket, intente nuevamente"
        );
        let responseService = {};
        let ticketsINH = {};

        store.setState({
            ticketInfoInh,
            loading: LoadingActions.show(store),
        });

        try {
            let resultTicket = await SellService.sellInhTicket({ sellform });
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfoInh = await SellService.getTicketINHById({ id: ticketId,status: 2 });
            if(empty(ticketInfoInh.allTicketsInhs.nodes) 
            && empty(ticketInfoInh.allTicketsInhs.nodes[0].idTransactionInh)){
                ErrorActions.handlerWarning(store, errorMessage);
            }
            responseService = await TicketsService.getMyTicketsINH({params});
            ticketsINH = responseService.nodes;
        } catch (error) {
            errorMessage = !empty(error) && !empty(error.response) && !empty(error.response.data)
                           && !empty(error.response.data.data) 
                           && !empty(error.response.data.data.messageError) ? new Error(
                            error.response.data.data.messageError
                        )   : errorMessage;

            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfoInh,
            loading: LoadingActions.hide(store),
            ticketsINH
        });
    }

    static async sellInhDolaresTicket(store, { sellform } = { sellform }) {
        let ticketInfoInh,ticketInfo = {};
        let params = {};
        let errorMessage = new Error(
            "No se pudo vender o totalizar el ticket, intente nuevamente"
        );
        let responseService = {};
        let ticketsINH = {};
        let balance = store.getState().balance;

        store.setState({
            ticketInfoInh,
            ticketInfo,
            loading: LoadingActions.show(store),
        });

        try {
            let resultTicket = await SellService.sellInhDolaresTicket({ sellform });
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfoInh = await SellService.getTicketINHById({ id: ticketId,status: 2 });
            if(empty(ticketInfoInh.allTicketsInhs.nodes)){
                ErrorActions.handlerWarning(store, errorMessage);
            }
            responseService = await TicketsService.getMyTicketsINH({params});
            ticketsINH = responseService.nodes;
            let responseBalance = await TicketsService.getBalance({ params: {} });
            balance = responseBalance.nodes;
        } catch (error) {
            errorMessage = !empty(error) && !empty(error.response) && !empty(error.response.data)
                           && !empty(error.response.data.data) 
                           && !empty(error.response.data.data.messageError) ? new Error(
                            error.response.data.data.messageError
                        )   : errorMessage;

            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfoInh,
            ticketInfo,
            loading: LoadingActions.hide(store),
            balance,
            ticketsINH
        });
    }

    static async sellInhElInmejorableTicket(store, { sellform } = { sellform }) {
        let ticketInfoInh,ticketInfo = {};
        let params = {};
        let errorMessage = new Error(
            "No se pudo vender o totalizar el ticket, intente nuevamente"
        );
        let responseService = {};
        let ticketsINH = {};
        let balance = store.getState().balance;

        store.setState({
            ticketInfoInh,
            ticketInfo,
            balance,
            loading: LoadingActions.show(store),
        });

        try {
            let resultTicket = await SellService.sellInhElInmejorableTicket({ sellform });
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfoInh = await SellService.getTicketINHById({ id: ticketId,status: 2 });
            if(empty(ticketInfoInh.allTicketsInhs.nodes)){
                ErrorActions.handlerWarning(store, errorMessage);
            }
            responseService = await TicketsService.getMyTicketsINH({params});
            ticketsINH = responseService.nodes;
            let responseBalance = await TicketsService.getBalance({ params: {} });
            balance = responseBalance.nodes;
        } catch (error) {
            errorMessage = !empty(error) && !empty(error.response) && !empty(error.response.data)
                           && !empty(error.response.data.data) 
                           && !empty(error.response.data.data.messageError) ? new Error(
                            error.response.data.data.messageError
                        )   : errorMessage;

            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfoInh,
            ticketInfo,
            loading: LoadingActions.hide(store),
            balance,
            ticketsINH
        });
    }

    static async getAllDataINHBySell(store, {} = {}) {
        let alldatainh = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            loading: LoadingActions.show(store),
        });

        try {
            alldatainh = await SellService.getAllDataINHBySell({});
        } catch (error) {
            //console.log("getAllDataBySellNoInterval: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        store.setState({
            alldatainh,
            loading: LoadingActions.hide(store),
        });
    }

    static async getAllDataINHValidas(store, {} = {}) {
        let racesvalidasinh = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            loading: LoadingActions.show(store),
        });

        try {
            racesvalidasinh = await SellService.getAllDataINHValidas({});
        } catch (error) {
            //console.log("getAllData: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        store.setState({
            racesvalidasinh,
            loading: LoadingActions.hide(store),
        });
    }

    static sellMarkTicket = async (store, { sellform }) => {
        let ticketInfo = {};
        let tickets = store.getState().tickets;

        store.setState({
            ticketInfo,
            loading: LoadingActions.show(store)
        });

        try {
            let resultTicket = await SellService.sellMarkTicket(sellform);
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfo = await SellService.getTicketById({ id: ticketId });

            let responseTickets = await TicketsService.getMyTickets({ params: {} });
            tickets = responseTickets.nodes;
        } catch (error) {
            store.setState({
                loading: LoadingActions.hide(store)
            });

            ErrorActions.handlerError(store, error);
        }

        store.setState({
            ticketInfo,
            tickets,
            loading: LoadingActions.hide(store)
        });
    };

    static sellStallTicket = async (store, { sellform }) => {
        let ticketInfo,ticketInfoInh = {};
        let tickets = store.getState().tickets;
        let balance = store.getState().balance;

        store.setState({
            ticketInfo,
            ticketInfoInh,
            loading: LoadingActions.show(store)
        });

        try {
            let resultTicket = await SellService.sellStallTicket(sellform);
            if(!empty(resultTicket.result) && !empty(resultTicket.result.vTicketIdCreated)){
                let ticketId = resultTicket.result.vTicketIdCreated;
                ticketInfo = await SellService.getTicketById({ id: ticketId });
                let responseTickets = await TicketsService.getMyTickets({ params: {} });
                tickets = responseTickets.nodes;
                let responseBalance = await TicketsService.getBalance({ params: {} });
                balance = responseBalance.nodes;
            }else if(!empty(resultTicket.result.vMessage)){
                //console.log(resultTicket.result.vMessage);
                toast.warn(resultTicket.result.vMessage,{position: toast.POSITION.TOP_CENTER});
            }
        } catch (error) {
            store.setState({
                loading: LoadingActions.hide(store)
            });

            ErrorActions.handlerError(store, error);
        }

        store.setState({
            ticketInfo,
            ticketInfoInh,
            tickets,
            balance,
            loading: LoadingActions.hide(store)
        });
    };

    static sellMacuareTicket = async (store, { sellform }) => {
        let ticketInfo = {};
        let tickets = store.getState().tickets;

        store.setState({
            ticketInfo,
            loading: LoadingActions.show(store)
        });

        try {
            let resultTicket = await SellService.sellMacuareTicket(sellform);
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfo = await SellService.getTicketById({ id: ticketId });

            let responseTickets = await TicketsService.getMyTickets({ params: {} });
            tickets = responseTickets.nodes;
        } catch (error) {
            store.setState({
                loading: LoadingActions.hide(store)
            });

            ErrorActions.handlerError(store, error);
        }

        store.setState({
            ticketInfo,
            tickets,
            loading: LoadingActions.hide(store)
        });
    };

    static sellMacuareHsipTicket = async (store, { sellform }) => {
        let ticketInfoHsip = {};
        let tickets = store.getState().tickets;
        let params = {};
        let responseService,ticketsHSIP = {};

        store.setState({
            ticketInfoHsip,
            loading: LoadingActions.show(store)
        });

        try {
            let resultTicket = await SellService.sellMacuareHsipTicket({ sellform });
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfoHsip = await SellService.getTicketHsipById({ id: ticketId,status: 1 });
            if(!empty(resultTicket.result) && !empty(resultTicket.result.vTicketIdCreated)){
                responseService = await TicketsService.getMyTicketsHSIP({params});
                ticketsHSIP = responseService.nodes;
            }else if(!empty(resultTicket.vMessage)){
                toast.warn(ticketInfoSell.vMessage,{position: toast.POSITION.TOP_CENTER});
            }
        } catch (error) {
            errorMessage = !empty(error) && !empty(error.response) && !empty(error.response.data)
                           && !empty(error.response.data.data) 
                           && !empty(error.response.data.data.messageError) ? new Error(
                            error.response.data.data.messageError
                        )   : errorMessage;

            ErrorActions.handlerWarning(store, errorMessage);
        }

        store.setState({
            ticketInfoHsip,
            tickets,
            loading: LoadingActions.hide(store)
        });
    };

    static sellCockTicket = async (store, { sellform }) => {
        let ticketInfo = {};
        let ticketsCocks = store.getState().tickets;

        store.setState({
            ticketInfo,
            loading: LoadingActions.show(store)
        });

        try {
            let resultTicket = await SellService.sellCockTicket(sellform);
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfo = await SellService.getHeaderTicketCockById({ id: ticketId });

            let responseTickets = await TicketsService.getMyHeaderTicketsCocks({ params: {} });
            ticketsCocks = responseTickets.nodes;
        } catch (error) {
            store.setState({
                loading: LoadingActions.hide(store)
            });

            ErrorActions.handlerError(store, error);
        }

        store.setState({
            ticketInfo,
            ticketsCocks,
            loading: LoadingActions.hide(store)
        });
    };

    static sellFreeCockTicket = async (store, { sellform }) => {
        let ticketInfo = {};
        let tickets = store.getState().tickets;

        store.setState({
            ticketInfo,
            loading: LoadingActions.show(store)
        });

        try {
            let resultTicket = await SellService.sellFreeCockTicket(sellform);
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfo = await SellService.getTicketById({ id: ticketId });

            let responseTickets = await TicketsService.getMyTickets({ params: {} });
            tickets = responseTickets.nodes;
        } catch (error) {
            store.setState({
                loading: LoadingActions.hide(store)
            });

            ErrorActions.handlerError(store, error);
        }

        store.setState({
            ticketInfo,
            tickets,
            loading: LoadingActions.hide(store)
        });
    };

    static async getTicketInfo(store, { ticketId } = { ticketId }) {
        let ticketInfo = {};
        let payInfo = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            ticketInfo,
            payInfo,
            loading: LoadingActions.show(store),
        });

        try {
            ticketInfo = await SellService.getTicketById({ id: ticketId });
        } catch (error) {
            //console.log("getAllDataBySellNoInterval: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfo)

        store.setState({
            ticketInfo,
            payInfo,
            loading: LoadingActions.hide(store),
        });
    }

    static async getTicketInfoINH(store, { ticketId } = { ticketId }) {
        let ticketInfoInh = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            ticketInfoInh,
            loading: LoadingActions.show(store),
        });

        try {
            ticketInfoInh = await SellService.getTicketINHById({ id: ticketId });
        } catch (error) {
            //console.log("getAllDataBySellNoInterval: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfoInh,
            loading: LoadingActions.hide(store),
        });
    }

    static sellFixedTabledTicket = async (store, { sellform }) => {
        let ticketInfo,ticketInfoInh = {};
        let tickets = store.getState().tickets;
        let balance = store.getState().balance;

        let errorMessage = new Error(
            "No se pudo vender el ticket"
        );

        store.setState({
            ticketInfo,
            ticketInfoInh,
            loading: LoadingActions.show(store)
        });

        try {
            let resultTicket = await SellService.sellFixedTabledTicket(sellform);
            if(!empty(resultTicket.result) && !empty(resultTicket.result.vTicketIdCreated)){

                let ticketId = resultTicket.result.vTicketIdCreated;
                ticketInfo = await SellService.getTicketById({ id: ticketId });
                let responseTickets = await TicketsService.getMyTickets({ params: {} });
                tickets = responseTickets.nodes;
                let responseBalance = await TicketsService.getBalance({ params: {} });
                balance = responseBalance.nodes;
            }else if(!empty(resultTicket.result.vMessage)){
                //console.log(resultTicket.result.vMessage);
                toast.warn(resultTicket.result.vMessage,{position: toast.POSITION.TOP_CENTER});
            }
        } catch (error) {
            errorMessage = !empty(error) && !empty(error.response) && !empty(error.response.data)
                           && !empty(error.response.data.data) 
                           && !empty(error.response.data.data.messageError) ? new Error(
                            error.response.data.data.messageError
                        )   : errorMessage;

            ErrorActions.handlerWarning(store, errorMessage);
        }

        store.setState({
            ticketInfo,
            ticketInfoInh,
            tickets,
            balance,
            loading: LoadingActions.hide(store)
        });
    };

    static async sellTicketSport(store, { sellform } = { sellform }) {
        let ticketInfoSport = {};
        let payInfoSport = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de los eventos"
        );

        let ticketssports = store.getState().ticketsSports;
        let balance = store.getState().balance;
        

        store.setState({
            ticketInfoSport,
            payInfoSport,
            balance,
            loading: LoadingActions.show(store),
        });

        try {
            let resultTicket = await SellService.sellTicketSport({ sellform });
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfoSport = await SellService.getTicketSportById(ticketId);
            ticketInfoSport = ticketInfoSport.nodes;
            let responseTickets = await TicketsService.getMyTicketsSports({ params: {} });
            ticketssports = responseTickets.nodes;
            let responseBalance = await TicketsService.getBalance({ params: {} });
            balance = responseBalance.nodes;
        } catch (error) {
            //console.log("getAllDataBySellNoInterval: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfo)

        store.setState({
            ticketInfoSport,
            ticketssports,
            payInfoSport,
            balance,
            loading: LoadingActions.hide(store),
        });
    }

    static async getTicketInfoSport(store, { ticketId } = { ticketId }) {
        let ticketInfoSport = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            ticketInfoSport,
            loading: LoadingActions.show(store),
        });

        try {
            ticketInfoSport = await SellService.getTicketSportById(ticketId);
            ticketInfoSport = ticketInfoSport.nodes;
        } catch (error) {
            //console.log("getAllDataBySellNoInterval: Error:Original::", error)
            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfoSport,
            loading: LoadingActions.hide(store),
        });
    }

    static setTracksRtEmpty(store){
        
        store.setState({
            loading: LoadingActions.show(store),
            tracksrt: null
        })
    }

    static setTracksRt(store, {params} = {params}){
        
        store.setState({
            tracksrt: !empty(params) && !empty(params.tracks) ? params.tracks : [] ,
            loading: LoadingActions.hide(store), 
        })
    }

    static async sellHsipTicket(store, { sellform } = { sellform }) {
        let ticketInfoHsip = {};
        let params = {};
        let errorMessage = new Error(
            "No se pudo vender o totalizar el ticket, intente nuevamente"
        );
        let responseService = {};
        let ticketsHSIP = {};

        store.setState({
            ticketInfoHsip,
            loading: LoadingActions.show(store),
        });

        try {
            let resultTicket = await SellService.sellHsipTicket({ sellform });
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfoHsip = await SellService.getTicketHsipById({ id: ticketId,status: 1 });
            if(!empty(resultTicket.result) && !empty(resultTicket.result.vTicketIdCreated)){
                responseService = await TicketsService.getMyTicketsHSIP({params});
                ticketsHSIP = responseService.nodes;
            }else if(!empty(resultTicket.vMessage)){
                toast.warn(ticketInfoSell.vMessage,{position: toast.POSITION.TOP_CENTER});
            }
            
        } catch (error) {
            errorMessage = !empty(error) && !empty(error.response) && !empty(error.response.data)
                           && !empty(error.response.data.data) 
                           && !empty(error.response.data.data.messageError) ? new Error(
                            error.response.data.data.messageError
                        )   : errorMessage;
            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfoHsip,
            loading: LoadingActions.hide(store),
            ticketsHSIP
        });
    }

    static async getTicketInfoHSIP(store, { ticketId } = { ticketId }) {
        let ticketInfoHsip = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            ticketInfoHsip,
            loading: LoadingActions.show(store),
        });

        try {
            ticketInfoHsip = await SellService.getTicketHsipById({ id: ticketId });
        } catch (error) {
            //console.log("getAllDataBySellNoInterval: Error:Original::", error)
            ErrorActions.handlerWarning(store, error);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfoHsip,
            loading: LoadingActions.hide(store),
        });
    }

    static sellCockTicketAnimal = async (store, { sellform }) => {
        let ticketInfoAnimal = {};
        let ticketsAnimals = store.getState().ticketsAnimals;

        store.setState({
            ticketInfoAnimal,
            loading: LoadingActions.show(store)
        });

        try {
            let resultTicket = await SellService.sellCockTicketAnimal(sellform);
            let ticketId = resultTicket.result.vTicketIdCreated;
            ticketInfoAnimal = await SellService.getTicketAnimalById({ id: ticketId,status: 1 });

            let responseTickets = await TicketsService.getMyTicketsAnimals({ params: {} });
            ticketsAnimals = responseTickets.nodes;
        } catch (error) {
            store.setState({
                loading: LoadingActions.hide(store)
            });

            ErrorActions.handlerError(store, error);
        }

        store.setState({
            ticketInfoAnimal,
            ticketsAnimals,
            loading: LoadingActions.hide(store)
        });
    }

    static async getTicketInfoAnimals(store, { ticketId } = { ticketId }) {
        let ticketInfoAnimal = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            ticketInfoAnimal,
            loading: LoadingActions.show(store),
        });

        try {
            ticketInfoAnimal = await SellService.getTicketAnimalById({ id: ticketId,status:1 });
        } catch (error) {
            
            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfoAnimal,
            loading: LoadingActions.hide(store),
        });
    }

    static async getTicketHeaderCock(store, { ticketId } = { ticketId }) {
        let ticketInfo = {};
        let errorMessage = new Error(
            "No se pudo cargar la información de las carreras"
        );

        store.setState({
            ticketInfo,
            loading: LoadingActions.show(store),
        });

        try {
            ticketInfo = await SellService.getHeaderTicketCockById({ id: ticketId,status:1 });
        } catch (error) {
            
            ErrorActions.handlerWarning(store, errorMessage);
        }

        //console.log("ticketInfo:::",ticketInfoInh)

        store.setState({
            ticketInfo,
            loading: LoadingActions.hide(store),
        });
    }
}

export default SellActions;
