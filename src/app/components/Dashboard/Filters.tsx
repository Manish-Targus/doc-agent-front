// components/Filters.tsx
import React, { useState, useEffect } from 'react';
import { Filter, Calendar, Info } from 'lucide-react';

// Export the FilterState interface
export interface FilterState {
  // Status Type Filters
  ongoing_bids: boolean;
  bidrastatus: boolean;
  
  // Bid Type Filters
  all: boolean;
  product: boolean;
  service: boolean;
  bidToRA: boolean;
  custom: boolean;
  boq: boolean;
  rcbid: boolean;
  byType: string;
  // Bid Value Filter
  highValue: boolean;
  
  // Bid Status Filters
  tech_evaluated: boolean;
  fin_evaluated: boolean;
  bid_awarded: boolean;
      highBidValue:string;
  // Date Filters
  fromEndDate: string;
  toEndDate: string;
  bidStatusType:string;
}

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [filterState, setFilterState] = useState<FilterState>({
    // Status Type
    ongoing_bids: false,
    bidrastatus: false,
    
    // Bid Types
    all: false,
    product: false,
    service: false,
    bidToRA: false,
    custom: false,
    boq: false,
    rcbid: false,
    byType:'',
    // Bid Value
    highValue: false,
    highBidValue:'',
    // Bid Status
    tech_evaluated: false,
    fin_evaluated: false,
    bid_awarded: false,
    
    // Dates
    fromEndDate: '',
    toEndDate: '',
    bidStatusType:'',
  });

  const [showBidRAStatus, setShowBidRAStatus] = useState(false);

  // Handle status type filter changes
  const handleBidStatusTypeFilter = (type: 'ongoing_bids' | 'bidrastatus') => {
    const updatedState = {
      ...filterState,
      [type]: !filterState[type],
    };
    
    // Show/hide bid/RA status section
    if (type === 'bidrastatus') {
      setShowBidRAStatus(!filterState.bidrastatus);
    }
    
    setFilterState(updatedState);
  };

  // Handle bid type filter changes (exclusive selection)
  const handleTypeFilter = (type: string) => {
    if (type === 'all') {
      // Reset all other bid type filters when "All" is selected
      setFilterState(prev => ({
        ...prev,
        all: !prev.all,
        product: false,
        service: false,
        bidToRA: false,
        custom: false,
        boq: false,
        rcbid: false,
      }));
    } else {
      // Uncheck "All" when selecting specific type
      setFilterState(prev => ({
        ...prev,
        all: false,
        [type]: !prev[type as keyof FilterState],
      }));
    }
  };

  // Handle high value filter
  const handleHighValueFilter = () => {
    setFilterState(prev => ({
      ...prev,
      highValue: !prev.highValue,
    }));
  };

  // Handle bid status filter
  const handleBidStatusFilter = (status: string) => {
    setFilterState(prev => ({
      ...prev,
      [status]: !prev[status as keyof FilterState],
    }));
  };

  // Handle date filter changes
  const handleDateFilter = (dateType: 'fromEndDate' | 'toEndDate', value: string) => {
    setFilterState(prev => ({
      ...prev,
      [dateType]: value,
    }));
  };

  // Reset all filters
  const clearAllFilters = () => {
    setFilterState({
      ongoing_bids: false,
      bidrastatus: false,
      all: false,
      product: false,
      service: false,
      bidToRA: false,
      custom: false,
      boq: false,
      rcbid: false,
      highValue: false,
      tech_evaluated: false,
      fin_evaluated: false,
      bid_awarded: false,
      fromEndDate: '',
      toEndDate: '',
      byType:'',
      highBidValue:'',
      bidStatusType:'',
    });

    setShowBidRAStatus(false);
  };

  // Trigger filter change callback whenever filterState changes
  useEffect(() => {
    onFilterChange(filterState);
  }, [filterState, onFilterChange]);

  return (
    <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          Reset
        </button>
      </div>
      
      <hr className="border-t-2 border-blue-800 mb-6" />
      
      {/* Status Type Filters */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="ongoing_bids"
            checked={filterState.ongoing_bids}
            onChange={() => handleBidStatusTypeFilter('ongoing_bids')}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="ongoing_bids" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
            Ongoing Bids/RA
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="bidrastatus"
            checked={filterState.bidrastatus}
            onChange={() => handleBidStatusTypeFilter('bidrastatus')}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="bidrastatus" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
            Bid/RA Status
          </label>
        </div>
      </div>
      
      {/* By Bid Type */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">By Bid Type:</h4>
        <div className="space-y-2">
          {[
            { id: 'all', label: 'All Bid/RAs' },
            { id: 'product', label: 'Product Bid/RAs' },
            { id: 'service', label: 'Service Bid/RAs' },
            { id: 'bidToRA', label: 'Bid To RAs' },
            { id: 'custom', label: 'Product Custom Bid/RAs' },
            { id: 'boq', label: 'BOQ Bids' },
            { id: 'rcbid', label: 'Rate Contract Bids' },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center">
              <input
                type="checkbox"
                id={id}
                checked={filterState?.byType === id}
                onChange={() => setFilterState({...filterState, byType: id})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor={id} className="ml-2 text-sm text-gray-700 cursor-pointer">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* By Bid Value */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">By Bid Value:</h4>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="highValue"
            checked={filterState.highBidValue === 'highValue'}
            onChange={
              () => setFilterState({...filterState, highBidValue: filterState.highBidValue === 'highValue' ? '' : 'highValue'})
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="highValue" className="ml-2 text-sm text-gray-700 cursor-pointer flex items-center gap-1">
            High Value Bids
            <span title="Bids where buyer mentioned the estimated bid value equal to or greater than Rs 2 Cr">
              <Info className="w-4 h-4 text-gray-400" />
            </span>
          </label>
        </div>
      </div>
      
      {/* By Bid/RA Status (Conditional) */}
      {showBidRAStatus && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">By Bid/RA Status:</h4>
          <div className="space-y-2">
            {[
              { id: 'tech_evaluated', label: 'Technical Evaluated' },
              { id: 'fin_evaluated', label: 'Financial Evaluated' },
              { id: 'bid_awarded', label: 'Bid/RA Awarded' },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={id}
                  checked={filterState[id as keyof FilterState] as boolean}
                  onChange={() => handleBidStatusFilter(id)}
                  disabled={!filterState.bidrastatus}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor={id} className={`ml-2 text-sm cursor-pointer ${
                  !filterState.bidrastatus ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Date Filters */}
      <div className="space-y-4">
        <div>
          <h5 className="font-medium text-gray-700 mb-2">Bid End Date (From):</h5>
          <div className="relative">
            <input
              type="date"
              id="fromEndDate"
              value={filterState.fromEndDate}
              onChange={(e) => handleDateFilter('fromEndDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-700 mb-2">Bid End Date (To):</h5>
          <div className="relative">
            <input
              type="date"
              id="toEndDate"
              value={filterState.toEndDate}
              onChange={(e) => handleDateFilter('toEndDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};