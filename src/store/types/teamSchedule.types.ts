export type ITeamSchedule = {
    [day: string]: {
      active: boolean;
      allDay: boolean; 
      availability: {
        startTime: string;
        endTime: string;
      }[];
    };
  }
