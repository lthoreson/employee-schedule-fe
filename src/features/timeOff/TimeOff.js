import React, { useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";

const TimeOff = ({ _fetch = fetch }) => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [profile, setProfile] = useState(null);
  const [shifts, setShifts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("shiftToken");
    const newShift = await _fetch("http://localhost:8080/timeOff", {
      method: "POST",
      body: JSON.stringify({
        startDate,
        endDate,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    // fetchTimeOff();
  };

  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Request Time Off</Accordion.Header>
        <Accordion.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default TimeOff;
