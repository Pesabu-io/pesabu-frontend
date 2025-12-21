'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Calendar,
  Loader2, 
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { server } from '@/utils/util';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

interface TransactionItem {
  names?: string;
  numbers?: string;
  receipt_count?: number;
  'Receipt No.'?: number;
  amount?: number;
  max_amount?: number;
  time_day?: string;
  day_name?: string;
}

interface TransactionData {
  transType?: Array<{
    Transaction_Type: string;
    Count: number;
    Total_Amount: number;
  }>;
  totalReceived?: { total: number };
  totalWithdrawn?: { total: number };
  totalTransacted?: { total: number };
  withdrawalCount?: { no_of_withdrawals: number };
  depositCount?: { number_of_deposits: number };
  totalTransactionCount?: { total_no_of_transactions: number };
  topDeposit?: { highest_receoved_amount: number };
  lowestDeposit?: { lowest_amount_received: number };
  topWithdrawal?: { highest_withdrawn_amount: number };
  lowestWithdrawal?: { lowest_withdrawn_amount: number };
  minAmountTransacted?: { lowest_amount_transacted: number };
  maxAmountTransacted?: { highest_amount_transacted: number };
  topPaybillTransactions?: { data_final: TransactionItem[] };
  topTillTransactions?: { data: TransactionItem[] };
  topSendMoneyTransactions?: { data: TransactionItem[] };
  topTransactionsCustomer?: { data: TransactionItem[] };
  topWithdrawals?: { data_final: TransactionItem[] };
  topTransactionsReceived?: { data_final: TransactionItem[] };
  topTransactionHour?: { data_final: TransactionItem[] };
  topTransactionDay?: { data_final: TransactionItem[] };
}

