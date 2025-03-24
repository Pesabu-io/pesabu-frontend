import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Assuming these are props or imported from another file
const InsightsTabContent = ({ 
  calculateBankTrends,
  getTransactionSuccessRate,
  FinancialHealthScore,
  TransactionInsights,
  RiskAlerts 
}) => {
  return (
    <div className="space-y-6">
      <FinancialHealthScore />
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Transaction Volume by Bank</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calculateBankTrends()}>
                  <XAxis dataKey="bank" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Transaction Success Trend</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: 'Week 1', rate: 92 },
                  { name: 'Week 2', rate: 88 },
                  { name: 'Week 3', rate: 95 },
                  { name: 'Week 4', rate: getTransactionSuccessRate() }
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Card>

      <TransactionInsights />
      <RiskAlerts />
    </div>
  );
};

export default InsightsTabContent;