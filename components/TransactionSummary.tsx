import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  ArrowUpDown, 
  Repeat, 
  Percent, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  BarChart4,
  PieChart as PieChartIcon,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { SummaryCard } from './SummaryCard';
import { TransactionDistribution } from './TransactionDistribution';
import { TransactionHealth } from './TransactionHealth';
import { useTransactionData } from '@/hooks/useTransactionData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';

type SortField = 'names' | 'numbers' | 'transactions' | 'amount' | 'max_amount';
type SortDirection = 'asc' | 'desc';

const TransactionDashboard = () => {
  const { transTypes, summary, insights, detailedTransactions } = useTransactionData();
  const [timeRange, setTimeRange] = useState("30");
  const [chartView, setChartView] = useState("volume");
  const [activeDetailTab, setActiveDetailTab] = useState("paybill");
  const [sortField, setSortField] = useState<SortField>('transactions');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Prepare hourly data from endpoint
  const hourlyChartData = detailedTransactions?.hourlyData?.map((item) => ({
    hour: item.time_day,
    transactions: item['Receipt No.'],
    amount: item.amount
  })) || [];

  // Prepare daily data from endpoint
  const dailyChartData = detailedTransactions?.dailyData?.map((item) => ({
    day: item.day_name,
    transactions: item['Receipt No.'],
    amount: item.amount
  })) || [];

  // Sorting function
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortData = <T extends Record<string, any>>(data: T[], field: SortField): T[] => {
    if (!data || data.length === 0) return data;
    
    const sorted = [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'names':
          aValue = (a.names || '').toLowerCase();
          bValue = (b.names || '').toLowerCase();
          break;
        case 'numbers':
          aValue = a.numbers || '';
          bValue = b.numbers || '';
          break;
        case 'transactions':
          aValue = a.receipt_count || a['Receipt No.'] || 0;
          bValue = b.receipt_count || b['Receipt No.'] || 0;
          break;
        case 'amount':
          aValue = a.amount || a.max_amount || 0;
          bValue = b.amount || b.max_amount || 0;
          break;
        case 'max_amount':
          aValue = a.max_amount || a.amount || 0;
          bValue = b.max_amount || b.amount || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return sorted;
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  // Sorted data for each tab
  const sortedPaybill = useMemo(() => 
    sortData(detailedTransactions?.topPaybill || [], sortField),
    [detailedTransactions?.topPaybill, sortField, sortDirection]
  );
  
  const sortedTill = useMemo(() => 
    sortData(detailedTransactions?.topTill || [], sortField),
    [detailedTransactions?.topTill, sortField, sortDirection]
  );
  
  const sortedSendMoney = useMemo(() => 
    sortData(detailedTransactions?.topSendMoney || [], sortField),
    [detailedTransactions?.topSendMoney, sortField, sortDirection]
  );
  
  const sortedCustomer = useMemo(() => 
    sortData(detailedTransactions?.topCustomer || [], sortField),
    [detailedTransactions?.topCustomer, sortField, sortDirection]
  );
  
  const sortedWithdrawals = useMemo(() => 
    sortData(detailedTransactions?.topWithdrawals || [], sortField),
    [detailedTransactions?.topWithdrawals, sortField, sortDirection]
  );
  
  const sortedReceived = useMemo(() => 
    sortData(detailedTransactions?.topReceived || [], sortField),
    [detailedTransactions?.topReceived, sortField, sortDirection]
  );

  if (transTypes.isLoading || summary.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading transaction data...</p>
        </div>
      </div>
    );
  }

  if (transTypes.error || summary.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-muted-foreground">{transTypes.error || summary.error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Net Cash Flow",
      value: `KES ${insights?.netFlow.toLocaleString() || '0'}`,
      change: (insights?.netFlow ?? 0) > 0 ? 
        `+${(((insights?.netFlow ?? 0) / ((insights?.totalTransactions ?? 1) || 1)) * 100).toFixed(1)}% positive` : 
        `${(((insights?.netFlow ?? 0) / ((insights?.totalTransactions ?? 1) || 1)) * 100).toFixed(1)}% negative`,
      icon: (insights?.netFlow ?? 0) > 0 ? 
        <TrendingUp className="h-4 w-4 text-emerald-500" /> : 
        <TrendingDown className="h-4 w-4 text-red-500" />,
      bgColor: (insights?.netFlow ?? 0) > 0 ? "bg-emerald-50" : "bg-red-50",
      textColor: (insights?.netFlow ?? 0) > 0 ? "text-emerald-600" : "text-red-600",
    },
    {
      title: "Average Transaction Size",
      value: `KES ${insights?.avgTransactionSize.toLocaleString() || '0'}`,
      change: `${(insights?.avgTransactionSize ?? 0) > 5000 ? 'Above' : 'Below'} market avg`,
      icon: <ArrowUpDown className="h-4 w-4 text-blue-500" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Transaction Volume",
      value: insights?.totalTransactions || 0,
      change: `${(((insights?.totalTransactions ?? 0) / 30) || 0).toFixed(1)}/day`,
      icon: <Repeat className="h-4 w-4 text-purple-500" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Amount Range",
      value: `KES ${summary.data?.minimum_amount_transacted.toLocaleString() || '0'}`,
      change: `Max: KES ${summary.data?.maximum_amount_transacted.toLocaleString() || '0'}`,
      icon: <DollarSign className="h-4 w-4 text-orange-500" />,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of financial movements and customer behavior
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="30" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last Quarter</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground bg-white px-3 py-2 rounded-md border shadow-sm">
            Last updated: {new Date().toLocaleString('en-US', { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="space-y-0 pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Transaction Activity</CardTitle>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${chartView === 'volume' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => setChartView('volume')}
                >
                  Volume
                </button>
                <button 
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${chartView === 'value' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                  onClick={() => setChartView('value')}
                >
                  Value
                </button>
              </div>
            </div>
            <CardDescription>Transaction patterns by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'volume' ? (
                  <BarChart data={dailyChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="transactions" name="Transactions" fill="#3b82f6" />
                  </BarChart>
                ) : (
                  <BarChart data={dailyChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => `KES ${value?.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="amount" name="Amount" fill="#16a34a" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Transaction Breakdown</CardTitle>
            <CardDescription>Distribution by transaction type</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="count">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="count">Count</TabsTrigger>
                <TabsTrigger value="value">Value</TabsTrigger>
              </TabsList>
              <TabsContent value="count">
                <TransactionDistribution summary={summary.data} />
              </TabsContent>
              <TabsContent value="value">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">Total Deposits</div>
                      <div className="text-2xl font-bold text-green-600">
                        KES {summary.data?.total_received.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">Total Withdrawals</div>
                      <div className="text-2xl font-bold text-red-600">
                        KES {summary.data?.total_withdrawn.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-sm font-medium mb-2">Value Ratio</div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-l-full" 
                        style={{ width: `${((summary.data?.total_received ?? 0) / ((summary.data?.total_received ?? 0) + (summary.data?.total_withdrawn ?? 0)) * 100) || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>{Math.round(((summary.data?.total_received ?? 0) / ((summary.data?.total_received ?? 0) + (summary.data?.total_withdrawn ?? 0)) * 100) || 0)}% Deposits</span>
                      <span>{Math.round(((summary.data?.total_withdrawn ?? 0) / ((summary.data?.total_received ?? 0) + (summary.data?.total_withdrawn ?? 0)) * 100) || 0)}% Withdrawals</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TransactionHealth insights={insights} summary={summary} />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Transaction Timing</CardTitle>
            <CardDescription>When users prefer to transact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hourlyChartData.length > 0 ? (
                hourlyChartData.slice(0, 8).map((item) => {
                  const total = hourlyChartData.reduce((sum, i) => sum + i.transactions, 0);
                  return (
                    <div key={item.hour} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.hour}</span>
                        <span className="text-sm text-muted-foreground">{item.transactions} transactions</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${total > 0 ? (item.transactions / total * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">No hourly data available</div>
              )}
            </div>
            {hourlyChartData.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <div className="text-sm font-medium mb-2">
                  Peak transaction time: {hourlyChartData.reduce((max, item) => 
                    item.transactions > max.transactions ? item : max, hourlyChartData[0]
                  )?.hour || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Consider optimizing system resources during peak hours to ensure smooth transaction processing
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Highlights</CardTitle>
            <CardDescription>Notable transaction metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-50 rounded-full">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Busiest Day</div>
                  <div className="text-2xl font-bold">Wednesday</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((summary.data?.deposit_count ?? 0) * 0.22)} transactions processed
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-50 rounded-full">
                  <BarChart4 className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Largest Transaction</div>
                  <div className="text-2xl font-bold">KES {summary.data?.top_deposit.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-full">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-sm font-medium">Processing Efficiency</div>
                  <div className="text-2xl font-bold">{Math.round((insights?.totalTransactions ?? 0) / 30 / 24 * 1.5)} / hour</div>
                  <div className="text-xs text-muted-foreground">
                    Average transaction processing rate
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Transactions by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Top Transactions by Type</CardTitle>
          <CardDescription>Most frequent transaction partners and patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab}>
            <TabsList className="grid w-full grid-cols-6 mb-4">
              <TabsTrigger value="paybill">Pay Bill</TabsTrigger>
              <TabsTrigger value="till">Till No</TabsTrigger>
              <TabsTrigger value="sendmoney">Send Money</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>

            <TabsContent value="paybill">
              {detailedTransactions?.topPaybill && detailedTransactions.topPaybill.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('names')}
                        >
                          <div className="flex items-center">
                            Name
                            <SortIcon field="names" />
                          </div>
                        </th>
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('numbers')}
                        >
                          <div className="flex items-center">
                            Number
                            <SortIcon field="numbers" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('transactions')}
                        >
                          <div className="flex items-center justify-end">
                            Transactions
                            <SortIcon field="transactions" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center justify-end">
                            Max Amount
                            <SortIcon field="amount" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPaybill.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.names || 'Unknown'}</td>
                          <td className="p-2">{item.numbers || 'N/A'}</td>
                          <td className="text-right p-2">{item.receipt_count || item['Receipt No.'] || 0}</td>
                          <td className="text-right p-2 font-semibold">KES {(item.max_amount || item.amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No Pay Bill transaction data available</div>
              )}
            </TabsContent>

            <TabsContent value="till">
              {detailedTransactions?.topTill && detailedTransactions.topTill.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('names')}
                        >
                          <div className="flex items-center">
                            Name
                            <SortIcon field="names" />
                          </div>
                        </th>
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('numbers')}
                        >
                          <div className="flex items-center">
                            Number
                            <SortIcon field="numbers" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('transactions')}
                        >
                          <div className="flex items-center justify-end">
                            Transactions
                            <SortIcon field="transactions" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center justify-end">
                            Total Amount
                            <SortIcon field="amount" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTill.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.names || 'Unknown'}</td>
                          <td className="p-2">{item.numbers || 'N/A'}</td>
                          <td className="text-right p-2">{item.receipt_count || item['Receipt No.'] || 0}</td>
                          <td className="text-right p-2 font-semibold">KES {(item.amount || item.max_amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No Till No transaction data available</div>
              )}
            </TabsContent>

            <TabsContent value="sendmoney">
              {detailedTransactions?.topSendMoney && detailedTransactions.topSendMoney.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('names')}
                        >
                          <div className="flex items-center">
                            Name
                            <SortIcon field="names" />
                          </div>
                        </th>
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('numbers')}
                        >
                          <div className="flex items-center">
                            Number
                            <SortIcon field="numbers" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('transactions')}
                        >
                          <div className="flex items-center justify-end">
                            Transactions
                            <SortIcon field="transactions" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center justify-end">
                            Total Amount
                            <SortIcon field="amount" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSendMoney.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.names || 'Unknown'}</td>
                          <td className="p-2">{item.numbers || 'N/A'}</td>
                          <td className="text-right p-2">{item.receipt_count || item['Receipt No.'] || 0}</td>
                          <td className="text-right p-2 font-semibold">KES {(item.amount || item.max_amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No Send Money transaction data available</div>
              )}
            </TabsContent>

            <TabsContent value="customer">
              {detailedTransactions?.topCustomer && detailedTransactions.topCustomer.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('names')}
                        >
                          <div className="flex items-center">
                            Name
                            <SortIcon field="names" />
                          </div>
                        </th>
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('numbers')}
                        >
                          <div className="flex items-center">
                            Number
                            <SortIcon field="numbers" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('transactions')}
                        >
                          <div className="flex items-center justify-end">
                            Transactions
                            <SortIcon field="transactions" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center justify-end">
                            Total Amount
                            <SortIcon field="amount" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCustomer.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.names || 'Unknown'}</td>
                          <td className="p-2">{item.numbers || 'N/A'}</td>
                          <td className="text-right p-2">{item['Receipt No.'] || item.receipt_count || 0}</td>
                          <td className="text-right p-2 font-semibold text-green-600">KES {(item.amount || item.max_amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No Customer Deposit transaction data available</div>
              )}
            </TabsContent>

            <TabsContent value="withdrawals">
              {detailedTransactions?.topWithdrawals && detailedTransactions.topWithdrawals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('names')}
                        >
                          <div className="flex items-center">
                            Name
                            <SortIcon field="names" />
                          </div>
                        </th>
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('numbers')}
                        >
                          <div className="flex items-center">
                            Number
                            <SortIcon field="numbers" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('transactions')}
                        >
                          <div className="flex items-center justify-end">
                            Transactions
                            <SortIcon field="transactions" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center justify-end">
                            Total Amount
                            <SortIcon field="amount" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedWithdrawals.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.names || 'Unknown'}</td>
                          <td className="p-2">{item.numbers || 'N/A'}</td>
                          <td className="text-right p-2">{item['Receipt No.'] || item.receipt_count || 0}</td>
                          <td className="text-right p-2 font-semibold text-red-600">KES {(item.amount || item.max_amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No withdrawal transaction data available</div>
              )}
            </TabsContent>

            <TabsContent value="received">
              {detailedTransactions?.topReceived && detailedTransactions.topReceived.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('names')}
                        >
                          <div className="flex items-center">
                            Name
                            <SortIcon field="names" />
                          </div>
                        </th>
                        <th 
                          className="text-left p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('numbers')}
                        >
                          <div className="flex items-center">
                            Number
                            <SortIcon field="numbers" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('transactions')}
                        >
                          <div className="flex items-center justify-end">
                            Transactions
                            <SortIcon field="transactions" />
                          </div>
                        </th>
                        <th 
                          className="text-right p-2 cursor-pointer hover:bg-gray-50 select-none"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center justify-end">
                            Total Amount
                            <SortIcon field="amount" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedReceived.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.names || 'Unknown'}</td>
                          <td className="p-2">{item.numbers || 'N/A'}</td>
                          <td className="text-right p-2">{item['Receipt No.'] || item.receipt_count || 0}</td>
                          <td className="text-right p-2 font-semibold text-green-600">KES {(item.amount || item.max_amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No Received Money transaction data available</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDashboard;