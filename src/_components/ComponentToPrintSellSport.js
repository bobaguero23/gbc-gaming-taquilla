import React, { Component } from "react";
import { Print } from "react-easy-print";

class ComponentToPrintSellSport extends Component {
    componentDidMount() {
        window.print();
    }

    componentWillUnmount() {
        this.props.SellActions({ action: "clearTicketInfo", params: {} });
    }

    tryRequire() {
        try {
            return require("../_themes/sell_tickets_sports/offices" +
                localStorage.getItem("ticketOfficesId")).default;
        } catch (err) {
            return require("../_themes/sell_tickets_sports/officesDefault").default;
        }
    }

    render() {
        const ComponentToPrintSellSport = this.tryRequire();
        return (
            <Print printOnly single>
                <ComponentToPrintSellSport {...this.props} />
            </Print>
        );
    }
}

export default ComponentToPrintSellSport;