const Transactions = () => {
  const [data, setData] = useState<TransactionData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactionData();
  }, []);

  const fetchTransactionData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const endpoints = [
        'trans_type/',
        'total_recieved/',
        'total_withdrawn/',
        'total_transacted/',
        'withdrawal_count/',
        'deposit_count/',
        'total_transaction_count',
        'top_deposit/',
        'lowest_deposit/',
        'top_withdrawal/',
        'lowest_withdrawal/',
        'minimum_amount_transacted/',
        'maximum_amount_transacted/',
        'top_paybill_transactions/',
        'top_till_transactions/',
        'top_send_money_transactions/',
        'top_transactions_customer/',
        'top_withdrawals/',
        'top_transactions_received/',
        'top_transaction_hour/',
        'top_transaction_day/'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(`${server}/transaction_module/${endpoint}`))
      );

      const results = await Promise.all(
        responses.map(response => response.json())
      );

      const transactionData: TransactionData = {};
      
      endpoints.forEach((endpoint, index) => {
        const key = endpoint.replace('/', '').replace('_', '');
        const result = results[index];
        
        if (!result.message) {
          switch (key) {
            case 'transtype':
              transactionData.transType = result;
              break;
            case 'totalrecieved':
              transactionData.totalReceived = result;
              break;
            case 'totalwithdrawn':
              transactionData.totalWithdrawn = result;
              break;
            case 'totaltransacted':
              transactionData.totalTransacted = result;
              break;
            case 'withdrawalcount':
              transactionData.withdrawalCount = result;
              break;
            case 'depositcount':
              transactionData.depositCount = result;
              break;
            case 'totaltransactioncount':
              transactionData.totalTransactionCount = result;
              break;
            case 'topdeposit':
              transactionData.topDeposit = result;
              break;
            case 'lowestdeposit':
              transactionData.lowestDeposit = result;
              break;
            case 'topwithdrawal':
              transactionData.topWithdrawal = result;
              break;
            case 'lowestwithdrawal':
              transactionData.lowestWithdrawal = result;
              break;
            case 'minimumamounttransacted':
              transactionData.minAmountTransacted = result;
              break;
            case 'maximumamounttransacted':
              transactionData.maxAmountTransacted = result;
              break;
            case 'toppaybilltransactions':
              transactionData.topPaybillTransactions = result;
              break;
            case 'toptilltransactions':
              transactionData.topTillTransactions = result;
              break;
            case 'topsendmoneytransactions':
              transactionData.topSendMoneyTransactions = result;
              break;
            case 'toptransactionscustomer':
              transactionData.topTransactionsCustomer = result;
              break;
            case 'topwithdrawals':
              transactionData.topWithdrawals = result;
              break;
            case 'toptransactionsreceived':
              transactionData.topTransactionsReceived = result;
              break;
            case 'toptransactionhour':
              transactionData.topTransactionHour = result;
              break;
            case 'toptransactionday':
              transactionData.topTransactionDay = result;
              break;
          }
        }
      });

      setData(transactionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transaction data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading transaction data...</p>
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
                onClick={fetchTransactionData}
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
  const transactionTypeData = data.transType?.map(item => ({
    name: item.Transaction_Type,
    count: item.Count,
    amount: item.Total_Amount
  })) || [];

  const hourlyData = data.topTransactionHour?.data_final?.map((item: TransactionItem) => ({
    hour: item.time_day,
    count: item['Receipt No.'],
    amount: item.amount
  })) || [];

  const dailyData = data.topTransactionDay?.data_final?.map((item: TransactionItem) => ({
    day: item.day_name,
    count: item['Receipt No.'],
    amount: item.amount
  })) || [];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transaction Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analysis of your transaction patterns</p>
        </div>
        <button 
          onClick={fetchTransactionData}
          className="p-2 rounded-md bg-muted hover:bg-muted/80"
        >
          <Loader2 className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Received */}
        <Card className="overflow-hidden border-t-4 border-t-green-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Total Received</h3>
                </div>
                <p className="text-3xl font-bold mt-2">
                  KES {data.totalReceived?.total?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.depositCount?.number_of_deposits || 0} deposits
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {data.topDeposit?.highest_receoved_amount?.toLocaleString() || '0'} max
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Total Withdrawn */}
        <Card className="overflow-hidden border-t-4 border-t-red-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium">Total Withdrawn</h3>
                </div>
                <p className="text-3xl font-bold mt-2">
                  KES {data.totalWithdrawn?.total?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.withdrawalCount?.no_of_withdrawals || 0} withdrawals
                </p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                {data.topWithdrawal?.highest_withdrawn_amount?.toLocaleString() || '0'} max
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Total Transacted */}
        <Card className="overflow-hidden border-t-4 border-t-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Total Transacted</h3>
                </div>
                <p className="text-3xl font-bold mt-2">
                  KES {data.totalTransacted?.total?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.totalTransactionCount?.total_no_of_transactions || 0} transactions
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {data.maxAmountTransacted?.highest_amount_transacted?.toLocaleString() || '0'} max
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Range */}
        <Card className="overflow-hidden border-t-4 border-t-purple-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Amount Range</h3>
                </div>
                <p className="text-3xl font-bold mt-2">
                  KES {data.minAmountTransacted?.lowest_amount_transacted?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Min transaction amount
                </p>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Range: {data.maxAmountTransacted?.highest_amount_transacted?.toLocaleString() || '0'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Types Distribution */}
        {transactionTypeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Transaction Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={transactionTypeData.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {transactionTypeData.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} transactions`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Amount by Type */}
        {transactionTypeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Transaction Amount by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionTypeData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => `KES ${value}`} />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Time-based Analytics */}
      {(hourlyData.length > 0 || dailyData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Transaction Pattern */}
          {hourlyData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Transaction Pattern by Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Transaction Pattern */}
          {dailyData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Transaction Pattern by Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Transaction Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="paybill">Pay Bill</TabsTrigger>
              <TabsTrigger value="till">Till No</TabsTrigger>
              <TabsTrigger value="sendmoney">Send Money</TabsTrigger>
              <TabsTrigger value="customer">Customer Deposit</TabsTrigger>
              <TabsTrigger value="received">Received Money</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            </TabsList>

            {/* Summary Tab */}
            <TabsContent value="summary">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Highest Received</p>
                  <p className="font-bold">KES {data.topDeposit?.highest_receoved_amount?.toLocaleString() || '0'}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Highest Withdrawn</p>
                  <p className="font-bold">KES {data.topWithdrawal?.highest_withdrawn_amount?.toLocaleString() || '0'}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="font-bold">{data.totalTransactionCount?.total_no_of_transactions || 0}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Transaction Types</p>
                  <p className="font-bold">{data.transType?.length || 0}</p>
                </div>
              </div>
            </TabsContent>

            {/* Pay Bill Transactions Tab */}
            <TabsContent value="paybill">
              {data.topPaybillTransactions?.data_final ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.topPaybillTransactions.data_final.map((item: TransactionItem, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <p className="font-semibold">{item.names || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{item.numbers}</p>
                        <div className="mt-2 flex justify-between">
                          <span className="text-sm">Transactions: {item.receipt_count}</span>
                          <span className="font-bold">KES {item.max_amount?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
              <div className="py-8 text-center text-muted-foreground">
                  No Pay Bill transaction data available
              </div>
              )}
            </TabsContent>

            {/* Till No Transactions Tab */}
            <TabsContent value="till">
              {data.topTillTransactions?.data ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Number</th>
                          <th className="text-right p-2">Transactions</th>
                          <th className="text-right p-2">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topTillTransactions.data.map((item: TransactionItem, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{item.names || 'Unknown'}</td>
                            <td className="p-2">{item.numbers}</td>
                            <td className="text-right p-2">{item['Receipt No.']}</td>
                            <td className="text-right p-2 font-semibold">KES {item.amount?.toLocaleString() || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
              <div className="py-8 text-center text-muted-foreground">
                  No Till No transaction data available
              </div>
              )}
            </TabsContent>

            {/* Send Money Transactions Tab */}
            <TabsContent value="sendmoney">
              {data.topSendMoneyTransactions?.data ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Number</th>
                          <th className="text-right p-2">Transactions</th>
                          <th className="text-right p-2">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topSendMoneyTransactions.data.map((item: TransactionItem, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{item.names || 'Unknown'}</td>
                            <td className="p-2">{item.numbers}</td>
                            <td className="text-right p-2">{item['Receipt No.']}</td>
                            <td className="text-right p-2 font-semibold">KES {item.amount?.toLocaleString() || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No Send Money transaction data available
                </div>
              )}
            </TabsContent>

            {/* Customer Deposit Transactions Tab */}
            <TabsContent value="customer">
              {data.topTransactionsCustomer?.data ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Number</th>
                          <th className="text-right p-2">Transactions</th>
                          <th className="text-right p-2">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topTransactionsCustomer.data.map((item: TransactionItem, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{item.names || 'Unknown'}</td>
                            <td className="p-2">{item.numbers}</td>
                            <td className="text-right p-2">{item['Receipt No.']}</td>
                            <td className="text-right p-2 font-semibold text-green-600">KES {item.amount?.toLocaleString() || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No Customer Deposit transaction data available
                </div>
              )}
            </TabsContent>

            {/* Received Money Transactions Tab */}
            <TabsContent value="received">
              {data.topTransactionsReceived?.data_final ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Number</th>
                          <th className="text-right p-2">Transactions</th>
                          <th className="text-right p-2">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topTransactionsReceived.data_final.map((item: TransactionItem, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{item.names || 'Unknown'}</td>
                            <td className="p-2">{item.numbers}</td>
                            <td className="text-right p-2">{item['Receipt No.']}</td>
                            <td className="text-right p-2 font-semibold text-green-600">KES {item.amount?.toLocaleString() || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
              <div className="py-8 text-center text-muted-foreground">
                  No Received Money transaction data available
              </div>
              )}
            </TabsContent>

            {/* Withdrawals Tab */}
            <TabsContent value="withdrawals">
              {data.topWithdrawals?.data_final ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Number</th>
                          <th className="text-right p-2">Transactions</th>
                          <th className="text-right p-2">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topWithdrawals.data_final.map((item: TransactionItem, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{item.names || 'Unknown'}</td>
                            <td className="p-2">{item.numbers}</td>
                            <td className="text-right p-2">{item['Receipt No.']}</td>
                            <td className="text-right p-2 font-semibold text-red-600">KES {item.amount?.toLocaleString() || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
              <div className="py-8 text-center text-muted-foreground">
                  No withdrawal transaction data available
              </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
