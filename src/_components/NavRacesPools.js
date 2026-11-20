import React from 'react';
import {Nav,NavDropdown,Form} from 'react-bootstrap';
import empty from 'is-empty';

class NavRacesPools extends React.Component {
  constructor(props, context) { 
    super(props, context);
    this.state = {
      countRows : 0
    };
    this.arrAllItems = [];
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
              arrAux.push(element.id)
            : null );
        })
        this.arrAllItems[position] = arrAux;
    }
  }

  rowsHorsesRaces(horsesRaces,position)
  {
    this.allItems(horsesRaces,position);

    return horsesRaces.map((horsesrace) =>
          (horsesrace.statusId==1  ?
            <Form.Check key={horsesrace.id} 
            type="checkbox" 
            inline 
            label={horsesrace.programNumber} 
            id={position} 
            name={horsesrace.id} 
            onChange={this.props.handleChangeCheckbox} 
            checked={this.props.checkedHorses.includes(Number.parseInt(horsesrace.id))}
            />
         : 
            null)
    );
  }


  navDropdownItems(races,id)
  {
    let navDropdownItems = null;
    if(!empty(races))
    {
      navDropdownItems = races.map((race) =>
            <NavDropdown.Item 
              eventKey={race.join()+"."+id} 
              key={race.join()} 
              id={id}>
              Carreras: {race.join()}
            </NavDropdown.Item>
      );
    }
    return navDropdownItems;
  }

  render () {
    //console.log('NAV RACES POOLS',this.props);
      const {racesPools,horsesRacesSelected} = this.props;
      let navItems = null;
      var countRows = 0;
      
            if(!empty(racesPools)){
            navItems = racesPools.map((race) =>
            <NavDropdown 
              title={race.wagerName} 
              id={race.wagerTypeId} 
              key={race.wagerName}>
                {this.navDropdownItems(race.races,race.wagerTypeId)}
            </NavDropdown>
                   
                );
            }

      return (
          <div>
              <Nav 
              defaultActiveKey={this.props.activeKey} 
              onSelect={this.props.handleSelect} 
              variant="pills">
                  {navItems}
              </Nav>
              {(!empty(horsesRacesSelected) ?

                horsesRacesSelected.map(function (horserace,index) 
                {
                  countRows=countRows+1;
                
                return (<div key={index}>
                    <label>Caballos disponibles en Carrera:{index}</label> 
                    {this.rowsHorsesRaces(horserace,countRows)} 
                    <Form.Check key={index} 
                    type="checkbox" 
                    inline 
                    label="Todos" 
                    id={countRows} 
                    name="all" 
                    onChange={(e) => this.props.handleChangeCheckboxAll(e, this.arrAllItems)} 
                    />
                </div>)}
                ,this) : null)}
          </div>

  )
   }
}

export default NavRacesPools;

