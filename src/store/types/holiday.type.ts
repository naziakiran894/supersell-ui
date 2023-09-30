export interface IHoliday {
  _id: string;
  holidayName: string;
  holidayDate: string;
  userId: string | null;
  companyAdminId: string | null;
  doNotDisturb: boolean;
  countryId: string;
  isDeleted: "y" | "n";
  datePick: number;
}
