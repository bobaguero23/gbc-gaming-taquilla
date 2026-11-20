import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';
import {Form,Image, Row, Col} from 'react-bootstrap';
import Select from 'react-select'
import {formatNumber} from '../../_helpers/lib';


class UnitsInh extends React.Component {
    
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
                    onChange={(e) => { 
                        this.props.handleChange({ target : { name: 'units', value: parseInt(e.target.value) }} )
                    }}
                    name="units"
                    value={this.props.value}
                    placeholder="Unidades" />
                    <Form.Text className="text-muted">
                        {formatNumber(user.currency_code,this.props.valueUnits)}
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

const connectedUnits = connect(mapToProps, actions)(UnitsInh);
export { connectedUnits as UnitsInh };