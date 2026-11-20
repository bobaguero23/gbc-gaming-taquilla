import React, { Component } from "react";
import { Print } from "react-easy-print";

class ComponentToPrintSell extends Component {
    componentDidMount() {
        window.print();
    }

    componentWillUnmount() {
        this.props.SellActions({ action: "clearTicketInfo", params: {} });
    }

    tryRequire() {
        try {
            return require("../_themes/sell_tickets/offices" +
                localStorage.getItem("ticketOfficesId")).default;
        } catch (err) {
            return require("../_themes/sell_tickets/officesDefault").default;
        }
    }

    render() {
        const ComponentToPrintSell = this.tryRequire();
        return (
            <Print printOnly single>
                <ComponentToPrintSell {...this.props} />
            </Print>
        );
    }
}

export default ComponentToPrintSell;
