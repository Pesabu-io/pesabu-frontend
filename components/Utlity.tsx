import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Home, Wifi, Droplet } from "lucide-react";
interface UtilityPayment {
  name: string;
  count: number;
  amount: number;
  icon: React.ReactNode;
}
interface TopPayment {
  name: string;
  number: string;
  count: number;
  highest: number;
  total: number;
}
const utilityPayments: UtilityPayment[] = [
  { name: "KPLC", count: 20, amount: 5000, icon: <Zap className="text-yellow-500" /> },
  { name: "House Rent", count: 45, amount: 151520, icon: <Home className="text-blue-500" /> },
  { name: "Wifi", count: 75, amount: 548520, icon: <Wifi className="text-green-500" /> },
  { name: "Water Bill", count: 75, amount: 548520, icon: <Droplet className="text-blue-500" /> },
];
const topPayments: TopPayment[] = [
  {
    name: "John Doe",
    number: "+2547xxxxx678",
    count: 100,
    highest: 10000.00,
    total: 100000.00,
  },
  {
    name: "James Juma",
    number: "+2547xxxxx678",
    count: 76,
    highest: 200.00,
    total: 14400.00,
  },
];
const Utility = () => {
  return (
    <div className="space-y-6">
      {/* Utility Payments Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Utility</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {utilityPayments.map((payment, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium flex items-center gap-2">
                  {payment.icon}
                  {payment.name}
                </TableCell>
                <TableCell>{payment.count}</TableCell>
                <TableCell>{payment.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Count</h3>
            <p className="text-3xl font-bold">25</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Top Utility</h3>
            <p className="text-3xl font-bold">KPLC</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Lowest Utility</h3>
            <p className="text-3xl font-bold">Water</p>
          </CardContent>
        </Card>
      </div>
      {/* KPLC Section */}
      <div className="bg-primary/10 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
          <Zap className="text-yellow-500" />
          KPLC
        </h2>
      </div>
      {/* Top 3 Payments */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Top 3 Payments</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Highest</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPayments.map((payment, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{payment.name}</TableCell>
                <TableCell>{payment.number}</TableCell>
                <TableCell>{payment.count}</TableCell>
                <TableCell>{payment.highest.toLocaleString()}</TableCell>
                <TableCell>{payment.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default Utility;