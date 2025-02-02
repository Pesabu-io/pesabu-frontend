'use client'

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const FinancialInstitutions = () => {
  const [data, setData] = useState({
    banks: [],
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/financial_institutions_module/client_banks/');
        if (!response.ok) throw new Error('API call failed');
        
        const responseData = await response.json();
        setData({
          banks: responseData[0],
          transactions: responseData[1].transactions,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = () => {
    if (!data.transactions.length) return null;

    const metrics = data.transactions.reduce((acc, transaction) => {
      // Total volume
      acc.totalVolume += (transaction["Paid In"] || 0) + (transaction["Withdrawn"] || 0);
      
      // Track deposits and withdrawals
      if (transaction["Paid In"] > 0) {
        acc.totalDeposits += transaction["Paid In"];
        acc.depositsCount++;
      }
      if (transaction["Withdrawn"] > 0) {
        acc.totalWithdrawals += transaction["Withdrawn"];
        acc.withdrawalCount++;
      }

      // Track by bank
      if (!acc.bankStats[transaction.Bank]) {
        acc.bankStats[transaction.Bank] = {
          count: 0,
          deposits: 0,
          withdrawals: 0,
          volume: 0
        };
      }
      acc.bankStats[transaction.Bank].count++;
      acc.bankStats[transaction.Bank].deposits += transaction["Paid In"] || 0;
      acc.bankStats[transaction.Bank].withdrawals += transaction["Withdrawn"] || 0;
      acc.bankStats[transaction.Bank].volume += (transaction["Paid In"] || 0) + (transaction["Withdrawn"] || 0);

      // Track by hour
      const hour = transaction.Hour;
      if (!acc.hourlyVolume[hour]) {
        acc.hourlyVolume[hour] = 0;
      }
      acc.hourlyVolume[hour] += (transaction["Paid In"] || 0) + (transaction["Withdrawn"] || 0);

      return acc;
    }, {
      totalVolume: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      depositsCount: 0,
      withdrawalCount: 0,
      bankStats: {},
      hourlyVolume: {}
    });

    return metrics;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading dashboard data...</div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 text-red-500 flex items-center justify-center">
      <div>Error loading dashboard: {error}</div>
    </div>
  );

  const metrics = calculateMetrics();
  
  // Prepare data for charts
  const hourlyData = Object.entries(metrics.hourlyVolume).map(([hour, volume]) => ({
    hour: `${hour}:00`,
    volume
  })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

  const bankData = Object.entries(metrics.bankStats).map(([bank, stats]) => ({
    bank,
    ...stats
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Total Volume</h3>
            <TrendingUp className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-primary mt-2">
            KES {metrics.totalVolume.toLocaleString()}
          </p>
        </Card>
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Deposits</h3>
            <ArrowUpCircle className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">
            KES {metrics.totalDeposits.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {metrics.depositsCount} transactions
          </p>
        </Card>
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Withdrawals</h3>
            <ArrowDownCircle className="text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600 mt-2">
            KES {metrics.totalWithdrawals.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {metrics.withdrawalCount} transactions
          </p>
        </Card>
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Active Banks</h3>
            <Clock className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {Object.keys(metrics.bankStats).length}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            of {data.banks.length} total banks
          </p>
        </Card>
      </div>

      {/* Hourly Volume Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume by Hour</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="volume" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bank Statistics Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Performance</h3>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Bank</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Deposits (KES)</TableHead>
              <TableHead>Withdrawals (KES)</TableHead>
              <TableHead>Total Volume (KES)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bankData.sort((a, b) => b.volume - a.volume).map((bank) => (
              <TableRow key={bank.bank}>
                <TableCell className="font-medium">{bank.bank}</TableCell>
                <TableCell>{bank.count}</TableCell>
                <TableCell className="text-green-600">
                  {bank.deposits.toLocaleString()}
                </TableCell>
                <TableCell className="text-red-600">
                  {bank.withdrawals.toLocaleString()}
                </TableCell>
                <TableCell className="font-semibold">
                  {bank.volume.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FinancialInstitutions;