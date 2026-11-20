import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';


class WagerTypesDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchticketform : {
            }
        };
    }

    select = (optionItems) => {
        return(<select name="wagerTypeId" id="wagerTypeId" className="form-control chosen-select" onChange={this.props.handleChange}>
                    <option value="">Seleccione Apuesta</option>
                    {optionItems}
                </select>);
    }

    render() {
        let wagertype227 = [1,2,3,18,19,20];// WIN, PLACE, SHOW
        const { wagertypes } = this.props;

        
        if(!empty(wagertypes)){
            this.optionWager = wagertypes.map((wagertype) =>
                (this.props.type == 'inh' ?
                    <option key={wagertype.id} value={wagertype.id}>{wagertype.description}</option>
                    :
                    (parseInt(this.props.ticket_offices_id)==parseInt(227)) ? 
                        (wagertype227.includes(parseInt(wagertype.id)) ? 
                        <option key={wagertype.id} value={wagertype.id}>{wagertype.name}</option> : null)
                    : <option key={wagertype.id} value={wagertype.id}>{wagertype.name}</option>
                )
            );
        }
    
        return (
                <div className="form-group mt-0 mb-0">              
                    <select name="wagerTypeId" id="wagerTypeId" className="form-control chosen-select" onChange={this.props.handleChange}>
                        <option value="">Seleccione Apuesta</option>
                        {this.optionWager}
                    </select>
               </div>
        );
    }
    
}


const mapToProps = ({
    wagertypes
 }) => ({
    wagertypes
 });
 
 const connectedWagerTypesDropDown = connect(mapToProps, actions)(WagerTypesDropDown);
 export { connectedWagerTypesDropDown as WagerTypesDropDown };
