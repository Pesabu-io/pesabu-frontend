'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2, 
  AlertCircle,
  BarChart3,
  Target,
  Award
} from 'lucide-react';
import { server } from '@/utils/util';

interface CreditScoreData {
  credit_score: number;
  credit_score_status: string;
}

const CreditScore = () => {
  const [data, setData] = useState<CreditScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreditScoreData();
  }, []);

  const fetchCreditScoreData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${server}/credit_score_module/get_credit_score`);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credit score data');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-blue-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 750) return 'bg-green-50';
    if (score >= 650) return 'bg-blue-50';
    if (score >= 550) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getScoreBorderColor = (score: number) => {
    if (score >= 750) return 'border-green-500';
    if (score >= 650) return 'border-blue-500';
    if (score >= 550) return 'border-yellow-500';
    return 'border-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 750) return <Award className="h-8 w-8 text-green-600" />;
    if (score >= 650) return <CheckCircle className="h-8 w-8 text-blue-600" />;
    if (score >= 550) return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
    return <XCircle className="h-8 w-8 text-red-600" />;
  };

  const getScoreDescription = (score: number) => {
    if (score >= 750) return 'Excellent credit score! You have a very strong financial profile.';
    if (score >= 650) return 'Good credit score. You have a solid financial standing.';
    if (score >= 550) return 'Fair credit score. There is room for improvement.';
    return 'Poor credit score. Consider improving your financial habits.';
  };

  const getScoreRecommendations = (score: number) => {
    if (score >= 750) return [
      'Maintain your excellent payment history',
      'Continue your current financial habits',
      'Consider premium financial products'
    ];
    if (score >= 650) return [
      'Maintain consistent payment patterns',
      'Keep credit utilization low',
      'Monitor your credit regularly'
    ];
    if (score >= 550) return [
      'Pay bills on time consistently',
      'Reduce outstanding debt',
      'Avoid new credit applications'
    ];
    return [
      'Focus on paying bills on time',
      'Work on reducing debt',
      'Consider credit counseling',
      'Avoid new credit applications'
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Calculating your credit score...</p>
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
                onClick={fetchCreditScoreData}
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <p className="text-muted-foreground">No credit score data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scorePercentage = (data.credit_score / 850) * 100;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Credit Score</h1>
          <p className="text-muted-foreground">Your financial health assessment</p>
        </div>
        <button 
          onClick={fetchCreditScoreData}
          className="p-2 rounded-md bg-muted hover:bg-muted/80"
        >
          <Loader2 className="h-4 w-4" />
        </button>
      </div>

      {/* Main Credit Score Card */}
      <Card className={`overflow-hidden border-t-4 ${getScoreBorderColor(data.credit_score)}`}>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Score Display */}
            <div className="flex flex-col items-center text-center">
              <div className={`p-6 rounded-full ${getScoreBgColor(data.credit_score)} mb-4`}>
                {getScoreIcon(data.credit_score)}
              </div>
              <div className="text-center">
                <h2 className={`text-6xl font-bold ${getScoreColor(data.credit_score)} mb-2`}>
                  {data.credit_score}
                </h2>
                <p className="text-2xl font-semibold text-muted-foreground mb-2">
                  {data.credit_score_status}
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  {getScoreDescription(data.credit_score)}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="flex-1 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Credit Score</span>
                    <span>{data.credit_score}/850</span>
                  </div>
                  <Progress value={scorePercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">Score Range</div>
                    <div className="text-muted-foreground">300 - 850</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="font-semibold">Your Score</div>
                    <div className={getScoreColor(data.credit_score)}>{data.credit_score}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className={`border-t-4 ${data.credit_score >= 750 ? 'border-t-green-500' : 'border-t-gray-300'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className={`h-5 w-5 ${data.credit_score >= 750 ? 'text-green-500' : 'text-gray-400'}`} />
              <h3 className="font-medium">Excellent</h3>
            </div>
            <p className="text-2xl font-bold mb-1">750-850</p>
            <p className="text-sm text-muted-foreground">Prime credit</p>
          </CardContent>
        </Card>

        <Card className={`border-t-4 ${data.credit_score >= 650 && data.credit_score < 750 ? 'border-t-blue-500' : 'border-t-gray-300'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className={`h-5 w-5 ${data.credit_score >= 650 && data.credit_score < 750 ? 'text-blue-500' : 'text-gray-400'}`} />
              <h3 className="font-medium">Good</h3>
            </div>
            <p className="text-2xl font-bold mb-1">650-749</p>
            <p className="text-sm text-muted-foreground">Above average</p>
          </CardContent>
        </Card>

        <Card className={`border-t-4 ${data.credit_score >= 550 && data.credit_score < 650 ? 'border-t-yellow-500' : 'border-t-gray-300'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`h-5 w-5 ${data.credit_score >= 550 && data.credit_score < 650 ? 'text-yellow-500' : 'text-gray-400'}`} />
              <h3 className="font-medium">Fair</h3>
            </div>
            <p className="text-2xl font-bold mb-1">550-649</p>
            <p className="text-sm text-muted-foreground">Below average</p>
          </CardContent>
        </Card>

        <Card className={`border-t-4 ${data.credit_score < 550 ? 'border-t-red-500' : 'border-t-gray-300'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className={`h-5 w-5 ${data.credit_score < 550 ? 'text-red-500' : 'text-gray-400'}`} />
              <h3 className="font-medium">Poor</h3>
            </div>
            <p className="text-2xl font-bold mb-1">300-549</p>
            <p className="text-sm text-muted-foreground">Subprime</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getScoreRecommendations(data.credit_score).map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credit Score Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Credit Score Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Positive Factors</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Consistent payment history</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Low credit utilization</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Diverse transaction types</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Areas for Improvement</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Payment consistency</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Debt management</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Financial stability</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">Important Disclaimer</p>
              <p>
                This credit score is calculated based on your M-PESA transaction patterns and may not reflect 
                your complete credit profile. It's intended for informational purposes only and should not be 
                used as the sole basis for financial decisions. For comprehensive credit assessment, 
                consult with financial institutions or credit bureaus.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditScore;

