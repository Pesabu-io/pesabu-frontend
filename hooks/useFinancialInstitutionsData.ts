import { server } from '@/utils/util';
import { useState, useEffect, useCallback } from 'react';

// Define your interfaces based on actual API responses
interface FinancialData {
  receivedMetrics: any;
  sentMetrics: any;
  fulizaMetrics: any;
  topReceived: any[];
  topSent: any[];
  fulizaTransactions: any[];
  safaricomServices: any[];
  creditScore: {
    credit_score: number;
    credit_score_status: string;
  };
}

interface FinancialDataState {
  data: FinancialData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useFinancialInstitutionsData = () => {
  // Initialize state with structured data
  const [state, setState] = useState<FinancialDataState>({
    data: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  // Define the API endpoints
  const endpoints = {
    receivedMetrics: '/financial_institutions_module/bank_received_summary_metrics/',
    sentMetrics: '/financial_institutions_module/bank_sent_summary_metrics/',
    fulizaMetrics: '/financial_institutions_module/fuliza_loan_summary/',
    topReceived: '/financial_institutions_module/top_five_received_count/',
    topSent: '/financial_institutions_module/top_five_sent_count/',
    fulizaTransactions: '/financial_institutions_module/fuliza_usage/',
    safaricomServices: '/financial_institutions_module/identify_safaricom_financial_services/',
    creditScore: '/credit_score_module/get_credit_score/' 
  };

  // Fetch function with retry logic
  const fetchWithRetry = useCallback(async (url: string, retries = 3, delay = 1000) => {
    let lastError;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, {
          // Add headers that might help with CORS
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // Add credentials if needed
          // credentials: 'include', // Uncomment if your API requires credentials
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${attempt + 1} failed for ${url}. Retrying...`);
        
        if (attempt < retries - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          // Increase delay for next retry (exponential backoff)
          delay *= 2;
        }
      }
    }
    
    throw lastError;
  }, []);

  // Function to fetch all data with individual error handling
  const fetchAllData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const results: Record<string, any> = {};
    let hasError = false;
    let errorMessage = '';
    
    // Process each endpoint individually to prevent one failure from blocking all
    for (const [key, endpoint] of Object.entries(endpoints)) {
      try {
        const data = await fetchWithRetry(`${server}${endpoint}`);
        
        // Handle special case for fulizaTransactions
        if (key === 'fulizaTransactions') {
          results[key] = data?.fuliza_usage || [];
        } else {
          results[key] = data;
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        hasError = true;
        errorMessage += `Failed to fetch ${key}. `;
        
        // Use cached data for this endpoint if available
        if (state.data && state.data[key as keyof FinancialData]) {
          results[key] = state.data[key as keyof FinancialData];
          console.log(`Using cached data for ${key}`);
        } else {
          // Initialize with empty data structure
          results[key] = key.includes('top') || key.includes('Transactions') || key.includes('Services') ? [] : {};
        }
      }
    }
    
    // Update state with whatever data we could fetch
    setState({
      data: results as unknown as FinancialData,
      isLoading: false,
      error: hasError ? errorMessage : null,
      lastUpdated: new Date(),
    });
  }, [fetchWithRetry, state.data]);

  // Calculate insights based on available data
  const getInsights = useCallback(() => {
    if (!state.data) return null;
    
    const { receivedMetrics, sentMetrics, fulizaMetrics, creditScore  } = state.data;
    
    // Add defensive checks for all data
    const totalReceived = receivedMetrics?.total_amount || 0;
    const totalSent = sentMetrics?.total_amount || 0;
    const fulizaAmount = fulizaMetrics?.total_amount || 0;
    const score = creditScore?.credit_score || 0;
    
    return {
      netFlow: totalReceived - totalSent,
      fulizaUtilization: fulizaAmount,
      creditScore: score,
      creditScoreStatus: creditScore?.credit_score_status || 'Unknown',
      // Add more insights as needed, with defensive checks
    };
  }, [state.data]);

  // Function to manually refresh data
  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
    
    // Optional: Set up periodic refresh
    // const intervalId = setInterval(fetchAllData, 60000); // Refresh every minute
    // return () => clearInterval(intervalId);
  }, [fetchAllData]);

  return {
    ...state,
    insights: getInsights(),
    refreshData,
    isPartialData: state.error !== null && state.data !== null,
  };
};