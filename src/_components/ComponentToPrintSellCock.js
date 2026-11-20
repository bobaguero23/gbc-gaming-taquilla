import React, { Component } from "react";
import { Print } from "react-easy-print";

class ComponentToPrintSellCock extends Component {
    componentDidMount() {
        window.print();
    }

    componentWillUnmount() {
        this.props.SellActions({ action: "clearTicketInfo", params: {} });
    }

    tryRequire() {
        try {
            return require("../_themes/sell_tickets_cocks/offices" +
                localStorage.getItem("ticketOfficesId")).default;
        } catch (err) {
            return require("../_themes/sell_tickets_cocks/officesDefault").default;
        }
    }

    render() {
        const ComponentToPrintSellCock = this.tryRequire();
        return (
            <Print printOnly single>
                <ComponentToPrintSellCock {...this.props} />
            </Print>
        );
    }
}

export default ComponentToPrintSellCock;
