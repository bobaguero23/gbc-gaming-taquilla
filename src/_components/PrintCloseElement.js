import React from 'react';
import ReactDOM from 'react-dom';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import empty from 'is-empty';

class PrintCloseElement extends React.Component {

    constructor(props) { 
        super(props);
    }
    
    componentDidMount() {
        if(!empty(this.props.pPrintTag)){
            window.print();
        }
    }
    
    
    
    render() {
        return (
                <div>
                {(!empty(this.props.pPrintTag) ? 
                    <Print printOnly single name="foo">
                        {this.props.pPrintTag}
                    </Print> 
                    : '' )}  
                </div>
        );
    }
    
}

// Export the class
export default (PrintCloseElement);
//export default CentersDropdown;
