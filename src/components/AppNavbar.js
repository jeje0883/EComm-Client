import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
  const { user } = useContext(UserContext); // Access user from context

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm" sticky="top">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="fs-4 fw-bold">Jay's Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Always visible to all users */}
            <Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>

            {/* Show Cart link for non-admin users, whether logged in or not */}
            {(user.id !== null && !user.isAdmin) ? (
              <Nav.Link as={NavLink} to="/cart" exact="true">Cart</Nav.Link>
            ) : null}

            {user.id !== null ? (
              <>
                {/* For logged-in users, both Admin and Non-Admin */}
                <Nav.Link as={NavLink} to="/orders" exact="true">Orders</Nav.Link>
                { (user.id !== null && user.isAdmin) ?
                  <Nav.Link as={NavLink} to="/users" exact="true">Users</Nav.Link>
                  : null}
                <Nav.Link as={NavLink} to="/profile" exact="true">Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/logout" exact="true" className="text-danger">Logout</Nav.Link>
              </>
            ) : (
              <>
                {/* For non-logged-in users */}
                <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
