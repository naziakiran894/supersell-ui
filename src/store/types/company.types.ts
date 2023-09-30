export interface ICompanyType {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  companyStatus: boolean;
  logo: string;
  userCount?: number;
  active?: boolean;
  countryId?: string;
  __v?: number;
  defaultCurrency?: string;
  defaultDateTimeFormat?: string;
  defaultLanguage?: string;
  userLoginType?: string;
  defaultCountryId?: IDefaultCountryId;
}

export interface ICompanyRoles {
  _id: string;
  roleName: string;
}

export interface IDefaultCountryId {
  _id: string;
  timezone: string;
  countryName: string;
}

export interface ICompanyDetailsByID {
  attemptRetriesEarly: boolean;
  callMarkedAsConversation: {
    active: boolean;
    time: number;
  };
  companyName: string;
  companyStatus?: boolean;
  defaultCountryId: {
    _id?: string;
    countryName: string;
    timezone: string;
  };
  defaultCurrency: string;
  defaultDateTimeFormat: string;
  defaultLanguage: string;
  detailsSubTitle: string;
  detailsTitle: string;
  email?: string;
  firstName?: string;
  hangupOnVoicemail: boolean;
  lastName?: string;
  leadSubTitle: string;
  leadTitle: string;
  permissions: {
    _id?: string;
    keyName: string;
    role: string;
  }[];
  phone?: string;
  retryLeadsAfterVoicemail: boolean;
  routingSetting: string;
  userLoginType: string;
  _id?: string;
}
