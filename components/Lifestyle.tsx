import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wallet, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { server } from "@/utils/util";

// TypeScript interfaces
interface BettingSummaryStats {
  total_transactions: string;
  average_transactions_per_month: string;
  total_tranasacted_amount: string;
  highest_transacted_amount: string;
  minimum_transacted_amount: string;
  average_transacted_amount: string;
}

interface SavingSummaryStats {
  message: string;
}

interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const LifestyleDashboard = () => {
  // State management with TypeScript
  const [bettingStats, setBettingStats] = useState<ApiResponse<BettingSummaryStats>>({
    data: null,
    isLoading: true,
    error: null,
  });
  const [savingStats, setSavingStats] = useState<ApiResponse<SavingSummaryStats>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchLifestyleData = async () => {
      try {
        // Fetch betting stats
        const bettingResponse = await fetch(`${server}/lifestyle_module/betting_summary_stats/`);
        const bettingData = await bettingResponse.json();
        setBettingStats({
          data: bettingData,
          isLoading: false,
          error: null,
        });

        // Fetch saving stats
        const savingResponse = await fetch(`${server}/lifestyle_module/saving_summary_stats/`);
        const savingData = await savingResponse.json();
        setSavingStats({
          data: savingData,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setBettingStats(prev => ({ ...prev, isLoading: false, error: `Failed to fetch betting data: ${errorMessage}` }));
        setSavingStats(prev => ({ ...prev, isLoading: false, error: `Failed to fetch saving data: ${errorMessage}` }));
      }
    };

    fetchLifestyleData();
  }, []);

  // Sample data for the chart (you can modify this based on actual data patterns)
  const monthlyData = [
    { month: 'Jan', betting: 0, savings: 0 },
    { month: 'Feb', betting: 0, savings: 0 },
    { month: 'Mar', betting: 0, savings: 0 },
  ];

  if (bettingStats.isLoading || savingStats.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading lifestyle data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lifestyle Analytics</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Betting Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">
                  {bettingStats.data?.total_transactions || "0"}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">
                  KES {parseFloat(bettingStats.data?.total_tranasacted_amount || "0").toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Average</p>
                <p className="text-2xl font-bold">
                  {parseFloat(bettingStats.data?.average_transactions_per_month || "0").toFixed(1)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Amount</p>
                <p className="text-2xl font-bold">
                  KES {parseFloat(bettingStats.data?.average_transacted_amount || "0").toLocaleString()}
                </p>
              </div>
              <PiggyBank className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="betting" fill="#2563eb" name="Betting" />
                <Bar dataKey="savings" fill="#16a34a" name="Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      <div className="space-y-4">
        {savingStats.data?.message && (
          <Alert>
            <AlertTitle className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Savings Status
            </AlertTitle>
            <AlertDescription>
              {savingStats.data.message}
            </AlertDescription>
          </Alert>
        )}

        {(bettingStats.error || savingStats.error) && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {bettingStats.error || savingStats.error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LifestyleDashboard;