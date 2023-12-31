import React, { useCallback, useEffect, useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../employees/employeeSlice";
import RecurringTable from "./RecurringTable";

const Recurrings = ({
  _useDispatch = useDispatch,
  _useSelector = useSelector,
  _fetch = fetch,
}) => {
  const [weekday, setDay] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [profile, setProfile] = useState("None");
  const [recurrings, setRecurrings] = useState([]);

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

  const fetchRecurrings = useCallback(async () => {
    const token = localStorage.getItem("shiftToken");
    const recurringsResponse = await _fetch(`http://localhost:8080/recurring`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const newRecurrings = await recurringsResponse.json();
    setRecurrings(newRecurrings);
  }, [_fetch]);

  useEffect(() => {
    fetchRecurrings();
  }, [fetchRecurrings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("shiftToken");
    await _fetch("http://localhost:8080/recurring", {
      method: "POST",
      body: JSON.stringify({
        startTime,
        endTime,
        weekday,
        profile: profile === "None" ? null : { id: profile },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    fetchRecurrings();
  };

  const deleteRecurring = async (recurring) => {
    const token = localStorage.getItem("shiftToken");
    await _fetch("http://localhost:8080/recurring", {
      method: "DELETE",
      body: JSON.stringify(recurring),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    fetchRecurrings();
  };

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Add New Recurring</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicDate">
                <Form.Label>Date</Form.Label>
                <Form.Select
                  aria-label="select day"
                  onChange={(e) => setDay(e.target.value)}
                >
                  <option value={0}>Sunday</option>
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                </Form.Select>
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

      <RecurringTable
        recurrings={recurrings}
        deleteRecurring={deleteRecurring}
        claimShift={() => {}}
      />
    </>
  );
};

export default Recurrings;
