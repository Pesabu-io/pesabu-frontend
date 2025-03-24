import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, AlertCircle, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUtilityData } from "@/hooks/useUtilityData";


const UtilityDashboard = () => {
  // Use the custom hook instead of useState and useEffect
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

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Utility Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated?.toLocaleDateString() || new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Metrics Cards */}
      {data?.kplcMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Transactions
              </h3>
              <p className="text-3xl font-bold">{data.kplcMetrics.total_transactions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Monthly Average
              </h3>
              <p className="text-3xl font-bold">
                {data.kplcMetrics.average_transactions_per_month.toFixed(1)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Amount
              </h3>
              <p className="text-3xl font-bold">
                KES {data.kplcMetrics.total_tranasacted_amount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Average Amount
              </h3>
              <p className="text-3xl font-bold">
                KES {data.kplcMetrics.average_transacted_amount}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* KPLC Transactions Chart */}
      {chartData && chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-yellow-500" />
              KPLC Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
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
      )}

      {/* Recent Transactions Table */}
      {data?.kplcTransactions && data.kplcTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent KPLC Transactions</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Receipt No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Month</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.kplcTransactions.map((transaction) => (
                <TableRow key={transaction["Receipt No."]}>
                  <TableCell className="font-medium">
                    {transaction["Receipt No."]}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction["Completion Time"]).toLocaleDateString()}
                  </TableCell>
                  <TableCell>KES {transaction.amount}</TableCell>
                  <TableCell>{transaction.month_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Other Utilities Status */}
      <Card>
        <CardHeader>
          <CardTitle>Other Utilities Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="text-yellow-500" />
              <span>{data?.wifiStatus.safaricom || "No Safaricom WiFi data available"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="text-yellow-500" />
              <span>{data?.wifiStatus.zuku || "No Zuku WiFi data available"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="text-yellow-500" />
              <span>{data?.fuelStatus || "No Fuel data available"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityDashboard