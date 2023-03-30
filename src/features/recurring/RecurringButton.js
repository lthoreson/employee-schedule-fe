import React from "react";
import { Button } from "react-bootstrap";

const RecurringButton = ({ shift, deleteRecurring }) => {
  const handleClick = () => {
    deleteRecurring(shift);
  };
  return (
    <Button onClick={handleClick}>
      {shift.startTime}:00 -- {shift.endTime}:00
    </Button>
  );
};

export default RecurringButton;
