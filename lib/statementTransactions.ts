import {
  matchesTransactionCategory,
  type TransactionCategory,
} from '@/lib/transactionCategories';

export interface StatementTransaction {
  'Receipt No.'?: string | number;
  'Completion Time'?: string;
  Details?: string;
  amount?: number;
  'Paid In'?: number;
  Withdrawn?: number;
  Balance?: number;
  names?: string;
  numbers?: string;
  'Transaction Type'?: string;
  Transaction_Type?: string;
  [key: string]: unknown;
}

const normalize = (value?: string | number | null): string =>
  String(value ?? '')
    .trim()
    .toLowerCase();

export function getStatementTransactions(): StatementTransaction[] {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem('statementData');
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StatementTransaction[]) : [];
  } catch {
    return [];
  }
}

export function getTransactionAmount(row: StatementTransaction): number {
  if (typeof row.amount === 'number' && !Number.isNaN(row.amount)) {
    return row.amount;
  }
  const paidIn = Number(row['Paid In']);
  if (!Number.isNaN(paidIn) && paidIn > 0) return paidIn;
  const withdrawn = Number(row.Withdrawn);
  if (!Number.isNaN(withdrawn) && withdrawn > 0) return withdrawn;
  return 0;
}

function matchesPartner(
  row: StatementTransaction,
  partnerName: string,
  partnerNumber: string
): boolean {
  const rowName = normalize(row.names);
  const rowNumber = normalize(row.numbers);
  const targetName = normalize(partnerName);
  const targetNumber = normalize(partnerNumber);

  if (
    targetNumber &&
    targetNumber !== 'n/a' &&
    rowNumber &&
    (rowNumber === targetNumber || rowNumber.includes(targetNumber) || targetNumber.includes(rowNumber))
  ) {
    return true;
  }

  if (
    targetName &&
    targetName !== 'unknown' &&
    rowName &&
    (rowName === targetName || rowName.includes(targetName) || targetName.includes(rowName))
  ) {
    return true;
  }

  const details = normalize(row.Details);
  if (targetName && targetName !== 'unknown' && details.includes(targetName)) {
    return true;
  }
  if (targetNumber && targetNumber !== 'n/a' && details.includes(targetNumber)) {
    return true;
  }

  return false;
}

function sortByCompletionTime(rows: StatementTransaction[]): StatementTransaction[] {
  return [...rows].sort((a, b) => {
    const timeA = new Date(String(a['Completion Time'] ?? 0)).getTime();
    const timeB = new Date(String(b['Completion Time'] ?? 0)).getTime();
    return timeB - timeA;
  });
}

export function filterTransactionsByPartner(
  rows: StatementTransaction[],
  category: TransactionCategory,
  partnerName: string,
  partnerNumber: string
): StatementTransaction[] {
  const partnerRows = rows.filter((row) =>
    matchesPartner(row, partnerName, partnerNumber)
  );

  const byCategory = partnerRows.filter((row) => {
    const details = String(row.Details ?? '');
    const transactionType = String(row['Transaction Type'] ?? row.Transaction_Type ?? '');
    return matchesTransactionCategory(details, transactionType, category);
  });

  return sortByCompletionTime(byCategory.length > 0 ? byCategory : partnerRows);
}
