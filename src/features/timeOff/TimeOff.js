import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import TimeOffCard from "./TimeOffCard";

const TimeOff = ({ _fetch = fetch, _useSelector = useSelector }) => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [timeOff, setTimeOff] = useState([]);

  const isAdmin = _useSelector((state) => state.account.isAdmin);

  const fetchTimeOff = async () => {
    const timeOffResponse = await _fetch(`http://localhost:8080/timeOff`);
    const newTimeOff = await timeOffResponse.json();
    setTimeOff(newTimeOff);
  };

  useEffect(() => {
    fetchTimeOff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("shiftToken");
    const newTimeOff = await _fetch("http://localhost:8080/timeOff", {
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
    fetchTimeOff();
  };

  const approveDeny = async (timeOffRequest, isApproved) => {
    const token = localStorage.getItem("shiftToken");
    const newTimeOff = await _fetch("http://localhost:8080/timeOff", {
      method: "PUT",
      body: JSON.stringify({
        ...timeOffRequest,
        profile: isApproved ? {} : null,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    fetchTimeOff();
  };

  const renderedTimeOff = timeOff.map((t) => {
    return <TimeOffCard key={t.id} t={t} approveDeny={approveDeny} />;
  });

  return (
    <>
      {!isAdmin && (
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
      )}

      {renderedTimeOff}
    </>
  );
};

export default TimeOff;
