/**
 * Rate Service
 * Admin management of currency exchange rates
 */

import { api } from '../lib/api';

export interface CurrencyRate {
  currency_name: string;
  currency_init: string;
  country: string | null;
  image: string | null;
  currency_sign: string | null;
  selling_rate: number | null;
  buying_rate: number | null;
  market_rate: number | null;
  flag: string | null;
  flag_emoji: string | null;
}

export interface UpdateRateParams {
  buying_rate?: number;
  selling_rate?: number;
  market_rate?: number;
}

export interface BulkUpdateItem {
  currency_init: string;
  buying_rate?: number;
  selling_rate?: number;
  market_rate?: number;
}

export interface BulkUpdateResponse {
  success: boolean;
  message: string;
  data: CurrencyRate[];
  updated: number;
  failed: number;
  errors?: { currency_init: string; error: string }[];
}

export interface RateChangeData {
  buying_rate: number | null;
  selling_rate: number | null;
  market_rate: number | null;
}

export interface UpdateRateResponse {
  success: boolean;
  message: string;
  data: CurrencyRate;
  beforeData?: RateChangeData;
  afterData?: RateChangeData;
}

export const rateService = {
  /**
   * Get all currency rates
   */
  getAll: async (): Promise<{ success: boolean; data: CurrencyRate[] }> => {
    const response = await api.get<{ success: boolean; data: CurrencyRate[] }>('/admin/rates');
    return response;
  },

  /**
   * Get a single currency rate by currency_init (e.g., 'NGN', 'USD')
   */
  getOne: async (currencyInit: string): Promise<{ success: boolean; data: CurrencyRate }> => {
    const response = await api.get<{ success: boolean; data: CurrencyRate }>(`/admin/rates/${currencyInit}`);
    return response;
  },

  /**
   * Update a currency rate
   */
  update: async (
    currencyInit: string,
    data: UpdateRateParams
  ): Promise<UpdateRateResponse> => {
    const response = await api.patch<UpdateRateResponse>(
      `/admin/rates/${currencyInit}`,
      data
    );
    return response;
  },
};
