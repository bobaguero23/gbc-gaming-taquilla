import React from 'react';
import empty from 'is-empty';
import { Image } from "react-bootstrap";
import { connect } from "redux-zero/react";
import {getAppConfig} from "../_helpers/lib";

class Footer extends React.Component {   

      constructor(props) {
        super(props);
        this.state = { appVersion: '' };
      }

      componentDidMount() {
        try {
          const isElectron = !!window.process && (window.process.type === 'renderer' || window.process.versions['electron']);
          if (isElectron) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.on('app_version', (event, version) => {
              this.setState({ appVersion: version });
            });
            ipcRenderer.send('get_app_version');
          }
        } catch (err) {
          console.warn('Footer: Could not get app version', err);
        }
      }

      render() {
        const appConfig = getAppConfig();
        const { appVersion } = this.state;

        const { alldata } = this.props;
        let username = "";
        let centerName = "";
        let ticketOfficesName = "";
        
        if(!empty(alldata))
        {
            if(!empty(alldata.allTokens))
            {
                if(!empty(alldata.allTokens.nodes))
                {
                    username = (!empty(alldata.allTokens.nodes[0].userBySellerId.username) ? alldata.allTokens.nodes[0].userBySellerId.username : null);
                    centerName = (!empty(alldata.allTokens.nodes[0].centerByCentersId.name) ? alldata.allTokens.nodes[0].centerByCentersId.name : null);
                    ticketOfficesName = (!empty(alldata.allTokens.nodes[0].ticketOfficeByTicketOfficesId.name) ? alldata.allTokens.nodes[0].ticketOfficeByTicketOfficesId.name : null);
                }
            }
        }
        
        const selectedHost = localStorage.getItem('SELECTED_HOST') || '';

        return (
            (!empty(localStorage.getItem("bearer_seller")) ? 
                <footer className="footer">
                    <div className="d-flex bg-dark text-white">
                        <div className="mr-2 p-2">
                               {username}
                        </div>
                        <div className="flex-fill p-2 text-center mr-2">{centerName}/{ticketOfficesName}</div>
                        {selectedHost && <div className="p-2 text-muted" style={{fontSize: '0.75rem'}}>{selectedHost}</div>}
                        {appVersion && <div className="p-2 text-muted" style={{fontSize: '0.75rem'}}>v{appVersion}</div>}
                    </div>
                </footer> 
            :
                <footer className="footer">
                <div className="row justify-content-center">
                    
                    <p className="pull-right">
                        {appConfig.logoPrint && <Image src={appConfig.logoPrint} width="80px" height="auto" id="image-logo" />} {'  '}
                        <a href="https://www.inh.gob.ve/" target="_blank">Desarrollado por INH{appVersion ? ` Version: ${appVersion}` : ''}</a>
                        {selectedHost && <span style={{fontSize: '0.75rem', color: '#999', marginLeft: '10px'}}>({selectedHost})</span>}
                        <br />
                    </p>
                </div>
                </footer>
            ) 
        )

      }
}


const mapStateToProps = ({ 
    loading,
    LoadingActions, 
    AuthActions,
    alldata,
}) => ({
    loading,
    LoadingActions,
    AuthActions,
    alldata
});

export default connect(mapStateToProps)(Footer);