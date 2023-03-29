import React, { useEffect, useState } from "react";
import { Accordion, Button, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../employees/employeeSlice";

const Shifts = ({
  _useDispatch = useDispatch,
  _useSelector = useSelector,
  _fetch = fetch,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [profile, setProfile] = useState(null);
  const [shifts, setShifts] = useState([]);
  const token = localStorage.getItem("shiftToken");

  const employees = _useSelector((state) => state.employees.employees);
  const isLoading = _useSelector((state) => state.employees.isLoading);
  const dispatch = _useDispatch();

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const renderedProfiles = employees.map((e) => (
    <option key={e.id} value={e.id}>
      {e.firstName} {e.lastName}
    </option>
  ));

  const fetchShifts = async () => {
    const shiftsResponse = await _fetch(
      `http://localhost:8080/shift?dateParam=${date}`
    );
    const newShifts = await shiftsResponse.json();
    setShifts(newShifts);
  };

  useEffect(() => {
    fetchShifts();
  }, [date]);

  const renderedShifts = shifts.map((employee) => {
    const weekdays = [null, null, null, null, null, null, null];
    employee.forEach((shift) => {
      weekdays[new Date(shift.date).getUTCDay()] = shift;
    });

    return (
      <tr key={employee[0]?.profile.id}>
        <td>
          {employee[0]?.profile.firstName} {employee[0]?.profile.lastName}
        </td>
        <td>{weekdays[0]?.date}</td>
        <td>{weekdays[1]?.date}</td>
        <td>{weekdays[2]?.date}</td>
        <td>{weekdays[3]?.date}</td>
        <td>{weekdays[4]?.date}</td>
        <td>{weekdays[5]?.date}</td>
        <td>{weekdays[6]?.date}</td>
      </tr>
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newShift = await _fetch("http://localhost:8080/shift", {
      method: "POST",
      body: JSON.stringify({
        startTime,
        endTime,
        date,
        profile: { id: profile },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const newShiftJson = await newShift.json();
    fetchShifts();
  };

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add New Shift</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
              <Form.Select
                aria-label="select employee"
                onChange={(e) => setProfile(e.target.value)}
              >
                <option>Employee</option>
                {renderedProfiles}
              </Form.Select>
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
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
        </thead>
        <tbody>{renderedShifts}</tbody>
      </Table>
    </>
  );
};

export default Shifts;
