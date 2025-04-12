import { server } from '@/utils/util';
import { useState, useEffect, useCallback, useRef } from 'react';

// Define interfaces based on your API responses
interface UtilityTransaction {
  "Receipt No.": string;
  "Completion Time": string;
  Details: string;
  amount: number;
  month_name: string;
  day_name: string;
  names?: string;
  numbers?: string;
}

interface UtilityMetrics {
  total_transactions: number;
  average_transactions_per_month: number;
  total_tranasacted_amount: number;
  highest_transacted_amount: number;
  minimum_transacted_amount: number;
  average_transacted_amount: number;
}

interface UtilityData {
  bills: UtilityTransaction[];
  kplcTransactions: UtilityTransaction[];
  kplcMetrics: UtilityMetrics | null;
  safaricomWifi: UtilityTransaction[];
  safaricomWifiMetrics: UtilityMetrics | null;
  zukuWifi: UtilityTransaction[];
  zukuWifiMetrics: UtilityMetrics | null;
  fuel: UtilityTransaction[];
  fuelMetrics: UtilityMetrics | null;
  chartData: any[];
}

interface UtilityDataState {
  data: UtilityData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useUtilityData = () => {
  // Initialize state with structured data
  const [state, setState] = useState<UtilityDataState>({
    data: null,
    isLoading: true,
    error: null,
    lastUpdated: null,
  });
  
  // Use a ref to track if the initial fetch has been done
  const initialFetchDone = useRef(false);

  // Define the API endpoints
  const endpoints = {
    bills: '/utility_module/data_bills/',
    kplc: '/utility_module/kplc/',
    kplcMetrics: '/utility_module/kplc_metrics/',
    safaricomWifi: '/utility_module/safaricom_wifi/',
    safaricomWifiMetrics: '/utility_module/safaricom_wifi_metrics/',
    zukuWifi: '/utility_module/zuku_wifi/',
    zukuWifiMetrics: '/utility_module/zuku_wifi_metrics/',
    fuel: '/utility_module/fuel/',
    fuelMetrics: '/utility_module/fuel_metrics/'
  };

  // Fetch function with retry logic
  const fetchWithRetry = useCallback(async (url: string, retries = 3, delay = 1000) => {
    let lastError;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        console.log(`Attempt ${attempt + 1} failed for ${url}. Retrying...`);
        
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }
    
    throw lastError;
  }, []);

  // Function to fetch all data with individual error handling
  const fetchAllData = useCallback(async () => {
    console.log("Fetching utility data...");
    setState(prev => ({ ...prev, isLoading: true }));
    
    const results: Partial<UtilityData> = {};
    let hasError = false;
    let errorMessage = '';
    
    // Helper function to safely fetch data from endpoints
    const safelyFetchData = async (endpointUrl: string, fallbackData: any = []) => {
      try {
        return await fetchWithRetry(`${server}${endpointUrl}`);
      } catch (error) {
        console.error(`Error fetching from ${endpointUrl}:`, error);
        hasError = true;
        // Use cached data if available or fallback
        return state.data ? (state.data[endpointUrl.split('/').pop() as keyof UtilityData] || fallbackData) : fallbackData;
      }
    };
    
    try {
      // Fetch data from all endpoints
      results.bills = await safelyFetchData(endpoints.bills, []);
      results.kplcTransactions = await safelyFetchData(endpoints.kplc, []);
      results.kplcMetrics = await safelyFetchData(endpoints.kplcMetrics, null);
      results.safaricomWifi = await safelyFetchData(endpoints.safaricomWifi, []);
      results.safaricomWifiMetrics = await safelyFetchData(endpoints.safaricomWifiMetrics, null);
      results.zukuWifi = await safelyFetchData(endpoints.zukuWifi, []);
      results.zukuWifiMetrics = await safelyFetchData(endpoints.zukuWifiMetrics, null);
      results.fuel = await safelyFetchData(endpoints.fuel, []);
      results.fuelMetrics = await safelyFetchData(endpoints.fuelMetrics, null);
      
    } catch (error) {
      console.error('Error fetching utility data:', error);
      hasError = true;
      errorMessage = 'Failed to fetch utility data. Please try again later.';
      
      // Use cached data if available
      if (state.data) {
        Object.keys(endpoints).forEach(key => {
          const endpoint = key as keyof typeof endpoints;
          results[endpoint] = results[endpoint] || state.data?.[endpoint as keyof UtilityData];
        });
      }
    }
    
    // Transform KPLC data for the chart if available
    const chartData = results.kplcTransactions && results.kplcTransactions.length > 0
      ? results.kplcTransactions
          .reduce((acc: any[], item: UtilityTransaction) => {
            // Group by month for chart
            const existingMonth = acc.find(x => x.month === item.month_name);
            if (existingMonth) {
              existingMonth.amount += item.amount;
            } else {
              acc.push({
                month: item.month_name,
                amount: item.amount
              });
            }
            return acc;
          }, [])
          .sort((a: any, b: any) => {
            // Sort months correctly
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months.indexOf(a.month) - months.indexOf(b.month);
          })
      : [];
    
    results.chartData = chartData;
    
    // Update state with whatever data we could fetch
    setState({
      data: results as UtilityData,
      isLoading: false,
      error: hasError ? errorMessage : null,
      lastUpdated: new Date(),
    });
    
    console.log("Utility data fetch completed", results);
  }, [fetchWithRetry, state.data]); 

  // Function to manually refresh data
  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Initial data fetch - only run once
  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchAllData();
      initialFetchDone.current = true;
    }
  }, [fetchAllData]);

  return {
    ...state,
    chartData: state.data?.chartData || [],
    refreshData,
    isPartialData: state.error !== null && state.data !== null,
  };
};