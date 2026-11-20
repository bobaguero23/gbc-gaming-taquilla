import React from 'react';
import { connect } from "redux-zero/react";
import { payTicket } from "../_actions/PayActions";
import { refundTicket } from "../_actions/RefundActions";
import {Alert} from 'react-bootstrap';
import empty from 'is-empty';
import actions from '../_actions'

class ButtonsPayHsip extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         confirm:'',
         specialKey:'',
         errormessage:''
     };
      this.handleClickPay = this.handleClickPay.bind(this);
      this.handleChange = this.handleChange.bind(this);
      
  }

  handleChange(e) {
   const { name, value } = e.target;
   this.setState({
           [name]: value
   });   
   }

   handleClickPay(e) {
      e.preventDefault();

      if(parseInt(this.state.confirm)>0){
         this.props.PayActions({action: 'payTicketHsip', params : {confirm:this.state.confirm}});
         //this.props.dispatch(payTicket(this.state.confirm));
         this.setState({
            confirm: ''
        });
      }
      else{
         let errormessage = 'Debe colocar un número de serial';
         this.setState({
            errormessage: errormessage
         }); 
      }
   }


  render () {
      const { errormessage } = this.state;
      const {payError,refundInfo,refundError,type} = this.props;
       return (
         <div className="row block-payrefund">  
               <div className="form-group col-12">
                  <h3>Pagar Ticket</h3>
                  <input type="text" id="confirm" name="confirm" value={this.state.confirm} className="form-control form-control-sm" placeholder="Serial del ticket" onChange={this.handleChange} />
                  {(!empty(this.props.specialKey) ? 
                  <input type="password" id="specialKey" name="specialKey" value={this.state.specialKey} className="form-control form-control-sm" placeholder="Clave de operaciones especiales" onChange={this.handleChange} />
                  : null )}
               </div>
               {(!empty(errormessage) ? 
                  <Alert variant="danger" dismissible>
                  {errormessage}
                  </Alert>
                  :
                  ''
                  )}

                  {(!empty(payError) ? 
                  <Alert variant="warning" dismissible>
                  {payError}
                  </Alert>
                  :
                  ''
                  )}

                  {(!empty(refundInfo) ? 
                  <Alert variant="info" dismissible>
                  {refundInfo}
                  </Alert>
                  :
                  ''
                  )}

                  {(!empty(refundError) ? 
                  <Alert variant="danger" dismissible>
                  {refundError}
                  </Alert>
                  :
                  ''
                  )}

               <div className="btn-group col-6">
                  <button type="button" className="btn btn-sm btn-warning btn-block" onClick={this.handleClickPay}>Pagar</button>
               </div>
               
         </div>
  )
   }
}


const mapStateToProps = ({ 
   payInfo,
   payError,
   refundInfo,
   refundError,
   ticketInfo
 }) => ({
   payInfo,
   payError,
   refundInfo,
   refundError,
   ticketInfo
 });

export default connect(mapStateToProps, actions)(ButtonsPayHsip);

