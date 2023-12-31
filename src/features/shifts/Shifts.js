import React, { useCallback, useEffect, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../employees/employeeSlice";
import ShiftsTable from "./ShiftsTable";

const Shifts = ({
  _useDispatch = useDispatch,
  _useSelector = useSelector,
  _fetch = fetch,
  _fetchProfiles = fetchProfiles,
  _ShiftsTable = ShiftsTable,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [profile, setProfile] = useState("None");
  const [shifts, setShifts] = useState([]);

  const employees = _useSelector((state) => state.employees.employees);
  const isAdmin = _useSelector((state) => state.account.isAdmin);
  const dispatch = _useDispatch();

  useEffect(() => {
    dispatch(_fetchProfiles());
  }, [dispatch, _fetchProfiles]);

  const renderedProfiles = employees.map((e) => (
    <option key={e.id} value={e.id}>
      {e.firstName} {e.lastName}
    </option>
  ));

  const fetchShifts = useCallback(async () => {
    try {
      const shiftsResponse = await _fetch(
        `http://localhost:8080/shift?dateParam=${date}`
      );
      if (shiftsResponse.status !== 200) {
        throw new Error("invalid date");
      }
      const newShifts = await shiftsResponse.json();
      setShifts(newShifts);
    } catch (e) {
      console.log(e);
    }
  }, [_fetch, date]);

  useEffect(() => {
    fetchShifts();
  }, [date, fetchShifts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("shiftToken");
    await _fetch("http://localhost:8080/shift", {
      method: "POST",
      body: JSON.stringify({
        startTime,
        endTime,
        date,
        profile: profile === "None" ? null : { id: profile },
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
    await _fetch("http://localhost:8080/shift/surrender", {
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
    await _fetch("http://localhost:8080/shift/claim", {
      method: "PUT",
      body: JSON.stringify(shift),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    fetchShifts();
  };

  const generateWeek = async () => {
    const token = localStorage.getItem("shiftToken");
    const shiftsResponse = await _fetch(
      `http://localhost:8080/shift/generate?dateParam=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const newShifts = await shiftsResponse.json();
    setShifts(newShifts);
  };

  const assignAllWeek = async () => {
    const token = localStorage.getItem("shiftToken");
    const shiftsResponse = await _fetch(
      `http://localhost:8080/shift/assign?dateParam=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const newShifts = await shiftsResponse.json();
    setShifts(newShifts);
  };

  return (
    <>
      {isAdmin && (
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
                  <Form.Group className="mb-3" controlId="formBasicDate">
                    <Form.Label>Employee</Form.Label>
                    <Form.Select
                      aria-label="select employee"
                      onChange={(e) => setProfile(e.target.value)}
                    >
                      <option>None</option>
                      {renderedProfiles}
                    </Form.Select>
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
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Button variant="primary" onClick={generateWeek}>
            Generate
          </Button>{" "}
          <Button variant="secondary" onClick={assignAllWeek}>
            Assign
          </Button>{" "}
        </>
      )}
      <Form.Group className="w-25">
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Form.Group>
      <_ShiftsTable
        shifts={shifts}
        surrenderShift={surrenderShift}
        claimShift={claimShift}
      />
    </>
  );
};

export default Shifts;
