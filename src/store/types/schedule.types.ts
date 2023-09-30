export type ISchedule = {
        [day: string]: {
          active: boolean;
          allDay: boolean; 
          availability: {
            startTime: string;
            endTime: string;
          }[];
        };
      }
