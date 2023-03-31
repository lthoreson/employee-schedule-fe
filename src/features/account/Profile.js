import React, { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const Profile = ({ _fetch = fetch }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const fetchMyProfile = useCallback(async () => {
    const token = localStorage.getItem("shiftToken");
    const profileResponse = await _fetch("http://localhost:8080/account", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const profileJson = await profileResponse.json();
    setFirstName(profileJson.firstName);
    setLastName(profileJson.lastName);
  }, [_fetch]);

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("shiftToken");
    e.preventDefault();
    const profileResponse = await _fetch(
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
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
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
