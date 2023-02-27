export class User {
  userName: string;
  email: string;
  company: string;
  firstName: string;
  lastName: string;
  nif: string;
  employeeCode: string;
  department: string;
  position: string;
  manager: string;
  laborHours: number;
  laborHoursFriday: number;
  locked: boolean;
  fcm: string;
  firstLogin: boolean;
  roles: string[];
  fixedUser: boolean;
}

export class UserCreate {
  userName: string;
  email: string;
  password: string;
  company: string;
  firstName: string;
  lastName: string;
  nif: string;
  employeeCode: string;
  department: string;
  position: string;
  manager: string;
  laborHours: number;
  laborHoursFriday: number;
  locked: boolean;
  fcm: string;
  firstLogin: boolean;
  roles: string[];
  fixedUser: boolean;
}

export class UserUpdate {
  oldUserName: string;
  userName: string;
  email: string;
  company: string;
  firstName: string;
  lastName: string;
  nif: string;
  employeeCode: string;
  department: string;
  position: string;
  manager: string;
  laborHours: number;
  laborHoursFriday: number;
  locked: boolean;
  fcm: string;
  firstLogin: boolean;
  roles: string[];
  fixedUser: boolean;
}

export class UserList {
  userName: string;
  email: string;
  company: string;
  firstName: string;
  lastName: string;
  nif: string;
  employeeCode: string;
  department: string;
  position: string;
  manager: string;
  laborHours: number;
  laborHoursFriday: number;
  isAdmin: boolean;
  fcm: string;
  firstLogin: boolean;
  locked: boolean;
  fixedUser: boolean;
}
