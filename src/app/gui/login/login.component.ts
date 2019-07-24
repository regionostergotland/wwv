import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from 'src/app/auth.service';
import { ConfigService, AuthenticationMethod } from 'src/app/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  AuthenticationMethod = AuthenticationMethod;
  method: AuthenticationMethod;

  constructor(
    private cfg: ConfigService,
    private auth: AuthService,
    public router: Router,
    private snackBar: MatSnackBar,

    private ngZone: NgZone,
  ) {
    this.method = this.cfg.getAuthMethod();
  }

  private showError(msg: string) {
    this.snackBar.open(
      msg,
      'OK',
      {
       duration: 100000000,
      }
    );
  }

  /* bug workaround https://github.com/angular/angular/issues/25837
     messes up routing, multiple views simultaneously and nothing is
     clickable. */
  private enter(): void {
    this.ngZone.run(() => this.router.navigateByUrl('home')).then();
  }

  /* TODO custom errors with specific user messages */
  assistedToken() {
    this.auth.authenticateAT().subscribe(
      () => this.enter(),
      e => this.showError('Inloggning med BankId misslyckades. Fel: "'
                          + e.message + '"')
    );
  }

  basic(user: string, pw: string, pnr: string) {
    this.auth.authenticateBasic(user, pw, pnr)
      .pipe(catchError(e => {
        if (e.status === 401) {
          return throwError(new Error('Fel användarnamn eller lösenord.'));
        } else {
          return throwError(e);
        }
      }))
      .subscribe(
        () => this.enter(),
        e => this.showError(
          'Inloggning misslyckades. Fel: "' + e.message + '"'
        )
      );
  }
}
