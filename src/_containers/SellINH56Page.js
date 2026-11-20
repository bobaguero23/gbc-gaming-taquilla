import React from 'react';
import { connect } from "redux-zero/react";
import {NavHeader} from '../_components/NavHeader';
import { ValidatorForm } from 'react-form-validator-core';
import PrintProvider, { NoPrint } from 'react-easy-print';
import FormUnits from '../_components/FormUnits';
import ButtonsPayRefund from '../_components/ButtonsPayRefund';
import ComponentToPrintSellINH from '../_components/ComponentToPrintSellINH';
import ComponentToPrintPay from '../_components/ComponentToPrintPay';
import empty from 'is-empty';
import actions from '../_actions';
import RacesValidas from '../_components/RacesValidas';
import { getTicketInfoPicks } from '../_helpers/lib';
import config from "config";

class SellINH56Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: null,
            ticketValue: 0,
            ticketCombinations: 0,
            valueUnitsInh56: config.value5y6VES,
            currencyCode: 'VES',
            specialKey: null,
            horsesRacesIdAll:[],
            dialogform : {
                horsesRacesId:[],
            }
        };


    }

    componentDidMount = () =>{

        this.props.SellActions({action: 'getAllDataINHValidas', params : {}});
        this.props.SellActions({action: 'getAllDataINHBySellNoInterval', params : {}});
        this.intervalID = setInterval( this.handleInterval, 60000 );

        const { sellform } = this.state;
        this.setState({
            sellform : {
                ...sellform,
                errormessage : this.props.errorMessage
            }
        });

    }

    componentWillUnmount(){
        clearInterval(this.intervalID);
    }

    componentWillReceiveProps = (nextProps) =>{

        const { alldatainhnointerval, errorMessage, ticketInfoInh } = nextProps;
        let { sellform, horsesRacesIdAll, activeKey } = this.state;

        if(!empty(ticketInfoInh)) {
            horsesRacesIdAll = [];
            sellform.horsesRacesId = [];
        }

        if(!empty(errorMessage)) {
            horsesRacesIdAll = [];
            activeKey = null;
        }

        if(!empty(alldatainhnointerval)){

            this.setState({
                activeKey,
                horsesRacesIdAll,
                sellform : {
                    ...sellform,
                    errormessage : errorMessage
                },
                valueUnitsInh56      : alldatainhnointerval.allTokens.nodes[0].ticketOfficeByTicketOfficesId.valueUnitsInh56,
                currencyCode    : alldatainhnointerval.allTokens.nodes[0].ticketOfficeByTicketOfficesId.currencyCode,
                specialKey      : alldatainhnointerval.allTokens.nodes[0].ticketOfficeByTicketOfficesId.specialKey
            })

        }
        
    }

    handleInterval = () => {
        this.props.SellActions({action: 'getAllDataINHBySell', params : {}});
        this.props.TicketsActions({action: 'getMyTicketsINH'});
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        const { dialogform } = this.state;
        this.setState({
            dialogform: {
                ...dialogform,
                [name]: value
            }
        }, () => {
          this.calculateTicketValue();
      });
        
    }

    calculateTicketValue() {
        const { dialogform } = this.state;
        
        //Create clone from Array
        const selectedHorsesAux = [...dialogform.horsesRacesId];
        let ticketInfo = getTicketInfoPicks({
            wagerTypeId: 14,
            selectedHorses: selectedHorsesAux,
            units: !empty(dialogform.units) ? dialogform.units : 0 ,
            valueUnits: this.state.valueUnitsInh56
        })
  
        //console.log('CALCULATE DIALOG FORM Ticket Info', dialogform,ticketInfo);
        this.setState({
            ticketValue : ticketInfo.ticketValue,
            ticketCombinations : ticketInfo.ticketCombinations
        })
        
    }

     handleChangeCheckbox = (e) => {
        const item = e.target.name;
        const isChecked = e.target.checked;
        const position = e.target.id;
        const { dialogform,horsesRacesIdAll } = this.state;

        //console.log('handleChangeCheckbox', dialogform, horsesRacesIdAll);

        let arr = horsesRacesIdAll;
        
        if(isChecked){
            if(empty(dialogform.horsesRacesId[position])){
              dialogform.horsesRacesId[position] = [];
            }
            if(!empty(horsesRacesIdAll))
            {
                arr = horsesRacesIdAll;
            }
            dialogform.horsesRacesId[position][item] = ({position:position,horsesRacesId:item});
            arr.push(Number.parseInt(item));
        }
        else{
            delete dialogform.horsesRacesId[position][item];
            delete arr[arr.indexOf(Number.parseInt(item))];
        }
        this.setState({
            horsesRacesIdAll:arr,
            dialogform: {
                ...dialogform
            }
        }, () => {
          this.calculateTicketValue();
        });
        
    }

    handleChangeCheckboxAll(e,arrAllItems) {
        const isChecked = e.target.checked;
        const position = e.target.id;
        const { dialogform,horsesRacesIdAll } = this.state;
        let arr = [];
        
    
        if(!empty(horsesRacesIdAll))
          {
              arr = horsesRacesIdAll;
          }
    
        if(isChecked){
          if(empty(dialogform.horsesRacesId[position]))
          {
            dialogform.horsesRacesId[position] = [];
          }
              arrAllItems[position].forEach(function(element) {
              dialogform.horsesRacesId[position][element] = ({position:position,horsesRacesId:element});
              arr[Number.parseInt(element)] = (Number.parseInt(element));
            });
        }
        else{
            arrAllItems[position].forEach(function(element) {
                delete dialogform.horsesRacesId[position][element];
                delete arr[arr.indexOf(Number.parseInt(element))];
              });
              
        }
        this.setState({
            horsesRacesIdAll:arr,
            dialogform: {
                ...dialogform
            }
        }, () => {
          this.calculateTicketValue();
      });
        
    }
    

    handleSubmitPicks(e) {
        e.preventDefault();
        let horsesRacesIdSend = '';
        const { dialogform } = this.state;
                
        if((parseInt(dialogform.units)>0) && (!empty(dialogform.horsesRacesId)) && (!empty(dialogform.tracksId)) && (!empty(dialogform.wagerTypeId)))
        {
            dialogform.horsesRacesId.forEach(function(element) {
                if(!empty(element)){
                    (Array.isArray(element) ? element : Object.values(element)).forEach(function(element2){
                        if(!empty(element2)){
                            horsesRacesIdSend+='{position:@' + element2.position + '@,horsesRacesId:@'+element2.horsesRacesId+'@},';
                        }
                    })
                }
              })
            
            let horsesRacesIdSerialized = [horsesRacesIdSend.substr(0,(horsesRacesIdSend.length-1))]; 
            //this.props.dispatch(sellTicket(dialogform));
            this.props.SellActions({action: 'sellTicket', params : {sellform: { ...dialogform, horsesRacesId: horsesRacesIdSerialized }}});
            this.setState({
                show:false,
                horsesRacesIdAll:[],
                ticketValue : 0,
                ticketCombinations : 0,
                horsesRacesIdAll:[],
                dialogform : {
                  tracksId:this.props.trackSelected[0],
                  horsesRacesId:[],
              }
            });
        }
        else
        {
            dialogform.errormessage = 'Debe seleccionar hipódromo, tipo de apuesta, caballos y colocar la unidad';
            this.setState({
                dialogform: {
                    ...dialogform
                }
            }); 
        }
        
        
    
    }

    onCloseAlert = () =>{
        const { sellform } = this.state;
        this.setState({
            sellform : {
                ...sellform,
                errormessage : null
            }
        });
    }
 
    render() {
        const { sellform} = this.state;
        const { ticketInfoInh,payInfo} = this.props;
        return (
            <div id="wrapper">
            <PrintProvider>
            <NoPrint>
            {(!empty(ticketInfoInh) ?
            <ComponentToPrintSellINH {...this.props} /> : null)}
            {(!empty(payInfo) ?
            <ComponentToPrintPay {...this.props} /> : null)}
                <NavHeader />
                <div id="page-wrapper-full">
                <ValidatorForm ref="formPickDialog" onSubmit={this.handleSubmitPicks}> 
                    <div className="container-fluid">
                        <div className="row d-flex flex-row clearfix">
                            <div className="col-12 col-md-3 col-xl-3 col-sm-4 content-left">
                                
                                <div className="row">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <ButtonsPayRefund specialKey={this.state.specialKey} />
                                    </div>
                                </div>


                                    
                            </div>
                            <div className="col-12 col-md-9 col-xl-9 col-sm-8 content-center">
                                
                                <div className="row block-sell-form">
                                    <div className="col-12 col-md-12 col-xl-12">
                                        <h3>Vender Ticket de 5 y 6 </h3>
                                    </div>

                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                            <RacesValidas races={this.props.racesvalidasinh} 
                                            handleChangeCheckbox={this.handleChangeCheckbox}
                                            handleChangeCheckboxAll={this.handleChangeCheckboxAll}
                                            checkedHorses={this.state.horsesRacesIdAll} 
                                            />
                                            <FormUnits
                                            ticketvalue={this.state.ticketValue}
                                            ticketCombinations={this.state.ticketCombinations}
                                            unitsValue={this.state.valueUnitsInh56}
                                            handleChange={this.handleChange} 
                                            handleSubmit={this.handleSubmitPicks}
                                            value={(!empty(this.state.dialogform.units) ? this.state.dialogform.units : '')}
                                            currencyCode={this.state.currencyCode}
                                            />      
                                        </div>
                                    </div>
                                </div>

                               
                            </div>
                        </div>
                    </div>
                    </ValidatorForm>
                </div>
                </NoPrint>
                </PrintProvider>
            </div>
            
        );
    }
}


const mapStateToProps = ({ 
    loading,
    racesvalidasinh,
    alldatainhnointerval,
    ticketInfoInh,
    payInfo,
    error,
    ticketsinh
}) => ({
    loading,
    racesvalidasinh,
    alldatainhnointerval,
    ticketInfoInh,
    payInfo,
    error,
    ticketsinh
});

const connectedSellINHPage = connect(mapStateToProps, actions)(SellINH56Page);
export { connectedSellINHPage as SellINH56Page };
 