import React, { useState } from 'react';
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
  PieChart as PieChartIcon
} from "lucide-react";
import { SummaryCard } from './SummaryCard';
import { TransactionDistribution } from './TransactionDistribution';
import { TransactionHealth } from './TransactionHealth';
import { useTransactionData } from '@/hooks/useTransactionData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';

const TransactionDashboard = () => {
  const { transTypes, summary, insights } = useTransactionData();
  const [timeRange, setTimeRange] = useState("30");
  const [chartView, setChartView] = useState("volume");

  // Mock time series data for demonstration
  const mockTimeSeriesData = [
    { date: '03/01', deposits: 1200, withdrawals: 900, net: 300 },
    { date: '03/02', deposits: 1400, withdrawals: 1100, net: 300 },
    { date: '03/03', deposits: 1300, withdrawals: 950, net: 350 },
    { date: '03/04', deposits: 1500, withdrawals: 1200, net: 300 },
    { date: '03/05', deposits: 1700, withdrawals: 1400, net: 300 },
    { date: '03/06', deposits: 1600, withdrawals: 1300, net: 300 },
    { date: '03/07', deposits: 1800, withdrawals: 1600, net: 200 },
  ];

  // Mock transaction size distribution for demonstration
  const transactionSizeBuckets = [
    { name: '0-1K', deposits: 142, withdrawals: 98 },
    { name: '1K-5K', deposits: 205, withdrawals: 178 },
    { name: '5K-10K', deposits: 125, withdrawals: 104 },
    { name: '10K-50K', deposits: 87, withdrawals: 95 },
    { name: '50K+', deposits: 23, withdrawals: 15 },
  ];

  // Mock time distribution data
  const timeDistribution = [
    { name: 'Morning (6-12)', transactions: 285, value: 1250000 },
    { name: 'Afternoon (12-17)', transactions: 376, value: 1580000 },
    { name: 'Evening (17-22)', transactions: 423, value: 1920000 },
    { name: 'Night (22-6)', transactions: 198, value: 750000 },
  ];

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
      change: insights?.netFlow > 0 ? 
        `+${((insights.netFlow / insights.totalTransactions) * 100).toFixed(1)}% positive` : 
        `${((insights.netFlow / insights.totalTransactions) * 100).toFixed(1)}% negative`,
      icon: insights?.netFlow > 0 ? 
        <TrendingUp className="h-4 w-4 text-emerald-500" /> : 
        <TrendingDown className="h-4 w-4 text-red-500" />,
      bgColor: insights?.netFlow > 0 ? "bg-emerald-50" : "bg-red-50",
      textColor: insights?.netFlow > 0 ? "text-emerald-600" : "text-red-600",
    },
    {
      title: "Average Transaction Size",
      value: `KES ${insights?.avgTransactionSize.toLocaleString()}`,
      change: `${insights?.avgTransactionSize > 5000 ? 'Above' : 'Below'} market avg`,
      icon: <ArrowUpDown className="h-4 w-4 text-blue-500" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Transaction Volume",
      value: insights?.totalTransactions || 0,
      change: `${((insights?.totalTransactions / 30) || 0).toFixed(1)}/day`,
      icon: <Repeat className="h-4 w-4 text-purple-500" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Retention Rate",
      value: `${insights?.retentionRate.toFixed(1)}%`,
      change: insights?.retentionRate > 85 ? "Healthy" : "Needs attention",
      icon: <Percent className="h-4 w-4 text-orange-500" />,
      bgColor: "bg-orange-50",
      textColor: insights?.retentionRate > 85 ? "text-green-600" : "text-orange-600",
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
            <CardDescription>Daily transaction patterns for the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'volume' ? (
                  <LineChart data={mockTimeSeriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="deposits" stroke="#16a34a" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="withdrawals" stroke="#dc2626" />
                    <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeDasharray="5 5" />
                  </LineChart>
                ) : (
                  <BarChart data={transactionSizeBuckets}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deposits" name="Deposits" fill="#16a34a" />
                    <Bar dataKey="withdrawals" name="Withdrawals" fill="#dc2626" />
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
                        style={{ width: `${(summary.data?.total_received / (summary.data?.total_received + summary.data?.total_withdrawn) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>{Math.round(summary.data?.total_received / (summary.data?.total_received + summary.data?.total_withdrawn) * 100)}% Deposits</span>
                      <span>{Math.round(summary.data?.total_withdrawn / (summary.data?.total_received + summary.data?.total_withdrawn) * 100)}% Withdrawals</span>
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
              {timeDistribution.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">{item.transactions} transactions</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${(item.transactions / timeDistribution.reduce((sum, i) => sum + i.transactions, 0) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="text-sm font-medium mb-2">Peak transaction time: 6:00 PM - 8:00 PM</div>
              <div className="text-xs text-muted-foreground">
                Consider optimizing system resources during peak hours to ensure smooth transaction processing
              </div>
            </div>
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
                    {Math.round(summary.data?.deposit_count * 0.22)} transactions processed
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
                  <div className="text-2xl font-bold">{Math.round(insights?.totalTransactions / 30 / 24 * 1.5)} / hour</div>
                  <div className="text-xs text-muted-foreground">
                    Average transaction processing rate
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Strategic Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-medium">Transaction Health</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {insights?.retentionRate > 85 
                  ? "Strong retention rate of " + insights?.retentionRate.toFixed(1) + "% indicates excellent platform trust. Consider implementing loyalty rewards to maintain this momentum."
                  : "Current retention rate of " + insights?.retentionRate.toFixed(1) + "% needs improvement. We recommend implementing trust-building measures and investigating withdrawal friction points."}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-full">
                  <PieChartIcon className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="font-medium">Usage Patterns</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {`Daily transaction volume of ${(insights?.totalTransactions / 30).toFixed(1)} 
                with deposit-to-withdrawal ratio of ${(insights?.depositFrequency / insights?.withdrawalFrequency).toFixed(1)} indicates 
                ${Number(insights?.depositFrequency) > 55 ? 'strong platform growth' : 'stable platform usage'}. 
                ${Number(insights?.depositFrequency) > 60 ? 'Consider introducing automatic savings features to capitalize on deposit behavior.' : 'Focus on increasing deposit frequency with targeted incentives.'}`}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="font-medium">Value Optimization</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {summary?.data ? `Transaction sizes ranging from KES ${summary.data.lowest_deposit} to 
                KES ${summary.data.top_deposit} present an opportunity to optimize for ${insights?.avgTransactionSize > 5000 ? 'high-value transactions' : 'transaction volume'}. 
                ${insights?.avgTransactionSize > 5000 ? 'Focus on enhancing VIP services for your high-value customers.' : 'Consider implementing tiered transaction fees to encourage larger deposits.'}`
                : "Transaction size data not available."}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="text-sm font-medium">Anomaly Detection</div>
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  {`There ${insights?.withdrawalFrequency > 45 ? 'is' : 'are no'} unusual withdrawal pattern${insights?.withdrawalFrequency > 45 ? 's' : 's'} detected in the last ${timeRange} days.`}
                  {insights?.withdrawalFrequency > 45 ? ' We recommend investigating the recent increase in withdrawal frequency.' : ' All transaction patterns are within normal parameters.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDashboard;