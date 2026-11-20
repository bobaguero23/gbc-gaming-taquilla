import React from 'react';
import { connect } from "redux-zero/react";
import TableAnimalsCocks from '../_components/TableAnimalsCocks';
import {Row, Col} from 'react-bootstrap';
import {NavHeaderAnimals} from '../_components/NavHeaderAnimals';
import ComponentToPrintSellAnimals from '../_components/ComponentToPrintSellAnimals';
import ComponentToPrintPay from '../_components/ComponentToPrintPay';
import {MyTicketsAnimals} from '../_components/MyTicketsAnimals';
import ButtonsPayRefundAnimals from '../_components/ButtonsPayRefundAnimals';
import empty from 'is-empty';
import PrintProvider, { NoPrint } from 'react-easy-print';
import actions from '../_actions';
import AuthActions from '../_actions/AuthActions';
import { toast } from 'react-toastify';
import {formatNumber} from '../_helpers/lib';
import Dialog from 'react-bootstrap-dialog';
import { isOnly5y6,isOnlyPollaElArca } from "../_helpers/lib";
import { history } from '../_helpers/history';


class LotteryCockPollaElArcaPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey           : '',
            ticketValue: 0,
            ticketCombinations: 0,
            show: false,
            numbersAll:[],
            numbersSelected:[],
            valueUnits: 0,
            sellform : {
              wagerTypeId: 2,
              lotteryCock:0,
              numbers:[],
          }
        };    
    }

      handleClose = () =>   {
        this.setState({ show: false });
      }
    
      componentWillMount = () => {
        let userData = AuthActions.meData();
        let ticket_offices_id =  (!empty(userData)) ? userData.ticket_offices_id : '';
        let centers_id =  (!empty(userData)) ? userData.centers_id : '';
        let currency_code =  (!empty(userData)) ? userData.currency_code : '';
        
        let params = {currency_code:currency_code};
        this.props.WagerTypesActions({action: 'getLotteryCockActive', params: {params}});  
        this.props.TicketsActions({action: 'getMyTicketsAnimals'});
           
        // TAQUILLAS SOLO 5 y 6
        if(isOnly5y6(ticket_offices_id)){
          history.push('/5y6');
        }    

        // TAQUILLAS NACIONALES
        if(!isOnlyPollaElArca(centers_id) 
          && currency_code =='VES'){
          history.push('/nacional');
        }

        if(isOnlyPollaElArca(centers_id)){
          history.push('/lotteries-cocks');
        }
      }

    handleChangeCheckbox = (e) => {

      const id = e.target.id;
      const {numbersAll } = this.state;
  
      if(numbersAll.includes(id)){
          let newNumbersAll = numbersAll.filter(id => id !== e.target.id)
          this.setState({ numbersAll: newNumbersAll })
      }
      else{

          if(numbersAll.length == 6){
              return null;
          }

          numbersAll.push(e.target.id);
          this.setState({ numbersAll })
      }
      
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ 
        sellform: {
            [name]: value
        }
    });
    }

  cleanAllSelections = (e) => {
    this.setState({ numbersAll: [] })
  }


  confirmSubmit = (costByCock,lottery_cock,e) => {
    let {numbersAll,sellform} = this.state;
    e.preventDefault();
    let userData = AuthActions.meData();
    let currencyCode =  (!empty(userData)) ? userData.currency_code : '';
    let costByCockText = (!empty(costByCock) ? `Costo Por Polla: ${formatNumber(currencyCode,costByCock)}` : null); 

    let numbersText = '';
    numbersAll.forEach((n) => {
      numbersText+= `${n}-`;
    });

    numbersText = numbersText.substring(0,numbersText.length-1);

    let bodyHtml = (<div align="center">Resumen de la jugada de Polla de Animalito:
    <br /> 
    <br />
    Números seleccionados: 
    <br />
    {numbersText}
    <br />
    {costByCockText}
    <br />
    Alias del usuario: {sellform.user_alias}
    </div>); 
    if(!empty(numbersText) 
    && !empty(costByCockText)
    ){
        if(!empty(sellform.user_alias) && sellform.user_alias.length > 4){
            this.dialog.show({
                title: 'Confirmar',
                body: bodyHtml,
                actions: [
                    Dialog.CancelAction(),
                    Dialog.OKAction(() => {
                        this.handleSubmitCocks(lottery_cock,costByCock)
                    })
                ],
            })
        }else{
            toast.warn('Debe colocar un usuario de alias válido, mayor a 4 caracteres',{position: toast.POSITION.TOP_CENTER});
        }
       
    }else{
        toast.warn('Debe seleccionar al menos 6 animalitos',{position: toast.POSITION.TOP_CENTER}); 
    }
    
  }

  handleSubmitCocks = (lotteryCock,amount) => {
    let numbersAllSend = '';
    const { sellform,numbersAll } = this.state;
    sellform.lotteryCock = lotteryCock;
    
      if((parseFloat(amount)>0) 
      && (!empty(numbersAll)) 
      && (!empty(sellform.lotteryCock))){
              numbersAll.forEach(function(element) {
                  numbersAllSend+='@' + element + '@,';
              })
          if(numbersAll.length == 6){
              
                sellform.numbers = [numbersAllSend.substr(0,(numbersAllSend.length-1))]; 
                sellform.amount = amount;
                sellform.userAlias = sellform.user_alias;
              this.props.SellActions({action: 'sellCockTicketAnimal', params : { sellform: sellform }}  );
      
              this.setState({ 
                numbersAll:[],
                numbersSelected:[],
                    sellform : {
                    wagerTypeId: 2,
                    numbers:[],
                }
            
            });
            
            }else{
                toast.warn('Debe seleccionar 6 animalitos.',{position: toast.POSITION.TOP_CENTER});
                this.setState({
                    dialogform: {
                        ...dialogform
                    }
                }); 
            }
        }else{
            toast.warn('Debe seleccionar lotería',{position: toast.POSITION.TOP_CENTER});
            this.setState({
                dialogform: {
                    ...dialogform
                }
            }); 
        }
  }

  compare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    const totalPointsA = a.totalPoints;
    const totalPointsB = b.totalPoints;
  
    let comparison = 0;
    if (totalPointsA > totalPointsB) {
      comparison = 1;
    } else if (totalPointsA < totalPointsB) {
      comparison = -1;
    }
    return comparison * -1;
  }

  render() {
    const { sellform} = this.state;
    const {ticketInfoAnimal,lottery_cock,payInfo,ticketsanimals } = this.props;
    let userData = AuthActions.meData();
    let currencyCode =  (!empty(userData)) ? userData.currency_code : '';

    

    return (
        <div id="wrapper">
        <PrintProvider>
        <NoPrint>
        <Dialog className="confirm-dialog" ref={(component) => { this.dialog = component }} />
        {(!empty(ticketInfoAnimal) ?
        <ComponentToPrintSellAnimals {...this.props} /> : null)}
        {(!empty(payInfo) ?
        <ComponentToPrintPay {...this.props} /> : null)}
            <NavHeaderAnimals />
            <div id="page-wrapper-full">
            {(!empty(sellform.errormessage) ? 
                <Alert variant="warning" onClose={this.onCloseAlert} dismissible >
                {sellform.errormessage}
                </Alert>
                :
                ''
            )}
            <form ref="form" onSubmit={this.handleSubmit}>
                <div className="container-fluid">
                    <div className="row d-flex flex-row clearfix">
                        <div className="col-12 col-md-3 col-xl-3 col-sm-4 content-left">
                            
                            <div className="row">
                                <div className="col-12 col-md-12 col-xl-12">
                                    <ButtonsPayRefundAnimals specialKey={this.state.specialKey} />
                                </div>
                                
                                <div className="col-12 col-md-12 col-xl-12">
                                    <MyTicketsAnimals />
                                </div> 

                            </div>


                                
                        </div>
                        <div className="col-12 col-md-9 col-xl-9 col-sm-8 content-center">
                            
                            <div className="row block-sell-form">
                                <div className="col-12 col-md-12 col-xl-12">
                                    <h3>Vender Ticket</h3>
                                </div>
                                
                                <div className="col-12 col-md-12 col-xl-12">
                                {!empty(lottery_cock) ?
                                    <TableAnimalsCocks
                                        handleChangeCheckbox={this.handleChangeCheckbox}
                                        handleChange={this.handleChange}
                                        checkedAnimals={this.state.numbersAll}
                                        currencyCode={currencyCode}
                                        confirmSubmit={this.confirmSubmit}
                                        lotteryCock={lottery_cock}
                                        cleanAllSelections={this.cleanAllSelections}
                                        />         
                                        : null }
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                </form>
            </div>
            </NoPrint>
            </PrintProvider>
        </div>
        
    );
  }
    
    
}

const mapToProps = ({
  ticketsAnimals,
  totalCocksById,
  ticketInfoAnimal,
  ticketoffice,
  lottery_cocks,
  lottery_cock
}) => ({
  ticketsAnimals,
  totalCocksById,
  ticketInfoAnimal,
  ticketoffice,
  lottery_cocks,
  lottery_cock
});
const connectedLotteryCockPollaElArcaPage = connect(mapToProps, actions)(LotteryCockPollaElArcaPage);
export { connectedLotteryCockPollaElArcaPage as LotteryCockPollaElArcaPage};
