import React from 'react';
import empty from 'is-empty'
import queryString from 'query-string';
import { Card,  Button, Form , Row, Col} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatePicker from "react-datepicker";
import Select from 'react-select';  


class TicketsElInmejorableFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params:
            {
                ticketoffice_id: '',
                wagertype_id: '',
                ticketstatus_id: '',
                numbers: '',
                confirms: '',
                date_from: new Date(),
                date_until: new Date(),
                amount: '',
                track_id:'',
                race_number:''
            }
        };
    }

    componentWillMount(){
        this.props.TicketStatusActions({ action: 'getAll', params: {params : {limit: 300 }} });
        this.props.TracksActions({ action: 'getAllInh', params: {params : {limit: 300 }} });
        this.props.WagerTypesActions({ action: 'getAllInhSelect', params: {params : {limit: 300 }} });
        
    }

    handleChange = (selectedOption) => {

        this.setState({ 
            params: {
                ...this.state.params,
                [name]: selectedOption  
            }
        });
      };

      loadTicketOfficesOptions = () => {
        
        const { ticketoffice, loading } = this.props;
        
        let options = [];

        if(!empty(ticketoffice)) {

            options.push({ value: '', label: 'Seleccionar', color: '#FFC400', isFixed: true });
            ticketoffice.map((ticketoffice) =>  {
                options.push( { value: ticketoffice.id, label: ticketoffice.name, color: '#FFC400', isFixed: true })
            })

        } 

        return (
            <Select options={options}
            name='ticketoffice_id'
            onChange={this.onChangeTicketOfficesId} 
            defaultValue={this.state.params.ticketoffice_id}
            label="Selecciona la taquilla"
            isSearchable={true} />);
    }
    

    loadWagerTypesOptions = () => {
        
        const { user, wagertypes, loading } = this.props;
        let wagertypesoptions = wagertypes;
        let options = [];

        if (!empty(this.props.user) && this.props.user.centers_id===177){
            wagertypesoptions = [{id:1, description:'GANADOR'}];
        }

        if(!empty(wagertypesoptions)) {

            options.push(<option key="0" value=''>Seleccionar..</option>);
            wagertypesoptions.map((wagertype) =>  {
                    options.push(<option key={wagertype.id} value={wagertype.id}>{wagertype.description}</option>)                
            })

        } else {

            if(loading){
                options.push(<option key="0" value=''>Cargando Lista..</option>);
            } else {
                options.push(<option key="0" value=''>Seleccionar..</option>);
            }
            
        }

        return (
            <Form.Control 
                required
                as="select" 
                name="wagertype_id"
                onChange={this.onChangeInput} >
                {options}
            </Form.Control>);
    }

    loadTracksOptions = () => {
        
        const { tracksInh, loading } = this.props;
        
        let tracks = tracksInh;
        let options = [];

        if(!empty(tracks)) {

            options.push(<option key="0" value=''>Seleccionar..</option>);
            tracks.map((track) =>  {
                options.push(<option key={track.id} value={track.id}>{track.trackName}</option>)
            })

        } else {

            if(loading){
                options.push(<option key="0" value=''>Cargando Lista..</option>);
            } else {
                options.push(<option key="0" value=''>Seleccionar..</option>);
            }
            
        }

        return (
            <Form.Control 
                required
                as="select" 
                name="track_id"
                onChange={this.onChangeInput} >
                {options}
            </Form.Control>);
    }

    loadTicketStatusOptions = () => {
        
        const { loading } = this.props;
        
        let ticketstatus =[{id:2,name:"Totalizado INH"},{id:10,name:"PERDEDOR"},{id:3,name:"GANADOR"},{id:11,name:"Enviado a Billetera del Cliente"},{id:7,name:"Anulado"}]
        let options = [];

        if(!empty(ticketstatus)) {

            options.push(<option key="0" value=''>Seleccionar..</option>);
            ticketstatus.map((ticketstatu) =>  {
                options.push(<option key={ticketstatu.id} value={ticketstatu.id}>{ticketstatu.name}</option>)
            })

        } else {

            if(loading){
                options.push(<option key="0" value=''>Cargando Lista..</option>);
            } else {
                options.push(<option key="0" value=''>Seleccionar..</option>);
            }
            
        }

        return (
            <Form.Control 
                required
                as="select" 
                name="ticketstatus_id"
                onChange={this.onChangeInput} >
                {options}
            </Form.Control>
            );
    }

    handleChangeFrom = (date) => {
        this.setState({
          params:{
            ...this.state.params,  
            date_from: date
          }
        });
    }

    handleChangeUntil = (date) => {
        this.setState({
          params:{
            ...this.state.params,  
            date_until: date
          }
        });
    }

    handleSubmit = (e) => {        
        e.preventDefault();
        e.stopPropagation();
        let form = e.target
        let params = this.state.params;

        params.ticketoffice_id = this.state.params.ticketoffice_id;
        params.wagertype_id = wagertype_id.value;
        params.ticketstatus_id = ticketstatus_id.value;
        params.numbers = numbers.value;
        params.confirms = confirms.value;
        params.amount = amount.value;
        params.track_id = track_id.value;
        params.race_number = race_number.value;
        
        let qString = queryString.stringify(params);
        this.props.history.push(`${this.props.location.pathname}?${qString}`)
        
        this.props.onLoadList({params});
                        
    }

    handleClear = () => {

       const form = this.refs.ticketsFormFilter;
       form.reset();
       let params = this.state.params;
       params.ticketoffice_id = '';
       params.wagertype_id = wagertype_id.value;
       params.ticketstatus_id = ticketstatus_id.value;
       params.numbers = numbers.value;
       params.confirms = confirms.value;
       params.date_from = date_from.value;
       params.date_until = date_until.value;
       params.amount = amount.value;
       params.track_id = track_id.value;
       params.race_number = race_number.value;
       
       this.setState({
           params: {...params}
       }, () => {
         this.props.onLoadList({params});
       })

    }

    isSearching = () => {
        let params = this.state.params;

        return ( !empty(params.ticketoffice_id) ||
                 !empty(params.track_id) ||
                 !empty(params.wagertype_id) ||
                 !empty(params.ticketstatus_id) ||
                 !empty(params.numbers) ||
                 !empty(params.confirms) ||
                 !empty(params.date_from) ||
                 !empty(params.date_until) ||
                 !empty(params.user_inmejorable) ||
                 !empty(params.amount) ||
                 !empty(params.track_id) || 
                 !empty(params.race_number) 
                 )
    }

    onChangeInput = (e) => {

        const { name, value } = e.target;

        this.setState({ 
            params: {
                ...this.state.params,
                [name]: value 
            }
        });

    }

    onChangeTicketOfficesId = (e) => {
        
        const { value } = e;

        this.setState({ 
            params: {
                ...this.state.params,
                ticketoffice_id : value 
            }
        });

    }

    loadRoles = () => {
        let result = [];
        const datarows = [
            {
                name: 'SUPERUSER'
            },
            {
                name: 'ADMIN'
            },
            {
                name: 'OPERADOR'
            }
        ];
        result.push(<option key={Math.random()} value="">Seleccione..</option>);

        let ci=0;
        datarows.map((c) => {
            ci++;
            result.push(<option key={Math.random()} value={c.name}>{c.name}</option>);
        })

        return result;
    } 
    
    render() {
        const { errors, validated, open, params} = this.state;

        return (

                <Card className="container-filters-card">
                    
                    
                    <Card.Body className="container-filters">

                    <Form 
                                id="ticketsFormFilter"
                                ref="ticketsFormFilter"
                                noValidate
                                validated={validated}
                                onSubmit={this.handleSubmit}>

                            <Row className="">

                                <Col xl="2">
                                <Form.Group controlId="date_filter">
                                    <Form.Label>Fecha desde</Form.Label>
                                    <DatePicker
                                    autoComplete="false"
                                    className="form-control"
                                    onChange={this.handleChangeFrom}
                                    selected={this.state.params.date_from}
                                    dateFormat="yyyy-MM-dd"
                                    name="date_from"
                                    />
                                </Form.Group>

                                </Col>
                                <Col xl="2">
                                <Form.Group controlId="date_filter">
                                    <Form.Label>Fecha hasta</Form.Label>
                                    <DatePicker
                                    autoComplete="false"
                                    className="form-control"
                                    selected={this.state.params.date_until}
                                    onChange={this.handleChangeUntil}
                                    dateFormat="yyyy-MM-dd"
                                    name="date_until"
                                    />
                                </Form.Group>

                                </Col>
                                <Col xl="2">

                                <Form.Group controlId="track_id">
                                    <Form.Label>Hipódromos</Form.Label>
                                    {this.loadTracksOptions()}
                                </Form.Group>

                                </Col>
                                <Col xl="2">

                                <Form.Group controlId="race_number">
                                    <Form.Label>Carrera</Form.Label>
                                    <Form.Control 
                                    type="number" 
                                    placeholder="# de Carrera" />
                                </Form.Group>

                                </Col>
                            </Row>
                            <Row className="">

                            <Col xl="4">

                            <Form.Group controlId="wagertype_id">
                                <Form.Label>Apuestas</Form.Label>
                                {this.loadWagerTypesOptions()}
                            </Form.Group>

                            </Col>

                            <Col xl="4">

                            <Form.Group controlId="ticketstatus_id">
                                <Form.Label>Estatus</Form.Label>
                                {this.loadTicketStatusOptions()}
                            </Form.Group>

                            </Col>
                            <Col xl="4">

                            <Form.Group controlId="numbers">
                                <Form.Label>Números de tickets INH</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder="Números de tickets" />
                            </Form.Group>

                            </Col>

                            </Row>
                            <Row>

                            <Col xl="4">

                            <Form.Group controlId="confirms">
                                <Form.Label>Números de confirmación</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder="Números de confirmación" />
                            </Form.Group>

                            </Col>

                            <Col xl="4">

                            <Form.Group controlId="amount">
                                <Form.Label>Tickets con montos mayores o iguales a:</Form.Label>
                                <Form.Control 
                                type="text" 
                                placeholder="Costo ticket" />
                            </Form.Group>

                            </Col>

                            

                            </Row>
                            <Row>
                                <Col xl="4">
                                    <Button
                                    type="submit"
                                    variant="success" 
                                    style={{marginRight: '2px'}} >Filtrar</Button>

                                    { (this.isSearching()) ? 
                                    <Button
                                    onClick= {this.handleClear}
                                    type="button"
                                    variant="info" 
                                    style={{marginRight: '0'}} >Limpiar</Button> : '' }

                                </Col>

                            </Row>
                        </Form>
                    
                    </Card.Body>
                    
                </Card>
        );
    }
}

export default TicketsElInmejorableFilter; 