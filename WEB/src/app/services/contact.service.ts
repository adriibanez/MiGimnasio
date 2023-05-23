import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private api = "https://mailthis.to/adriibanez7";

  constructor(private http: HttpClient) { }

  sendContactForm(input :any){
    return this.http.post(this.api,input, {responseType: 'text'});
  }
}
