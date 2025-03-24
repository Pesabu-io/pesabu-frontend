import { server } from '@/utils/util';
import { useState, useEffect, useCallback, useRef } from 'react';

// Define interfaces based on your API responses
interface KplcTransaction {
  "Receipt No.": string;
  "Completion Time": string;
  amount: number;
  month_name: string;
}

interface KplcMetrics {
  total_transactions: number;
  average_transactions_per_month: number;
  total_tranasacted_amount: number;
  average_transacted_amount: number;
}

interface WifiStatus {
  safaricom: string | null;
  zuku: string | null;
}

interface UtilityData {
  bills: any[];
  kplcTransactions: KplcTransaction[];
  kplcMetrics: KplcMetrics | null;
  wifiStatus: WifiStatus;
  fuelStatus: string | null;
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
    safaricomMetrics: '/utility_module/safaricom_wifi_metrics/',
    zukuWifi: '/utility_module/zuku_wifi/',
    zukuMetrics: '/utility_module/zuku_wifi_metrics/',
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
    
    // Process each endpoint individually
    try {
      // Fetch bills data
      results.bills = await fetchWithRetry(`${server}${endpoints.bills}`);
      
      // Fetch KPLC transactions
      results.kplcTransactions = await fetchWithRetry(`${server}${endpoints.kplc}`);
      
      // Fetch KPLC metrics
      results.kplcMetrics = await fetchWithRetry(`${server}${endpoints.kplcMetrics}`);
      
      // Fetch WiFi status
      const safaricomData = await fetchWithRetry(`${server}${endpoints.safaricomWifi}`);
      const zukuData = await fetchWithRetry(`${server}${endpoints.zukuWifi}`);
      
      results.wifiStatus = {
        safaricom: safaricomData.message || null,
        zuku: zukuData.message || null
      };
      
      // Fetch fuel status
      const fuelData = await fetchWithRetry(`${server}${endpoints.fuel}`);
      results.fuelStatus = fuelData.message || null;
      
    } catch (error) {
      console.error('Error fetching utility data:', error);
      hasError = true;
      errorMessage = 'Failed to fetch utility data. Please try again later.';
      
      // Use cached data if available
      if (state.data) {
        results.bills = results.bills || state.data.bills;
        results.kplcTransactions = results.kplcTransactions || state.data.kplcTransactions;
        results.kplcMetrics = results.kplcMetrics || state.data.kplcMetrics;
        results.wifiStatus = results.wifiStatus || state.data.wifiStatus;
        results.fuelStatus = results.fuelStatus || state.data.fuelStatus;
      } else {
        // Initialize with empty data structure if no cached data
        results.bills = results.bills || [];
        results.kplcTransactions = results.kplcTransactions || [];
        results.kplcMetrics = results.kplcMetrics || null;
        results.wifiStatus = results.wifiStatus || { safaricom: null, zuku: null };
        results.fuelStatus = results.fuelStatus || null;
      }
    }
    
    // Transform KPLC data for the chart if available
    const chartData = results.kplcTransactions && results.kplcTransactions.length > 0
      ? results.kplcTransactions
          .map((item: KplcTransaction) => ({
            month: item.month_name,
            amount: item.amount
          }))
          .sort((a: any, b: any) => {
            // Handle potential date parsing issues
            try {
              return new Date(a.month).getTime() - new Date(b.month).getTime();
            } catch (e) {
              return 0;
            }
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
    
    console.log("Utility data fetch completed");
  }, [fetchWithRetry]); // Only depend on fetchWithRetry

  // Calculate insights based on available data
  const getInsights = useCallback(() => {
    if (!state.data) return null;
    
    const { kplcMetrics } = state.data;
    
    return {
      totalKplcSpending: kplcMetrics?.total_tranasacted_amount || 0,
      avgMonthlyElectricity: kplcMetrics?.average_transacted_amount || 0,
    };
  }, [state.data]);

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
    insights: getInsights(),
    refreshData,
    isPartialData: state.error !== null && state.data !== null,
  };
};