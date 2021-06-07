import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogPopupComponent } from '../dialog-popup/dialog-popup.component';
import { AccountDetails, AccountType } from '../models/accounts';
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
  // tslint:disable-next-line:variable-name
  constructor(private _snackBar: MatSnackBar, private _dialog: MatDialog) {}

  ngOnInit(): void {
    // Validates if the user can withdraw
    this.accountBalanceValidation();
  }

  withdraw(accountItem: AccountDetails, index: number): void {
    // Initiate withdrawal process
    if (accountItem.canWithdraw) {
      const dialogRef = this._dialog.open(DialogPopupComponent, {
        width: '250px',
        data: {
          account_type: accountItem.account_type,
          balance: accountItem.balance,
          updatedBalance: '',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (!result.updatedBalance) {
          return;
        }

        const pendingBalance = +result.balance - +result.updatedBalance;
        if (
          pendingBalance <= 0 &&
          result.account_type === AccountType.savings
        ) {
          const msg = `Unable to withdraw R${result.updatedBalance} because your balance is R${result.balance}`;
          this.withdrawalResponse(msg);
          return;
        } else if (result.account_type === AccountType.savings) {
          this.accountList[index].balance = result.balance;
          const msg = 'Withdraw successful';
          this.withdrawalResponse(msg);
          this.accountBalanceValidation();
          return;
        }

        if (
          result.account_type === AccountType.cheque &&
          !(pendingBalance < -500)
        ) {
          this.accountList[index].balance = pendingBalance.toString();
          const msg = 'Withdraw successful';
          this.withdrawalResponse(msg);
          this.accountBalanceValidation();
        } else {
          const msg = `Unable to withdraw R${result.updatedBalance} because your balance is R${result.balance}`;
          this.withdrawalResponse(msg);
        }
      });
    }
  }

  withdrawalResponse(message: string) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: 4500,
      data: message,
      horizontalPosition: 'center',
    });
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
            +item.balance > 0 || +item.balance >= -501 ? true : false;
          break;
      }
    });
  }
}
