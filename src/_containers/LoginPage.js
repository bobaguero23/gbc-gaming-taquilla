import React from 'react';
import { connect } from 'redux-zero/react';
import { Alert, Image } from 'react-bootstrap';
import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-google';
import { ValidatorForm } from 'react-form-validator-core';
import { load } from 'recaptcha-v3';
import TextValidator from '../_components/TextValidator';
import actions from '../_actions';
import { getAppConfig } from '../_helpers/lib';
import { isGbcGaming } from '../_helpers/product';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        token: '',
        ticket_office_id: '',
        username: '',
        password: '',
        submitted: false,
        rememberMe: false,
      },
    };
  }

  componentDidMount = () => {
    const isElectron = !!window.process && (window.process.type === 'renderer' || window.process.versions['electron']);
    if (isElectron) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.invoke('secure-get-credentials').then((creds) => {
          if (creds) {
            this.setState(prevState => ({
              form: {
                ...prevState.form,
                username: creds.username,
                password: creds.password,
                rememberMe: true
              }
            }));
          }
        });
      } catch (e) {
        console.error("Error retrieving credentials", e);
      }
    }
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const { form } = this.state;

    // Handle checkbox vs text input
    let val = value;
    if (type === 'checkbox') {
      val = checked;
    }

    this.setState({
      form: {
        ...form,
        [name]: val,
      },
    });
  }

  isElectronApp = () => {
    return !!window.process && (window.process.type === 'renderer' || (window.process.versions && window.process.versions['electron']));
  }

  handleSubmit = (e) => {
    (async () => {
      this.props.LoadingActions({ action: 'setShow', params: {} });
      await this.onLoadRecaptcha();
      const { form } = this.state;
      const macAddress = await this.getMacAddress();
      const geoLocation = await this.getGeolocation();
      const ipAddress = this.getIpAddress();
      const model = {
        token: form.token,
        macAddress,
        geoLocation,
        ipAddress
      };
      this.props.AuthActions({ action: 'login', params: { ...model } });
      this.props.LoadingActions({ action: 'setHide', params: {} });
    })();
  }

  handleSubmitTicketOffices = (e) => {
    (async () => {
      this.props.LoadingActions({ action: 'setShow', params: {} });
      await this.onLoadRecaptcha();
      const { form } = this.state;
      const macAddress = await this.getMacAddress();
      const geoLocation = await this.getGeolocation();
      const ipAddress = this.getIpAddress();
      const model = {
        token: form.token,
        ticket_office_id: form.ticket_office_id,
        macAddress,
        geoLocation,
        ipAddress
      };
      this.props.AuthActions({ action: 'loginTicketOffice', params: { ...model } });
      this.props.LoadingActions({ action: 'setHide', params: {} });
    })();
  }

  handleSubmitUserPass = () => {
    (async () => {
      this.props.LoadingActions({ action: 'setShow', params: {} });
      await this.onLoadRecaptcha();
      const { form } = this.state;

      if (form.rememberMe) {
        try {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.invoke('secure-set-credentials', {
            username: form.username,
            password: form.password
          });
        } catch (e) {
          console.error("Error saving creds", e);
        }
      } else {
        try {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.invoke('secure-delete-credentials');
        } catch (e) {
          console.error("Error deleting creds", e);
        }
      }

      const macAddress = await this.getMacAddress();
      const geoLocation = await this.getGeolocation();
      const ipAddress = this.getIpAddress();
      const model = {
        username: form.username,
        password: form.password,
        macAddress,
        geoLocation,
        ipAddress
      };
      this.props.AuthActions({ action: 'loginUserPass', params: { ...model } });
      this.props.LoadingActions({ action: 'setHide', params: {} });
    })();
  }



  componentWillReceiveProps = (nextProps) => {
    if (nextProps.loading == 0) {
      this.onLoadRecaptcha();
    }
  }

  async onLoadRecaptcha() {
    // La taquilla INH instalada sigue con el atajo. GBC no: el servidor tiene que ver un captcha real.
    if (this.isElectronApp() && !isGbcGaming()) {
      localStorage.setItem('recaptcha', 'electron-desktop');
      return;
    }
    const recaptcha = await load('6LdQg8YUAAAAAHGf-V_iA6lRn-gEXFwqT66cfe8s');
    const recaptchaToken = await recaptcha.execute('login');
    localStorage.setItem('recaptcha', recaptchaToken);
  }

  getMacAddress = () => {
    return new Promise((resolve) => {
      const isElectron = !!window.process && (window.process.type === 'renderer' || window.process.versions['electron']);
      if (isElectron) {
        try {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('get-mac-address');
          ipcRenderer.once('get-mac-address-reply', (event, mac) => {
            resolve(mac);
          });
          // Fallback timeout
          setTimeout(() => resolve('00:00:00:00:00:00'), 2000);
        } catch (e) {
          console.error("Error with IPC MAC", e);
          resolve('00:00:00:00:00:00');
        }
      } else {
        resolve('');
      }
    });
  }

  getGeolocation = () => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve(`${latitude},${longitude}`);
          },
          (error) => {
            console.error("Geo error", error);
            resolve('');
          },
          {
            enableHighAccuracy: false,
            timeout: 3000,
            maximumAge: 600000
          }
        );
      } else {
        resolve('');
      }
    });
  }

  getIpAddress = () => {
    const isElectron = !!window.process && (window.process.type === 'renderer' || window.process.versions['electron']);
    if (isElectron) {
      try {
        const os = window.require('os');
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
          for (const iface of interfaces[name]) {
            if (iface.internal) continue;
            if (iface.family === 'IPv4' || iface.family === 4) {
              return iface.address;
            }
          }
        }
      } catch (e) {
        console.error('Error getting IP', e);
      }
    }
    return '';
  }

  render() {
    const { error } = this.props;
    const appConfig = getAppConfig();
    const { origin } = window.location;
    let otherLogin = false;

    if (['', '', '', '', '', ''].includes(origin)) {
      otherLogin = true;
    }

    return (
      <div className="container" style={{ padding: '8em' }}>
        <div className="row justify-content-center">
          <div className="col-4 text-center mb-4">
            {appConfig.logo ? (
              <Image src={appConfig.logo} className="loginLogo" />
            ) : (
              <h2>{appConfig.appName}</h2>
            )}
          </div>
        </div>
        {error == 1 && (
          <Alert variant="danger" dismissible>
            Revise el turno, es invalido.
          </Alert>
        )}
        {error == 2 && (
          <Alert variant="danger" dismissible>
            Ha fallado la verificación del captcha. Refrescando..
          </Alert>
        )}
        <div className="row">
          {!isGbcGaming() ? (
          <div className="col-md-6 border-right" style={{ padding: '4em' }}>
            {otherLogin ? (
              <ValidatorForm ref="form" onSubmit={this.handleSubmitTicketOffices}>
                <div className="form-group">
                  <TextValidator
                    onChange={this.handleChange}
                    name="token"
                    className="form-control"
                    placeholder="Introduzca el turno"
                    value={this.state.form.token}
                    validators={['required', 'isNumber', 'maxNumber:999999999']}
                    errorMessages={[
                      'El número de turno es requerido',
                      'Debe ser un número',
                      'el máximo valor para este campo es 999999999',
                    ]}
                  />
                </div>
                <div className="form-group">
                  <TextValidator
                    onChange={this.handleChange}
                    name="ticket_office_id"
                    className="form-control"
                    placeholder="Introduzca el id de la taquilla"
                    value={this.state.form.ticket_office_id}
                    validators={['required', 'isNumber', 'maxNumber:999999999']}
                    errorMessages={[
                      'El número de taquilla es requerido',
                      'Debe ser un número',
                      'el máximo valor para este campo es 999999999',
                    ]}
                  />
                </div>
                <div className="row">
                  <div className="col-12">
                    <center>
                      <button type="submit" className="btn btn-primary">
                        Aperturar taquilla
                      </button>
                    </center>
                  </div>
                </div>
              </ValidatorForm>
            ) : (
              <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <TextValidator
                    onChange={this.handleChange}
                    name="token"
                    className="form-control"
                    placeholder="Introduzca el turno"
                    value={this.state.form.token}
                    validators={['required', 'isNumber', 'maxNumber:999999999']}
                    errorMessages={[
                      'El número de turno es requerido',
                      'Debe ser un número',
                      'el máximo valor para este campo es 999999999',
                    ]}
                  />
                </div>
                <div className="row">
                  <div className="col-12">
                    <center>
                      <button type="submit" className="btn btn-primary">
                        Aperturar taquilla
                      </button>
                    </center>
                  </div>
                </div>
              </ValidatorForm>
            )}
          </div>
          ) : null}
          <div className={isGbcGaming() ? 'col-md-6 offset-md-3' : 'col-md-6'} style={{ padding: '4em' }}>
            <ValidatorForm ref="form" onSubmit={this.handleSubmitUserPass}>
              <div className="form-group">
                <TextValidator
                  onChange={this.handleChange}
                  name="username"
                  className="form-control"
                  placeholder="Introduzca su usuario"
                  value={this.state.form.username}
                  validators={['required']}
                  errorMessages={['El usuario es requerido']}
                />
              </div>
              <div className="form-group">
                <TextValidator
                  onChange={this.handleChange}
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Introduzca su contraseña"
                  value={this.state.form.password}
                  validators={['required']}
                  errorMessages={['La contraseña es requerida']}
                />
              </div>
              <div className="form-group">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    name="rememberMe"
                    checked={this.state.form.rememberMe}
                    onChange={this.handleChange}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Recordar usuario y contraseña
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <center>
                    <button type="submit" className="btn btn-primary">
                      Iniciar sesión
                    </button>
                  </center>
                </div>
              </div>
            </ValidatorForm>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  loading,
  LoadingActions,
  AuthActions,
  token,
  error,
}) => ({
  loading,
  LoadingActions,
  AuthActions,
  token,
  error,
});

const connectedLoginPage = connect(mapStateToProps, actions)(LoginPage);
export { connectedLoginPage as LoginPage };
