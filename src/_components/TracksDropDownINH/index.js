import React from 'react';
import { connect } from "redux-zero/react";
import empty from 'is-empty';
import actions from '../../_actions';

class TracksDropDownINH extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            searchticketform : {
            }
        };
    }

    select = (optionItems) => {
        return(<select name="tracksId" id="tracksId" data-placeholder="Seleccione el hipodromo" className="form-control chosen-select" onChange={this.props.handleChange} value={!empty(this.props.trackSelected) ? this.props.trackSelected : ''}>
                    <option value="">Seleccione Hipódromo</option>
                    {optionItems}
                </select>);
    }

    render() {
        const { tracks }= this.props;
        let tagInclude=null;
        let optionItems=null;
        

        if(!empty(tracks)){
        
            optionItems = tracks.map((track) =>
                    (this.props.results ? <option key={track.id} value={track.id}>{track.trackName}</option> :
                    (
                    <option key={track.id} value={track.id}>{track.trackName}</option> 
                   
                    ) )
            );
        }
    
        tagInclude = this.select(optionItems);

        return (
                <div className="form-group mt-0 mb-0">               
                    {tagInclude}
               </div>
        );
    }
    
}

const mapToProps = ({
    
}) => ({
    
});

const connectedTracksDropDownINH = connect(mapToProps, actions)(TracksDropDownINH);
export { connectedTracksDropDownINH as TracksDropDownINH };