import React from 'react';
import empty from 'is-empty';

import {Table, Card,Button,OverlayTrigger,Tooltip} from 'react-bootstrap';

import PaginationComponent from '../PaginationComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from "react-router-bootstrap";
import { buildSecureGetParams,formatNumber,parseUrlParams } from '../../_helpers/lib';
import Dialog from 'react-bootstrap-dialog';

 const headersCSV = [
    { label: "Taquilla", key: "ticketOffices" },
    { label: "# Ticket", key: "number" },
    { label: "# Confirmación", key: "confirm" },
    { label: "Tipo de Apuesta", key: "wagerType" },
    { label: "Creado", key: "created" },
    { label: "Unidades", key: "units" },
    { label: "Total", key: "amount" },
    { label: "Total a Pagar", key: "totalToPay" },
    { label: "Estatus del ticket", key: "ticketsStatus" },
    { label: "Caballo (s)", key: "horseName" },
    { label: "# Carrera", key: "raceNumber" },
    { label: "Hipódromo", key: "trackName" },
    { label: "Usuario", key: "userInmejorable" },
  ];

class TicketsListStallsFixedTables extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params:
            {
                page:1,
                orderBy: 'CREATED_DESC'
            }
        };
    }

    
    horsesNames = (ticketDetails,wager_type_id) =>{
        let horses_name = [];
        let raceArray = [];
        let raceText = [];
        let ticket = ticketDetails;
        ticketDetails = ticketDetails.horse_races;
        for(let ticket_detail of ticketDetails){
            if(!empty(raceArray[ticket_detail.race_number])){
              raceArray[ticket_detail.race_number].push(<span>{ticket_detail.program_number} - {ticket_detail.horse_name} </span>);
            }else{
              raceArray[ticket_detail.race_number] = [];
              raceArray[ticket_detail.race_number].push(<><span>{ticket_detail.program_number} - {ticket_detail.horse_name} </span></>);
            }
            
          }
      
          for (let raceNumber in raceArray) {
            let horses = raceArray[raceNumber];
            horses_name.push(<>Carrera: {raceNumber}) <b>{horses}</b> </>);
          }

        return horses_name;
      }

    racesNumber = (horseraces,wager_type_id) =>{
        let races_name = [];
        
        if( wager_type_id>=10 && wager_type_id<=14){
            if(!empty(horseraces)){
                for(let l=0;l<horseraces.length;l++){
                    races_name.push(<> {horseraces[l].race_number} / </>);
                }
            }
            
        }else{
            races_name.push(<> {!empty(horseraces) && !empty(horseraces[0]) ? horseraces[0].race_number : null} </>);
        }
          
        return races_name;
    }


    componentWillMount = () => {
       let params = this.state.params;
        // If pagination o not
        if(!empty(this.props.match.params.page)){
            params.page = this.props.match.params.page
        }

        params = parseUrlParams(params,this.props.location.search);

         

        this.props.onLoadList({
            params
        });  
    }

    componentWillReceiveProps(newProps){

        let params = this.state.params;
        params.page = newProps.match.params.page

        if( newProps.match.params.page != this.props.match.params.page) {
            params = parseUrlParams(params,this.props.location.search);
            this.props.onLoadList({
                params
            }); 
        }

        
    }

    
    loadRows = () => {
        let rows= [];
        const {user} = this.props;
        
        const tickets = this.props.tickets;

         

        if(empty(tickets)){
            return (
                <tr>
                    <td colSpan="14">{(this.props.loading > 0) ? 'Actualizando información..' : '' }</td>
                </tr>
            );
        }
        let date = require('date-and-time');

        for(let k in tickets){  
            const detailParams = {
                id : tickets[k].id
            }
            let confirm = tickets[k].confirm;
            rows.push(<tr key={Math.random()}>
                <td>{!empty(tickets[k].ticket_office) && !empty(tickets[k].ticket_office[0].name)  ? tickets[k].ticket_office[0].name : null}</td>
                <td>{tickets[k].number}</td>
                <td>{!empty(confirm) ? `****${(confirm.substring(4,7))}` : null}</td>
                <td>{!empty(tickets[k].wager_type) && !empty(tickets[k].wager_type[0].name ) ? tickets[k].wager_type[0].name : null} {(!empty(tickets[k].wager_type) && !empty(tickets[k].wager_type[0]) && tickets[k].wager_type[0].id===24 ? (!empty(tickets[k].stall) && (!empty(tickets[k].stall[0])) ? tickets[k].stall[0].stall_name : null ) : null)}
                 </td>
                <td>{date.format(new Date(tickets[k].created),"DD/MM/YYYY hh:mm:ss A")}</td>
                <td>{tickets[k].units}</td>
                <td>{!empty(tickets[k].ticket_office) && !empty(tickets[k].ticket_office[0].currency_code) ? formatNumber(tickets[k].ticket_office[0].currency_code, tickets[k].amount) : null}</td>
                <td>{!empty(tickets[k].ticket_office) && !empty(tickets[k].ticket_office[0].currency_code) ? formatNumber(tickets[k].ticket_office[0].currency_code, tickets[k].total_to_pay) : null} 
                </td>
                <td>{!empty(tickets[k].ticket_status) && !empty(tickets[k].ticket_status[0].name) ? tickets[k].ticket_status[0].name : null }</td>
                <td>{this.horsesNames(tickets[k],tickets[k].wager_type[0].id)}
                </td>
                <td>{!empty(tickets[k].wager_type) && !empty(tickets[k].wager_type[0]) ? this.racesNumber(tickets[k].horse_races,tickets[k].wager_type[0].id): null}</td>
                <td>{(!empty(tickets[k].wager_type) && !empty(tickets[k].wager_type[0]) && tickets[k].wager_type[0].id!==34) ? !empty(tickets[k].track) && !empty(tickets[k].track[0].name ) ? tickets[k].track[0].name : !empty(tickets[k].horse_races) && !empty(tickets[k].horse_races[0]) ? tickets[k].horse_races[0].track_name : null : `Múltiples Hipódromos`} </td>
            </tr>)
        }
        return rows;
    }

    dataToCSV = ({rows} = {rows}) => {
        let array = [];
        let date = require('date-and-time');    
        if(!empty(rows)){
            rows.map((row) =>
                array.push({
                    ticketOffices: !empty(row.ticket_office) && !empty(row.ticket_office[0]) ?  row.ticket_office[0].name : '',
                    number:row.number,
                    confirm: 0,
                    wagerType: !empty(row.wager_type) && !empty(row.wager_type[0]) ? row.wager_type[0].name : '',
                    created: date.format(new Date(row.created),"DD/MM/YYYY hh:mm:ss A"),
                    units: !empty(row.units) ? row.units.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '',
                    amount: !empty(row.amount) ? row.amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0,
                    totalToPay: !empty(row.total_to_pay) ? row.total_to_pay.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0,
                    ticketsStatus: !empty(row.ticket_status) && !empty(row.ticket_status[0]) ? row.ticket_status[0].name : '' ,
                    horseName: '',
                    raceNumber: '',
                    trackName: !empty(row.track) && !empty(row.track[0]) ? row.track[0].track_name : '' ,
                    userInmejorable: !empty(row.user) && !empty(row.user[0]) ? row.user[0].user_inmejorable : ''
                })
            );
        }
        return array;
    }
    
    render() {
        const user = this.props.user;
        const tickets = this.props.tickets;
        const totalResults = this.props.totalResultsTickets;
        let dataCSV =  this.dataToCSV({rows : tickets});
        
        return (
                <div className="col-lg-12">
                <Card>
                    <Card.Header>
                        <Card.Title>Tickets Vendidos de Puestos y Tablas Fijas por el modulo de Taquilla Física para Caballos Nacionales</Card.Title>
                    </Card.Header>
                    <Card.Body>
                    <Dialog ref={(component) => { this.dialog = component }} />
                    <PaginationComponent
                                {...this.props}
                                url={'/tickets-stalls/page/'}
                                exportCsvHeaders={headersCSV} 
                                exportCsvData={dataCSV} 
                                exportCsvFileName={"tickets-stalls.csv"} 
                                totalResults={(!empty(totalResults) ? totalResults: 0)} 
                                 />
                            {(!empty(tickets) ? 
                                <Table bordered hover responsive>
                                <thead>
                                
                                    <tr>
                                    <th>Taquilla</th>
                                    <th>Número</th>
                                    <th>Confirmación</th>
                                    <th>Apuesta</th>
                                    <th>Fecha</th>
                                    <th>Unidades</th>
                                    <th>Monto</th>
                                    <th>Premio</th>
                                    <th>Status</th>
                                    <th>Caballo</th>
                                    <th>Carrera</th>
                                    <th>Hipódromo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.loadRows() }
                                </tbody>
                            </Table>
                            :  
                            <p>No hay registros para mostrar</p>
                            )}   
                        
                    </Card.Body>
                </Card>
                </div>
        );
    }
}

export default TicketsListStallsFixedTables; 