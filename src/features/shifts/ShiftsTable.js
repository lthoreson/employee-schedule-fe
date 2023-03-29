import React from "react";
import { Table } from "react-bootstrap";

const ShiftsTable = ({ shifts }) => {
  const renderedShifts = shifts.map((employee) => {
    const weekdays = [null, null, null, null, null, null, null];
    employee.forEach((shift) => {
      weekdays[new Date(shift.date).getUTCDay()] = shift;
    });
    const safeProfile = employee[0].profile
      ? employee[0].profile
      : { id: "unassigned", firstName: "Available", lastName: "Shifts" };
    return (
      <tr key={safeProfile.id}>
        <td>
          {safeProfile.firstName} {safeProfile.lastName}
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
  return (
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
  );
};

export default ShiftsTable;
