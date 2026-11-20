import React, { Component } from 'react';
import { Print } from 'react-easy-print';

    class ComponentToPrintSellINH extends Component {
        componentDidMount() {
                window.print();
        }

        componentWillUnmount(){
            this.props.SellActions({action: 'clearTicketInfo', params : {}});
        }

        tryRequire () {
            try {
             return require('../_themes/sell_tickets_inh/offices'+localStorage.getItem('ticketOfficesId')).default;
            } catch (err) {
             return require('../_themes/sell_tickets_inh/officesDefault').default
            }
          };
   
        render () {
            const ComponentToPrintSellINH = this.tryRequire();
            return (
                <Print printOnly single>
                    <ComponentToPrintSellINH {...this.props} />
                </Print>
                );
        }
    }

    export default ComponentToPrintSellINH