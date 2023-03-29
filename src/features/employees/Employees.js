import React, { useEffect } from "react";
import { Container, Navbar, Nav, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "./employeeSlice";

const Employees = ({
  _useDispatch = useDispatch,
  _useSelector = useSelector,
}) => {
  const employees = _useSelector((state) => state.employees.employees);
  const isLoading = _useSelector((state) => state.employees.isLoading);
  const dispatch = _useDispatch();

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  const renderedProfiles = employees.map((e) => (
    <Card style={{ width: "18rem" }} key={e.id}>
      <Card.Body>
        <Card.Title>
          {e.firstName} {e.lastName}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </Card.Body>
    </Card>
  ));
  return <>{renderedProfiles}</>;
};

export default Employees;
