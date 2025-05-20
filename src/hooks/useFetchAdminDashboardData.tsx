"use client";

import { useState, useCallback } from 'react';
import {
  dashboardTransformPayload,
  TypeDashboardTransformedPayload,
} from '@/utils/dashboardPayloadFormatter';

interface Range {
  start: string;
  end: string;
}

interface UseFetchDashboardData {
  data: TypeDashboardTransformedPayload[];
  allData: any;
  error: string | null;
  isLoading: boolean;
  fetchData: (range: Range | null, signal: AbortSignal) => Promise<void>;
}

const useFetchAdminDashboardData = (): UseFetchDashboardData => {
  const [data, setData] = useState<TypeDashboardTransformedPayload[]>([]);
  const [allData, setAllData] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (range: Range | null, signal: AbortSignal): Promise<void> => {
      setError(null);
      setIsLoading(true);

      let baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}dashboard/admin?`;

      if (range) {
        baseURL += `&start=${range.start}&end=${range.end}`;
      }

      console.log("Fetching admin dashboard data from URL:", baseURL);

      try {
        const response = await fetch(baseURL, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();

        const transformedData =
          result.data?.latestTransactions?.length > 0
            ? dashboardTransformPayload(result.data.latestTransactions)
            : [];

        setAllData(result.data);
        setData(transformedData);
      } catch (fetchError: any) {
        if (fetchError.name === 'AbortError') {
          console.warn('Fetch request aborted');
        } else {
          const errorMessage =
            fetchError.message || 'An error occurred during data fetching';
          setError(errorMessage);
          console.error('Error fetching data:', fetchError);
        }
      } finally {
        setIsLoading(false);
        console.log("Fetch admin dashboard finished. isLoading set to false");
      }
    },
    []
  );

  return { data, allData, error, isLoading, fetchData };
};

export default useFetchAdminDashboardData;
