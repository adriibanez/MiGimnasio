import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private localService:LocalStorageService,private router:Router,private snackBar:MatSnackBar) {}
  
   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
  return from(this.localService.getToken()).pipe(
    switchMap(token => {
      // console.log(token);
      if (token) {
        // console.log("INSERTA CABECERA");
        let jwtToken = request.clone({
          setHeaders: {
            Authorization: `${token}`,
            'ngrok-skip-browser-warning': '40'
          }
        });
        return next.handle(jwtToken);
      } else {
        return next.handle(request);
      }
    }),
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.log("401 Unauthorized");
          this.snackBar.open("Acceso prohibido", undefined, { duration: 1000,panelClass:['orange-snackbar'] });
          this.router.navigate(["/userLogin"]);
        }
      }
      return throwError(err);
    })
  );



  }




}
