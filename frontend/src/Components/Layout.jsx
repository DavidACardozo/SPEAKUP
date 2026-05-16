import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { Container } from 'react-bootstrap';

const Layout = () => {
  return (
    <div className="d-flex w-100 min-vh-100">
      <Sidebar />
      <div className="d-none d-lg-block" style={{ width: '280px', flexShrink: 0 }} />
      <div className="flex-grow-1"> 
        <Container fluid className="px-3 py-4 pt-sm-5 pt-lg-4"> 
          <Outlet /> 
        </Container>
      </div>
    </div>
  );
};

export default Layout;