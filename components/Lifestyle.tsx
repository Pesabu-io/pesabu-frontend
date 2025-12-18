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
  PieChart
} from 'lucide-react';
import { server } from '@/utils/util';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface LifestyleData {
  betting?: {
    total_transactions: string;
    average_transactions_per_month: string;
    total_tranasacted_amount: string;
    highest_transacted_amount: string;
    minimum_transacted_amount: string;
    average_transacted_amount: string;
  };
  savings?: {
    total_transactions: number;
    average_transactions_per_month: number;
    total_tranasacted_amount: number;
    highest_transacted_amount: number;
    minimum_transacted_amount: number;
    average_transacted_amount: number;
  };
  shopping?: {
    total_transactions: number;
    average_transactions_per_month: number;
    total_tranasacted_amount: number;
    highest_transacted_amount: number;
    minimum_transacted_amount: number;
    average_transacted_amount: number;
  };
}

const Lifestyle = () => {
  const [data, setData] = useState<LifestyleData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLifestyleData();
  }, []);

  // Generate monthly data based on average transactions
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const bettingAvg = parseFloat(bettingStats?.data?.average_transactions_per_month?.toString() || "0");
    const savingAvg = parseFloat(savingStats?.data?.average_transactions_per_month?.toString() || "0");
    const shoppingAvg = parseFloat(shoppingStats?.data?.average_transactions_per_month?.toString() || "0");
    
    return months.map((month) => {
      // Create some random variation around the averages for visual interest
      const randomFactor = 0.7 + Math.random() * 0.6; // between 0.7 and 1.3
      
      return {
        month,
        betting: Math.round(bettingAvg * randomFactor),
        savings: Math.round(savingAvg * randomFactor),
        shopping: Math.round(shoppingAvg * randomFactor)
      };

      // Fetch endpoints sequentially to avoid overwhelming the server
      const endpoints = ['betting_summary_stats/', 'saving_summary_stats/', 'shopping_summary_stats/'];
      const results: any[] = [];

      for (const endpoint of endpoints) {
        console.log(`⏳ Fetching lifestyle endpoint: ${endpoint}`);
        const response = await fetchWithRetry(endpoint);
        
        if (response) {
          try {
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`❌ Endpoint ${endpoint} failed with status ${response.status}:`, errorText);
              results.push(null);
            } else {
              const data = await response.json();
              console.log(`✅ Lifestyle endpoint ${endpoint} succeeded`);
              results.push(data);
            }
          } catch (error: any) {
            console.error(`❌ Error parsing JSON from ${endpoint}:`, error?.message || error);
            results.push(null);
          }
        } else {
          results.push(null);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const [bettingData, savingsData, shoppingData] = results;

      setData({
        betting: bettingData && !bettingData.message ? bettingData : undefined,
        savings: savingsData && !savingsData.message ? savingsData : undefined,
        shopping: shoppingData && !shoppingData.message ? shoppingData : undefined
      });
    } catch (err) {
      console.error('Error fetching lifestyle data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch lifestyle data');
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

  // Prepare data for charts
  const lifestyleComparisonData = [
    { 
      name: 'Betting', 
      value: parseFloat(data.betting?.total_tranasacted_amount || '0'), 
      color: '#ef4444',
      transactions: parseInt(data.betting?.total_transactions || '0')
    },
    { 
      name: 'Savings', 
      value: data.savings?.total_tranasacted_amount || 0, 
      color: '#10b981',
      transactions: data.savings?.total_transactions || 0
    },
    { 
      name: 'Shopping', 
      value: data.shopping?.total_tranasacted_amount || 0, 
      color: '#3b82f6',
      transactions: data.shopping?.total_transactions || 0
    }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lifestyle Analytics</h1>
          <p className="text-muted-foreground">Track your spending patterns across different lifestyle categories</p>
        </div>
        <button 
          onClick={fetchLifestyleData}
          className="p-2 rounded-md bg-muted hover:bg-muted/80"
        >
          <Loader2 className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Betting Card */}
        <Card className={`overflow-hidden border-t-4 ${data.betting ? 'border-t-red-500' : 'border-t-gray-300'}`}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Dice6 className={`h-5 w-5 ${data.betting ? 'text-red-500' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Betting</h3>
                </div>
                {data.betting ? (
                  <>
                    <p className="text-3xl font-bold mt-2">
                      KES {parseFloat(data.betting.total_tranasacted_amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.betting.total_transactions} transactions
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-2">No betting data found</p>
                )}
              </div>
              {data.betting && (
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  ~{parseFloat(data.betting.average_transacted_amount).toFixed(0)} KES avg
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Savings Card */}
        <Card className={`overflow-hidden border-t-4 ${data.savings ? 'border-t-green-500' : 'border-t-gray-300'}`}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <PiggyBank className={`h-5 w-5 ${data.savings ? 'text-green-500' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Savings</h3>
                </div>
                {data.savings ? (
                  <>
                    <p className="text-3xl font-bold mt-2">
                      KES {data.savings.total_tranasacted_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.savings.total_transactions} transactions
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-2">No savings data found</p>
                )}
              </div>
              {data.savings && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ~{data.savings.average_transacted_amount.toFixed(0)} KES avg
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shopping Card */}
        <Card className={`overflow-hidden border-t-4 ${data.shopping ? 'border-t-blue-500' : 'border-t-gray-300'}`}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className={`h-5 w-5 ${data.shopping ? 'text-blue-500' : 'text-gray-400'}`} />
                  <h3 className="font-medium">Shopping</h3>
                </div>
                {data.shopping ? (
                  <>
                    <p className="text-3xl font-bold mt-2">
                      KES {data.shopping.total_tranasacted_amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {data.shopping.total_transactions} transactions
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-2">No shopping data found</p>
                )}
              </div>
              {data.shopping && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  ~{data.shopping.average_transacted_amount.toFixed(0)} KES avg
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
                    <Tooltip formatter={(value) => `KES ${value}`} />
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
              <TabsTrigger value="shopping" className="flex items-center gap-2">
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
                    <p className="text-sm text-muted-foreground">Highest Amount</p>
                    <p className="font-bold">KES {parseFloat(data.betting.highest_transacted_amount).toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Lowest Amount</p>
                    <p className="font-bold">KES {parseFloat(data.betting.minimum_transacted_amount).toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg per Month</p>
                    <p className="font-bold">{parseFloat(data.betting.average_transactions_per_month).toFixed(1)}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Dice6 className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg Amount</p>
                    <p className="font-bold">KES {parseFloat(data.betting.average_transacted_amount).toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Betting Insights
            </AlertTitle>
            <AlertDescription>
              You&apos;re spending approximately KES {parseFloat(bettingStats.data?.average_transacted_amount?.toString() || "0").toLocaleString()} per betting transaction, 
              with {parseFloat(bettingStats.data?.average_transactions_per_month?.toString() || "0").toFixed(1)} transactions per month on average.
              {parseFloat(bettingStats.data?.total_tranasacted_amount?.toString() || "0") > 10000 ? 
                " Consider setting a monthly budget for betting activities." : ""}
            </AlertDescription>
          </Alert>
        </TabsContent>

            {/* Savings Details */}
            <TabsContent value="savings">
              {data.savings ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Highest Amount</p>
                    <p className="font-bold">KES {data.savings.highest_transacted_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Lowest Amount</p>
                    <p className="font-bold">KES {data.savings.minimum_transacted_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg per Month</p>
                    <p className="font-bold">{data.savings.average_transactions_per_month.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <PiggyBank className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg Amount</p>
                    <p className="font-bold">KES {data.savings.average_transacted_amount.toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Savings Insights
            </AlertTitle>
            <AlertDescription>
              Great job saving! You&apos;ve accumulated KES {parseFloat(savingStats.data?.total_tranasacted_amount?.toString() || "0").toLocaleString()} 
              across {savingStats.data?.total_transactions} transactions. Your largest single savings contribution was 
              KES {parseFloat(savingStats.data?.highest_transacted_amount?.toString() || "0").toLocaleString()}.
            </AlertDescription>
          </Alert>
        </TabsContent>

            {/* Shopping Details */}
            <TabsContent value="shopping">
              {data.shopping ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Highest Amount</p>
                    <p className="font-bold">KES {data.shopping.highest_transacted_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Lowest Amount</p>
                    <p className="font-bold">KES {data.shopping.minimum_transacted_amount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg per Month</p>
                    <p className="font-bold">{data.shopping.average_transactions_per_month.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Avg Amount</p>
                    <p className="font-bold">KES {data.shopping.average_transacted_amount.toFixed(0)}</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No shopping data available</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Lifestyle;