import React from 'react';
import { Print } from 'react-easy-print';
import empty from 'is-empty';

class PrintElement extends React.Component {

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
export default (PrintElement);
//export default CentersDropdown;
