import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';
import {Form,Image, Row, Col} from 'react-bootstrap';
import Select from 'react-select'


class WagerTypes extends React.Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps){
        return nextProps.wagertypes !== this.props.wagertypes || nextProps.wagerTypeSelected !== this.props.wagerTypeSelected;
    }

    getOptions = (wagertypes) => {

        let result = []
        let {type, user} = this.props;
        let wagertype227 = [1,2,3,18,19,20];// WIN, PLACE, SHOW

        for(let w of wagertypes){
            
            let label = (type == 'inh') ? w.description : w.name;

            if( (parseInt(user.ticket_offices_id) == 227) && !wagertype227.includes(parseInt(w.id)) ){
                continue;
            }

            result.push({
                label: label,
                value: parseInt(w.id)
            })
        }

        return result;
    }

    render() {

        const { wagertypes, wagerTypeSelected }= this.props;

        if(empty(wagertypes)){
            return null;
        }

        const options = this.getOptions(wagertypes)
        return (
            <Row>
                <Col xl={12}>
                    <Select className={'wager-types-dropdown'} placeholder={'Tipo de Apuesta'} options={options} defaultValue={wagerTypeSelected} onChange={(e) => {
                        this.props.handleChange({
                            target: {
                                name: 'wagerTypeId',
                                value: e.value
                            }
                        })
                    }} />
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
 
 const connectedWagerTypes = connect(mapToProps, actions)(WagerTypes);
 export { connectedWagerTypes as WagerTypes };
