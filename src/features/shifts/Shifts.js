import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const Shifts = ({ _useDispatch = useDispatch, _useSelector = useSelector }) => {
  const dispatch = _useDispatch();
  const message = _useSelector((state) => state.account.message);

  const [date, setDate] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [shifts, setShifts] = useState([]);
  const token = localStorage.getItem("shiftToken");

  const fetchShifts = async () => {
    const shiftsResponse = await fetch("http://localhost:8080/shift");
    const newShifts = await shiftsResponse.json();
    setShifts(newShifts);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const renderedShifts = shifts.map((shift) => {
    return (
      <tr key={shift.id}>
        <td>{shift.id}</td>
        <td>{shift.date}</td>
        <td>{shift.startTime}</td>
        <td>{shift.endTime}</td>
      </tr>
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newShift = await fetch("http://localhost:8080/shift", {
      method: "POST",
      body: JSON.stringify({ startTime, endTime, date }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const newShiftJson = await newShift.json();
    setShifts([...shifts, newShiftJson]);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h1>New Shift</h1>
        <Form.Group className="mb-3" controlId="formBasicDate">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="0"
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicNumber">
          <Form.Label>Start Time</Form.Label>
          <Form.Control
            type="number"
            placeholder="0"
            onChange={(e) => setStartTime(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicNumber">
          <Form.Label>End Time</Form.Label>
          <Form.Control
            type="number"
            placeholder="0"
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        {Boolean(message.length) && <Alert variant="danger">{message}</Alert>}
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>{renderedShifts}</tbody>
      </Table>
    </>
  );
};

export default Shifts;
