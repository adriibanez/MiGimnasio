import { StaffCreate } from "./staff.create.model";

export class Staff extends StaffCreate {
  _id: number;

  constructor() {
    super();
    this._id = 0;
  }
}
