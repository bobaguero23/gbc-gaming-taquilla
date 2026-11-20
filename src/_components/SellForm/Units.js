import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';
import {Form,Image, Row, Col} from 'react-bootstrap';
import Select from 'react-select'
import {formatNumber} from '../../_helpers/lib';


class Units extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {

        const { wagertypes, ticketoffice, user }= this.props;
        if(empty(wagertypes) || (empty(ticketoffice)) || (empty(user))){
            return null;
        }

        return (
            <Row>
                <Col xl={12}>
                    <Form.Control 
                    type="number" 
                    min={0}
                    onChange={this.props.handleChange}
                    name="units"
                    value={this.props.value}
                    placeholder="Unidades" />
                    <Form.Text className="text-muted">
                        {formatNumber(user.currency_code,ticketoffice[0].valueUnits)}
                    </Form.Text>
                </Col>
            </Row>
        );
    }
    
}

const mapToProps = ({
    wagertypes
}) => ({
    wagertypes
});

const connectedUnits = connect(mapToProps, actions)(Units);
export { connectedUnits as Units };