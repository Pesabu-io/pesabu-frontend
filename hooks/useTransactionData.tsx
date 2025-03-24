// hooks/useTransactionData.ts
import { server } from '@/utils/util';
import { useState, useEffect } from 'react';

interface TransactionType {
  Count: number;
  Total_Amount: number;
}

interface TransactionSummary {
  total_received: number;
  total_withdrawn: number;
  withdrawal_count: number;
  deposit_count: number;
  top_deposit: number;
  lowest_deposit: number;
  top_withdrawal: number;
  lowest_withdrawal: number;
}

interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface TransactionInsights {
  netFlow: number;
  avgDeposit: number;
  avgWithdrawal: number;
  retentionRate: number;
  depositFrequency: string;
  withdrawalFrequency: string;
  avgTransactionSize: number;
  moneyVelocity: number;
  totalTransactions: number;
  totalTransacted: number
}

export const useTransactionData = () => {
  const [transTypes, setTransTypes] = useState<ApiResponse<TransactionType[]>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const [summary, setSummary] = useState<ApiResponse<TransactionSummary>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const [insights, setInsights] = useState<TransactionInsights | null>(null);

  const calculateInsights = (summary: TransactionSummary): TransactionInsights => {
    const totalTransactions = summary.deposit_count + summary.withdrawal_count;
    
    return {
      netFlow: summary.total_received - summary.total_withdrawn,
      avgDeposit: summary.total_received / summary.deposit_count,
      avgWithdrawal: summary.total_withdrawn / summary.withdrawal_count,
      retentionRate: ((summary.total_received - summary.total_withdrawn) / summary.total_received * 100),
      depositFrequency: ((summary.deposit_count / totalTransactions) * 100).toFixed(1),
      withdrawalFrequency: ((summary.withdrawal_count / totalTransactions) * 100).toFixed(1),
      avgTransactionSize: (summary.total_received + summary.total_withdrawn) / totalTransactions,
      moneyVelocity: (summary.total_received + summary.total_withdrawn) / totalTransactions,
      totalTransacted: summary.total_received + summary.total_withdrawn,
      totalTransactions
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          'trans_type',
          'total_recieved',
          'total_withdrawn',
          'withdrawal_count',
          'deposit_count',
          'top_deposit',
          'lowest_deposit',
          'top_withdrawal',
          'lowest_withdrawal'
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => 
            fetch(`${server}/transaction_module/${endpoint}/`)
          )
        );

        const [
          transTypeData,
          totalReceived,
          totalWithdrawn,
          withdrawalCount,
          depositCount,
          topDeposit,
          lowestDeposit,
          topWithdrawal,
          lowestWithdrawal
        ] = await Promise.all(responses.map(res => res.json()));

        const summaryData = {
          total_received: totalReceived.total,
          total_withdrawn: totalWithdrawn.total,
          withdrawal_count: withdrawalCount.no_of_withdrawals,
          deposit_count: depositCount.number_of_deposits,
          top_deposit: topDeposit.highest_receoved_amount,
          lowest_deposit: lowestDeposit.lowest_amount_received,
          top_withdrawal: topWithdrawal.highest_withdrawn_amount,
          lowest_withdrawal: lowestWithdrawal.lowest_withdrawn_amount,
        };

        setTransTypes({ data: transTypeData, isLoading: false, error: null });
        setSummary({ data: summaryData, isLoading: false, error: null });
        setInsights(calculateInsights(summaryData));

      } catch (error) {
        const errorMessage = 'Failed to fetch transaction data';
        setTransTypes(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        setSummary(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      }
    };

    fetchData();
  }, []);

  return { transTypes, summary, insights };
};