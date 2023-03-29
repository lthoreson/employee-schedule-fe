import React from "react";
import { Button, Table } from "react-bootstrap";
import RecurringButton from "./RecurringButton";
import ShiftButton from "./RecurringButton";

const ShiftsTable = ({ recurrings, deleteRecurring, claimShift }) => {
  const renderedRows = recurrings.map((employee) => {
    const weekdays = [null, null, null, null, null, null, null];
    employee.forEach((shift) => {
      weekdays[shift.weekday] = shift;
    });
    const safeProfile = employee[0].profile
      ? employee[0].profile
      : { id: "unassigned", firstName: "Available", lastName: "Shifts" };
    return (
      <tr key={safeProfile.id}>
        <td>
          {safeProfile.firstName} {safeProfile.lastName}
        </td>
        {weekdays.map((w, i) => (
          <td key={i}>
            {w && (
              <RecurringButton
                shift={w}
                deleteRecurring={deleteRecurring}
                claimShift={claimShift}
              />
            )}
          </td>
        ))}
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
      <tbody>{renderedRows}</tbody>
    </Table>
  );
};

export default ShiftsTable;
