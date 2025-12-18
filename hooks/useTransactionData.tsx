// hooks/useTransactionData.ts
import { server } from '@/utils/util';
import { useState, useEffect } from 'react';

interface TransactionType {
  Count: number;
  Total_Amount: number;
}

interface TopTransaction {
  names: string;
  numbers: string;
  'Receipt No.': number;
  amount?: number;
  receipt_count?: number;
  max_amount?: number;
}

interface TransactionSummary {
  total_received: number;
  total_withdrawn: number;
  total_transacted: number;
  withdrawal_count: number;
  deposit_count: number;
  top_deposit: number;
  lowest_deposit: number;
  top_withdrawal: number;
  lowest_withdrawal: number;
  total_transaction_count: number;
  minimum_amount_transacted: number;
  maximum_amount_transacted: number;
  top_paybill_transactions: TopTransaction[];
  top_till_transactions: TopTransaction[];
  top_send_money_transactions: TopTransaction[];
  top_transactions_customer: TopTransaction[];
  top_withdrawals: TopTransaction[];
  top_transactions_received: TopTransaction[];
  top_transaction_hour: Array<{ time_day: string; 'Receipt No.': number; amount: number }>;
  top_transaction_day: Array<{ day_name: string; 'Receipt No.': number; amount: number }>;
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
  const [detailedTransactions, setDetailedTransactions] = useState<{
    topPaybill: TopTransaction[];
    topTill: TopTransaction[];
    topSendMoney: TopTransaction[];
    topCustomer: TopTransaction[];
    topWithdrawals: TopTransaction[];
    topReceived: TopTransaction[];
    hourlyData: Array<{ time_day: string; 'Receipt No.': number; amount: number }>;
    dailyData: Array<{ day_name: string; 'Receipt No.': number; amount: number }>;
  } | null>(null);

  const calculateInsights = (summary: TransactionSummary): TransactionInsights => {
    // Use the total_transaction_count endpoint if available, otherwise calculate
    const totalTransactions = summary.total_transaction_count || (summary.deposit_count + summary.withdrawal_count);
    
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
          'total_transacted',
          'withdrawal_count',
          'deposit_count',
          'total_transaction_count',
          'top_deposit',
          'lowest_deposit',
          'top_withdrawal',
          'lowest_withdrawal',
          'minimum_amount_transacted',
          'maximum_amount_transacted',
          'top_paybill_transactions',
          'top_till_transactions',
          'top_send_money_transactions',
          'top_transactions_customer',
          'top_withdrawals',
          'top_transactions_received',
          'top_transaction_hour',
          'top_transaction_day'
        ];

        // Endpoints that are known to be slower - process sequentially
        const slowEndpoints = ['top_transaction_hour', 'top_transaction_day', 'top_paybill_transactions'];

