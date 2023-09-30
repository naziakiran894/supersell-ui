export interface IPurchaseNumber {
  numberName: string;
  countryShortName: string;
  countryId: string;
  type: string;
  areaCode: number;
  number: string;
  _id?: string;
}

export interface AvailableNumberProps {
  countryCode: string;
  areaCode: string;
}


export interface AvailableNumber {
  phoneNumber: string;
}