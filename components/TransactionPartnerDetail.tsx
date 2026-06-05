'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  Hash,
  Receipt,
  User,
  Phone,
  AlertCircle,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  filterTransactionsByPartner,
  getStatementTransactions,
  getTransactionAmount,
} from '@/lib/statementTransactions';
import {
  isTransactionCategory,
  TRANSACTION_CATEGORY_LABELS,
} from '@/lib/transactionCategories';

const TransactionPartnerDetail = () => {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const typeParam = searchParams.get('type');
  const partnerName = searchParams.get('name') ?? 'Unknown';
  const partnerNumber = searchParams.get('number') ?? 'N/A';
  const category = isTransactionCategory(typeParam) ? typeParam : null;

  const transactions = useMemo(() => {
    if (!category) return [];
    return filterTransactionsByPartner(
      getStatementTransactions(),
      category,
      partnerName,
      partnerNumber
    );
  }, [category, partnerName, partnerNumber]);

  const totalAmount = useMemo(
    () => transactions.reduce((sum, row) => sum + getTransactionAmount(row), 0),
    [transactions]
  );

  const backHref = '/insights';

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="flex-1 overflow-auto">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href={backHref}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Insights
                  </Link>
                </Button>
              </div>

              {!category ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-3 text-center py-8">
                      <AlertCircle className="h-8 w-8 text-destructive" />
                      <p className="text-muted-foreground">
                        Invalid transaction type. Open a partner from Top Transactions by Type on Insights.
                      </p>
                      <Button asChild>
                        <Link href={backHref}>Go to Insights</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-xl sm:text-2xl">{partnerName}</CardTitle>
                          <CardDescription className="mt-1">
                            {TRANSACTION_CATEGORY_LABELS[category]} · {partnerNumber}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {transactions.length} transaction{transactions.length === 1 ? '' : 's'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Total amount:{' '}
                        <span className="font-semibold text-foreground">
                          KES {totalAmount.toLocaleString()}
                        </span>
                      </p>
                    </CardContent>
                  </Card>

                  {transactions.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-3 text-center py-8">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground max-w-md">
                            No individual transactions found for this partner. Upload a statement on the home
                            page if you have not already, or the partner may only appear in aggregated
                            analytics.
                          </p>
                          <Button asChild variant="outline">
                            <Link href={backHref}>Back to Insights</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((row, index) => {
                        const amount = getTransactionAmount(row);
                        const receipt = row['Receipt No.'] ?? '—';
                        const completionTime = row['Completion Time'] ?? '—';
                        const details = row.Details ?? 'No description';

                        return (
                          <Card
                            key={`${receipt}-${index}`}
                            className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <CardContent className="pt-6">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      #{index + 1}
                                    </span>
                                    <span>·</span>
                                    <span>{TRANSACTION_CATEGORY_LABELS[category]}</span>
                                  </div>
                                  <p className="text-sm sm:text-base leading-relaxed">{details}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Receipt className="h-4 w-4 shrink-0" />
                                      <span>Receipt: {String(receipt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Calendar className="h-4 w-4 shrink-0" />
                                      <span>{String(completionTime)}</span>
                                    </div>
                                    {row.names ? (
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4 shrink-0" />
                                        <span>{row.names}</span>
                                      </div>
                                    ) : null}
                                    {row.numbers ? (
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        <span>{row.numbers}</span>
                                      </div>
                                    ) : null}
                                    {row.Balance != null ? (
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <Hash className="h-4 w-4 shrink-0" />
                                        <span>Balance: KES {Number(row.Balance).toLocaleString()}</span>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="text-left sm:text-right shrink-0">
                                  <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                  <p className="text-xl font-bold">KES {amount.toLocaleString()}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TransactionPartnerDetail;
