import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const token = localStorage.getItem("shiftToken");

  const fetchShifts = async () => {
    const profileResponse = await fetch("http://localhost:8080/account", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const profileJson = await profileResponse.json();
    setFirstName(profileJson.firstName);
    setLastName(profileJson.lastName);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileResponse = await fetch(
      "http://localhost:8080/account/profile",
      {
        method: "POST",
        body: JSON.stringify({ firstName, lastName }),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const profileJson = await profileResponse.json();
    setFirstName(profileJson.firstName);
    setLastName(profileJson.lastName);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Edit Profile</h1>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default Profile;
