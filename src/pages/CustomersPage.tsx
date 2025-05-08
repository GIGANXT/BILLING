import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Customer } from '../types';

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+91 98765 43210',
      email: 'john@example.com',
      loyaltyPoints: 150
    },
    // Add more mock data as needed
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Customer Management</h1>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Customer
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="loyalty">Loyalty Points</option>
              <option value="recent">Recent Purchase</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b">
                  <th className="pb-4 pr-4">Name</th>
                  <th className="pb-4 pr-4">Phone</th>
                  <th className="pb-4 pr-4">Email</th>
                  <th className="pb-4 pr-4">Loyalty Points</th>
                  <th className="pb-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockCustomers.map((customer) => (
                  <tr key={customer.id} className="text-sm text-gray-800">
                    <td className="py-4 pr-4">{customer.name}</td>
                    <td className="py-4 pr-4">{customer.phone}</td>
                    <td className="py-4 pr-4">{customer.email}</td>
                    <td className="py-4 pr-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {customer.loyaltyPoints} points
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;