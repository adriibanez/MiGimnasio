import { UserCreate } from "./user.create.model";

export class User extends UserCreate {
  _id: number;

  constructor() {
    super();
    this._id = 0;
  }
}
