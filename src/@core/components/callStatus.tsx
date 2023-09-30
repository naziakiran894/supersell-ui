import React from "react";

type CallStatusProps = {
  callstatusValue: string;
};

const CallStatus = ({ callstatusValue }: CallStatusProps) => {
  const getStatusMessage = (): string => {
    switch (callstatusValue) {
      case "no-response-from-lead":
        return "Lead No Answer";
      case "no-response-from-user":
        return "No Users Answered";
      case "lead-busy":
        return "Lead Busy";
      case "outside-availability-hours":
        return "Outside Availability Hours";
      case "all-users-busy":
        return "All Users Busy";
      case "failed":
        return "Failed";
      case "queued":
        return "Queued";
      case "initiated":
        return "Initiated";
      case "ringing":
        return "Ringing";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "failed-to-call-user":
        return "Failed to Call";
      case "failed-to-call-lead":
        return "Failed to Call Lead";
      case "user-did-not-call-lead":
        return "User did not call lead";
      case "user-did-not-answer":
        return "User did not answer";
      case "incomplete-call":
        return "Incomplete Call";
      default:
        return "";
    }
  };

  const statusMessage: string = getStatusMessage();

  return <span>{statusMessage}</span>;
};

export default CallStatus;
