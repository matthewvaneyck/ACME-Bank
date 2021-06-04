import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  async getAccountList(): Promise<AccountDetails> {
    await this.http
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

export interface AccountDetails {
  account_number: string;
  account_type: AccountType;
  balance: string;
  canWithdraw?: boolean;
}

export enum AccountType {
  cheque = 'cheque',
  savings = 'savings',
}
