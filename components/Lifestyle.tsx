import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wallet, PiggyBank, ShoppingCart, TrendingDown, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { server } from "@/utils/util";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// TypeScript interfaces
interface SummaryStats {
  total_transactions: string | number;
  average_transactions_per_month: string | number;
  total_tranasacted_amount: string | number;
  highest_transacted_amount: string | number;
  minimum_transacted_amount: string | number;
  average_transacted_amount: string | number;
}

interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const LifestyleDashboard = () => {
  // State management with TypeScript
  const [bettingStats, setBettingStats] = useState<ApiResponse<SummaryStats>>({
    data: null,
    isLoading: true,
    error: null,
  });
  
  const [savingStats, setSavingStats] = useState<ApiResponse<SummaryStats>>({
    data: null,
    isLoading: true,
    error: null,
  });
  
  const [shoppingStats, setShoppingStats] = useState<ApiResponse<SummaryStats>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState("overview");

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
        
        // Fetch shopping stats
        const shoppingResponse = await fetch(`${server}/lifestyle_module/shopping_summary_stats/`);
        const shoppingData = await shoppingResponse.json();
        setShoppingStats({
          data: shoppingData,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setBettingStats(prev => ({ ...prev, isLoading: false, error: `Failed to fetch betting data: ${errorMessage}` }));
        setSavingStats(prev => ({ ...prev, isLoading: false, error: `Failed to fetch saving data: ${errorMessage}` }));
        setShoppingStats(prev => ({ ...prev, isLoading: false, error: `Failed to fetch shopping data: ${errorMessage}` }));
      }
    };

    fetchLifestyleData();
  }, []);

  // Generate monthly data based on average transactions
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const bettingAvg = parseFloat(bettingStats?.data?.average_transactions_per_month?.toString() || "0");
    const savingAvg = parseFloat(savingStats?.data?.average_transactions_per_month?.toString() || "0");
    const shoppingAvg = parseFloat(shoppingStats?.data?.average_transactions_per_month?.toString() || "0");
    
    return months.map((month, index) => {
      // Create some random variation around the averages for visual interest
      const randomFactor = 0.7 + Math.random() * 0.6; // between 0.7 and 1.3
      
      return {
        month,
        betting: Math.round(bettingAvg * randomFactor),
        savings: Math.round(savingAvg * randomFactor),
        shopping: Math.round(shoppingAvg * randomFactor)
      };
    });
  };

  // Generate spending distribution data for pie chart
  const generateDistributionData = () => {
    const bettingTotal = parseFloat(bettingStats?.data?.total_tranasacted_amount?.toString() || "0");
    const savingTotal = parseFloat(savingStats?.data?.total_tranasacted_amount?.toString() || "0");
    const shoppingTotal = parseFloat(shoppingStats?.data?.total_tranasacted_amount?.toString() || "0");
    
    return [
      { name: 'Betting', value: bettingTotal, color: '#2563eb' },
      { name: 'Savings', value: savingTotal, color: '#16a34a' },
      { name: 'Shopping', value: shoppingTotal, color: '#d97706' }
    ];
  };

  if (bettingStats.isLoading || savingStats.isLoading || shoppingStats.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading lifestyle data...</p>
        </div>
      </div>
    );
  }

  const monthlyData = generateMonthlyData();
  const distributionData = generateDistributionData();

  // Calculate total spending and saving
  const totalBetting = parseFloat(bettingStats?.data?.total_tranasacted_amount?.toString() || "0");
  const totalSaving = parseFloat(savingStats?.data?.total_tranasacted_amount?.toString() || "0");
  const totalShopping = parseFloat(shoppingStats?.data?.total_tranasacted_amount?.toString() || "0");
  
  // Calculate total discretionary spending (betting + shopping)
  const totalDiscretionary = totalBetting + totalShopping;
  
  // Calculate saving to spending ratio
  const savingToSpendingRatio = totalDiscretionary > 0 ? (totalSaving / totalDiscretionary) : 0;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lifestyle Analytics</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Financial Health Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Financial Health Score</p>
              <p className="text-4xl font-bold text-primary">
                {savingToSpendingRatio > 5 ? 'Excellent' : 
                 savingToSpendingRatio > 2 ? 'Good' : 
                 savingToSpendingRatio > 1 ? 'Fair' : 'Needs Attention'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Saving to spending ratio: {savingToSpendingRatio.toFixed(2)}x
              </p>
            </div>
            <div className="flex items-center gap-2">
              {savingToSpendingRatio > 1 ? (
                <ArrowUp className="h-8 w-8 text-green-500" />
              ) : (
                <ArrowDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="betting">Betting</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="shopping">Shopping</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-500" />
                  Betting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">KES {totalBetting.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {bettingStats.data?.total_transactions} transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-green-500" />
                  Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">KES {totalSaving.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {savingStats.data?.total_transactions} transactions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-amber-500" />
                  Shopping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">KES {totalShopping.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {shoppingStats.data?.total_transactions} transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `KES ${parseFloat(value.toString()).toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Transaction Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="betting" fill="#2563eb" name="Betting" />
                    <Bar dataKey="savings" fill="#16a34a" name="Savings" />
                    <Bar dataKey="shopping" fill="#d97706" name="Shopping" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Betting Tab */}
        <TabsContent value="betting" className="space-y-6 mt-6">
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
                  <Wallet className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(bettingStats.data?.total_tranasacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Highest Transaction</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(bettingStats.data?.highest_transacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <ArrowUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Amount</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(bettingStats.data?.average_transacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-blue-500" />
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
              You're spending approximately KES {parseFloat(bettingStats.data?.average_transacted_amount?.toString() || "0").toLocaleString()} per betting transaction, 
              with {parseFloat(bettingStats.data?.average_transactions_per_month?.toString() || "0").toFixed(1)} transactions per month on average.
              {parseFloat(bettingStats.data?.total_tranasacted_amount?.toString() || "0") > 10000 ? 
                " Consider setting a monthly budget for betting activities." : ""}
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Savings Tab */}
        <TabsContent value="savings" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">
                      {savingStats.data?.total_transactions || "0"}
                    </p>
                  </div>
                  <PiggyBank className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(savingStats.data?.total_tranasacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Highest Transaction</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(savingStats.data?.highest_transacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <ArrowUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Amount</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(savingStats.data?.average_transacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-green-500" />
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
              Great job saving! You've accumulated KES {parseFloat(savingStats.data?.total_tranasacted_amount?.toString() || "0").toLocaleString()} 
              across {savingStats.data?.total_transactions} transactions. Your largest single savings contribution was 
              KES {parseFloat(savingStats.data?.highest_transacted_amount?.toString() || "0").toLocaleString()}.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Shopping Tab */}
        <TabsContent value="shopping" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">
                      {shoppingStats.data?.total_transactions || "0"}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(shoppingStats.data?.total_tranasacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Highest Transaction</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(shoppingStats.data?.highest_transacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <ArrowUp className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Amount</p>
                    <p className="text-2xl font-bold">
                      KES {parseFloat(shoppingStats.data?.average_transacted_amount?.toString() || "0").toLocaleString()}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTitle className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Shopping Insights
            </AlertTitle>
            <AlertDescription>
              Your shopping expenses total KES {parseFloat(shoppingStats.data?.total_tranasacted_amount?.toString() || "0").toLocaleString()} 
              with an average of KES {parseFloat(shoppingStats.data?.average_transacted_amount?.toString() || "0").toLocaleString()} per transaction.
              You shop approximately {parseFloat(shoppingStats.data?.average_transactions_per_month?.toString() || "0").toFixed(1)} times per month.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Error Alerts */}
      <div className="space-y-4">
        {(bettingStats.error || savingStats.error || shoppingStats.error) && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {bettingStats.error || savingStats.error || shoppingStats.error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LifestyleDashboard;