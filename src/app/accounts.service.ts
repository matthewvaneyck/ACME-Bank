import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountDetails } from './models/accounts';
import { SnackbarComponent } from './snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  public accountsData: AccountDetails;
  readonly URL = 'http://localhost:8080/api/accounts';

  get accountItems(): AccountDetails {
    return this.accountsData;
  }

  set accountItems(items: AccountDetails) {
    this.accountsData = items;
  }

  // tslint:disable-next-line:variable-name
  constructor(private _http: HttpClient, private _snackBar: MatSnackBar) {}

  async getAccountList(): Promise<AccountDetails> {
    await this._http
      .get<AccountDetails>(this.URL)
      .toPromise()
      .then((response) => {
        this.accountItems = response ? response : null;
      })
      .catch(() => {
        this._snackBar.openFromComponent(SnackbarComponent, {
          duration: 4500,
          data: 'Unable to retrieve Account list',
          horizontalPosition: 'center',
        });
      });

    return this.accountItems;
  }
}


