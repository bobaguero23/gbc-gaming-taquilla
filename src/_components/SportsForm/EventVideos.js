import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';
import {Form,Image, Row, Col} from 'react-bootstrap';
import Select from 'react-select'


class EventVideos extends React.Component {
    
    constructor(props) {
        super(props);
    }

    getOptions = (eventList) => {

        let result = []
        for(let t of eventList){
            
            result.push({
                label: t.eventName,
                value: parseInt(t.eventChannelId)
            })
        }

        return result;
    }


    render() {
        const { eventList, eventSelected }= this.props;

        if(empty(eventList)){
            return null;
        }

        const options = this.getOptions(eventList)
        const defaultValue = options.find((o) => o.value == eventSelected)

        return (
            <Row className='video-content-select'>
                <Col xl={12}>
                    <Select className={'events-dropdown'} placeholder={'Seleccionar Evento'}  options={options} onChange={(e) => {this.props.handleEventChange({
                        target : {
                            name: "channel",
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
    eventList
}) => ({
    eventList
});

const connectedEventVideos = connect(mapToProps, actions)(EventVideos);
export { connectedEventVideos as EventVideos };