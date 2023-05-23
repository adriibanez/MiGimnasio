import { User } from "./user.model";

export class UserResponse {
  data: User[];

  error: string | null;

  constructor() {
    this.data = [];
    this.error = null;
  }
}
