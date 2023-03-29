import React from "react";
import { Button } from "react-bootstrap";

const ShiftButton = ({ shift, surrenderShift, claimShift }) => {
  const handleClick = () => {
    if (shift.profile === null) {
      claimShift(shift);
    } else {
      surrenderShift(shift);
    }
  };
  return (
    <Button onClick={handleClick}>
      {shift.startTime}:00 -- {shift.endTime}:00
    </Button>
  );
};

export default ShiftButton;
