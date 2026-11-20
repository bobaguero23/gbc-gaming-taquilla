import React from 'react';
import { connect } from "redux-zero/react";
import { func } from 'prop-types';
import empty from 'is-empty';
import actions from '../_actions'


class WagerTypesDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchticketform : {
            }
        };
    }

    select(optionItems) {
        return(<select name="wagerTypeId" id="wagerTypeId" className="form-control chosen-select" onChange={this.props.handleChange}>
                    <option value="">Seleccione Apuesta</option>
                    {optionItems}
                </select>);
    }

                
    render() {
        const { wagertypes } = this.props;
        
        if(!empty(wagertypes)){
            if(this.props.type=='inh'){
                this.optionWager = wagertypes.map((wagertype) =>
                (
                    (wagertype.id == 4 || wagertype.id == 5 || wagertype.id == 6) ? 
                    <option key={wagertype.id} value={wagertype.id}>{wagertype.name}</option> : null
                )
                );  
            }else{
                this.optionWager = wagertypes.map((wagertype) =>
                (
                    (wagertype.id != 1 && wagertype.id != 2 && wagertype.id != 3) ? 
                    <option key={wagertype.id} value={wagertype.id}>{wagertype.name}</option> : null
                )
                );
            }
            
        }

    
        return (
                <div className="form-group mt-0 mb-0">              
                    <select name="wagerTypeId" id="wagerTypeId" className="form-control chosen-select" onChange={this.props.handleChange} value={this.props.wagerTypeId}>
                        <option value="">Seleccione Apuesta</option>
                        {this.optionWager}
                    </select>
               </div>
        );
    }
    
}

const mapStateToProps = ({ 
    wagertypes
  }) => ({
    wagertypes
  });

WagerTypesDropDown.propTypes = {
    handleChange: func.isRequired,
  };

// Export the class
export default connect(mapStateToProps, actions)(WagerTypesDropDown);
