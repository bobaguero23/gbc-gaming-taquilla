import React, { Component } from 'react';
import { Print } from 'react-easy-print';

    class ComponentToPrintSellArgentino extends Component {
        componentDidMount() {
                window.print();
        }

        componentWillUnmount(){
            this.props.SellActions({action: 'clearTicketInfo', params : {}});
        }

        tryRequire () {
            try {
             return require('../_themes/sell_tickets_argentino/offices'+localStorage.getItem('ticketOfficesId')).default;
            } catch (err) {
             return require('../_themes/sell_tickets_argentino/officesDefault').default
            }
          };
   
        render () {
            const ComponentToPrintSellArgentino = this.tryRequire();
            return (
                <Print printOnly single>
                    <ComponentToPrintSellArgentino {...this.props} />
                </Print>
                );
        }
    }

    export default ComponentToPrintSellArgentino