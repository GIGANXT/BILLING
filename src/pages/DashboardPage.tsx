import React from 'react';
import { IndianRupee, Package, Users, AlertTriangle, TrendingUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Welcome to your pharmacy dashboard</p>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4 mt-2 sm:mt-0">
            <span className="text-xs sm:text-sm text-gray-600">Welcome back, Dr. Smith</span>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          <DashboardCard
            title="Today's Sales"
            value="₹24,500"
            icon={IndianRupee}
            trend={{ value: 12, isPositive: true }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-lg transition-shadow duration-300"
          />
          <DashboardCard
            title="Total Products"
            value="1,456"
            icon={Package}
            trend={{ value: 3, isPositive: true }}
            className="bg-gradient-to-r from-green-50 to-green-100 hover:shadow-lg transition-shadow duration-300"
          />
          <DashboardCard
            title="Total Customers"
            value="892"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
            className="bg-gradient-to-r from-purple-50 to-purple-100 hover:shadow-lg transition-shadow duration-300"
          />
          <DashboardCard
            title="Low Stock Items"
            value="23"
            icon={AlertTriangle}
            className="bg-gradient-to-r from-red-50 to-red-100 hover:shadow-lg transition-shadow duration-300"
          />
          <DashboardCard
            title="Receivables"
            value="₹32,450"
            icon={ArrowDownLeft}
            trend={{ value: 5, isPositive: true }}
            className="bg-gradient-to-r from-amber-50 to-amber-100 hover:shadow-lg transition-shadow duration-300"
          />
          <DashboardCard
            title="Payable"
            value="₹18,720"
            icon={ArrowUpRight}
            trend={{ value: 2, isPositive: false }}
            className="bg-gradient-to-r from-cyan-50 to-cyan-100 hover:shadow-lg transition-shadow duration-300"
          />
        </div>

        {/* Recent Sales Table */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Sales</h2>
            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors duration-300">
              View All
            </button>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-lg">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="text-left text-xs sm:text-sm font-medium text-gray-500 border-b">
                  <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 pl-4 sm:pl-2">Invoice</th>
                  <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 px-2">Customer</th>
                  <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 px-2">Products</th>
                  <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 px-2">Amount</th>
                  <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 pl-2 pr-4 sm:pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="text-xs sm:text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-300">
                    <td className="py-3 sm:py-4 pl-4 sm:pl-2">#INV-{2024000 + i}</td>
                    <td className="py-3 sm:py-4 px-2">John Doe</td>
                    <td className="py-3 sm:py-4 px-2">3 items</td>
                    <td className="py-3 sm:py-4 px-2">₹1,{200 + i * 100}</td>
                    <td className="py-3 sm:py-4 pl-2 pr-4 sm:pr-2 text-center sm:text-left">
                      <span className="inline-block px-2 py-0.5 sm:py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Sales Analytics</h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-xs sm:text-sm font-medium text-green-600">+12.5% from last month</span>
            </div>
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
            <span className="text-base sm:text-lg font-medium">Sales chart will be implemented here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;