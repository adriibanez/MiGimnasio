import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private ngInitSubject = new Subject<void>();
  ngInit$ = this.ngInitSubject.asObservable();

  emitNgInit() {
    this.ngInitSubject.next();
  }
}
