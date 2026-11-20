import React from 'react';
import {Form,Badge} from 'react-bootstrap';
import empty from 'is-empty';
import {Button,Image, Row, Col} from 'react-bootstrap';
import {formatNumber, getAnimals} from '../../_helpers/lib';
import config from "config";

class TableAnimalsCocks extends React.Component {
  constructor(props, context) { 
    super(props, context);
    this.state = {
      countRows : 0,
      amount_ves: config.valueUnitsVES,
    };
    this.arrAllItems = [];
    this.animals = getAnimals();
  }

  allItems(horsesRaces,position)
  {
    let arrAux=[];
    if(!empty(horsesRaces))
    {
        if(empty(this.arrAllItems[position]))
        {
          this.arrAllItems[position] = [];
        }
        
        horsesRaces.forEach(function(element) {
          (element.statusId==1  ?
              arrAux.push({id: element.id,programNumber: element.programNumber})
            : null );
        })
        this.arrAllItems[position] = arrAux;
    }
  }

  rowsAnimals = () => {

    return this.animals.map((animal) =>
         
      <div className={this.props.checkedAnimals.includes(animal.id) ? 'cocks-animals-container-option pick-selected' : 'cocks-animals-container-option'}>
        <Image src={animal.image} height="60px" width="60px" onClick={this.props.handleChangeCheckbox} id={animal.id} /> &nbsp;
        <Form.Check key={animal.id} 
        type="checkbox" 
        inline 
        label={<span className={`animal-${animal.id}`}>{`${animal.id}) ${animal.name}`}</span>} 
        id={animal.id}
        name={animal.id} 
        value={animal.id} 
        onChange={this.props.handleChangeCheckbox} 
        checked={this.props.checkedAnimals.includes(animal.id)}
        />
      </div>      
         
    );
  }

  render () {
      const {account,currencyCode,ticketCombinations} = this.props;
      const { amount_usd,amount_ves} = this.state;
      let errorMessage = '';
      let lottery_cock = this.props.lotteryCock;
      let costByCock = 0;
      //console.log('lottery_cock2>>>>',lottery_cock,currencyCode);
      if(!empty(lottery_cock)){
            if(currencyCode=='USD'){
              costByCock = lottery_cock.amount;
            }else if(currencyCode=='VES'){
              costByCock = parseFloat(lottery_cock.amount) * parseFloat(amount_ves);
            }
      }

      
      if( this.props.checkedAnimals.length < 6) {
        errorMessage = 'Debe elegir 6 números para poder sellar la polla'
      }  

      return (
          <Row className="cocks-animals-container">
              
              {(!empty(lottery_cock) ? 
                <>
                  <Col xl={12}>
                    <h1>Polla de Animalitos</h1> 
                  </Col>
                              
                  <Col xl={12} className="cocks-animals-container-bets">
                      <Row>
                        <Col xl={8} className='animals-bet-options-container'>
                          <Col xl={12}>
                          {this.rowsAnimals()}
                          </Col>
                        </Col>
                        <Col xl={4} className='bet-selection-container'>
                          <Col xl={12}>
                            { !empty(errorMessage) ? 
                                <Badge pill variant={'danger'}>{errorMessage}</Badge>
                              : null }
                          </Col>
                          <Col xl={12} className="animal-selected-items">
                            { [0,1,2,3,4,5].map((item) => 
                              <div className="animal-selected-item">
                                {!empty(this.props.checkedAnimals[item]) ?  <Image src={this.animals.find((a) => a.id == this.props.checkedAnimals[item]).image } height="60px" width="60px" /> : ''}
                              </div>
                            )}
                          </Col>

                          <Col xl={12} className="animal-selected-items">
                            { [0,1,2,3,4,5].map((item) => 
                              <div className="animal-selected-item-number">
                                {!empty(this.props.checkedAnimals[item]) ?  <>{ this.animals.find((a) => a.id == this.props.checkedAnimals[item]).id }</> : ''}
                              </div>
                            )}
                          </Col>
                          <Col xl={12}>
                             <label>Costo por polla: {formatNumber(currencyCode, costByCock)}</label>
                          </Col>
                          
                          <Col xl={12}>
                                <Form.Control 
                                type="text" 
                                onChange={this.props.handleChange}
                                name="user_alias"
                                placeholder="Alias del usuario" />
                                
                              <Button type="button" onClick={(e) => this.props.confirmSubmit(costByCock,lottery_cock.lotteryId,e)} disabled={!empty(errorMessage)}>Vender</Button> 
                          </Col>

                          <Col xl={12}>
                              <Button variant='info' type="button" onClick={(e) => this.props.cleanAllSelections(e)} >Limpiar Selección</Button> 
                          </Col> 
                          
                        </Col>
                      </Row>
                                           
                  </Col>
                </>
                 : <p>No hay sorteos disponibles</p>)
              } 
          </Row>
          

  )
   }
}

export default TableAnimalsCocks;

