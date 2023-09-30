export interface IDaysOff {
  companyAdminId: null;
  daysOff: DataInterface[];
  holidayDate: string;
  holidayName: string;
  dayName: string;
  date: number;
  isDeleted: "y" | "n";
  userId: null;
  _id: string;
  status: number;
  doNotDisturb: boolean;
}

interface DataInterface {
  createdAt: string;
  doNotDisturb: boolean;
  holidayId: string;
  isDeleted: string;
  updatedAt: string;
  userId: string;
}

