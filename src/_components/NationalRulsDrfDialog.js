import React from "react";
import { connect } from "redux-zero/react";
import { Button, Modal } from "react-bootstrap";
import empty from "is-empty";
import actions from "../_actions";
import AuthActions from '../_actions/AuthActions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class NationalRulsDrfDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
    }

    handleClose = () => {
        this.setState({ showRetrospectos: false, showRules: false });
    };

    showModalRetrospectos = () => {
        return (
            <Modal
                show={this.state.showRetrospectos}
                onHide={this.handleClose}
                size={"lg"}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Retrospectos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe
                        border="0"
                        class="iframePdf"
                        src={`/gaceta_hipica/la_rinconada/RETROSPECTOS.pdf?t=${new Date().getTime()}`}
                    ></iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        );
    };

    showModalRules = (currency_code) => {
        return (
            <Modal
                show={this.state.showRules}
                onHide={this.handleClose}
                size={"lg"}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {'Reglas de Apuestas'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <iframe
                        border="0"
                        class="iframePdf"
                        src={`/gaceta_hipica/reglas-inh.pdf?t=${new Date().getTime()}`}
                    ></iframe>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        );
    };

    render() {
         let userData = AuthActions.meData();
        let currencyCode = userData.currency_code; 
        let ticket_offices_id = userData.ticket_offices_id; 
        return (
            <>
                {this.showModalRetrospectos()}
                {this.showModalRules(currencyCode)}
                <Button
                variant="warning"
                onClick={() => {
                    this.setState({ showRetrospectos: true });
                }}
            >
                <FontAwesomeIcon icon="file-pdf" /> Retrospectos
            </Button>
                
                {" "}
                <Button
                    variant="warning"
                    onClick={() => {
                        this.setState({ showRules: true });
                    }}
                >
                    <FontAwesomeIcon icon="file-alt" /> Reglas
                </Button>
            </>
        );
    }
}

const mapToProps = ({}) => ({});
const connectedNationalRulsDrfDialog = connect(
    mapToProps,
    actions
)(NationalRulsDrfDialog);
export { connectedNationalRulsDrfDialog as NationalRulsDrfDialog };
