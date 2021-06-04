import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountDetails, AccountType } from '../accounts.service';
import { DialogPopupComponent } from '../dialog-popup/dialog-popup.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'account-detail-form',
  templateUrl: './account-detail-form.component.html',
  styleUrls: ['./account-detail-form.component.scss'],
})
export class AccountDetailFormComponent implements OnInit {
  @Input() accountList: AccountDetails[];
  dataSource: AccountDetails;
  AcountType = AccountType;
  totalBalance = 0;
  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.accountBalanceValidation();
  }

  withdraw(accountItem: AccountDetails, index: number): void {
    if (accountItem.canWithdraw) {
      const dialogRef = this.dialog.open(DialogPopupComponent, {
        width: '250px',
        data: {
          account_type: accountItem.account_type,
          balance: accountItem.balance,
          updatedBalance: '',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (!result.updatedBalance) { return; }
        if (+result.updatedBalance > +result.balance) {
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: 4500,
            data: `Unable to withdraw ${result.updatedBalance} because your balance is ${result.balance}`,
            horizontalPosition: 'center',
          });
          return;
        }
        result.balance = +result.balance - +result.updatedBalance;

        if (result.account_type === AccountType.savings) {
          this.accountList[index].balance = result.balance;
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: 4500,
            data: 'Withdraw successful',
            horizontalPosition: 'center',
          });
        }

        if (
          result.account_type === AccountType.cheque &&
          +result.balance >= -500
        ) {
          this.accountList[index].balance = result.balance;
          this._snackBar.openFromComponent(SnackbarComponent, {
            duration: 4500,
            data: 'Withdraw successful',
            horizontalPosition: 'center',
          });
        }

        this.accountBalanceValidation();
      });
    }
  }

  accountBalanceValidation(): void {
    this.totalBalance = 0;
    this.accountList.forEach((item) => {
      this.totalBalance += +item.balance;
      switch (item.account_type) {
        case AccountType.savings:
          item.canWithdraw = +item.balance > 0 ? true : false;
          break;
        case AccountType.cheque:
          item.canWithdraw =
            +item.balance > 0 || +item.balance >= -500 ? true : false;
          break;
      }
    });
  }
}
