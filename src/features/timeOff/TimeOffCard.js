import React from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

const TimeOffCard = ({ t, approveDeny, _useSelector = useSelector }) => {
  const isAdmin = _useSelector((state) => state.account.isAdmin);

  const handleClickYes = () => approveDeny(t, true);
  const handleClickNo = () => approveDeny(t, false);
  return (
    <Card style={{ width: "20rem" }} key={t.id}>
      <Card.Body>
        <Card.Title>
          {t.profile.firstName} {t.profile.lastName}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Requested Time Off
        </Card.Subtitle>
        {t.approval && (
          <Alert variant="success">
            {`approved by ${t.approval.firstName} ${t.approval.lastName}`}
          </Alert>
        )}
        <Card.Text>
          {new Date(t.startDate).toUTCString().split(" 00:")[0]} --{" "}
          {new Date(t.endDate).toUTCString().split(" 00:")[0]}
        </Card.Text>
        {!t.approval && isAdmin && (
          <Button onClick={handleClickYes}>Approve</Button>
        )}
        {isAdmin && (
          <Button variant="danger" onClick={handleClickNo}>
            Deny
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default TimeOffCard;
