import { FormItem } from "../../pages/FieldSettings/index";
import { IGridItem } from "../../pages/FieldSettings/index";

export interface ILeadSettings {
  about: FormItem[];
  companyId: {
    _id: string;
    firstName: string;
    lastName: string;
    companyName: string;
  };
  contact: FormItem[];
  customFields: IGridItem[];
  details: FormItem[];
  offersAndDeals: any;
  __v: number;
  _id: string;
}
