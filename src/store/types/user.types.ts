export interface IUser {
  _id: string;
  email: string;
  phone: string;
  name: string;
  sendEmail: boolean;
  sendSms: boolean;
  available: boolean;
  doNotDisturbStatus: boolean;
  firstName: string;
  lastName: string;
  isDeleted: string;
  role: string;
  roleId: string;
  timezone: string;
  userId: string;
  language: string;
  userrole: string;
  company: string;
  userRoles?: string;
  notifyVia?: string;
  companyId?: ICompanyId | string;
}

interface ICompanyId {
  companyName: string;
  _id: string;
}

export interface IAuthUser {
  token: string;
  id: string;
  email: string;
  roleName: string;
  companyId?: string;
  loginAsClient?: boolean;
}

export interface IUserRoles {
  _id: string;
  roleName: string;
}

export interface IUserList {
  firstName?: string;
  lastName?: string;
  _id?: string;
  userId?: string;
}
