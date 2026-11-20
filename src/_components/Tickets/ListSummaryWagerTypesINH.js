import React from 'react';
import empty from 'is-empty';

import {Table, Card, Badge} from 'react-bootstrap';

import PaginationComponent from '../PaginationComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {formatNumber} from '../../_helpers/lib';
import {parseUrlParams} from '../../_helpers/lib';
import moment from 'moment-timezone';


 const headersCSV = [
    { label: "Centro", key: "centers" },
    { label: "Taquilla", key: "ticketOffices" },
    { label: "Fecha", key: "date" },
    { label: "Vendido", key: "sold" },
    { label: "Anulado", key: "canceled" },
    { label: "Por Pagar", key: "payable" },
    { label: "Pagado", key: "paid" },
    { label: "Balance", key: "profit" },
  ];

class TicketsSummaryWagerTypesINH extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params:
            {
                page:1,
                orderBy: 'TICKET_OFFICES_DESC'
            }
        };
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

    loadOptions(row){

        const {user} = this.props;

        if(!empty(user)){

            if((user.role_name == 'SUPERVISOR') || (user.role_name == 'SUPERUSER'))  {
                return this.loadOptions_SUPERUSER(row)
            }

        }

    }


    loadRows = () => {
        let rows= []
        
        const tickets = this.props.ticketsWagerTypesINH;
        
        if(empty(tickets)){
            return (
                <tr>
                    <td colSpan="14">{(this.props.loading > 0) ? 'Actualizando información..' : '' }</td>
                </tr>
            );
        }
        let total_sold = [];
        let total_payable = [];
        let total_paid = [];
        let total_profit = [];
         
        for(let k in tickets){  
            rows.push(<tr className="tr-ticketsummary" key={tickets[k].sold}>
            <td>{tickets[k].ticketOffices}</td>
            <td>{tickets[k].name}</td>
            <td>{(!empty(tickets[k].created) ? moment(tickets[k].created).tz("America/Caracas").format('DD-MM-YYYY') : '')}</td>
            <td>{(!empty(tickets[k].currencyCode) ? formatNumber(tickets[k].currencyCode,tickets[k].sold) : '' )}</td>
            <td>{(!empty(tickets[k].currencyCode) ? formatNumber(tickets[k].currencyCode,tickets[k].payable) : '' )}</td>
            <td>{(!empty(tickets[k].currencyCode) ? formatNumber(tickets[k].currencyCode,tickets[k].paid): '' )}</td>
            <td>{(!empty(tickets[k].currencyCode) ? formatNumber(tickets[k].currencyCode,tickets[k].profit): '' )}</td>
        </tr>);
                
            if(!empty(tickets[k].created) 
            && !empty(tickets[k].currencyCode) ) {
                total_sold[tickets[k].currencyCode]     = (!empty(total_sold[tickets[k].currencyCode]) ? total_sold[tickets[k].currencyCode] : 0) +tickets[k].sold;
                total_payable[tickets[k].currencyCode]  = (!empty(total_payable[tickets[k].currencyCode]) ? total_payable[tickets[k].currencyCode] : 0) +tickets[k].payable;
                total_paid[tickets[k].currencyCode]     = (!empty(total_paid[tickets[k].currencyCode]) ? total_paid[tickets[k].currencyCode] : 0) +tickets[k].paid;
                total_profit[tickets[k].currencyCode]   = (!empty(total_profit[tickets[k].currencyCode]) ? total_profit[tickets[k].currencyCode] : 0) +tickets[k].profit;
                 
            }
                            
        }

        for(let l in total_sold){  
            if(!empty(l) || l!=undefined)
            {
                rows.push(<tr className="tr-ticketsummary" key={'total_'+total_sold[l]}>
                <td colSpan='3' align='center'><b>TOTAL {l}</b></td>
                <td><Badge variant="dark">{(!empty(l) ? formatNumber(l,total_sold[l]) : '' )}</Badge></td>
                <td><Badge variant="dark">{(!empty(l) ? formatNumber(l,total_payable[l]) : '' )}</Badge></td>
                <td><Badge variant="dark">{(!empty(l) ? formatNumber(l,total_paid[l]) : '' )}</Badge></td>
                <td><Badge variant={((total_profit[l] >=0) ? 'success' : 'danger')}>{(!empty(l) ? formatNumber(l,total_profit[l]) : '' )}</Badge></td>
                </tr>); 
            }   
        } 
        return rows;
    }

    dataToCSV = ({rows} = {rows}) => {
        let array = [];
        let date = require('date-and-time');    
        if(!empty(rows)){
            rows.map((row) =>
                array.push({
                    centers:row.centers,
                    ticketOffices:row.ticketOffices,
                    created: date.format(new Date(row.created),"DD/MM/YYYY hh:mm:ss A"),
                    sold: row.sold,
                    canceled: row.canceled,
                    payable: row.payable,
                    paid: row.paid,
                    profit: row.profit
                })
            );
        }
        return array;
    }
    
    render() {
        const user = this.props.user;
        const tickets = this.props.ticketsWagerTypesINH;
        const totalResults = this.props.totalResults;
        let dataCSV =  this.dataToCSV({rows : tickets});
        
        return (
                <Card>
                    <Card.Header>
                        <Card.Title>Total de Taquillas Por Tipo de Apuesta INH</Card.Title>
                    </Card.Header>
                    <Card.Body>
                    <PaginationComponent
                                {...this.props}
                                url={'/tickets-wager-types-inh/page/'}
                                exportCsvHeaders={headersCSV} 
                                exportCsvData={dataCSV} 
                                exportCsvFileName={"tickets-wager-types-inh.csv"} 
                                totalResults={(!empty(totalResults) ? totalResults: 0)} 
                                 />
                     {(!empty(tickets) ? 
                        <Table  bordered hover responsive>
                        <thead>
                        
                            <tr>
                                <th>Taquilla</th>
                                <th>Tipo de Apuesta</th>
                                <th>Fecha</th>
                                <th>Vendido</th>
                                <th>Por Pagar</th>
                                <th>Pagado</th>
                                <th>Balance</th>
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
        );
    }
}

export default TicketsSummaryWagerTypesINH; 