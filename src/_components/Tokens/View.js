import React from 'react';
import empty from 'is-empty';
import Dialog from 'react-bootstrap-dialog'
import {Table, Card,Badge} from 'react-bootstrap';
import { getSecureGetParams } from '../../_helpers/lib';
import PrintCloseElement from '../PrintCloseElement';

import {formatNumber} from '../../_helpers/lib'; 



class TokensView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            print:false,
            printTagClose:null,
            params:
            {
                page:1,
                orderBy: 'ID_DESC'
            }
        };
    }

    componentWillMount(){

        this.setState({
            loadingData: true,
            model: {
                id : this.props.match.params.id
            }
        })
        
        const getParams = getSecureGetParams(this.props.match.params.id);
        this.props.TokensActions({ action: 'getTokenInfo', params: {params : {id: getParams.id }} });

    }

    

    handlePrint = (e,tokendetail) =>{
        e.preventDefault();

        this.setState ( {
            print:true,
            printTagClose:(
                <table>
                    <tbody>
                        <tr>
                            <td colSpan="2">Taquilla:{tokendetail.ticketOffices}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Turno:{tokendetail.tokenValue}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                Detalle del saldo
                            </td>
                        </tr>
                        <tr>
                            <td>Monto de Apertura:</td>
                            <td>{tokendetail.funds}</td>
                        </tr>
                        <tr>
                            <td>Vendido Ganadores:</td>
                            <td>{tokendetail.soldWin}</td>
                        </tr>
                        <tr>
                            <td>Pagado Ganadores:</td>
                            <td>{tokendetail.paidWin}</td>
                        </tr>
                        <tr>
                            <td>Reembolso Ganadores:</td>
                            <td>{tokendetail.refundWin}</td>
                        </tr>
                        <tr>
                            <td>Saldo Ganadores:</td>
                            <td>{tokendetail.balanceWin}</td>
                        </tr>
                        <tr>
                            <td>Vendido Tabla Fija:</td>
                            <td>{tokendetail.soldFixed}</td>
                        </tr>
                        <tr>
                            <td>Pagado Tabla Fija:</td>
                            <td>{tokendetail.paidFixed}</td>
                        </tr>
                        <tr>
                            <td>Reembolso Tabla Fija:</td>
                            <td>{tokendetail.refundFixed}</td>
                        </tr>
                        <tr>
                            <td>Saldo Tabla Fija:</td>
                            <td>{tokendetail.balanceFixed}</td>
                        </tr>
                        <tr>
                            <td>Vendido Puestos:</td>
                            <td>{tokendetail.soldStall}</td>
                        </tr>
                        <tr>
                            <td>Pagado Puestos:</td>
                            <td>{tokendetail.paidStall}</td>
                        </tr>
                        <tr>
                            <td>Reembolso Puestos:</td>
                            <td>{tokendetail.refundStall}</td>
                        </tr>
                        <tr>
                            <td>Saldo Puestos:</td>
                            <td>{tokendetail.balanceStall}</td>
                        </tr>
                        <tr>
                            <td>Monto colocado en el cierre:</td>
                            <td>{tokendetail.closemoney}</td>
                        </tr>
                        <tr>
                            <td>Saldo Final:</td>
                            <td>{tokendetail.balance}</td>
                        </tr>
                    </tbody>
                </table>)
                });
       
    }

    

    loadRows = () => {
        let rows= [];
        let user = this.props.user;
        let currencyCode = !empty(user) ? user.currency_code : null;
        
        const tokendetail = this.props.tokendetail;
        
        if(empty(tokendetail)){
            return (
                <tr>
                    <td colSpan="14">{(this.props.loading > 0) ? 'Actualizando información..' : '' }</td>
                </tr>
            );
        }
        let date = require('date-and-time');

        if(!empty(tokendetail)){
            rows.push(<tbody>
                <tr key={0}>
                    <td>Vendido Ganador</td>
                    <td>Pagado Ganador</td> 
                    <td>Por Pagar</td> 
                    <td>Balance Ganador</td> 
                    <td>{' '}</td> 
                </tr>
                <tr key={1}>
                    <td>{formatNumber(currencyCode,tokendetail[0].soldWin)}</td>
                    <td>{formatNumber(currencyCode,tokendetail[0].paidWin)}</td> 
                    <td>{formatNumber(currencyCode,tokendetail[0].payable)}</td> 
                    <td>{formatNumber(currencyCode,tokendetail[0].balanceWin)}</td> 
                    <td><Badge pill variant={'danger'} onClick={(e) => {this.handlePrint(e,tokendetail[0])}} style={{cursor:'pointer'}}>Imprimir</Badge></td> 
                </tr>
                <tr key={2}>
                    <td>Vendido Tabla Fija</td>
                    <td>Pagado Tabla Fija</td> 
                    <td>Por Pagar</td> 
                    <td>Balance Tabla Fija</td> 
                    <td>{' '}</td> 
                </tr>
                <tr key={3}>
                    <td>{formatNumber(currencyCode,tokendetail[0].soldFixed)}</td>
                    <td>{formatNumber(currencyCode,tokendetail[0].paidFixed)}</td> 
                    <td>{formatNumber(currencyCode,tokendetail[0].payable)}</td> 
                    <td>{formatNumber(currencyCode,tokendetail[0].balanceFixed)}</td> 
                    <td>{' '}</td> 
                </tr>
                <tr key={4}>
                    <td>Vendido Puestos</td>
                    <td>Pagado Puestos</td> 
                    <td>Por Pagar</td> 
                    <td>Balance Puestos</td> 
                    <td>{' '}</td> 
                </tr>
                <tr key={5}>
                    <td>{formatNumber(currencyCode,tokendetail[0].soldStall)}</td>
                    <td>{formatNumber(currencyCode,tokendetail[0].paidStall)}</td> 
                    <td>{formatNumber(currencyCode,tokendetail[0].payable)}</td> 
                    <td>{formatNumber(currencyCode,tokendetail[0].balanceStall)}</td> 
                    <td>{''}</td> 
                </tr>
                <tr key={5}>
                    <td colSpan={5}>BALANCE TOTAL:{formatNumber(currencyCode,tokendetail[0].balance)}</td> 
                </tr>
            </tbody>)
        }


        for(let k in tokendetail){  
            
        }
        return rows;
    }

    render() {
        const {printTagClose,print} = this.state;
             
        return (
            <> {( print && !empty(printTagClose) ? 
                <PrintCloseElement pPrintTag={printTagClose} />
            : '' )}
            <div className="col-lg-12">
                

                <Card>
                    <Card.Header>
                        <Card.Title>Detalle del Turno {!empty(this.props.tokendetail) && !empty(this.props.tokendetail[0]) ? this.props.tokendetail[0].tokenValue : ''}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                    <Dialog ref={(component) => { this.dialog = component }} />
                    
                     {(!empty(this.props.tokendetail) ? 
                        <Table  bordered hover responsive>
                        { this.loadRows() }
                        
                    </Table>
                     :  
                     <p>No hay registros para mostrar</p>
                     )}   
                        
                    </Card.Body>
                </Card>
                
            </div>
            </>
        );
    }
}

export default TokensView; 