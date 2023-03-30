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
  const isAdmin = _useSelector((state) => state.account.isAdmin);
  const isLoggedIn = _useSelector((state) => state.account.isLoggedIn);
  const dispatch = _useDispatch();

  const handleNav = (destination) => {
    dispatch(navigate(destination));
  };

  const handleLogOut = () => {
    dispatch(logOut());
    localStorage.removeItem("shiftToken");
    dispatch(navigate(""));
  };

  useEffect(() => {
    dispatch(tryLogin());
  }, [dispatch]);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => handleNav("")}>Shyft</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {!isLoggedIn && (
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNav("login")}>Login</Nav.Link>
              <Nav.Link onClick={() => handleNav("register")}>
                Register
              </Nav.Link>
            </Nav>
          )}
          {isLoggedIn && (
            <>
              <Nav className="me-auto">
                <Nav.Link onClick={() => handleNav("")}>Home</Nav.Link>
                <Nav.Link onClick={() => handleNav("shifts")}>Shifts</Nav.Link>
                {isAdmin && (
                  <>
                    <Nav.Link onClick={() => handleNav("employees")}>
                      Employees
                    </Nav.Link>
                    <Nav.Link onClick={() => handleNav("recurrings")}>
                      Recurrings
                    </Nav.Link>
                  </>
                )}
                <Nav.Link onClick={() => handleNav("timeOff")}>
                  TimeOff
                </Nav.Link>
                <Nav.Link onClick={() => handleNav("profile")}>
                  Profile
                </Nav.Link>
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
