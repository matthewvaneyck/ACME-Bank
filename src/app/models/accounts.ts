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
