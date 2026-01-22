'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  PiggyBank,
  Loader2, 
  AlertCircle,
  BarChart3,
  Banknote,
  Calendar
} from 'lucide-react';
import { server } from '@/utils/util';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface Transaction {
  [key: string]: unknown;
}

interface FinancialInstitutionsData {
  clientBanks?: {
    banks: string[];
    transactions: Transaction[];
    count: number;
  };
  bankReceivedSummary?: {
    total_amount_received: number;
    highest_amount_received: number;
    lowest_amount_received: number;
    highest_amount_bank: string;
    lowest_amount_bank: string;
  };
  bankSentSummary?: {
    total_amount_sent: number;
    highest_amount_sent: number;
    lowest_amount_sent: number;
    highest_amount_bank: string;
    lowest_amount_bank: string;
  };
  lowestAmountReceivedThroughBank?: {
    lowest_received_amount: number;
  };
  lowestAmountSentThroughBank?: number;
  topFiveReceivedCount?: {
    top_five_banks: Array<{
      bank: string;
      count: number;
    }>;
  };
  topFiveSentCount?: {
    top_five_banks: Array<{
      bank: string;
      count: number;
    }>;
  };
  safaricomFinancialServices?: {
    transactions: Transaction[];
  };
  mshwariTransactions?: {
    mshwari_transactions: Transaction[];
    count: number;
  };
  mshwariLoanSummary?: {
    total_loan_count: number;
    highest_loan_disbursed: number;
    highest_loan_paid_back: number;
    date_of_last_loan_disbursement: string;
    date_of_last_loan_repayment: string;
    last_amount_borrowed: number;
    last_amount_paid_back: number;
    total_loan_disbursed_amount: number;
    total_loan_paid_back_amount: number;
  };
  fulizaUsage?: {
    fuliza_usage: Transaction[];
  };
  fulizaLoanSummary?: {
    total_loan_count: number;
    highest_loan_disbursed: number;
    highest_loan_paid_back: number;
    date_of_last_loan_disbursement: string;
    date_of_last_loan_repayment: string;
    last_amount_borrowed: number;
    last_amount_paid_back: number;
    total_loan_disbursed_amount: number;
    total_loan_paid_back_amount: number;
    total_loan_balance: number;
  };
}

