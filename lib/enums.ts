// Contract Types
export enum ContractType {
  PERMANENT = "p",
  CONTRACT = "c"
}

// Work Hours
export enum WorkHours {
  FULL_TIME = "f",
  PART_TIME = "p"
}

// Application Status
export enum ApplicationStatus {
  NOT_APPLIED = 0,
  APPLIED = 1,
  INTERVIEWED = 2,
  ACCEPTED = 3
}

// Helper functions for display labels
export const getContractTypeLabel = (type: string | undefined): string => {
  if (type === ContractType.PERMANENT) return "Permanent";
  if (type === ContractType.CONTRACT) return "Contract";
  return "";
};

export const getWorkHoursLabel = (hours: string | undefined): string => {
  if (hours === WorkHours.FULL_TIME) return "Full-time";
  if (hours === WorkHours.PART_TIME) return "Part-time";
  return "";
};

export const getApplicationStatusLabel = (status: number): string => {
  switch (status) {
    case ApplicationStatus.NOT_APPLIED:
      return "not applied";
    case ApplicationStatus.APPLIED:
      return "applied";
    case ApplicationStatus.INTERVIEWED:
      return "interviewed";
    case ApplicationStatus.ACCEPTED:
      return "accepted";
    default:
      return "not applied";
  }
};
