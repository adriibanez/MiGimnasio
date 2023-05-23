export class UserCreate {

   dni:string;

  name: string;

  email: string;

  password: string;

  fechaNacimiento: string;

  fechaInscripcion: string;

  membresia:string;

  numIban:number;


  constructor() {
     this.dni = "";
    this.name = "";
    this.email = "";
    this.password = "";
    this.fechaNacimiento = "";
    this.fechaInscripcion = "";
    this.membresia = "";
    this.numIban = 0;

  }
}
