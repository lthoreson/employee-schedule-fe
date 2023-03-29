import React, { useEffect, useState } from "react";
import { Accordion, Button, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../employees/employeeSlice";
import ShiftsTable from "./ShiftsTable";

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

  const employees = _useSelector((state) => state.employees.employees);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("shiftToken");
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
    fetchShifts();
  };

  const surrenderShift = async (shift) => {
    const token = localStorage.getItem("shiftToken");
    const newShift = await _fetch("http://localhost:8080/shift/surrender", {
      method: "PUT",
      body: JSON.stringify(shift),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    fetchShifts();
  };
  const claimShift = async (shift) => {
    const token = localStorage.getItem("shiftToken");
    const newShift = await _fetch("http://localhost:8080/shift/claim", {
      method: "PUT",
      body: JSON.stringify(shift),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
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

      <ShiftsTable
        shifts={shifts}
        surrenderShift={surrenderShift}
        claimShift={claimShift}
      />
    </>
  );
};

export default Shifts;
