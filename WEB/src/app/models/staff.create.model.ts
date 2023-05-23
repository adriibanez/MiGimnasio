export class StaffCreate {

  dni:string;

  name: string;

  email: string;

  password: string;

  fechaNacimiento: string;

  fechaInscripcion: string;

  cargo:string;

  constructor() {
    this.dni = "";
    this.name = "";
    this.email = "";
    this.password = "";
    this.fechaNacimiento = "";
    this.fechaInscripcion = "";
    this.cargo = "";
  }
}