        // Helper function to fetch with retry and timeout
        const fetchWithRetry = async (endpoint: string, retries = 3): Promise<Response | null> => {
          for (let i = 0; i < retries; i++) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
              
              const response = await fetch(`${server}/transaction_module/${endpoint}/`, {
                signal: controller.signal,
                headers: {
                  'Content-Type': 'application/json',
                },
                // Add keepalive to maintain connection
                keepalive: true,
              });
              
              clearTimeout(timeoutId);
              return response;
            } catch (error: any) {
              // Handle specific error types
              const isNetworkError = error?.name === 'TypeError' || 
                                   error?.message?.includes('network') ||
                                   error?.message?.includes('ERR_NETWORK') ||
                                   error?.name === 'AbortError';
              
              if (isNetworkError && i < retries - 1) {
                console.warn(`⚠️ Network error for ${endpoint}, retrying... (attempt ${i + 1}/${retries})`);
                // Longer delay for network errors
                await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
                continue;
              }
              
              if (i === retries - 1) {
                console.error(`❌ Failed to fetch ${endpoint} after ${retries} attempts:`, error?.message || error);
                return null;
              }
              
              // Wait before retrying (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
          }
          return null;
        };

        // Separate endpoints into fast and slow categories
        const fastEndpoints = endpoints.filter(e => !slowEndpoints.includes(e));
        const slowEndpointsList = endpoints.filter(e => slowEndpoints.includes(e));
        
        // Use a Map to track responses by endpoint name to avoid index misalignment
        const responseMap: Record<string, any> = {};
        
        // Process fast endpoints in batches
        const batchSize = 3;
        for (let i = 0; i < fastEndpoints.length; i += batchSize) {
          const batch = fastEndpoints.slice(i, i + batchSize);
          console.log(`📦 Fetching fast batch ${Math.floor(i / batchSize) + 1}: ${batch.join(', ')}`);
          
          const batchResponses = await Promise.all(
            batch.map(endpoint => fetchWithRetry(endpoint))
          );
          
          // Map responses to their endpoints
          for (let j = 0; j < batch.length; j++) {
            const endpoint = batch[j];
            const response = batchResponses[j];
            if (response) {
              try {
                if (!response.ok) {
                  const errorText = await response.text();
                  console.error(`❌ Endpoint ${endpoint} failed with status ${response.status}:`, errorText);
                  responseMap[endpoint] = null;
                } else {
                  const data = await response.json();
                  // Check if response has an error message
                  if (data && data.message && !data.data_final && !data.data && !data.total && !data.Transaction_Type) {
                    console.warn(`⚠️ Endpoint ${endpoint} returned message:`, data.message);
                    responseMap[endpoint] = null;
                  } else {
                    // Log specific endpoints for debugging
                    if (endpoint === 'top_till_transactions' || endpoint === 'top_send_money_transactions') {
                      console.log(`✅ Endpoint ${endpoint} succeeded:`, data);
                    } else {
                      console.log(`✅ Endpoint ${endpoint} succeeded`);
                    }
                    responseMap[endpoint] = data;
                  }
                }
              } catch (error: any) {
                // Handle network errors specifically
                if (error?.message?.includes('network') || error?.name === 'TypeError') {
                  console.error(`❌ Network error parsing response from ${endpoint}:`, error?.message);
                } else {
                  console.error(`❌ Error parsing JSON from ${endpoint}:`, error?.message || error);
                }
                responseMap[endpoint] = null;
              }
            } else {
              console.error(`❌ Endpoint ${endpoint} - No response received`);
              responseMap[endpoint] = null;
            }
          }
          
          // Delay between batches
          if (i + batchSize < fastEndpoints.length) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
        
        // Process slow endpoints sequentially (one at a time)
        console.log(`🐌 Processing slow endpoints sequentially: ${slowEndpointsList.join(', ')}`);
        for (const endpoint of slowEndpointsList) {
          console.log(`⏳ Fetching slow endpoint: ${endpoint}`);
          const response = await fetchWithRetry(endpoint);
          if (response) {
            try {
              if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Endpoint ${endpoint} failed with status ${response.status}:`, errorText);
                responseMap[endpoint] = null;
              } else {
                const data = await response.json();
                // Check if response has an error message
                if (data && data.message && !data.data_final && !data.data && !data.total && !data.Transaction_Type) {
                  console.warn(`⚠️ Endpoint ${endpoint} returned message:`, data.message);
                  responseMap[endpoint] = null;
                } else {
                  console.log(`✅ Endpoint ${endpoint} succeeded`);
                  responseMap[endpoint] = data;
                }
              }
            } catch (error: any) {
              // Handle network errors specifically
              if (error?.message?.includes('network') || error?.name === 'TypeError') {
                console.error(`❌ Network error parsing response from ${endpoint}:`, error?.message);
              } else {
                console.error(`❌ Error parsing JSON from ${endpoint}:`, error?.message || error);
              }
              responseMap[endpoint] = null;
            }
          } else {
            console.error(`❌ Endpoint ${endpoint} - No response received`);
            responseMap[endpoint] = null;
          }
          // Wait between slow endpoint requests
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Extract data with explicit endpoint mapping
        const transTypeData = responseMap['trans_type'];
        const totalReceived = responseMap['total_recieved'];
        const totalWithdrawn = responseMap['total_withdrawn'];
        const totalTransacted = responseMap['total_transacted'];
        const withdrawalCount = responseMap['withdrawal_count'];
        const depositCount = responseMap['deposit_count'];
        const totalTransactionCount = responseMap['total_transaction_count'];
        const topDeposit = responseMap['top_deposit'];
        const lowestDeposit = responseMap['lowest_deposit'];
        const topWithdrawal = responseMap['top_withdrawal'];
        const lowestWithdrawal = responseMap['lowest_withdrawal'];
        const minAmountTransacted = responseMap['minimum_amount_transacted'];
        const maxAmountTransacted = responseMap['maximum_amount_transacted'];
        const topPaybillTransactions = responseMap['top_paybill_transactions'];
        const topTillTransactions = responseMap['top_till_transactions'];
        const topSendMoneyTransactions = responseMap['top_send_money_transactions'];
        const topTransactionsCustomer = responseMap['top_transactions_customer'];
        const topWithdrawals = responseMap['top_withdrawals'];
        const topTransactionsReceived = responseMap['top_transactions_received'];
        const topTransactionHour = responseMap['top_transaction_hour'];
        const topTransactionDay = responseMap['top_transaction_day'];

        // Debug logging to verify data mapping
        console.log('🔍 Till Transactions Response (from top_till_transactions endpoint):', topTillTransactions);
        console.log('🔍 Send Money Transactions Response (from top_send_money_transactions endpoint):', topSendMoneyTransactions);
        console.log('🔍 Till Transactions Data:', topTillTransactions?.data);
        console.log('🔍 Send Money Transactions Data:', topSendMoneyTransactions?.data);

        const summaryData: TransactionSummary = {
          total_received: totalReceived?.total || 0,
          total_withdrawn: totalWithdrawn?.total || 0,
          total_transacted: totalTransacted?.total || 0,
          withdrawal_count: withdrawalCount?.no_of_withdrawals || 0,
          deposit_count: depositCount?.number_of_deposits || 0,
          total_transaction_count: totalTransactionCount?.total_no_of_transactions || 0,
          top_deposit: topDeposit?.highest_receoved_amount || 0,
          lowest_deposit: lowestDeposit?.lowest_amount_received || 0,
          top_withdrawal: topWithdrawal?.highest_withdrawn_amount || 0,
          lowest_withdrawal: lowestWithdrawal?.lowest_withdrawn_amount || 0,
          minimum_amount_transacted: minAmountTransacted?.lowest_amount_transacted || 0,
          maximum_amount_transacted: maxAmountTransacted?.highest_amount_transacted || 0,
          top_paybill_transactions: topPaybillTransactions?.data_final || [],
          // Directly use the data from backend response - Till returns {"data": [...]}
          top_till_transactions: Array.isArray(topTillTransactions?.data) ? topTillTransactions.data : (topTillTransactions?.data_final || []),
          // Directly use the data from backend response - Send Money returns {"data": [...]}
          top_send_money_transactions: Array.isArray(topSendMoneyTransactions?.data) ? topSendMoneyTransactions.data : (topSendMoneyTransactions?.data_final || []),
          top_transactions_customer: Array.isArray(topTransactionsCustomer?.data) ? topTransactionsCustomer.data : [],
          top_withdrawals: topWithdrawals?.data_final || [],
          top_transactions_received: topTransactionsReceived?.data_final || [],
          top_transaction_hour: topTransactionHour?.data_final || [],
          top_transaction_day: topTransactionDay?.data_final || [],
        };

        // Additional debug logging
        console.log('📊 Mapped Till Transactions:', summaryData.top_till_transactions);
        console.log('📊 Mapped Send Money Transactions:', summaryData.top_send_money_transactions);

        setDetailedTransactions({
          topPaybill: summaryData.top_paybill_transactions,
          topTill: summaryData.top_till_transactions,
          topSendMoney: summaryData.top_send_money_transactions,
          topCustomer: summaryData.top_transactions_customer,
          topWithdrawals: summaryData.top_withdrawals,
          topReceived: summaryData.top_transactions_received,
          hourlyData: summaryData.top_transaction_hour,
          dailyData: summaryData.top_transaction_day,
        });

        setTransTypes({ data: transTypeData, isLoading: false, error: null });
        setSummary({ data: summaryData, isLoading: false, error: null });
        setInsights(calculateInsights(summaryData));

      } catch (error) {
        console.error('Error fetching transaction data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transaction data';
        setTransTypes(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        setSummary(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      }
    };

    fetchData();
  }, []);

  return { transTypes, summary, insights, detailedTransactions };
};