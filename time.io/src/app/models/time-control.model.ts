export class TimeControl {
  id: number;
  userName: string;
  company: string;
  startDate: string;
  endDate: string;
  realStartDate: string;
  realEndDate: string;
  comments: string;
  startLongitude: number;
  startLatitude: number;
  startAltitude: number;
  startHorizontalAccuracy: number;
  startVerticalAccuracy: number;
  startSpeed: number;
  startAddress: string;
  startCity: string;
  startCountry: string;
  startCounty: string;
  startDistrict: string;
  startHouseNumber: string;
  startPostalCode: string;
  startState: string;
  startStreet: string;
  endLongitude: number;
  endLatitude: number;
  endAltitude: number;
  endHorizontalAccuracy: number;
  endVerticalAccuracy: number;
  endSpeed: number;
  endAddress: string;
  endCity: string;
  endCountry: string;
  endCounty: string;
  endDistrict: string;
  endHouseNumber: string;
  endPostalCode: string;
  endState: string;
  endStreet: string;
  break: boolean;
  breakCurrentSessionId: number;
  language: string;

  constructor() {
    this.id = 0;
    this.userName = '';
    this.company = '';
    this.startDate = '';
    this.endDate = null;
    this.realStartDate = null;
    this.realEndDate = null;
    this.comments = null;
    this.startLongitude = null;
    this.startLatitude = null;
    this.startAltitude = null;
    this.startHorizontalAccuracy = null;
    this.startVerticalAccuracy = null;
    this.startSpeed = null;
    this.startAddress = '';
    this.startCity = '';
    this.startCountry = '';
    this.startCounty = '';
    this.startDistrict = '';
    this.startHouseNumber = '';
    this.startPostalCode = '';
    this.startState = '';
    this.startStreet = '';
    this.endLongitude = null;
    this.endLatitude = null;
    this.endAltitude = null;
    this.endHorizontalAccuracy = null;
    this.endVerticalAccuracy = null;
    this.endSpeed = null;
    this.endAddress = '';
    this.endCity = '';
    this.endCountry = '';
    this.endCounty = '';
    this.endDistrict = '';
    this.endHouseNumber = '';
    this.endPostalCode = '';
    this.endState = '';
    this.endStreet = '';
    this.break = false;
    this.breakCurrentSessionId = null;
    this.language = null;
  }
}

export class Issue {
  comments: string;
  realStartDate: string;
  realEndDate: string;
}

export class HoursAndMinutes {
  hours: number;
  minutes: number;
}
