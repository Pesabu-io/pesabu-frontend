export type TransactionCategory =
  | 'paybill'
  | 'till'
  | 'sendmoney'
  | 'customer'
  | 'withdrawals'
  | 'received';

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  paybill: 'Pay Bill',
  till: 'Till No',
  sendmoney: 'Send Money',
  customer: 'Customer Deposit',
  withdrawals: 'Withdrawals',
  received: 'Received Money',
};

const CATEGORY_PATTERNS: Record<TransactionCategory, RegExp[]> = {
  paybill: [/pay\s*bill/i, /paybill/i],
  till: [/buy\s*goods/i, /\btill\b/i, /merchant/i],
  sendmoney: [/send\s*money/i, /\bsent\s+to\b/i],
  customer: [/customer\s*deposit/i, /deposit\s+of\s+funds/i],
  withdrawals: [/withdraw/i, /\bagent\b/i, /\batm\b/i],
  received: [/receive\s*money/i, /\breceived\b/i, /money\s*received/i],
};

export function isTransactionCategory(value: string | null): value is TransactionCategory {
  return value !== null && value in TRANSACTION_CATEGORY_LABELS;
}

export function matchesTransactionCategory(
  details: string,
  transactionType: string | undefined,
  category: TransactionCategory
): boolean {
  const combined = `${details} ${transactionType ?? ''}`.trim();
  if (!combined) return false;
  return CATEGORY_PATTERNS[category].some((pattern) => pattern.test(combined));
}
