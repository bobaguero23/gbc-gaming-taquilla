import React from 'react';
import empty from 'is-empty';

import {Table, Card,Button} from 'react-bootstrap';

import PaginationComponent from '../PaginationComponent';
import Dialog from 'react-bootstrap-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from "react-router-bootstrap"; 

import {parseUrlParams,buildSecureGetParams} from '../../_helpers/lib';


 const headersCSV = [
    { label: "Taquilla", key: "ticketOfficeName" },
    { label: "Rule", key: "rule" },
  ];

class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params:
            {
                page:1,
                orderBy: 'ID_ASC',
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

    loadRows = () => {
        let rows= []
        const user = this.props.user;
        const tokens = this.props.tokens;

        console.log('user',user);
        
        if(empty(tokens)){
            return (
                <tr>
                    <td colSpan="14">{(this.props.loading > 0) ? 'Actualizando información..' : '' }</td>
                </tr>
            );
        }
        let date = require('date-and-time');

        for(let k in tokens){  
            const detailParams = {
                id : tokens[k].id
            }
            rows.push(<tr key={k}>
                <td>{date.format(new Date(tokens[k].created),"DD/MM/YYYY hh:mm:ss A")}</td>
                <td>{tokens[k].value}</td> 
                <td>{tokens[k].tokensStatusByTokensStatusId.description}</td>
                <td>
                    {user.centers_id === 177 ? 
                    <>
                    <LinkContainer to={`/tokens/details/${buildSecureGetParams(detailParams)}`}>
                    <Button size="sm" variant="primary">Ver Detalle</Button>
                    </LinkContainer>
                    <br /></>
                    : null}
                    <br />
                    <LinkContainer to={`/tokens/ticketsoffices-movements/${buildSecureGetParams(detailParams)}`}>
                    <Button size="sm" variant="primary">Ver Movimientos</Button>
                    </LinkContainer>
                    </td>
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
                    centerName:row.centerName,
                    ticketOfficeName:row.ticketOfficeName,
                    clientName:row.firstName + " " + row.lastName + "/" + row.userInmejorable,
                    playing: row.playing
                })
            );
        }
        return array;
    }
    
    render() {
        const user = this.props.user;
        const totalResults = this.props.totalResults;
        let dataCSV =  this.dataToCSV({rows : this.props.ticketofficesinhinmejorable});
        
        return (
                <Card>
                    <Card.Header>
                        <Card.Title>Turnos</Card.Title>
                    </Card.Header>
                    <Card.Body>
                    <Dialog ref={(component) => { this.dialog = component }} />
                    <PaginationComponent
                                {...this.props}
                                url={'/tokens/page/'}
                                exportCsvHeaders={headersCSV} 
                                exportCsvData={dataCSV} 
                                exportCsvFileName={"tokens.csv"} 
                                totalResults={(!empty(totalResults) ? totalResults: 0)} 
                                 />
                     {(!empty(this.props.tokens) ? 
                        <Table  bordered hover responsive>
                        <thead>
                        
                            <tr>
                            <th>Fecha</th>
                            <th># Turno</th>
                            <th>Estatus</th>
                            <th>Accion</th>
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

export default List; 