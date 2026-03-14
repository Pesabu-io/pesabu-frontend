'use client'
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, AlertCircle, Loader2, Wifi, Droplet, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useUtilityData } from "@/hooks/useUtilityData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const UtilityDashboard = () => {
  // Use the custom hook to fetch data from all endpoints
  const { 
    data, 
    isLoading, 
    error, 
    chartData, 
    lastUpdated, 
    refreshData 
  } = useUtilityData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading utility data...</p>
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
                onClick={refreshData}
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

  // Prepare data for the comparison pie chart
  const utilityComparisonData = [
    { name: 'KPLC', value: data?.kplcMetrics?.total_tranasacted_amount || 0, color: '#2563eb' },
    { name: 'Safaricom WiFi', value: data?.safaricomWifiMetrics?.total_tranasacted_amount || 0, color: '#10b981' },
    { name: 'Zuku WiFi', value: data?.zukuWifiMetrics?.total_tranasacted_amount || 0, color: '#f59e0b' },
    { name: 'Fuel', value: data?.fuelMetrics?.total_tranasacted_amount || 0, color: '#ef4444' }
  ];

  const kplcTransactions = Array.isArray(data?.kplcTransactions) ? data.kplcTransactions : [];
  const safaricomWifiTransactions = Array.isArray(data?.safaricomWifi) ? data.safaricomWifi : [];
  const zukuWifiTransactions = Array.isArray(data?.zukuWifi) ? data.zukuWifi : [];
  const fuelTransactions = Array.isArray(data?.fuel) ? data.fuel : [];

  // Convert monthly data for comparison chart
  const getMonthlyComparisonData = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    return months.map(month => {
      const kplcAmount = kplcTransactions
        .filter(t => t.month_name === month)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const safaricomAmount = safaricomWifiTransactions
        .filter(t => t.month_name === month)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const zukuAmount = zukuWifiTransactions
        .filter(t => t.month_name === month)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const fuelAmount = fuelTransactions
        .filter(t => t.month_name === month)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month,
        KPLC: kplcAmount,
        Safaricom: safaricomAmount,
        Zuku: zukuAmount,
        Fuel: fuelAmount
      };
    }).filter(item => item.KPLC > 0 || item.Safaricom > 0 || item.Zuku > 0 || item.Fuel > 0);
  };

  const monthlyComparisonData = getMonthlyComparisonData();

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Utility Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track and manage all your utility expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Last updated: {lastUpdated?.toLocaleDateString() || new Date().toLocaleDateString()}
          </span>
          <button 
            onClick={refreshData}
            className="p-2 rounded-md bg-muted hover:bg-muted/80"
          >
            <Loader2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPLC Summary */}
        <Card className="overflow-hidden border-t-4 border-t-blue-500">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <h3 className="text-sm sm:text-base font-medium">KPLC</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  KES {data?.kplcMetrics?.total_tranasacted_amount || 0}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {data?.kplcMetrics?.total_transactions || 0} transactions
                </p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                ~{data?.kplcMetrics?.average_transacted_amount?.toFixed(0) || 0} KES avg
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Safaricom WiFi Summary */}
        <Card className="overflow-hidden border-t-4 border-t-green-500">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  <h3 className="text-sm sm:text-base font-medium">Safaricom WiFi</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  KES {data?.safaricomWifiMetrics?.total_tranasacted_amount || 0}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {data?.safaricomWifiMetrics?.total_transactions || 0} transactions
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                ~{data?.safaricomWifiMetrics?.average_transacted_amount?.toFixed(0) || 0} KES avg
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Zuku WiFi Summary */}
        <Card className="overflow-hidden border-t-4 border-t-yellow-500">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  <h3 className="text-sm sm:text-base font-medium">Zuku WiFi</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  KES {data?.zukuWifiMetrics?.total_tranasacted_amount || 0}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {data?.zukuWifiMetrics?.total_transactions || 0} transactions
                </p>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
                ~{data?.zukuWifiMetrics?.average_transacted_amount?.toFixed(0) || 0} KES avg
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Fuel Summary */}
        <Card className="overflow-hidden border-t-4 border-t-red-500">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  <h3 className="text-sm sm:text-base font-medium">Fuel</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  KES {data?.fuelMetrics?.total_tranasacted_amount || 0}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {data?.fuelMetrics?.total_transactions || 0} transactions
                </p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                ~{data?.fuelMetrics?.average_transacted_amount?.toFixed(0) || 0} KES avg
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Comparison Chart */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Monthly Utility Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="KPLC" fill="#2563eb" />
                  <Bar dataKey="Safaricom" fill="#10b981" />
                  <Bar dataKey="Zuku" fill="#f59e0b" />
                  <Bar dataKey="Fuel" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Pie Chart */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
              Utility Expense Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilityComparisonData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius="60%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {utilityComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KES ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Tabs */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Utility Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kplc">
            <TabsList className="mb-3 sm:mb-4 flex-wrap h-auto p-1">
              <TabsTrigger value="kplc" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                <span className="hidden sm:inline">KPLC</span>
                <span className="sm:hidden">KPLC</span>
              </TabsTrigger>
              <TabsTrigger value="safaricom" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                <span className="hidden sm:inline">Safaricom</span>
                <span className="sm:hidden">Saf</span>
              </TabsTrigger>
              <TabsTrigger value="zuku" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                Zuku
              </TabsTrigger>
              <TabsTrigger value="fuel" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
                <Droplet className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                Fuel
              </TabsTrigger>
            </TabsList>

            {/* KPLC Transactions */}
            <TabsContent value="kplc">
              {kplcTransactions.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs sm:text-sm">Receipt No.</TableHead>
                        <TableHead className="text-xs sm:text-sm">Date</TableHead>
                        <TableHead className="text-xs sm:text-sm">Details</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kplcTransactions.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction["Receipt No."]}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            {transaction["Receipt No."]}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {new Date(transaction["Completion Time"]).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="max-w-[100px] sm:max-w-xs truncate text-xs sm:text-sm">{transaction.Details}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm font-medium">KES {transaction.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No KPLC transactions found</div>
              )}
            </TabsContent>

            {/* Safaricom WiFi Transactions */}
            <TabsContent value="safaricom">
              {safaricomWifiTransactions.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs sm:text-sm">Receipt No.</TableHead>
                        <TableHead className="text-xs sm:text-sm">Date</TableHead>
                        <TableHead className="text-xs sm:text-sm">Details</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {safaricomWifiTransactions.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction["Receipt No."]}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            {transaction["Receipt No."]}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {new Date(transaction["Completion Time"]).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="max-w-[100px] sm:max-w-xs truncate text-xs sm:text-sm">{transaction.Details}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm font-medium">KES {transaction.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No Safaricom WiFi transactions found</div>
              )}
            </TabsContent>

            {/* Zuku WiFi Transactions */}
            <TabsContent value="zuku">
              {zukuWifiTransactions.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs sm:text-sm">Receipt No.</TableHead>
                        <TableHead className="text-xs sm:text-sm">Date</TableHead>
                        <TableHead className="text-xs sm:text-sm">Details</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {zukuWifiTransactions.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction["Receipt No."]}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            {transaction["Receipt No."]}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {new Date(transaction["Completion Time"]).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="max-w-[100px] sm:max-w-xs truncate text-xs sm:text-sm">{transaction.Details}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm font-medium">KES {transaction.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No Zuku WiFi transactions found</div>
              )}
            </TabsContent>

            {/* Fuel Transactions */}
            <TabsContent value="fuel">
              {fuelTransactions.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs sm:text-sm">Receipt No.</TableHead>
                        <TableHead className="text-xs sm:text-sm">Date</TableHead>
                        <TableHead className="text-xs sm:text-sm">Details</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fuelTransactions.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction["Receipt No."]}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            {transaction["Receipt No."]}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {new Date(transaction["Completion Time"]).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="max-w-[100px] sm:max-w-xs truncate text-xs sm:text-sm">{transaction.Details}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm font-medium">KES {transaction.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No fuel transactions found</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* KPLC Chart */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              KPLC Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Utility Status */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Utility Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-500" />
                    Safaricom WiFi
                  </h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last payment: {safaricomWifiTransactions.length > 0 ? 
                    new Date(safaricomWifiTransactions[0]["Completion Time"]).toLocaleDateString() : 
                    "N/A"}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-yellow-500" />
                    Zuku WiFi
                  </h3>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    {zukuWifiTransactions.length > 0 ? "Active" : "Status Unknown"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last payment: {zukuWifiTransactions.length > 0 ? 
                    new Date(zukuWifiTransactions[0]["Completion Time"]).toLocaleDateString() : 
                    "N/A"}
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-red-500" />
                    Fuel Status
                  </h3>
                  <Badge variant="outline" className="bg-slate-50 text-slate-700">
                    {fuelTransactions.length > 0 ? 
                      `Last fueled: ${new Date(fuelTransactions[0]["Completion Time"]).toLocaleDateString()}` : 
                      "No recent transactions"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Average monthly spend: KES {data?.fuelMetrics?.average_transacted_amount?.toFixed(0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UtilityDashboard;