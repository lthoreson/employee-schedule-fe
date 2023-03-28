import React, { useEffect } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logOut, tryLogin } from "./features/account/accountSlice";
import { navigate } from "./features/ui_routes/uiSlice";

const NavMenu = ({
  _useDispatch = useDispatch,
  _useSelector = useSelector,
}) => {
  const me = _useSelector((state) => state.account.username);
  const isLoggedIn = _useSelector((state) => state.account.isLoggedIn);
  const dispatch = _useDispatch();

  const handleLogin = () => {
    dispatch(navigate("login"));
  };

  const handleLogOut = () => {
    dispatch(logOut());
    localStorage.removeItem("shiftToken");
    dispatch(navigate(""));
  };

  const handleHome = () => {
    dispatch(navigate(""));
  };

  useEffect(() => {
    dispatch(tryLogin());
  }, [dispatch]);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand onClick={handleHome}>Shyft</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {!isLoggedIn && (
            <Nav className="me-auto">
              <Nav.Link onClick={handleLogin}>Login</Nav.Link>
              <Nav.Link>Register</Nav.Link>
            </Nav>
          )}
          {isLoggedIn && (
            <>
              <Nav className="me-auto">
                <Nav.Link onClick={handleHome}>Home</Nav.Link>
              </Nav>
              <Navbar.Text>
                Signed in as: <a>{me}</a>
              </Navbar.Text>
              <Nav>
                <Nav.Link onClick={handleLogOut}>LogOut</Nav.Link>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;
