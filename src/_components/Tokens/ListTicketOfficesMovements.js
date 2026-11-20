import React from 'react';
import empty from 'is-empty';
import { getSecureGetParams } from '../../_helpers/lib';
import {formatNumber} from '../../_helpers/lib'; 
import {Table, Card,Button} from 'react-bootstrap';
import Dialog from 'react-bootstrap-dialog';


class ListTicketOfficesMovements extends React.Component {

    constructor(props) { 
        super(props);
        
    }

    componentWillMount(){

        this.setState({
            loadingData: true,
            model: {
                id : this.props.match.params.id
            }
        })
        
        const getParams = getSecureGetParams(this.props.match.params.id);
        this.props.TicketOfficesActions({ action: 'getAllTicketOfficesMovements', params: {params : {id: getParams.id }} });

    }

    loadRows = () => {
        let rows= []
        
        const ticketofficesmovements = this.props.ticketofficesmovements;
        let descriptionText = [];
        descriptionText['TICKET_PAY'] = 'TICKET PAGADO';
        descriptionText['TICKET_SOLD'] = 'TICKET VENDIDO';
        descriptionText['TICKET_REFUND'] = 'TICKET DEVUELTO';
        descriptionText['TICKET_OFFICES_OPEN'] = 'MONTO APERTURA';
        descriptionText['TICKET_OFFICES_CLOSE'] = 'MONTO CIERRE';
        let user = this.props.user;
        let currencyCode = !empty(user) ? user.currency_code : null;
        
        if(empty(ticketofficesmovements)){
            return (
                <tr>
                    <td colSpan="14">{(this.props.loading > 0) ? 'Actualizando información..' : '' }</td>
                </tr>
            );
        }
        let date = require('date-and-time');
        let balance = 0;
        for(let k in ticketofficesmovements){  
            const detailParams = {
                id : ticketofficesmovements[k].id
            }
            if(ticketofficesmovements[k].description!=='TICKET_OFFICES_CLOSE'){
                ticketofficesmovements[k].typeMovement === 'DEBIT' ? balance -= ticketofficesmovements[k].amount : balance += ticketofficesmovements[k].amount;
            }
            
            rows.push(<tr key={k}>
                <td>{date.format(new Date(ticketofficesmovements[k].createdAt),"DD/MM/YYYY hh:mm:ss A")}</td>
                <td>{descriptionText[ticketofficesmovements[k].description] || ticketofficesmovements[k].description}</td> 
                <td>{ticketofficesmovements[k].reference}</td>
                <td>{ticketofficesmovements[k].typeMovement === 'DEBIT' ? `-${formatNumber(currencyCode,ticketofficesmovements[k].amount)}` : formatNumber(currencyCode,ticketofficesmovements[k].amount)}</td>
                <td></td>
            </tr>)
        }
        rows.push(<tr>
            <td colSpan="3" style={{textAlign: 'right'}}><b>BALANCE</b></td>
            <td>{formatNumber(currencyCode,balance)}</td>
            <td></td>
        </tr>)
        return rows;
    }
  
    render() {
        const user = this.props.user;
        const totalResults = this.props.totalResults;
        
        return (
                <Card>
                    <Card.Header>
                        <Card.Title>Movimientos de Taquilla del Token </Card.Title>
                    </Card.Header>
                    <Card.Body>
                    <Dialog ref={(component) => { this.dialog = component }} />
                    
                     {(!empty(this.props.ticketofficesmovements) ? 
                        <Table  bordered hover responsive>
                        <thead>
                        
                            <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Referencia</th>
                            <th>Monto</th>
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

export default ListTicketOfficesMovements;