import React from 'react';
import empty from 'is-empty'

class Loading extends React.Component {

    constructor(props) {
        super(props);
      }
      render() {
        
        let showLoading = false;

        if(!empty(this.props.loading)) {
            if(this.props.loading > 0) {
                showLoading=true;
            }
        }

        return (
          <div className={(showLoading) ? 'loading-overlay' : 'loading-overlay noshow'}>
            <div className='loading-wheel'>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #e0e0e0',
                    borderTop: '4px solid #333',
                    borderRadius: '50%',
                    animation: 'spin-loading 0.8s linear infinite'
                  }}
                />
            </div>
            <style>{`
              @keyframes spin-loading {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div> 
        )
      }
}

export default Loading;