import React from 'react';
import { withRouter } from 'react-router-dom';
import TextValidator from '../_components/TextValidator';
import { ValidatorForm } from 'react-form-validator-core';


class SetupPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agencyUrl: '',
            taquillaLocation: '',
        };
    }

    componentDidMount() {
        // Register custom validation rule
        ValidatorForm.addValidationRule('isAllowedDomain', (value) => {
            if (!value) return true; // Let 'required' handle empty
            let host = value.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/;+$/, '').toLowerCase();
            const allowedDomainsRegex = /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;
            return allowedDomainsRegex.test(host);
        });

        // Load saved location if any
        const savedLocation = localStorage.getItem('TAQUILLA_LOCATION');
        if (savedLocation) {
            this.setState({ taquillaLocation: savedLocation });
        }
    }



    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handlePrinterSetup = () => {
        const isElectron = !!window.process && (window.process.type === 'renderer' || window.process.versions['electron']);
        if (isElectron) {
            const { shell } = window.require('electron');
            shell.openExternal('ms-settings:printers');
        } else {
            alert('Esta función solo está disponible en la aplicación de escritorio.');
        }
    }

    handleSubmit = () => {
        const { agencyUrl, taquillaLocation } = this.state;
        // Basic cleaning, remove protocol if present
        let host = agencyUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

        if (host) {
            localStorage.setItem('SELECTED_HOST', host);
            // Save optional location for geolocation fallback
            if (taquillaLocation.trim()) {
                localStorage.setItem('TAQUILLA_LOCATION', taquillaLocation.trim());
            }
            // Reload into main app, redirect to proper route handled by App.js
            window.location.href = '#/';
            window.location.reload();
        }
    }

    render() {
        return (
            <div className="container" style={{ paddingTop: '100px' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="text-center mb-4">
                            <h2>Taquilla Física 2026</h2>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <h3>Configuración Inicial</h3>
                            </div>
                            <div className="card-body">
                                <p>Ingrese el código de la taquilla, sin dominio.</p>
                                <ValidatorForm onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <TextValidator
                                            onChange={this.handleChange}
                                            name="agencyUrl"
                                            value={this.state.agencyUrl}
                                            validators={['required', 'isAllowedDomain']}
                                            errorMessages={['Este campo es requerido', 'Código no válido (ej: 4l-1usd)']}
                                            className="form-control"
                                            placeholder="Ejemplo: 4l-1usd"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label><small className="text-muted">Ubicación de la taquilla (opcional)</small></label>
                                        <input
                                            type="text"
                                            name="taquillaLocation"
                                            value={this.state.taquillaLocation}
                                            onChange={this.handleChange}
                                            className="form-control"
                                            placeholder="Ej: Caracas, Venezuela o 10.4806,-66.9036"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">
                                        Guardar y Continuar
                                    </button>
                                    <div className="mt-3">
                                        <button type="button" className="btn btn-secondary btn-block" onClick={this.handlePrinterSetup}>
                                            Configurar Impresora
                                        </button>
                                    </div>
                                </ValidatorForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SetupPage);
