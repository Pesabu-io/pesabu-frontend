import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Repeat, 
  TrendingUp, 
  Loader2,
  AlertCircle 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// TypeScript interfaces
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

const TransactionDashboard = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [
          transTypeRes,
          totalReceivedRes,
          totalWithdrawnRes,
          withdrawalCountRes,
          depositCountRes,
          topDepositRes,
          lowestDepositRes,
          topWithdrawalRes,
          lowestWithdrawalRes
        ] = await Promise.all([
          fetch('http://127.0.0.1:8000/transaction_module/trans_type/'),
          fetch('http://127.0.0.1:8000/transaction_module/total_recieved/'),
          fetch('http://127.0.0.1:8000/transaction_module/total_withdrawn/'),
          fetch('http://127.0.0.1:8000/transaction_module/withdrawal_count/'),
          fetch('http://127.0.0.1:8000/transaction_module/deposit_count/'),
          fetch('http://127.0.0.1:8000/transaction_module/top_deposit/'),
          fetch('http://127.0.0.1:8000/transaction_module/lowest_deposit/'),
          fetch('http://127.0.0.1:8000/transaction_module/top_withdrawal/'),
          fetch('http://127.0.0.1:8000/transaction_module/lowest_withdrawal/')
        ]);

        const transTypeData = await transTypeRes.json();
        const totalReceived = await totalReceivedRes.json();
        const totalWithdrawn = await totalWithdrawnRes.json();
        const withdrawalCount = await withdrawalCountRes.json();
        const depositCount = await depositCountRes.json();
        const topDeposit = await topDepositRes.json();
        const lowestDeposit = await lowestDepositRes.json();
        const topWithdrawal = await topWithdrawalRes.json();
        const lowestWithdrawal = await lowestWithdrawalRes.json();

        setTransTypes({
          data: transTypeData,
          isLoading: false,
          error: null,
        });

        setSummary({
          data: {
            total_received: totalReceived.total,
            total_withdrawn: totalWithdrawn.total,
            withdrawal_count: withdrawalCount.no_of_withdrawals,
            deposit_count: depositCount.number_of_deposits,
            top_deposit: topDeposit.highest_receoved_amount,
            lowest_deposit: lowestDeposit.lowest_amount_received,
            top_withdrawal: topWithdrawal.highest_withdrawn_amount,
            lowest_withdrawal: lowestWithdrawal.lowest_withdrawn_amount,
          },
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setTransTypes(prev => ({ ...prev, isLoading: false, error: 'Failed to fetch data' }));
        setSummary(prev => ({ ...prev, isLoading: false, error: 'Failed to fetch data' }));
      }
    };

    fetchData();
  }, []);

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

  const summaryData = [
    {
      title: "Total Received",
      value: `KES ${summary.data?.total_received.toLocaleString() || '0'}`,
      change: `${summary.data?.deposit_count || 0} deposits`,
      icon: <ArrowUpRight className="h-4 w-4 text-green-500" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Withdrawn",
      value: `KES ${summary.data?.total_withdrawn.toLocaleString() || '0'}`,
      change: `${summary.data?.withdrawal_count || 0} withdrawals`,
      icon: <ArrowDownRight className="h-4 w-4 text-red-500" />,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Highest Transaction",
      value: `KES ${Math.max(
        summary.data?.top_deposit || 0,
        summary.data?.top_withdrawal || 0
      ).toLocaleString()}`,
      change: "Highest amount",
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Transactions",
      value: (summary.data?.withdrawal_count || 0) + (summary.data?.deposit_count || 0),
      change: "All transactions",
      icon: <Repeat className="h-4 w-4 text-purple-500" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  // Data for pie chart
  const pieData = [
    { name: 'Deposits', value: summary.data?.deposit_count || 0 },
    { name: 'Withdrawals', value: summary.data?.withdrawal_count || 0 },
  ];

  const COLORS = ['#16a34a', '#dc2626'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transaction Summary</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{item.title}</span>
                <div className={`p-2 rounded-full ${item.bgColor}`}>{item.icon}</div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </span>
                <span className={`text-sm ${item.textColor} flex items-center`}>
                  {item.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Extremes */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Extremes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Highest Deposit</p>
                <p className="text-2xl font-semibold">
                  KES {summary.data?.top_deposit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lowest Deposit</p>
                <p className="text-2xl font-semibold">
                  KES {summary.data?.lowest_deposit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Highest Withdrawal</p>
                <p className="text-2xl font-semibold">
                  KES {summary.data?.top_withdrawal.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Lowest Withdrawal</p>
                <p className="text-2xl font-semibold">
                  KES {summary.data?.lowest_withdrawal.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDashboard;