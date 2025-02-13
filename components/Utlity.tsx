import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, AlertCircle, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UtilityDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataBills, setDataBills] = useState([]);
  const [kplcData, setKplcData] = useState([]);
  const [kplcMetrics, setKplcMetrics] = useState(null);
  const [wifiStatus, setWifiStatus] = useState({ safaricom: null, zuku: null });
  const [fuelStatus, setFuelStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const endpoints = {
          bills: 'http://127.0.0.1:8000/utility_module/data_bills/',
          kplc: 'http://127.0.0.1:8000/utility_module/kplc/',
          kplcMetrics: 'http://127.0.0.1:8000/utility_module/kplc_metrics/',
          safaricomWifi: 'http://127.0.0.1:8000/utility_module/safaricom_wifi/',
          safaricomMetrics: 'http://127.0.0.1:8000/utility_module/safaricom_wifi_metrics/',
          zukuWifi: 'http://127.0.0.1:8000/utility_module/zuku_wifi/',
          zukuMetrics: 'http://127.0.0.1:8000/utility_module/zuku_wifi_metrics/',
          fuel: 'http://127.0.0.1:8000/utility_module/fuel/',
          fuelMetrics: 'http://127.0.0.1:8000/utility_module/fuel_metrics/'
        };

        const responses = await Promise.all([
          fetch(endpoints.bills),
          fetch(endpoints.kplc),
          fetch(endpoints.kplcMetrics),
          fetch(endpoints.safaricomWifi),
          fetch(endpoints.zukuWifi),
          fetch(endpoints.fuel)
        ]);

        const [
          billsData,
          kplcTransactions,
          kplcStats,
          safaricomData,
          zukuData,
          fuelData
        ] = await Promise.all(responses.map(r => r.json()));

        setDataBills(billsData);
        setKplcData(kplcTransactions);
        setKplcMetrics(kplcStats);
        setWifiStatus({
          safaricom: safaricomData.message || null,
          zuku: zukuData.message || null
        });
        setFuelStatus(fuelData.message || null);

      } catch (err) {
        setError("Failed to fetch utility data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform KPLC data for the line chart
  const chartData = kplcData
    ? kplcData
        .map(item => ({
          month: item.month_name,
          amount: item.amount
        }))
        .sort((a, b) => new Date(a.month) - new Date(b.month))
    : [];

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
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Metrics Cards */}
      {kplcMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Transactions
              </h3>
              <p className="text-3xl font-bold">{kplcMetrics.total_transactions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Monthly Average
              </h3>
              <p className="text-3xl font-bold">
                {kplcMetrics.average_transactions_per_month.toFixed(1)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Total Amount
              </h3>
              <p className="text-3xl font-bold">
                KES {kplcMetrics.total_tranasacted_amount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Average Amount
              </h3>
              <p className="text-3xl font-bold">
                KES {kplcMetrics.average_transacted_amount}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* KPLC Transactions Chart */}
      {kplcData && kplcData.length > 0 && (
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
      {kplcData && kplcData.length > 0 && (
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
              {kplcData.map((transaction) => (
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
              <span>{wifiStatus.safaricom || "No Safaricom WiFi data available"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="text-yellow-500" />
              <span>{wifiStatus.zuku || "No Zuku WiFi data available"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="text-yellow-500" />
              <span>{fuelStatus || "No Fuel data available"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityDashboard;