'use client'

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,  } from 'recharts';
import { Clock, TrendingUp, ArrowUpCircle, ArrowDownCircle, Wallet, CreditCard, Building, ArrowRightLeft, Activity, CheckCircle2, AlertCircle,  } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import InsightsTabContent from "./InsightsTabContent";
import { useFinancialInstitutionsData } from "@/hooks/useFinancialInstitutionsData";


const FinancialInstitutions: React.FC = () => {



  const { data, isLoading, error,  } = useFinancialInstitutionsData();
  

  if (isLoading && !data) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading dashboard data...</div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-red-500 flex items-center justify-center">
      <div>Error loading dashboard: {error}</div>
    </div>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];


    // Helper function to calculate bank usage trends
    const calculateBankTrends = () => {
      const transactions = data.safaricomServices?.transactions || [];
      const bankFrequency: { [key: string]: number } = {};
      
      transactions.forEach(tx => {
        if (tx.Bank) {
          bankFrequency[tx.Bank] = (bankFrequency[tx.Bank] || 0) + 1;
        }
      });
  
      return Object.entries(bankFrequency)
        .map(([bank, count]) => ({ bank, count }))
        .sort((a, b) => b.count - a.count);
    };
  
    // Helper function to get transaction success rate
    const getTransactionSuccessRate = () => {
      const transactions = data.safaricomServices?.transactions || [];
      const total = transactions.length;
      const successful = transactions.filter(tx => tx["Paid In"] > 0 || tx["Withdrawn"] > 0).length;
      return total ? Math.round((successful / total) * 100) : 0;
    };


     // New component for Financial Health Score
  const FinancialHealthScore = () => {
    const calculateScore = () => {
      let score = 0;
      
      // Factor 1: Fuliza loan management
      const fulizaMetrics = data.fulizaMetrics;
      if (fulizaMetrics) {
        if (fulizaMetrics.total_loan_balance >= 0) score += 25;
        if (fulizaMetrics.total_loan_paid_back_amount > fulizaMetrics.total_loan_disbursed_amount) score += 15;
      }

      // Factor 2: Transaction diversity
      const bankTrends = calculateBankTrends();
      if (bankTrends.length >= 3) score += 20;

      // Factor 3: Regular income
      const receivedMetrics = data.receivedMetrics;
      if (receivedMetrics && receivedMetrics.total_amount_received > 0) score += 20;

      // Factor 4: Transaction success rate
      const successRate = getTransactionSuccessRate();
      if (successRate > 90) score += 20;

      return score;
    };

    const score = calculateScore();
    const getHealthStatus = (score: number) => {
      if (score >= 80) return { text: 'Excellent', color: 'text-green-500' };
      if (score >= 60) return { text: 'Good', color: 'text-blue-500' };
      if (score >= 40) return { text: 'Fair', color: 'yellow-500' };
      return { text: 'Needs Improvement', color: 'text-red-500' };
    };

    const status = getHealthStatus(score);

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Financial Health Score
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold">{score}/100</div>
          <div className={`text-lg font-semibold ${status.color}`}>{status.text}</div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-600">Key Factors:</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Loan Management</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Transaction Diversity</span>
            </div>
          </div>
        </div>
      </Card>
    );
  };

    // New component for Transaction Insights
    const TransactionInsights = () => {
      const insights = [
        {
          title: "Most Active Time",
          value: "2-4 PM",
          icon: <Clock className="h-5 w-5" />,
          trend: "+15% vs last month"
        },
        {
          title: "Preferred Bank",
          value: calculateBankTrends()[0]?.bank || "N/A",
          icon: <Building className="h-5 w-5" />,
          trend: "Used in 45% of transactions"
        },
        {
          title: "Success Rate",
          value: `${getTransactionSuccessRate()}%`,
          icon: <CheckCircle2 className="h-5 w-5" />,
          trend: "↑ 5% improvement"
        }
      ];
  
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {insight.icon}
                <h4 className="font-semibold">{insight.title}</h4>
              </div>
              <div className="text-2xl font-bold mb-1">{insight.value}</div>
              <div className="text-sm text-gray-600">{insight.trend}</div>
            </Card>
          ))}
        </div>
      );
    };

      // New component for Risk Alerts
  const RiskAlerts = () => {
    const fulizaMetrics = data.fulizaMetrics;
    const alerts = [];

    if (fulizaMetrics && fulizaMetrics.total_loan_balance > 0) {
      alerts.push({
        title: "Outstanding Fuliza Balance",
        description: `You have KES ${fulizaMetrics.total_loan_balance.toLocaleString()} pending. Consider clearing this soon.`
      });
    }

    if (getTransactionSuccessRate() < 90) {
      alerts.push({
        title: "Transaction Success Rate Below Target",
        description: "Your transaction success rate is below 90%. This might indicate some failed transactions."
      });
    }

    return alerts.length > 0 ? (
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <Alert key={index}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </Alert>
        ))}
      </div>
    ) : null;
  };
  
  const TransactionsTab = () => (

    <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building className="h-5 w-5" />
          Recent  Transactions
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.safaricomServices?.transactions?.slice(0, 5).map((tx, index) => (
              <TableRow key={index}>
                <TableCell>{tx.Bank || 'N/A'}</TableCell>
                <TableCell className={tx["Paid In"] > 0 ? 'text-green-600' : 'text-red-600'}>
                  KES {Math.abs(tx["Paid In"] || tx["Withdrawn"] || 0).toLocaleString()}
                </TableCell>
                <TableCell>{tx.Transaction_Type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Transaction Statistics
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Total Transactions Value</p>
            <p className="text-2xl font-bold">
              KES {(data.receivedMetrics?.total_amount_received + (data.sentMetrics?.total_amount_sent || 0)).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Largest Transaction</p>
            <p className="text-2xl font-bold">
              KES {Math.max(
                data.receivedMetrics?.highest_amount_received || 0,
                data.sentMetrics?.highest_amount_sent || 0
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { name: 'Received', amount: data.receivedMetrics?.total_amount_received || 0 },

              { name: 'Sent', amount: data.sentMetrics?.total_amount_sent || 0 }
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
    </div>
);

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="digital">Digital Banking</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>

        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Money Flow Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Received</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    KES {data.receivedMetrics?.total_amount_received.toLocaleString()}
                  </p>
                </div>
                <ArrowUpCircle className="text-green-500 h-8 w-8" />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div>Highest: KES {data.receivedMetrics?.highest_amount_received.toLocaleString()} ({data.receivedMetrics?.highest_amount_bank})</div>
                <div>Lowest: KES {data.receivedMetrics?.lowest_amount_received.toLocaleString()} ({data.receivedMetrics?.lowest_amount_bank})</div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Sent</h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    KES {data.sentMetrics?.total_amount_sent.toLocaleString()}
                  </p>
                </div>
                <ArrowDownCircle className="text-red-500 h-8 w-8" />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div>Highest: KES {data.sentMetrics?.highest_amount_sent.toLocaleString()} ({data.sentMetrics?.highest_amount_bank})</div>
                <div>Lowest: KES {data.sentMetrics?.lowest_amount_sent.lowest_sent_amount.toLocaleString()} ({data.sentMetrics?.lowest_amount_bank})</div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Net Flow</h3>
                  <p className={`text-3xl font-bold mt-2 ${
                    (data.receivedMetrics?.total_amount_received || 0) - (data.sentMetrics?.total_amount_sent || 0) > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                  }`}>
                    KES {((data.receivedMetrics?.total_amount_received || 0) - (data.sentMetrics?.total_amount_sent || 0)).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="text-blue-500 h-8 w-8" />
              </div>
            </Card>
          </div>

          {/* Bank Rankings */}
                   {/* Updated Bank Rankings */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Banks by Received Transactions</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topReceived?.top_five_banks.map(item => ({
                        name: item.bank,
                        value: item.count
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {data.topReceived?.top_five_banks.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Banks by Sent Transactions</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topSent?.top_five_banks.map(item => ({
                        name: item.bank,
                        value: item.count
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {data.topSent?.top_five_banks.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            </div>
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>

        <TabsContent value="digital" className="space-y-6">
          {/* Fuliza Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Fuliza Loan Summary</h3>
              <CreditCard className="text-blue-500 h-6 w-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Total Loans</div>
                <div className="text-2xl font-bold">{data.fulizaMetrics?.total_loan_count}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Total Disbursed</div>
                <div className="text-2xl font-bold text-green-600">
                  KES {data.fulizaMetrics?.total_loan_disbursed_amount.toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Total Paid Back</div>
                <div className="text-2xl font-bold text-blue-600">
                  KES {data.fulizaMetrics?.total_loan_paid_back_amount.toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Highest Loan</div>
                <div className="text-2xl font-bold">
                  KES {data.fulizaMetrics?.highest_loan_disbursed.toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Last Borrowed</div>
                <div className="text-2xl font-bold">
                  KES {data.fulizaMetrics?.last_amount_borrowed.toLocaleString()}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Current Balance</div>
                <div className={`text-2xl font-bold ${data.fulizaMetrics?.total_loan_balance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  KES {Math.abs(data.fulizaMetrics?.total_loan_balance || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Fuliza Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Fuliza Transactions</h3>
              <Wallet className="text-blue-500 h-6 w-6" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.fulizaTransactions?.slice(0, 5).map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(tx["Completion Time"]).toLocaleString()}</TableCell>
                    <TableCell className="max-w-md truncate">{tx.Details}</TableCell>
                    <TableCell className={tx["Paid In"] > 0 ? 'text-green-600' : 'text-red-600'}>
                      KES {(tx["Paid In"] || tx["Withdrawn"]).toLocaleString()}
                    </TableCell>
                    <TableCell>{tx.Transaction_Type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

              <TabsContent value="insights" className="space-y-6">
              <FinancialHealthScore />
      
              <InsightsTabContent 
    calculateBankTrends={calculateBankTrends}
    getTransactionSuccessRate={getTransactionSuccessRate}
    FinancialHealthScore={FinancialHealthScore}
    TransactionInsights={TransactionInsights}
    RiskAlerts={RiskAlerts}
  />

      <TransactionInsights />
      <RiskAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialInstitutions;