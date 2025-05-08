import React, { useState } from 'react';
import { AlertTriangle, Calendar, Package, Filter } from 'lucide-react';
import { Medicine, BatchType } from '../../types';

const ExpiryTracker: React.FC = () => {
  const [filterDays, setFilterDays] = useState<30 | 60 | 90>(30);
  const [selectedBatch, setSelectedBatch] = useState<BatchType | 'ALL'>('ALL');

  // Mock data for demonstration
  const mockMedicines: Medicine[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      barcode: '123456789012',
      batches: [
        {
          type: 'A',
          quantity: 200,
          expiryDate: '2025-03-15', // Long expiry
        },
        {
          type: 'B',
          quantity: 150,
          expiryDate: '2024-06-30', // Medium expiry
        },
        {
          type: 'C',
          quantity: 100,
          expiryDate: '2024-04-15', // Short expiry
        },
      ],
      stock: 450,
      price: 5.99,
      manufacturer: 'PharmaCo',
      category: 'Pain Relief',
    },
    {
      id: '2',
      name: 'Ibuprofen 400mg',
      barcode: '987654321098',
      batches: [
        {
          type: 'A',
          quantity: 150,
          expiryDate: '2025-05-30',
        },
        {
          type: 'B',
          quantity: 100,
          expiryDate: '2024-08-15',
        },
        {
          type: 'C',
          quantity: 50,
          expiryDate: '2024-05-30',
        },
      ],
      stock: 300,
      price: 8.99,
      manufacturer: 'MediCare',
      category: 'Pain Relief',
    },
  ];

  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (daysUntilExpiry: number): {
    color: string;
    text: string;
  } => {
    if (daysUntilExpiry <= 30) {
      return { color: 'text-red-600', text: 'Critical' };
    } else if (daysUntilExpiry <= 60) {
      return { color: 'text-yellow-600', text: 'Warning' };
    } else {
      return { color: 'text-green-600', text: 'Good' };
    }
  };

  const getBatchTypeLabel = (type: BatchType): string => {
    switch (type) {
      case 'A':
        return 'Short Expiry';
      case 'B':
        return 'Medium Expiry';
      case 'C':
        return 'Long Expiry';
    }
  };

  const getBatchTypeColor = (type: BatchType): string => {
    switch (type) {
      case 'A':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'B':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'C':
        return 'bg-green-100 text-green-700 border border-green-200';
    }
  };

  const filteredMedicines = mockMedicines.flatMap((medicine) =>
    medicine.batches
      .filter((batch) => selectedBatch === 'ALL' || batch.type === selectedBatch)
      .filter((batch) => calculateDaysUntilExpiry(batch.expiryDate) <= filterDays)
      .map((batch) => ({
        ...medicine,
        batch,
      }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Expiry Tracking</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value as BatchType | 'ALL')}
            className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Batches</option>
            <option value="A">Batch A (Long Expiry)</option>
            <option value="B">Batch B (Medium Expiry)</option>
            <option value="C">Batch C (Short Expiry)</option>
          </select>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterDays}
              onChange={(e) => setFilterDays(Number(e.target.value) as 30 | 60 | 90)}
              className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={30}>Next 30 Days</option>
              <option value={60}>Next 60 Days</option>
              <option value={90}>Next 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-red-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Critical</p>
              <p className="text-2xl font-bold text-red-700">
                {filteredMedicines.filter((m) => calculateDaysUntilExpiry(m.batch.expiryDate) <= 30).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-red-600">Expiring within 30 days</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Warning</p>
              <p className="text-2xl font-bold text-yellow-700">
                {filteredMedicines.filter(
                  (m) => {
                    const days = calculateDaysUntilExpiry(m.batch.expiryDate);
                    return days > 30 && days <= 60;
                  }
                ).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-yellow-600">Expiring within 60 days</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Tracked</p>
              <p className="text-2xl font-bold text-blue-700">{filteredMedicines.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-blue-600">Items being monitored</p>
        </div>
      </div>

      {/* Expiry List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 bg-gray-50">
                <th className="px-6 py-4">Medicine</th>
                <th className="px-6 py-4">Batch Type</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Days Left</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedicines.map((medicine) => {
                const daysLeft = calculateDaysUntilExpiry(medicine.batch.expiryDate);
                const status = getExpiryStatus(daysLeft);

                return (
                  <tr key={`${medicine.id}-${medicine.batch.type}`} className="text-sm text-gray-800">
                    <td className="px-6 py-4">{medicine.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBatchTypeColor(medicine.batch.type)}`}>
                        {getBatchTypeLabel(medicine.batch.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{medicine.batch.quantity}</td>
                    <td className="px-6 py-4">{medicine.batch.expiryDate}</td>
                    <td className="px-6 py-4">{daysLeft} days</td>
                    <td className="px-6 py-4">
                      <span className={`${status.color} font-medium`}>{status.text}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpiryTracker;