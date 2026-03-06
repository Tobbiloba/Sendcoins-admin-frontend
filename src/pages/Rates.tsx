import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchNormal1, Edit2, TickCircle, CloseCircle, Refresh2, Clock, ArrowRight } from 'iconsax-react';
import { queryKeys } from '@/lib/queryClient';
import { rateService, CurrencyRate, UpdateRateParams, UpdateRateResponse, RateHistoryItem } from '@/services/rateService';
import { useMfaProtectedAction } from '@/hooks/useMfaProtectedAction';
import { MfaVerificationModal } from '@/components/modals/MfaVerificationModal';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditingRate {
  currency_init: string;
  buying_rate: string;
  selling_rate: string;
  market_rate: string;
}

export default function Rates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCurrencyInit, setEditingCurrencyInit] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<EditingRate | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<CurrencyRate | null>(null);
  const [rateHistory, setRateHistory] = useState<RateHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch rates
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.rates.list(),
    queryFn: () => rateService.getAll(),
  });

  // MFA protected action for updates
  const mfa = useMfaProtectedAction<void>({
    actionName: 'Update Currency Rate',
    actionDescription: 'Updating exchange rates requires MFA verification for security.',
    onSuccess: () => {
      toast({
        title: 'Rate Updated',
        description: 'The currency rate has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ currencyInit, data }: { currencyInit: string; data: UpdateRateParams }) =>
      rateService.update(currencyInit, data),
    onSuccess: (response: UpdateRateResponse) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rates.all });

      // Show before/after in toast if available
      if (response.beforeData && response.afterData) {
        const changes: string[] = [];

        if (response.beforeData.buying_rate !== response.afterData.buying_rate) {
          changes.push(`Buying: ${formatRate(response.beforeData.buying_rate)} → ${formatRate(response.afterData.buying_rate)}`);
        }
        if (response.beforeData.selling_rate !== response.afterData.selling_rate) {
          changes.push(`Selling: ${formatRate(response.beforeData.selling_rate)} → ${formatRate(response.afterData.selling_rate)}`);
        }
        if (response.beforeData.market_rate !== response.afterData.market_rate) {
          changes.push(`Market: ${formatRate(response.beforeData.market_rate)} → ${formatRate(response.afterData.market_rate)}`);
        }

        toast({
          title: `${response.data.currency_init} Rate Updated`,
          description: changes.join(' | ') || 'Rate updated successfully.',
        });
      }

      setEditingCurrencyInit(null);
      setEditingValues(null);
    },
  });

  // Filter rates by search
  const filteredRates = useMemo(() => {
    if (!data?.data) return [];
    if (!searchQuery) return data.data;

    const query = searchQuery.toLowerCase();
    return data.data.filter(
      (rate) =>
        rate.currency_name.toLowerCase().includes(query) ||
        rate.currency_init.toLowerCase().includes(query) ||
        rate.country?.toLowerCase().includes(query)
    );
  }, [data?.data, searchQuery]);

  // Start editing
  const handleEdit = (rate: CurrencyRate) => {
    setEditingCurrencyInit(rate.currency_init);
    setEditingValues({
      currency_init: rate.currency_init,
      buying_rate: rate.buying_rate?.toString() || '0',
      selling_rate: rate.selling_rate?.toString() || '0',
      market_rate: rate.market_rate?.toString() || '0',
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingCurrencyInit(null);
    setEditingValues(null);
  };

  // Save changes with MFA
  const handleSave = async () => {
    if (!editingValues) return;

    const updateData: UpdateRateParams = {};
    const originalRate = data?.data.find((r) => r.currency_init === editingValues.currency_init);

    if (!originalRate) return;

    // Only include changed values
    const newBuying = parseFloat(editingValues.buying_rate);
    const newSelling = parseFloat(editingValues.selling_rate);
    const newMarket = parseFloat(editingValues.market_rate);

    if (newBuying !== originalRate.buying_rate) {
      updateData.buying_rate = newBuying;
    }
    if (newSelling !== originalRate.selling_rate) {
      updateData.selling_rate = newSelling;
    }
    if (newMarket !== originalRate.market_rate) {
      updateData.market_rate = newMarket;
    }

    // If nothing changed, just close
    if (Object.keys(updateData).length === 0) {
      handleCancel();
      return;
    }

    // Execute with MFA protection
    await mfa.executeWithMfa(async () => {
      await updateMutation.mutateAsync({ currencyInit: editingValues.currency_init, data: updateData });
    });
  };

  // Calculate spread percentage
  const calculateSpread = (buying: number, selling: number): string => {
    if (!buying || !selling) return '-';
    const spread = ((selling - buying) / buying) * 100;
    return spread.toFixed(2) + '%';
  };

  // Format rate with commas
  const formatRate = (rate: number | null): string => {
    if (rate === null || rate === undefined) return '-';
    return rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  // Handle clicking on a rate to view history
  const handleViewHistory = async (rate: CurrencyRate) => {
    setSelectedRate(rate);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    setRateHistory([]);

    try {
      const response = await rateService.getHistory(rate.currency_init);
      if (response.success) {
        setRateHistory(response.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load rate history',
        variant: 'destructive',
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  // Format date for history
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  return (
    <DashboardLayout title="Currency Rates">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <SearchNormal1 size="20" color="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search currencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
            />
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Refresh2 size="18" color="currentColor" />
          Refresh
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Buying rate is what users pay when buying crypto. Selling rate is what users receive when selling.
          The spread is the platform's margin.
        </p>
      </div>

      {/* Rates Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>Failed to load rates</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Try again
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Buying Rate
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Selling Rate
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Market Rate
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Spread
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRates.map((rate) => (
                <tr key={rate.currency_init} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewHistory(rate)}
                      className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                    >
                      {rate.flag_emoji ? (
                        <span className="text-2xl">{rate.flag_emoji}</span>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {rate.currency_init}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {rate.currency_name}
                          <Clock size="14" color="currentColor" className="text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-500">
                          {rate.currency_init} ({rate.currency_sign})
                        </div>
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingCurrencyInit === rate.currency_init && editingValues ? (
                      <input
                        type="number"
                        step="0.0001"
                        value={editingValues.buying_rate}
                        onChange={(e) =>
                          setEditingValues({ ...editingValues, buying_rate: e.target.value })
                        }
                        className="w-32 px-3 py-1.5 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                      />
                    ) : (
                      <span className="font-mono text-gray-900">{formatRate(rate.buying_rate)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingCurrencyInit === rate.currency_init && editingValues ? (
                      <input
                        type="number"
                        step="0.0001"
                        value={editingValues.selling_rate}
                        onChange={(e) =>
                          setEditingValues({ ...editingValues, selling_rate: e.target.value })
                        }
                        className="w-32 px-3 py-1.5 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                      />
                    ) : (
                      <span className="font-mono text-gray-900">{formatRate(rate.selling_rate)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingCurrencyInit === rate.currency_init && editingValues ? (
                      <input
                        type="number"
                        step="0.0001"
                        value={editingValues.market_rate}
                        onChange={(e) =>
                          setEditingValues({ ...editingValues, market_rate: e.target.value })
                        }
                        className="w-32 px-3 py-1.5 text-right border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none"
                      />
                    ) : (
                      <span className="font-mono text-gray-500">{formatRate(rate.market_rate)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        rate.selling_rate > rate.buying_rate
                          ? 'bg-green-50 text-green-700'
                          : rate.selling_rate < rate.buying_rate
                          ? 'bg-red-50 text-red-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {calculateSpread(rate.buying_rate, rate.selling_rate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingCurrencyInit === rate.currency_init ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={handleSave}
                          disabled={mfa.isLoading || updateMutation.isPending}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          <TickCircle size="20" color="currentColor" />
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={mfa.isLoading || updateMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Cancel"
                        >
                          <CloseCircle size="20" color="currentColor" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(rate)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size="18" color="currentColor" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && !isError && filteredRates.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No currencies found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Total count */}
      {!isLoading && !isError && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredRates.length} of {data?.data.length || 0} currencies
        </div>
      )}

      {/* MFA Verification Modal */}
      <MfaVerificationModal
        open={mfa.isMfaModalOpen}
        onOpenChange={(open) => !open && mfa.closeMfaModal()}
        onVerified={mfa.handleMfaVerified}
        actionName={mfa.modalConfig.actionName}
        actionDescription={mfa.modalConfig.actionDescription}
      />

      {/* Rate History Modal */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRate?.flag_emoji && <span className="text-xl">{selectedRate.flag_emoji}</span>}
              {selectedRate?.currency_name} ({selectedRate?.currency_init}) - Rate History
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {historyLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : rateHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Clock size="32" color="currentColor" className="mb-2 opacity-50" />
                <p>No rate changes recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rateHistory.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </div>
                      <div className="text-xs text-gray-400">
                        by {item.admin.name}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {/* Buying Rate */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Buying Rate</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-400">
                            {formatRate(item.before?.buying_rate ?? null)}
                          </span>
                          <ArrowRight size="14" color="currentColor" className="text-gray-400" />
                          <span className="font-mono text-gray-900 font-medium">
                            {formatRate(item.after?.buying_rate ?? null)}
                          </span>
                        </div>
                      </div>

                      {/* Selling Rate */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Selling Rate</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-400">
                            {formatRate(item.before?.selling_rate ?? null)}
                          </span>
                          <ArrowRight size="14" color="currentColor" className="text-gray-400" />
                          <span className="font-mono text-gray-900 font-medium">
                            {formatRate(item.after?.selling_rate ?? null)}
                          </span>
                        </div>
                      </div>

                      {/* Market Rate */}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Market Rate</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-400">
                            {formatRate(item.before?.market_rate ?? null)}
                          </span>
                          <ArrowRight size="14" color="currentColor" className="text-gray-400" />
                          <span className="font-mono text-gray-900 font-medium">
                            {formatRate(item.after?.market_rate ?? null)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
