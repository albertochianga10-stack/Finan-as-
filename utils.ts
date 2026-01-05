
import { SavingRecord } from './types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value).replace('AOA', 'Kz');
};

export const calculateSavings = (
  monthlyDeposit: number,
  annualInterestRate: number,
  years: number
): SavingRecord[] => {
  const records: SavingRecord[] = [];
  const monthlyRate = annualInterestRate / 100 / 12;
  let totalAccumulated = 0;
  let totalDeposited = 0;

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      totalDeposited += monthlyDeposit;
      // Compound interest applied at the end of each month
      totalAccumulated = (totalAccumulated + monthlyDeposit) * (1 + monthlyRate);
    }
    
    records.push({
      year,
      totalDeposited,
      totalInterest: totalAccumulated - totalDeposited,
      totalAccumulated,
    });
  }

  return records;
};
