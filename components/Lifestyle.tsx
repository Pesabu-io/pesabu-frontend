'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  PiggyBank,
  Dice6,
  Loader2,
  AlertCircle,
  BarChart3,
  PieChart,
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
} from 'recharts';

interface CategoryStats {
  total_transactions: string | number;
  average_transactions_per_month: string | number;
  total_tranasacted_amount: string | number;
  highest_transacted_amount: string | number;
  minimum_transacted_amount: string | number;
  average_transacted_amount: string | number;
}

interface LifestyleData {
  betting?: CategoryStats;
  savings?: CategoryStats;
  shopping?: CategoryStats;
}

const toNum = (val: string | number | undefined): number =>
  parseFloat(val?.toString() || '0');

const Lifestyle = () => {
  const [data, setData] = useState<LifestyleData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLifestyleData();
  }, []);

  const fetchLifestyleData = async () => {
    setIsLoading(true);
    setError(null);

    // Helper: fetch with retry + timeout
    const fetchWithRetry = async (
      endpoint: string,
      retries = 3
    ): Promise<Response | null> => {
      for (let i = 0; i < retries; i++) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);
          const response = await fetch(`${server}${endpoint}`, {
            signal: controller.signal,
            credentials: 'include',
          });
          clearTimeout(timeout);
          return response;
        } catch (_err) {
          if (i < retries - 1) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (i + 1))
            );
          }
        }
      }
      return null;
    };

    try {
      const endpoints = [
        'betting_summary_stats/',
        'saving_summary_stats/',
        'shopping_summary_stats/',
      ];
      const results: (unknown)[] = [];

      for (const endpoint of endpoints) {
        console.log(`⏳ Fetching lifestyle endpoint: ${endpoint}`);
        const response = await fetchWithRetry(endpoint);

        if (response) {
          try {
            if (!response.ok) {
              const errorText = await response.text();
              console.error(
                `❌ Endpoint ${endpoint} failed with status ${response.status}:`,
                errorText
              );
              results.push(null);
            } else {
              const json = await response.json();
              console.log(`✅ Lifestyle endpoint ${endpoint} succeeded`);
              results.push(json);
            }
          } catch (parseErr) {
            console.error(
              `❌ Error parsing JSON from ${endpoint}:`,
              parseErr instanceof Error ? parseErr.message : parseErr
            );
            results.push(null);
          }
        } else {
          results.push(null);
        }

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      type ApiResult = { message?: string; data?: CategoryStats } & Partial<CategoryStats> | null;
      const [bettingData, savingsData, shoppingData] = results as ApiResult[];

      setData({
        betting:
          bettingData && !bettingData.message ? bettingData.data ?? bettingData : undefined,
        savings:
          savingsData && !savingsData.message ? savingsData.data ?? savingsData : undefined,
        shopping:
          shoppingData && !shoppingData.message ? shoppingData.data ?? shoppingData : undefined,
      });
    } catch (err) {
      console.error('Error fetching lifestyle data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch lifestyle data'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading lifestyle data...</p>
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
                onClick={fetchLifestyleData}
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

  const lifestyleComparisonData = [
    {
      name: 'Betting',
      value: toNum(data.betting?.total_tranasacted_amount),
      color: '#ef4444',
      transactions: toNum(data.betting?.total_transactions),
    },
    {
      name: 'Savings',
      value: toNum(data.savings?.total_tranasacted_amount),
      color: '#10b981',
      transactions: toNum(data.savings?.total_transactions),
    },
    {
      name: 'Shopping',
      value: toNum(data.shopping?.total_tranasacted_amount),
      color: '#3b82f6',
      transactions: toNum(data.shopping?.total_transactions),
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lifestyle Analytics</h1>
          <p className="text-muted-foreground">
            Track your spending patterns across different lifestyle categories
          </p>
        </div>
        <button
          onClick={fetchLifestyleData}
          className="p-2 rounded-md bg-muted hover:bg-muted/80"
          aria-label="Refresh data"
        >
          <Loader2 className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Betting Card */}
        <Card
          className={`overflow-hidden border-t-4 ${
            data.betting ? 'border-t-red-500' : 'border-t-gray-300'
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Dice6
                    className={`h-5 w-5 ${
                      data.betting ? 'text-red-500' : 'text-gray-400'
                    }`}
                  />
                  <h3 className="font-medium">Betting</h3>
                </div>
                {data.betting ? (
                  <>
                    <p className="text-3xl font-bold mt-2">
                      KES{' '}
                      {toNum(
                        data.betting.total_tranasacted_amount
                      ).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.betting.total_transactions} transactions
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-2">
                    No betting data found
                  </p>
                )}
              </div>
              {data.betting && (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700"
                >
                  ~{toNum(data.betting.average_transacted_amount).toFixed(0)}{' '}
                  KES avg
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Savings Card */}
        <Card
          className={`overflow-hidden border-t-4 ${
            data.savings ? 'border-t-green-500' : 'border-t-gray-300'
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <PiggyBank
                    className={`h-5 w-5 ${
                      data.savings ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                  <h3 className="font-medium">Savings</h3>
                </div>
                {data.savings ? (
                  <>
                    <p className="text-3xl font-bold mt-2">
                      KES{' '}
                      {toNum(
                        data.savings.total_tranasacted_amount
                      ).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.savings.total_transactions} transactions
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-2">
                    No savings data found
                  </p>
                )}
              </div>
              {data.savings && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700"
                >
                  ~{toNum(data.savings.average_transacted_amount).toFixed(0)}{' '}
                  KES avg
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shopping Card */}
        <Card
          className={`overflow-hidden border-t-4 ${
            data.shopping ? 'border-t-blue-500' : 'border-t-gray-300'
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingCart
                    className={`h-5 w-5 ${
                      data.shopping ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  />
                  <h3 className="font-medium">Shopping</h3>
                </div>
                {data.shopping ? (
                  <>
                    <p className="text-3xl font-bold mt-2">
                      KES{' '}
                      {toNum(
                        data.shopping.total_tranasacted_amount
                      ).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.shopping.total_transactions} transactions
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-2">
                    No shopping data found
                  </p>
                )}
              </div>
              {data.shopping && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700"
                >
                  ~{toNum(data.shopping.average_transacted_amount).toFixed(0)}{' '}
                  KES avg
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {lifestyleComparisonData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Lifestyle Spending Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={lifestyleComparisonData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {lifestyleComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `KES ${Number(value).toLocaleString()}`
                      }
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Count Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Transaction Count Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lifestyleComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="transactions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="betting">
            <TabsList className="mb-4">
              <TabsTrigger value="betting" className="flex items-center gap-2">
                <Dice6 className="h-4 w-4 text-red-500" />
                Betting
              </TabsTrigger>
              <TabsTrigger value="savings" className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-green-500" />
                Savings
              </TabsTrigger>
              <TabsTrigger
                value="shopping"
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                Shopping
              </TabsTrigger>
            </TabsList>

            {/* Betting Details */}
            <TabsContent value="betting">
              {data.betting ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Highest Amount
                    </p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.betting.highest_transacted_amount
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Lowest Amount
                    </p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.betting.minimum_transacted_amount
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Avg per Month
                    </p>
                    <p className="font-bold">
                      {toNum(
                        data.betting.average_transactions_per_month
                      ).toFixed(1)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Dice6 className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg Amount</p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.betting.average_transacted_amount
                      ).toFixed(0)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No betting data available
                </div>
              )}
            </TabsContent>

            {/* Savings Details */}
            <TabsContent value="savings">
              {data.savings ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Highest Amount
                    </p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.savings.highest_transacted_amount
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Lowest Amount
                    </p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.savings.minimum_transacted_amount
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Avg per Month
                    </p>
                    <p className="font-bold">
                      {toNum(
                        data.savings.average_transactions_per_month
                      ).toFixed(1)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <PiggyBank className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg Amount</p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.savings.average_transacted_amount
                      ).toFixed(0)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No savings data available
                </div>
              )}
            </TabsContent>

            {/* Shopping Details */}
            <TabsContent value="shopping">
              {data.shopping ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Highest Amount
                    </p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.shopping.highest_transacted_amount
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Lowest Amount
                    </p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.shopping.minimum_transacted_amount
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Avg per Month
                    </p>
                    <p className="font-bold">
                      {toNum(
                        data.shopping.average_transactions_per_month
                      ).toFixed(1)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg Amount</p>
                    <p className="font-bold">
                      KES{' '}
                      {toNum(
                        data.shopping.average_transacted_amount
                      ).toFixed(0)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No shopping data available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Lifestyle;
