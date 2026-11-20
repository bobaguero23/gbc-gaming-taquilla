import React from 'react';
import empty from 'is-empty';
//import { logoutByFailure } from '../_helpers';

class FooterLogin extends React.Component {
    constructor() { 
        super();
        this.handleLogout = this.handleLogout.bind(this);
    }
   
    handleLogout()
    {
        //logoutByFailure();
    }

      render() {

        return (
                <footer className="footer">
                <div className="row justify-content-center">
                    <p className="pull-right">
                        <a href="https://www.inh.gob.ve/" target="_blank">Desarrollado por INH</a>
                    </p>
                </div>
                </footer>
        )

      }
}

export default FooterLogin;