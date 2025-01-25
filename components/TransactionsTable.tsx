import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  name: string;
  number: string;
  count: number;
  highest: number;
  total: number;
}

const transactions: Transaction[] = [
  {
    name: "John Doe",
    number: "+254 7xxxxx678",
    count: 100,
    highest: 10000.0,
    total: 100000.0,
  },
  {
    name: "James Juma",
    number: "+254 7xxxxx678",
    count: 76,
    highest: 200.0,
    total: 14400.0,
  },
  {
    name: "Jane Futurama",
    number: "+254 7xxxxx678",
    count: 55,
    highest: 100.0,
    total: 5500.0,
  },
  {
    name: "Advil Afuna",
    number: "+254 7xxxxx678",
    count: 55,
    highest: 50.0,
    total: 5500.0,
  },
];

const TransactionsTable = () => {
  return (
    <div className="rounded-lg border bg-card">
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
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{transaction.name}</TableCell>
              <TableCell>{transaction.number}</TableCell>
              <TableCell>{transaction.count}</TableCell>
              <TableCell>{transaction.highest.toLocaleString()}</TableCell>
              <TableCell>{transaction.total.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;