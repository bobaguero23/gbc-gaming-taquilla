import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SellMenuNacional() {
  return (
    <Nav className="mt-3 mb-0 menu-venta">
      <Nav.Item>
        <Nav.Link as={Link} style={{ backgroundColor: '#fa711e', color: 'white', marginRight: '5px' }} to="/nacional">
          Vender Nacional
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} style={{ backgroundColor: '#fa711e', color: 'white', marginRight: '5px' }} to="/5y6">
          Vender 5 y 6
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SellMenuNacional;
