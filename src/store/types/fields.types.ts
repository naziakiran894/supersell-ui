export interface Field {
  keyName: string;
  visible: boolean;
  order?: number;
  value: string;
  type: "text" | "largeText" | "number" | "date" | "dateAndTime";
}
export interface IField {
  companyId: string;
  about: Field[];
  contact: Field[];
  customFields: Field[];
  details: Field[];
  offersAndDeals: Field[];
  hideEmptyLeadFields: boolean;
  __v?: number;
  __id?: string;
}
