
export interface SavingRecord {
  year: number;
  totalDeposited: number;
  totalInterest: number;
  totalAccumulated: number;
}

export interface ScenarioResult {
  label: string;
  rate: number;
  data: SavingRecord[];
  finalAmount: number;
  color: string;
}

export interface UserInput {
  monthlyIncome: number;
  savingsRate: number;
  annualInterestRate: number;
}
