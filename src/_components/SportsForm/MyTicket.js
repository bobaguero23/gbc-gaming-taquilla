import React from "react";
import { connect } from "redux-zero/react";
import { Card, Row, Col, Image,Tabs, Tab, Form, Badge, Button } from "react-bootstrap";
import empty from "is-empty";
import actions from "../../_actions";
import { formatNumber } from "../../_helpers/lib";
import { translateType,translateDescription } from "../../_helpers/libSport";
import NumberFormat from 'react-number-format';

class MyTicket extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: null
        };
    }

    handleSelect = (eventKey) => {
        this.setState({
            activeKey: eventKey
        })
    }

    render() {
        const {sellform,currencyCode,valueUnits,user,ticketoffice,events,usersGamification,showOdds} = this.props;
        let centers_id =  (!empty(user)) ? user.centers_id : '';
        let eventsSelected = sellform.events;
        let date = require('date-and-time');

        let fastAmountUsd = [];
        fastAmountUsd[0] = 1;
        fastAmountUsd[1] = 2;
        fastAmountUsd[2] = 3;
        fastAmountUsd[3] = 4;
        fastAmountUsd[4] = 5;
        fastAmountUsd[5] = 10;
        fastAmountUsd[6] = 15;
        fastAmountUsd[7] = 20;
        fastAmountUsd[8] = 25;
        fastAmountUsd[9] = 30;
        fastAmountUsd[10] = 50;
        fastAmountUsd[11] = 100;
        fastAmountUsd[12] = 500;
        fastAmountUsd[13] = 1000;
        fastAmountUsd[14] = 2500;
        fastAmountUsd[15] = 5000;
        fastAmountUsd[16] = 10000;
        fastAmountUsd[17] = 15000;

       

        let fastAmount = [];
        fastAmount[0] = fastAmountUsd[0];
        fastAmount[1] = fastAmountUsd[1];
        fastAmount[2] = fastAmountUsd[2];
        fastAmount[3] = fastAmountUsd[3];
        fastAmount[4] = fastAmountUsd[4];
        fastAmount[5] = fastAmountUsd[5];
        fastAmount[6] = fastAmountUsd[6];
        fastAmount[7] = fastAmountUsd[7];
        fastAmount[8] = fastAmountUsd[8];
        fastAmount[9] = fastAmountUsd[9];
        fastAmount[10] = fastAmountUsd[10];
        fastAmount[11] = fastAmountUsd[11];
        fastAmount[12] = fastAmountUsd[12];
        fastAmount[13] = fastAmountUsd[13];
        fastAmount[14] = fastAmountUsd[14];
        fastAmount[15] = fastAmountUsd[15];
        fastAmount[16] = fastAmountUsd[16];
        fastAmount[17] = fastAmountUsd[17];


        let hasRisk = true;

        let individual = [];
        let multiple = [];
        
        eventsSelected.sort((a,b) => a.key - b.key);
        
        let activeKey = empty(this.state.activeKey) ? 1 : this.state.activeKey;

        if(empty(this.state.activeKey) && eventsSelected.length > 1) {
            activeKey = 2;
        } 

        if(!empty(this.state.activeKey) && eventsSelected.length == 1){
            activeKey = 1;
        }


        let eventsMultiples = [];
        let hasMultiSelectEvent = false;
        let intervalSimpleRisk = null;

        if(this.props.sportNameSelected=='Soccer'){
            eventsSelected.map((event) => {
                if(empty(eventsMultiples[event.eventId])){
                    eventsMultiples[event.eventId] = event.eventId;
                }else{
                    hasMultiSelectEvent = true;
                }
            })
        }


        for(let k=0;k<eventsSelected.length;k++){
            let eventFilter = [];
            eventFilter[0] = eventsSelected[k].eventSource;

            if(empty(eventsSelected[k].risk) || eventsSelected[k].risk == 0){
                hasRisk=false;
            }
            
            individual.push(
                <div className={'sport-ticket-selection'} key={`selection-${eventsSelected[k].key}-${Math.random()}`}>
                    <Row key={Math.random()}>
                        <Col xl={12} className={'sport-ticket-bet-amount'}>

                        <NumberFormat value={(!empty(eventsSelected[k].risk) ? eventsSelected[k].risk : '')} className="form-control" thousandSeparator={'.'} decimalSeparator={','} placeholder="Ingrese su apuesta" onValueChange={(values) => {
                            if(!empty(intervalSimpleRisk)){
                                clearTimeout(intervalSimpleRisk)
                            }
                            const {formattedValue, value} = values;
                            let e ={
                                target:{
                                    name: 'risk',
                                    value : value
                                }
                            }
                            
                            intervalSimpleRisk = setTimeout(() => {
                                this.props.onChangeRisk(e, eventsSelected[k])
                            }, 500)
                            
                            
                            }} />
                        </Col>

                        <Col xl={4} className={'sport-ticket-bet-remove'}>
                            <Badge variant={'danger'} onClick={() => {this.props.onClickDeleteEvent(eventsSelected[k])}}>Eliminar x</Badge>
                        </Col>

                        <Col xl={12} className={'sport-ticket-bet-amount-fast'}>
                            <Row className={'sport-ticket-bet-amount-fast-list'}>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[0]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[0])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[1]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[1])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[2]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[2])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[3]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[3])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[4]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[4])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[5]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[5])}</Button> 
                                </Col>
                            </Row>
                            <Row className={'sport-ticket-bet-amount-fast-list'}>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[6]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[6])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[7]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[7])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[8]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[8])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[9]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[9])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[10]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[10])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[11]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[11])}</Button> 
                                </Col>
                            </Row>
                            <Row className={'sport-ticket-bet-amount-fast-list'}>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[12]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[12])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[13]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[13])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[14]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[14])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[15]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[15])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[16]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[16])}</Button> 
                                </Col>
                                <Col xl={2} className={'con-button-amount'}>
                                    <Button onClick={()=>{
                                        let e ={
                                            target:{
                                                name: 'risk',
                                                value : fastAmount[17]
                                            }
                                        }
                                        this.props.onChangeRiskFast(e,eventsSelected[k])
                                    }}>{formatNumber(currencyCode,fastAmount[17])}</Button> 
                                </Col>
                            </Row>
                            
                            
                        </Col>

                        <Col xl={12} className={'sport-ticket-bet-profit text-right'}>
                            <b>Ganancia Potencial: {formatNumber(currencyCode,(!empty(eventsSelected[k].totalToPay) ? eventsSelected[k].totalToPay : 0))}</b>
                        </Col>
                        
                    </Row>
                    <Row key={Math.random()}>

                        <Col xl={12} className={'sport-ticket-event-name event-date'}>
                            {date.format(new Date(eventFilter[0].eventDate),"DD/MM hh:mm A") }
                        </Col>

                        <Col xl={12} className={'sport-ticket-event-name'}>
                            {eventFilter[0].eventName}
                        </Col>

                        <Col xl={12} className={'sport-ticket-bet-type'}>
                            {translateType(eventsSelected[k].type)}
                        </Col>

                        <Col xl={8} className={'sport-ticket-bet-type-selection'}>
                            {translateDescription(eventsSelected[k].type,eventFilter[0].eventHome,eventFilter[0].eventAway,eventsSelected[k].factor,eventsSelected[k].marketType,eventsSelected[k].factorExtra,eventsSelected[k].marketTypeDetail)}
                        </Col>
                        <Col xl={4} className={'sport-ticket-bet-odd-selection'}>
                            <Badge variant={'success'}>{showOdds == 'D' ? eventsSelected[k].odd : this.props.convertOddToAmerican(eventsSelected[k].odd)}</Badge>
                        </Col>
                        
                    </Row>

                    
                </div>
            );

            
            multiple.push(
            <div className={'sport-ticket-selection'} key={`selection-mul-${eventsSelected[k].key}-${Math.random()}`}>
                <Row key={Math.random()}>
                    
                    <Col xl={12} className={'sport-ticket-event-name event-date'}>
                        {date.format(new Date(eventFilter[0].eventDate),"DD/MM hh:mm A") }
                    </Col>

                    <Col xl={12} className={'sport-ticket-event-name'}>
                        {eventFilter[0].eventName}
                    </Col>

                    <Col xl={12} className={'sport-ticket-bet-type'}>
                        {translateType(eventsSelected[k].type)}
                    </Col>

                    <Col xl={8} className={'sport-ticket-bet-type-selection'}>
                        {translateDescription(eventsSelected[k].type,eventFilter[0].eventHome,eventFilter[0].eventAway,eventsSelected[k].factor,eventsSelected[k].marketType,eventsSelected[k].factorExtra,eventsSelected[k].marketTypeDetail)}
                    </Col>
                    <Col xl={4} className={'sport-ticket-bet-odd-selection'}>
                        <Badge variant={'success'}>{showOdds == 'D' ? eventsSelected[k].odd : this.props.convertOddToAmerican(eventsSelected[k].odd)}</Badge>
                    </Col>

                    <Col xl={12} className={'sport-ticket-bet-remove'}>
                        <Badge variant={'danger'} onClick={() => {this.props.onClickDeleteEventMultiple(eventsSelected[k])}}>Eliminar x</Badge>
                    </Col>
                </Row>
            </div>
        );
        }

        if(empty(individual) && empty(multiple)){
            return (
                <Row key={Math.random()}>
                    <Col xl={12} className={"p-0"}>
                        <Card className={"my-ticket"}>
                            <Card.Body>
                                <Row key={Math.random()}>
                                    <Col xl={12} className={'text-empty-ticket'}>
                                        <h2>No has seleccionado ninguna combinación</h2>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )
        }


        return (
            <Row key={Math.random()}>
                <Col xl={12} className={"p-0"}>
                    <Card className={"my-ticket"}>
                        <Card.Body>
                            <Row>
                                {centers_id == 1 ? 
                                <Col xl={12}>
                                    <Image src={Logo} className="ticketLogo" />
                                </Col>
                                : null}
                                {centers_id == 136 ? 
                                <Col xl={12}>
                                    <Image src={LogoApuestaInternacional} className="ticketLogo" />
                                </Col>
                                : null}
                            </Row>
                            <Row>
                                <Col xl={12} className={'sport-content-preview-ticket'}>
                                <>
                                    <Tabs
                                    activeKey={activeKey}  
                                    onSelect={(e) => this.handleSelect(e)}>
                                    <Tab eventKey={1} title="Individual" key={1}>
                                        <>
                                        <Row>
                                                <Col xl={12} className={'sport-ticket-bet-button'}>
                                                    <button
                                                    disabled={ hasRisk ? false : true}
                                                    type="button"
                                                    className="btn btn-sm btn-success btn-sell"
                                                    onClick={(e) =>
                                                        this.props.confirmSubmitIndividual(
                                                            e
                                                        )
                                                    }
                                                >
                                                    Apostar
                                                    </button>
                                                </Col>
                                            </Row>
                                        {individual}
                                        
                                        </>
                                    </Tab>
                                    
                                    <Tab eventKey={2} title="Múltiple" key={2}>
                                        <>
                                        <Row>
                                                <Col xl={12} className={'sport-ticket-bet-button'}>
                                                    <button
                                                    disabled={(!empty(sellform.riskMultiple) && !hasMultiSelectEvent) ? false : true}
                                                    type="button"
                                                    className="btn btn-sm btn-success btn-sell"
                                                    onClick={(e) =>
                                                        this.props.confirmSubmitMultiple(
                                                            e
                                                        )
                                                    }
                                                >
                                                    Apostar
                                                    </button>
                                                </Col>
                                        </Row>
                                        <Row key={Math.random()}>

                                                <Col xl={12} className={'sport-ticket-bet-amount-multiple'}>

                                                            <NumberFormat value={(!empty(sellform.riskMultiple) ? sellform.riskMultiple : '')} className="form-control" thousandSeparator={'.'} decimalSeparator={','} placeholder="Ingrese su apuesta" onValueChange={(values) => {
                                                            const {formattedValue, value} = values;
                                                            let e ={
                                                                target:{
                                                                    name: 'risk',
                                                                    value : value
                                                                }
                                                            }
                                                            this.props.onChangeRiskMultiple(e)
                                                            
                                                            }} />
                                                </Col>
                                                
                                                <Col xl={12} className={'sport-ticket-bet-amount-fast'}>
                                                    <Row className={'sport-ticket-bet-amount-fast-list'}>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[0]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e);
                                                                
                                                            }}>{formatNumber(currencyCode,fastAmount[0])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[1]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[1])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[2]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[2])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[3]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[3])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[4]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[4])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[5]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[5])}</Button> 
                                                        </Col>
                                                    </Row>

                                                    <Row className={'sport-ticket-bet-amount-fast-list'}>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[6]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[6])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[7]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[7])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[8]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[8])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[9]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[9])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[10]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[10])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[11]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[11])}</Button> 
                                                        </Col>
                                                    </Row>

                                                    <Row className={'sport-ticket-bet-amount-fast-list'}>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[12]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[12])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[13]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[13])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[14]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[14])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[15]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[15])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[16]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[16])}</Button> 
                                                        </Col>
                                                        <Col xl={2} className={'con-button-amount'}>
                                                            <Button onClick={()=>{
                                                                let e ={
                                                                    target:{
                                                                        name: 'risk',
                                                                        value : fastAmount[17]
                                                                    }
                                                                }
                                                                this.props.onChangeRiskMultipleFast(e)
                                                            }}>{formatNumber(currencyCode,fastAmount[17])}</Button> 
                                                        </Col>
                                                    </Row>
                                                    
                                                    
                                                </Col>
                                                
                                                <Col xl={12} className={'sport-ticket-bet-profit-multiple text-left'}>
                                                    <b>Ganancia Potencial: <span className='float-r multiple-win'>{formatNumber(currencyCode,sellform.totalToPayMultiple)}</span></b>
                                                </Col>

                                                <Col xl={12} className={'sport-ticket-bet-profit-multiple text-left'}>
                                                    Apuesta Total: <span className='float-r'>{formatNumber(currencyCode,sellform.riskMultiple)}</span>
                                                </Col>

                                                {(hasMultiSelectEvent) ?
                                                    <Col xl={12} className={'sport-ticket-bet-error-multiple text-left'}>
                                                    Las selecciones múltiples del mismo evento no se pueden combinar en un Multibet.
                                                    </Col>
                                                : null}
                                            
                                            </Row>

                                        {multiple}
                                        
                                        </>
                                    </Tab>
                                    
                                    </Tabs>
                                </>

                                </Col>
                            </Row>
                            
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}

const mapToProps = ({ user }) => ({
    user
});
const connectedMyTickets = connect(mapToProps, actions)(MyTicket);
export { connectedMyTickets as MyTicket };
