import React from 'react';
import empty from 'is-empty';

class FormUnits extends React.Component {

  render () {
       return (
    <div className="row">  
        <div className="form-group col-8">
            <input type="text" id="units" name="units" className="form-control form-control-sm" placeholder="Unidades" onChange={this.props.handleChange} value={this.props.value}/> 
            {(this.props.unitsValue) ? <span className="row units-help">Valor de la unidad : {this.props.unitsValue}</span>  : '' }  
            <span className="row units-help">Combinaciones : {this.props.ticketCombinations}</span> 
            <span className="row units-help">Valor del Ticket : {new Intl.NumberFormat("de-DE", {style: "currency", currency: this.props.currencyCode}).format(this.props.ticketvalue)}</span>

        </div>
        <div className="form-group col-4">
                {!empty(this.props.confirmSubmit) ? 
                  <button type="button" className="btn btn-sm btn-success btn-sell" onClick={(e) => this.props.confirmSubmit(this.props.races,this.props.activeKey,e)}>Vender</button>

                : 
                  <button type="button" className="btn btn-sm btn-success btn-sell" onClick={this.props.handleSubmit}>Vender</button>  
                }
                
              
        </div>
    </div>

  )
   }
}

export default FormUnits;