const FinancialInstitutions = () => {
  const [data, setData] = useState<FinancialInstitutionsData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialInstitutionsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoints = [
        'client_banks/',
        'bank_received_summary_metrics/',
        'bank_sent_summary_metrics/',
        'lowest_amount_received_through_bank/',
        'lowest_amount_sent_through_bank/',
        'top_five_received_count/',
        'top_five_sent_count/',
        'identify_safaricom_financial_services/',
        'identify_mshwari_financial_transactions/',
        'mshwari_loan_summary/',
        'fuliza_usage/',
        'fuliza_loan_summary/'
      ];

      const slowEndpoints = [
        'fuliza_usage/',
        'fuliza_loan_summary/',
        'identify_mshwari_financial_transactions/',
        'mshwari_loan_summary/',
        'identify_safaricom_financial_services/'
      ];

      // Helper function to fetch with retry and timeout
      const fetchWithRetry = async (endpoint: string, retries = 3): Promise<Response | null> => {
        for (let i = 0; i < retries; i++) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            const response = await fetch(`${server}/financial_institutions_module/${endpoint}`, {
              signal: controller.signal,
              headers: {
                'Content-Type': 'application/json',
              },
              keepalive: true,
            });
            
            clearTimeout(timeoutId);
            return response;
          } catch (error: unknown) {
            // Handle specific error types
            const errorObj = error as { name?: string; message?: string };
            const isNetworkError = errorObj?.name === 'TypeError' || 
                                 errorObj?.message?.includes('network') ||
                                 errorObj?.message?.includes('ERR_NETWORK') ||
                                 errorObj?.name === 'AbortError';
            
            if (isNetworkError && i < retries - 1) {
              console.warn(`⚠️ Network error for ${endpoint}, retrying... (attempt ${i + 1}/${retries})`);
              // Longer delay for network errors
              await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
              continue;
            }
            
            if (i === retries - 1) {
              const errorObj = error as { message?: string };
              console.error(`❌ Failed to fetch ${endpoint} after ${retries} attempts:`, errorObj?.message || error);
              return null;
            }
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
        return null;
      };

      const responses: (Response | null)[] = [];
      const batchSize = 3; // Process 3 endpoints at a time

      for (let i = 0; i < endpoints.length; i += batchSize) {
        const batch = endpoints.slice(i, i + batchSize);
        console.log(`📦 Fetching batch ${Math.floor(i / batchSize) + 1} for Financial Institutions: ${batch.join(', ')}`);

        const batchResponses = await Promise.all(
          batch.map(endpoint => {
            if (slowEndpoints.includes(endpoint)) {
              // Process slow endpoints sequentially
              return (async () => {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                return fetchWithRetry(endpoint);
              })();
            }
            return fetchWithRetry(endpoint);
          })
        );
        responses.push(...batchResponses);

        if (i + batchSize < endpoints.length) {
          await new Promise(resolve => setTimeout(resolve, 300)); // Delay between batches
        }
      }

      // Parse responses with error handling
      const results = await Promise.all(
        responses.map(async (res, index) => {
          if (!res) {
            console.error(`❌ Endpoint ${endpoints[index]} - No response received`);
            return null;
          }

          try {
            if (!res.ok) {
              const errorText = await res.text();
              console.error(`❌ Endpoint ${endpoints[index]} failed with status ${res.status}:`, errorText);
              return null;
            }
            
            const data = await res.json();
            console.log(`✅ Financial Institutions endpoint ${endpoints[index]} succeeded`);
            return data;
          } catch (error: unknown) {
            const errorObj = error as { message?: string };
            console.error(`❌ Error parsing JSON from ${endpoints[index]}:`, errorObj?.message || error);
            return null;
          }
        })
      );

      const financialData: FinancialInstitutionsData = {};
      
      endpoints.forEach((endpoint, index) => {
        const result = results[index];
        
        // Skip null results (failed requests)
        if (!result || result.message || result.error) {
          return;
        }
        
        switch (endpoint) {
            case 'client_banks/':
              financialData.clientBanks = {
                banks: result[0] || [],
                transactions: result[1]?.transactions || [],
                count: result[1]?.count || 0
              };
              break;
            case 'bank_received_summary_metrics/':
              financialData.bankReceivedSummary = result;
              break;
            case 'bank_sent_summary_metrics/':
              financialData.bankSentSummary = result;
              break;
            case 'lowest_amount_received_through_bank/':
              financialData.lowestAmountReceivedThroughBank = result;
              break;
            case 'lowest_amount_sent_through_bank/':
              financialData.lowestAmountSentThroughBank = result;
              break;
            case 'top_five_received_count/':
              financialData.topFiveReceivedCount = result;
              break;
            case 'top_five_sent_count/':
              financialData.topFiveSentCount = result;
              break;
            case 'identify_safaricom_financial_services/':
              financialData.safaricomFinancialServices = result;
              break;
            case 'identify_mshwari_financial_transactions/':
              financialData.mshwariTransactions = result;
              break;
            case 'mshwari_loan_summary/':
              financialData.mshwariLoanSummary = result;
              break;
            case 'fuliza_usage/':
              financialData.fulizaUsage = result;
              break;
            case 'fuliza_loan_summary/':
              financialData.fulizaLoanSummary = result;
              break;
        }
      });

      setData(financialData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial institutions data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinancialInstitutionsData();
  }, [fetchFinancialInstitutionsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading financial institutions data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-muted-foreground">{error}</p>
              <button 
                onClick={fetchFinancialInstitutionsData}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare data for charts
  const bankReceivedData = data.topFiveReceivedCount?.top_five_banks?.map(item => ({
    name: item.bank,
    count: item.count,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  })) || [];

  const bankSentData = data.topFiveSentCount?.top_five_banks?.map(item => ({
    name: item.bank,
    count: item.count,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  })) || [];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Financial Institutions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Bank transactions, M-Shwari, and Fuliza analytics</p>
        </div>
        <button 
          onClick={fetchFinancialInstitutionsData}
          className="p-2 rounded-md bg-muted hover:bg-muted/80"
        >
          <Loader2 className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Bank Transactions */}
        <Card className="overflow-hidden border-t-4 border-t-blue-500">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <h3 className="text-sm sm:text-base font-medium">Bank Transactions</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {data.clientBanks?.count || 0}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {data.clientBanks?.banks?.length || 0} banks
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* M-Shwari */}
        <Card className="overflow-hidden border-t-4 border-t-green-500">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  <h3 className="text-sm sm:text-base font-medium">M-Shwari</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {data.mshwariTransactions?.count || 0}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {data.mshwariLoanSummary?.total_loan_count || 0} loans
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                KES {data.mshwariLoanSummary?.total_loan_disbursed_amount?.toLocaleString() || '0'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Fuliza */}
        <Card className="overflow-hidden border-t-4 border-t-red-500">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  <h3 className="text-sm sm:text-base font-medium">Fuliza</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {data.fulizaLoanSummary?.total_loan_count || 0}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  KES {data.fulizaLoanSummary?.total_loan_balance?.toLocaleString() || '0'} balance
                </p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                KES {data.fulizaLoanSummary?.total_loan_disbursed_amount?.toLocaleString() || '0'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Bank Summary */}
        <Card className="overflow-hidden border-t-4 border-t-purple-500">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  <h3 className="text-sm sm:text-base font-medium">Bank Activity</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  KES {data.bankReceivedSummary?.total_amount_received?.toLocaleString() || '0'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Total received
                </p>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                KES {data.bankSentSummary?.total_amount_sent?.toLocaleString() || '0'} sent
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Banks by Received Count */}
        {bankReceivedData.length > 0 && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                Top Banks by Received Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bankReceivedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Banks by Sent Count */}
        {bankSentData.length > 0 && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                Top Banks by Sent Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bankSentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Detailed Financial Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="banks">
            <TabsList className="mb-3 sm:mb-4 flex-wrap h-auto p-1">
              <TabsTrigger value="banks" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                Banks
              </TabsTrigger>
              <TabsTrigger value="mshwari" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                M-Shwari
              </TabsTrigger>
              <TabsTrigger value="fuliza" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                Fuliza
              </TabsTrigger>
            </TabsList>

            {/* Banks Tab */}
            <TabsContent value="banks">
              <div className="space-y-4 sm:space-y-6">
                {/* Bank Summary Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-1.5 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Highest Received</p>
                    <p className="text-sm sm:text-base font-bold mt-1">KES {data.bankReceivedSummary?.highest_amount_received?.toLocaleString() || '0'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{data.bankReceivedSummary?.highest_amount_bank || 'N/A'}</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-1.5 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Lowest Received</p>
                    <p className="text-sm sm:text-base font-bold mt-1">KES {data.bankReceivedSummary?.lowest_amount_received?.toLocaleString() || '0'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{data.bankReceivedSummary?.lowest_amount_bank || 'N/A'}</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-1.5 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Highest Sent</p>
                    <p className="text-sm sm:text-base font-bold mt-1">KES {data.bankSentSummary?.highest_amount_sent?.toLocaleString() || '0'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{data.bankSentSummary?.highest_amount_bank || 'N/A'}</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-1.5 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Lowest Sent</p>
                    <p className="text-sm sm:text-base font-bold mt-1">KES {data.bankSentSummary?.lowest_amount_sent?.toLocaleString() || '0'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{data.bankSentSummary?.lowest_amount_bank || 'N/A'}</p>
                  </div>
                </div>

                {/* Connected Banks */}
                {data.clientBanks?.banks && data.clientBanks.banks.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Connected Banks</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.clientBanks.banks.map((bank, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 text-xs sm:text-sm">
                          {bank}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* M-Shwari Tab */}
            <TabsContent value="mshwari">
              {data.mshwariLoanSummary ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                      <PiggyBank className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Loans</p>
                      <p className="text-sm sm:text-base font-bold mt-1">{data.mshwariLoanSummary.total_loan_count}</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Highest Disbursed</p>
                      <p className="text-sm sm:text-base font-bold mt-1">KES {data.mshwariLoanSummary.highest_loan_disbursed.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                      <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Highest Repaid</p>
                      <p className="text-sm sm:text-base font-bold mt-1">KES {data.mshwariLoanSummary.highest_loan_paid_back.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Last Disbursement</p>
                      <p className="text-xs sm:text-sm font-bold mt-1">
                        {new Date(data.mshwariLoanSummary.date_of_last_loan_disbursement).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                      <h4 className="text-sm sm:text-base font-semibold mb-2">Loan Summary</h4>
                      <p className="text-xs sm:text-sm mb-1">Total Disbursed: KES {data.mshwariLoanSummary.total_loan_disbursed_amount.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm mb-1">Total Repaid: KES {data.mshwariLoanSummary.total_loan_paid_back_amount.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm mb-1">Last Borrowed: KES {data.mshwariLoanSummary.last_amount_borrowed.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm">Last Repaid: KES {data.mshwariLoanSummary.last_amount_paid_back.toLocaleString()}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                      <h4 className="text-sm sm:text-base font-semibold mb-2">Recent Activity</h4>
                      <p className="text-xs sm:text-sm">Last Repayment: {new Date(data.mshwariLoanSummary.date_of_last_loan_repayment).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No M-Shwari data available</div>
              )}
            </TabsContent>

            {/* Fuliza Tab */}
            <TabsContent value="fuliza">
              {data.fulizaLoanSummary ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Loans</p>
                      <p className="text-sm sm:text-base font-bold mt-1">{data.fulizaLoanSummary.total_loan_count}</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Highest Disbursed</p>
                      <p className="text-sm sm:text-base font-bold mt-1">KES {data.fulizaLoanSummary.highest_loan_disbursed.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                      <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Highest Repaid</p>
                      <p className="text-sm sm:text-base font-bold mt-1">KES {data.fulizaLoanSummary.highest_loan_paid_back.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Last Disbursement</p>
                      <p className="text-xs sm:text-sm font-bold mt-1">
                        {new Date(data.fulizaLoanSummary.date_of_last_loan_disbursement).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
                      <h4 className="text-sm sm:text-base font-semibold mb-2">Loan Summary</h4>
                      <p className="text-xs sm:text-sm mb-1">Total Disbursed: KES {data.fulizaLoanSummary.total_loan_disbursed_amount.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm mb-1">Total Repaid: KES {data.fulizaLoanSummary.total_loan_paid_back_amount.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm mb-1">Current Balance: KES {data.fulizaLoanSummary.total_loan_balance.toLocaleString()}</p>
                      <p className="text-xs sm:text-sm">Last Borrowed: KES {data.fulizaLoanSummary.last_amount_borrowed.toLocaleString()}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
                      <h4 className="text-sm sm:text-base font-semibold mb-2">Recent Activity</h4>
                      <p className="text-xs sm:text-sm mb-1">Last Repayment: {new Date(data.fulizaLoanSummary.date_of_last_loan_repayment).toLocaleDateString()}</p>
                      <p className="text-xs sm:text-sm">Last Repaid: KES {data.fulizaLoanSummary.last_amount_paid_back.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No Fuliza data available</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialInstitutions;