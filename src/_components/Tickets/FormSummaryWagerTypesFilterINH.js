import React from 'react';
import empty from 'is-empty'
import { Card,  Button, Form , Row, Col} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatePicker from "react-datepicker";
import queryString from 'query-string';


class TicketsSummaryWagerTypesFilterINH extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            params:
            {
                date_from: new Date(),
                date_until: new Date(),
            }
        };
    }

    componentWillMount(){
        this.props.WagerTypesActions({ action: 'getAllInh', params: {params : {limit: 300 }} });
    }


    loadWagerTypesOptions = () => {
        
        const { wagertypes, loading } = this.props;
        
        //console.log('user',this.props.user);
        let options = [];

        if(!empty(wagertypes)) {

            options.push(<option key="0" value=''>Seleccionar..</option>);
            wagertypes.map((wagertype) =>  {
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

        let qString = queryString.stringify(params);
        this.props.history.push(`${this.props.location.pathname}?${qString}`)
        
        this.props.onLoadList({params});
                        
    }

    handleClear = () => {

       const form = this.refs.ticketsFormFilter;
       form.reset();
       let params = this.state.params;
       params.date_from = date_from.value;
       params.date_until = date_until.value;
       
       this.setState({
           params: {...params}
       }, () => {
         this.props.onLoadList({params});
       })

    }

    isSearching = () => {
        let params = this.state.params;

        return ( 
                 !empty(params.date_from) ||
                 !empty(params.date_until) )
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
        result.push(<option key='roles-fix-empty' value="">Seleccione..</option>);

        let ci=0;
        datarows.map((c) => {
            ci++;
            result.push(<option key={'cc-'+ci} value={c.name}>{c.name}</option>);
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

                            
                               <Col xl="3">
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
                                <Col xl="3">
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
                            </Row>
                            <Row>
                                <Col xl="4" className="text-left">
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
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </Card.Body>
                    
                </Card>
        );
    }
}

export default TicketsSummaryWagerTypesFilterINH; 