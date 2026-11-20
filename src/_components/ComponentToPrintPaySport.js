import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';


    class ComponentToPrintPaySport extends Component {
        
        constructor(props) {
            super(props);
            this.state = {
                show: true,
            };
        }
    
          handleClose = () => {
            this.setState({ show: false });
          }
        
          handleShow = () => {
            this.setState({ show: true });
          }

        componentWillUnmount(){
            this.props.SellActions({action: 'clearTicketInfo', params : {}});
        }

        tryRequire () {
            try {
             return require('../_themes/pay_tickets_sports/offices'+localStorage.getItem('ticketOfficesId')).default;
            } catch (err) {
             return require('../_themes/pay_tickets_sports/officesDefault').default 
             
            }
          };
   
        render () {
            const ComponentToPrintPaySport = this.tryRequire();
            return (
            <Modal show={this.state.show} onHide={this.handleClose} size={"lg"}>
              <Modal.Header closeButton>
                <Modal.Title>Ticket a Pagar</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                    <ComponentToPrintPaySport {...this.props} />
                </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleClose}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
                );
        }
    }

    export default ComponentToPrintPaySport