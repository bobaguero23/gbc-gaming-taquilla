import React from 'react';
import empty from 'is-empty';

import {Table, Card,Button,OverlayTrigger,Tooltip} from 'react-bootstrap';

import PaginationComponent from '../PaginationComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from "react-router-bootstrap";
import { buildSecureGetParams, horsesNames } from '../../_helpers/lib';

import {formatNumber} from '../../_helpers/lib';
import {parseUrlParams} from '../../_helpers/lib';

import Dialog from 'react-bootstrap-dialog';
import { renderToString } from 'react-dom/server';


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
    { label: "Hipódromo", key: "trackName" },
    { label: "Caballo", key: "horseName" },
    { label: "Usuario", key: "userInmejorable" },
  ];

class TicketsListElInmejorableINH extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params:
            {
                page:1,
                orderBy: 'CREATED_AT_DESC'
            }
        };
    }

        raceText(races){
        let raceArray = [];
        let raceText = [];
        for(let race of races){
          if(!empty(raceArray[race.raceNumber])){
            raceArray[race.raceNumber].push(race.horseNumber);
          }else{
            raceArray[race.raceNumber] = [race.horseNumber];
          }
          
        }
    
        for (let raceNumber in raceArray) {
          let horses = raceArray[raceNumber].toString();
          raceText.push(<>{raceNumber}) <b>{horses}</b> </>);
        }
    
        return raceText;
    
      }

    horsesNames = (horsesaces,wager_type_id) =>{ // HORSESRACES ES IGUAL A TICKETSDETAILS EN ESTA FUNCION
        let horses_name = [];
        let raceArray = [];
         
        if(wager_type_id==4 || wager_type_id==5 || wager_type_id==6){
            for(let race of horsesaces){
                if(!empty(race)){
                    if(!empty(raceArray[race.race_number])){
                        raceArray[race.race_number].push(<>Posición: <b>{race.place}</b><span> Caballo: <b>{race.program_number} - {race.horse_name}</b> </span> <br /></>);
                      }else{
                        raceArray[race.race_number] = [];
                        raceArray[race.race_number].push(<>Posición: <b>{race.place}</b> <span> Caballo: <b>{race.program_number} - {race.horse_name} </b></span> <br /></>);
                      }
                } 
              }
          
              for (let raceNumber in raceArray) {
                let horses = raceArray[raceNumber];
                horses_name.push(<>Carrera: {raceNumber}) {horses} </>);
              }

        }else{
            for(let race of horsesaces){
                
                if(!empty(race)){
                    if(!empty(raceArray[race.race_number])){
                    raceArray[race.race_number].push(<span>{race.program_number} - {race.horse_name} </span>);
                    }else{
                    raceArray[race.race_number] = [];
                    raceArray[race.race_number].push(<><span>{race.program_number} - {race.horse_name} </span></>);
                    }
                }
                
              }
          
              for (let raceNumber in raceArray) {
                let horses = raceArray[raceNumber];
                horses_name.push(<>Carrera: {raceNumber}) <b>{horses}</b> </>);
              }   
        }
        return horses_name;
      }

      horsesNamesToCsv = (horsesaces,wager_type_id) =>{ // HORSESRACES ES IGUAL A TICKETSDETAILS EN ESTA FUNCION
        let horses_name = [];
        let raceArray = [];
         
        if(wager_type_id==4 || wager_type_id==5 || wager_type_id==6){
            for(let race of horsesaces){
                if(!empty(race)){
                    if(!empty(raceArray[race.race_number])){
                        raceArray[race.race_number].push(<>Posición: {race.place} Caballo: {race.program_number} - {race.horse_name}</>);
                      }else{
                        raceArray[race.race_number] = [];
                        raceArray[race.race_number].push(<>Posición: {race.place} Caballo: {race.program_number} - {race.horse_name}</>);
                      }
                } 
              }
          
              for (let raceNumber in raceArray) {
                let horses = raceArray[raceNumber];
                horses_name.push(<>Carrera: {raceNumber}) {horses} </>);
              }

        }else{
            for(let race of horsesaces){
                
                if(!empty(race)){
                    if(!empty(raceArray[race.race_number])){
                    raceArray[race.race_number].push(<>{race.program_number} - {race.horse_name}</>);
                    }else{
                    raceArray[race.race_number] = [];
                    raceArray[race.race_number].push(<>{race.program_number} - {race.horse_name}</>);
                    }
                }
                
              }
          
              for (let raceNumber in raceArray) {
                let horses = raceArray[raceNumber];
                horses_name.push(<>Carrera: {raceNumber}) {horses}</>);
              }   
        }
        return horses_name;
      }

    racesNumber = (horsesaces,wager_type_id) =>{
        let races_name = [];
        
        if( wager_type_id>=10 && wager_type_id<=14){
            for(let l=0;l<horsesaces.length;l++){
                if(!empty(horsesaces[l].horsesRaceByHorsesRacesId.raceByRacesId)){
                    races_name.push(<> {horsesaces[l].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber} / </>);
                }
                
            }
        }else{
            if(!empty(horsesaces[l].horsesRaceByHorsesRacesId.raceByRacesId)){
                races_name.push(<> {horsesaces[0].horsesRaceByHorsesRacesId.raceByRacesId.raceNumber} </>);
            }
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

        
        if( newProps.ticket_refund_id != this.props.ticket_refund_id) {
            params = parseUrlParams(params,this.props.location.search);
            this.props.onLoadList({
                params
            }); 
        }

        
    }

    loadOptions(row){
        return this.loadOptions_SUPERUSER(row)
    }

    refundTicket = (id) => {
        this.dialog.show({
            title: 'Confirmar',
            body: 'Desea anular el ticket?',
            actions: [
                Dialog.CancelAction(),
                Dialog.OKAction(() => {
                    this.props.refundTicket(id)
                })
            ],
        })
    }

    loadOptions_SUPERUSER = (row) =>{
        
        return (<>
            <OverlayTrigger
            key={row.id}
            placement={'top'}
            overlay={
                <Tooltip id={`tooltip-${row.id}`}>
                    Anular ticket
                </Tooltip>
            }
            >
                <Button variant="info" onClick={() => {
                    this.refundTicket(row.id)
                }} >
                    <FontAwesomeIcon 
                        icon='minus-circle'
                    />
                </Button>
            </OverlayTrigger>
            </>)
    }


    loadRows = () => {
        let rows= [];
        const {user} = this.props;
        
        const ticketsINH = this.props.ticketsINH;
        let tickets = ticketsINH;
        let statusArray = [];
        statusArray[10] = 'Perdedor';
        statusArray[3] = 'Ganador';
        statusArray[11] = 'Enviado a Billetera del Cliente';
        statusArray[12] = 'Devolución Enviada a Billetera del Cliente';
        statusArray[2] = 'Totalizado INH';
        statusArray[7] = 'Anulado';
        statusArray[4] = 'Devuelto';
        statusArray[6] = 'Retirado';
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
            
            rows.push(<tr key={Math.random()}>
                <td>{!empty(tickets[k].ticket_office) && !empty(tickets[k].ticket_office[0].name)  ? tickets[k].ticket_office[0].name : null}</td>
                <td>{!empty(tickets[k]) && !empty(tickets[k].id_transaction_inh) ? `****${(tickets[k].id_transaction_inh.toString().substring(4,7))}` : null }</td>
                <td>{user.role_name=='public_admin' ? <LinkContainer to={`/tickets-elinmejorable-inh/tickets_details/${buildSecureGetParams(detailParams)}`}>
                    <Button size="sm" variant="primary">{!empty(tickets[k]) && !empty(tickets[k].ticket_confirm) ? `****${(tickets[k].ticket_confirm[0].confirm.substring(4,7))}` : `****${(tickets[k].confirm.substring(4,7))}` }</Button>
                    </LinkContainer> : !empty(tickets[k]) && !empty(tickets[k].ticket_confirm) ? `****${(tickets[k].ticket_confirm[0].confirm.substring(4,7))}` : `****${(tickets[k].confirm.substring(4,7))}` }</td>
                <td>{!empty(tickets[k].wager_type) && !empty(tickets[k].wager_type[0] ) ? tickets[k].wager_type[0].description : null} 
                </td>
                <td>{date.format(new Date(tickets[k].created_at),"DD/MM/YYYY hh:mm:ss A")}</td>
                <td>{tickets[k].ticket_units}</td>
                <td>{!empty(tickets[k].currency_code) ? formatNumber(tickets[k].currency_code, tickets[k].ticket_amount) : null}</td>
                <td>{!empty(tickets[k].currency_code) ? formatNumber(tickets[k].currency_code, tickets[k].ticket_total_to_pay) : null}</td>
                <td>{!empty(tickets[k].status) ? statusArray[tickets[k].status] : null }</td>
                <td>{(!empty(tickets[k].horse_races) ? this.horsesNames(tickets[k].horse_races,tickets[k].wager_type[0].id): null )}</td>
                <td><b>{tickets[k].track_name}</b><br />
                Fecha de Carrera:{!empty(tickets[k].horse_races) ? date.format(new Date(tickets[k].horse_races[0].race_date),"DD/MM/YYYY hh:mm:ss A") : date.format(new Date(tickets[k].race_date),"DD/MM/YYYY")} 
                </td>
                <td>{!empty(tickets[k].user) && !empty(tickets[k].user[0]) ? 
                !empty(tickets[k].ticket_office) && (tickets[k].ticket_office[0].center_id == 1) ? tickets[k].user[0].user_alias :
                `${tickets[k].user[0].user_inmejorable}` : null}</td>
                <td>{!empty(user) && !empty(user.role_name) && (user.role_name==='public_account' || user.role_name==='role_centers') && !empty(tickets[k].status) && tickets[k].status===2 ? 
                 this.loadOptions(tickets[k]) : null}</td>
            </tr>)
        }
        return rows;
    }

    dataToCSV = ({rows} = {rows}) => {
        let array = [];
        let date = require('date-and-time');    
        let statusArray = [];
        statusArray[10] = 'Perdedor';
        statusArray[3] = 'Ganador';
        statusArray[11] = 'Enviado a Billetera del Cliente';
        statusArray[2] = 'Totalizado INH';
        statusArray[7] = 'Anulado';
        if(!empty(rows)){
            rows.map((row) => {
                array.push({
                    ticketOffices:!empty(row) && !empty(row.ticket_office) ? row.ticket_office[0].name : '',
                    number:row.idTransactionInh,
                    confirm: 0,
                    wagerType: !empty(row) && !empty(row.wager_type) ? row.wager_type[0].description : '',
                    created: date.format(new Date(row.created_at),"DD/MM/YYYY hh:mm:ss A"),
                    units: !empty(row.ticket_units) ? row.ticket_units.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '',
                    amount: !empty(row.ticket_amount) ? row.ticket_amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0,
                    totalToPay: !empty(row.ticket_total_to_pay) ? row.ticket_total_to_pay.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0, 
                    ticketsStatus: statusArray[row.status],
                    trackName: row.track_name,
                    horseName: !empty(row) && !empty(row.horse_races) ? renderToString(this.horsesNamesToCsv(row.horse_races,row.wager_type[0].id)).replace(/<!-- -->/g,' ') : '',
                    userInmejorable: !empty(row) && !empty(row.user) ? row.user[0].user_inmejorable : ''
                });
                }
            );
        }
        return array;
    }
    
    render() {
        const user = this.props.user;
        const ticketsINH = this.props.ticketsINH;
        let tickets = ticketsINH;
        const totalResults = this.props.totalResultsINH;
        let dataCSV =  this.dataToCSV({rows : ticketsINH});
        
        return (
            <div className="col-lg-12">
                <Dialog ref={(component) => { this.dialog = component }} />
                <Card>
                    <Card.Header>
                        <Card.Title>Tickets Vendidos en el INH por modulo de Taquilla Física</Card.Title>
                    </Card.Header>
                    <Card.Body>
                    <PaginationComponent
                                {...this.props}
                                url={'/tickets-inh/page/' }
                                exportCsvHeaders={headersCSV} 
                                exportCsvData={dataCSV} 
                                exportCsvFileName={"tickets-elinmejorable-inh.csv"} 
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
                                    <th>Caballos</th>
                                    <th>Hipódromo</th>
                                    <th>Usuario</th>
                                    <th></th>
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

export default TicketsListElInmejorableINH; 