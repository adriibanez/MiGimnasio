import { Staff } from "./staff.model";

export class StaffResponse {
  data: Staff[];

  error: string | null;

  constructor() {
    this.data = [];
    this.error = null;
  }
}
