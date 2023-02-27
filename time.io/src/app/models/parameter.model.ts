export class Parameter {
  id: number;
  company: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  cif: string;
  vacationDays: number;
  geolocation: boolean;
  restsRegistered: boolean;
  navbarBackgroundColor: string;
  navbarColorClass: string;
  logo: string;
  allowEdit: boolean;

  constructor() {
    this.id = 0;
    this.company = '';
    this.address = '';
    this.city = '';
    this.province = '';
    this.zipCode = '';
    this.cif = '';
    this.vacationDays = 0;
    this.geolocation = false;
    this.restsRegistered = true;
    this.navbarBackgroundColor = '#8ce3d3';
    this.navbarColorClass = 'navbar-light';
    this.logo = '';
    this.allowEdit = false;
  }
}
