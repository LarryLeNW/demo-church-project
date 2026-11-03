export enum FundType {
  Tithes = 'tithes',
  Missions = 'missions',
  Building = 'building',
  Benevolence = 'benevolence',
  General = 'general',
}

export enum DonationFrequency {
  OneTime = 'one_time',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export enum DonationStatus {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export enum PaymentMethodType {
  Card = 'card',
  UsBankAccount = 'us_bank_account',
  Cash = 'cash',
  Check = 'check',
}
