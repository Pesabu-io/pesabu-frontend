import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const FinancialInstitutions = () => {
  const institutions = [
    { name: "KCB Bank", count: 25, amount: 5000 },
    { name: "Co-op Bank", count: 45, amount: 15120 },
    { name: "Mshwari", count: 75, amount: 25000 },
    { name: "Family", count: 75, amount: 35000 },
    { name: "M&M Bank", count: 25, amount: 38500 },
  ];
  const totalCount = 25;
  const depositsCount = 500;
  const withdrawalCount = 225;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Total Count</h3>
          <p className="text-3xl font-bold text-primary mt-2">{totalCount}</p>
        </Card>
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Deposits Count</h3>
          <p className="text-3xl font-bold text-primary mt-2">{depositsCount}</p>
        </Card>
        <Card className="p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Withdrawal Count</h3>
          <p className="text-3xl font-bold text-primary mt-2">{withdrawalCount}</p>
        </Card>
      </div>
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Financial Institution</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutions.map((institution, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{institution.name}</TableCell>
                <TableCell>{institution.count}</TableCell>
                <TableCell>{institution.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
export default FinancialInstitutions;