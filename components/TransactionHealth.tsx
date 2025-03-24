import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// components/TransactionHealth.tsx
export const TransactionHealth = ({ insights, summary }) => {
    const getHealthStatus = (retentionRate: number) => {
      if (retentionRate > 95) return { status: 'Excellent', color: 'text-green-600' };
      if (retentionRate > 85) return { status: 'Good', color: 'text-blue-600' };
      if (retentionRate > 75) return { status: 'Fair', color: 'text-yellow-600' };
      return { status: 'Needs Attention', color: 'text-red-600' };
    };
  
    const health = insights ? getHealthStatus(insights.retentionRate) : { status: '', color: '' };
  
    return (
        <>
        <Card>
        <CardHeader>
          <CardTitle>Transaction Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {insights?.retentionRate.toFixed(1)}%
              </span>
              <span className={`${health.color} font-medium`}>
                {health.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Money Velocity</span>
                <span>KES {insights?.moneyVelocity.toLocaleString()}/transaction</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction Frequency</span>
                <span>{(insights?.totalTransactions / 30).toFixed(1)}/day</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
          {/* Transaction Pattern Analysis */}
          <Card>
          <CardHeader>
            <CardTitle>Transaction Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Deposit vs Withdrawal Frequency</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${insights?.depositFrequency}%` }}
                      />
                    </div>
                    <p className="text-sm mt-1">Deposits: {insights?.depositFrequency}%</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-red-500 rounded-full" 
                        style={{ width: `${insights?.withdrawalFrequency}%` }}
                      />
                    </div>
                    <p className="text-sm mt-1">Withdrawals: {insights?.withdrawalFrequency}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
         {/* Transaction Size Distribution */}
         <Card>
          <CardHeader>
            <CardTitle>Transaction Size Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Size Distribution</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Average Size:</span>
                    <span className="font-medium">
                      KES {insights?.avgTransactionSize.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Largest Deposit:</span>
                    <span className="font-medium text-green-600">
                      KES {summary?.data?.top_deposit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Largest Withdrawal:</span>
                    <span className="font-medium text-red-600">
                      KES {summary?.data?.top_withdrawal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Transaction Health</h3>
                <p className="text-sm text-muted-foreground">
                  {insights?.retentionRate > 85 
                    ? "Healthy retention rate indicating strong platform trust and user satisfaction."
                    : "Consider investigating factors affecting retention rate and implement measures to improve trust."}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Volume Patterns</h3>
                <p className="text-sm text-muted-foreground">
                  {`Average daily transaction volume of ${(insights?.totalTransactions / 30).toFixed(1)} 
                  with ${insights?.depositFrequency}% deposits indicates 
                  ${Number(insights?.depositFrequency) > 50 ? 'positive' : 'concerning'} platform usage.`}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Size Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  {summary?.data ? `Transaction sizes range from KES ${summary.data.lowest_deposit} to 
                  KES ${summary.data.top_deposit}, with an average of 
                  KES ${insights?.avgTransactionSize.toFixed(2)}. 
                  ${insights?.avgTransactionSize > 5000 ? 'High' : 'Moderate'} average value indicates 
                  ${insights?.avgTransactionSize > 5000 ? 'strong' : 'normal'} user engagement.` : 
                  "Transaction size data not available."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </>
      
    );
  };