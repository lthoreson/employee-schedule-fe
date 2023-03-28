import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { tryLogin } from "./accountSlice";
import { navigate } from "../ui_routes/uiSlice";

const Register = ({
  _useDispatch = useDispatch,
  _useSelector = useSelector,
}) => {
  const dispatch = _useDispatch();
  const message = _useSelector((state) => state.account.message);
  const isLoggedIn = _useSelector((state) => state.account.isLoggedIn);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      tryLogin({ username: username, password: password, path: "register" })
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(navigate(""));
    }
  }, [isLoggedIn, dispatch]);

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
      {Boolean(message.length) && <Alert variant="danger">{message}</Alert>}
    </Form>
  );
};

export default Register;
