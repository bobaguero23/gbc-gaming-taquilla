import React from 'react';
import empty from 'is-empty';
import {Form} from 'react-bootstrap';

class FormUnitsNacional extends React.Component {

  
  render () {
       return (
    <div className="row">  
        <div className="form-group col-8 no-padding-r">
            <Form.Control 
            type="number" 
            onChange={this.props.handleChange}
            name="units"
            value={this.props.value}
            placeholder="Unidades" />
            {(this.props.unitsValue) ? <span className="row units-help">Valor de la unidad : {this.props.unitsValue}</span>  : '' }  
            <span className="row units-help">Combinaciones : {this.props.ticketCombinations}</span> 
            <span className="row units-help">Valor del Ticket : {this.props.ticketvalue}</span>

        </div>
        <div className="form-group col-4 no-padding-l">

              {!empty(this.props.confirmSubmit) ? 
                <button type="button" className="btn btn-sm btn-success btn-sell" onClick={(e) => this.props.confirmSubmit(this.props.races,this.props.activeKey,e)}>Apostar</button>
              :
                <button type="button" className="btn btn-sm btn-success btn-sell" onClick={(e) => this.props.handleSubmit(e)}>Apostar</button>
              }
        </div>
    </div>

  )
   }
}

export default FormUnitsNacional;

