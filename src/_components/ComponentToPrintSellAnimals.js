import React, { Component } from 'react';
import { Print } from 'react-easy-print';

    class ComponentToPrintSellAnimals extends Component {
        componentDidMount() {
                window.print();
        }

        componentWillUnmount(){
            this.props.SellActions({action: 'clearTicketInfo', params : {}});
        }

        tryRequire () {
            try {
             return require('../_themes/sell_tickets_animals/offices'+localStorage.getItem('ticketOfficesId')).default;
            } catch (err) {
             return require('../_themes/sell_tickets_animals/officesDefault').default
            }
          };
   
        render () {
            const ComponentToPrintSellAnimals = this.tryRequire();
            return (
                <Print printOnly single>
                    <ComponentToPrintSellAnimals {...this.props} />
                </Print>
                );
        }
    }

    export default ComponentToPrintSellAnimals