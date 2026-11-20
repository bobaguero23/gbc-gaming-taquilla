import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';
import {Form,Image, Row, Col} from 'react-bootstrap';
import Select from 'react-select'


class Tracks extends React.Component {
    
    constructor(props) {
        super(props);
    }

    getOptions = (tracksList) => {

        let result = []
        for(let t of tracksList){
            
            result.push({
                label: t.trackName,
                value: parseInt(t.id)
            })
        }

        return result;
    }


    render() {
        const { tracksList, trackSelected }= this.props;

        if(empty(tracksList)){
            return null;
        }

        const options = this.getOptions(tracksList)
        const defaultValue = options.find((o) => o.value == trackSelected)

        return (
            <Row>
                <Col xl={12}>
                    <Select className={'tracks-dropdown'} placeholder={'Hipódromos'} options={options} defaultValue={defaultValue} onChange={(e) => {this.props.handleChange({
                        target : {
                            name: "tracksId",
                            value: parseInt(e.value)
                        } 
                    }
                    )}} />
                </Col>
            </Row>
        );
    }
    
}

const mapToProps = ({
    tracksList
}) => ({
    tracksList
});

const connectedTracks = connect(mapToProps, actions)(Tracks);
export { connectedTracks as Tracks };