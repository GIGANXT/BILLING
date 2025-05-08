import React, { useState } from 'react';
import { Calendar, Download, BarChart2, PieChart as PieChartIcon, TrendingUp, Package, FileText } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Label,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, Title, Text, TabList, Tab, TabGroup, TabPanels, TabPanel } from '@tremor/react';

type ReportType = 'sales' | 'gst' | 'inventory';

interface PieChartLabelProps {
  name: string;
  value: number;
}

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReport, setSelectedReport] = useState<ReportType>('sales');

  // Mock data for GST report
  const gstData = {
    currentMonth: {
      taxableAmount: 24500.00,
      cgst: 2205.00,
      sgst: 2205.00,
      totalTax: 4410.00,
      totalAmount: 28910.00,
      percentChange: 8.5
    },
    monthlyData: [
      {
        month: 'May 2023',
        taxableAmount: 24500.00,
        cgst: 2205.00,
        sgst: 2205.00,
        totalTax: 4410.00,
        totalAmount: 28910.00
      },
      {
        month: 'April 2023',
        taxableAmount: 31200.00,
        cgst: 2808.00,
        sgst: 2808.00,
        totalTax: 5616.00,
        totalAmount: 36816.00
      },
      {
        month: 'March 2023',
        taxableAmount: 27800.00,
        cgst: 2502.00,
        sgst: 2502.00,
        totalTax: 5004.00,
        totalAmount: 32804.00
      }
    ]
  };

  // Mock data for Sales report
  const salesData = {
    currentMonth: {
      totalSales: 124500.00,
      totalOrders: 256,
      averageOrderValue: 486.00,
      totalProfit: 28650.00,
      percentChange: 12.5
    },
    monthlyData: [
      {
        month: 'May 2023',
        sales: 124500,
        orders: 256,
        profit: 28650
      },
      {
        month: 'April 2023',
        sales: 118200,
        orders: 243,
        profit: 27300
      },
      {
        month: 'March 2023',
        sales: 110500,
        orders: 228,
        profit: 25400
      }
    ]
  };

  // Mock data for Inventory report
  const inventoryData = {
    currentMonth: {
      totalItems: 1456,
      lowStock: 23,
      outOfStock: 5,
      totalValue: 285000.00,
      percentChange: -2.3
    },
    monthlyData: [
      {
        month: 'May 2023',
        totalItems: 1456,
        lowStock: 23,
        value: 285000
      },
      {
        month: 'April 2023',
        totalItems: 1489,
        lowStock: 18,
        value: 292000
      },
      {
        month: 'March 2023',
        totalItems: 1502,
        lowStock: 15,
        value: 298000
      }
    ]
  };

  // Add new mock data for daily sales and category distribution
  const dailySalesData = [
    { date: '12 Mar', sales: 12000 },
    { date: '14 Mar', sales: 45000 },
    { date: '16 Mar', sales: 52000 },
    { date: '18 Mar', sales: 35000 },
    { date: '20 Mar', sales: 42000 },
    { date: '22 Mar', sales: 38000 },
    { date: '24 Mar', sales: 35000 },
    { date: '26 Mar', sales: 48000 },
    { date: '28 Mar', sales: 55000 },
    { date: '30 Mar', sales: 52000 },
    { date: '01 Apr', sales: 48000 },
    { date: '03 Apr', sales: 42000 },
    { date: '05 Apr', sales: 51461 },
    { date: '07 Apr', sales: 45000 },
    { date: '09 Apr', sales: 38000 }
  ];

  const categoryData = [
    { name: 'Antibiotics', value: 35 },
    { name: 'Pain Relief', value: 25 },
    { name: 'Supplements', value: 20 },
    { name: 'Cold & Cough', value: 10 },
    { name: 'Antiallergic', value: 10 }
  ];

  const topSellingProducts = [
    { medicine: 'Amoxicillin 500mg', category: 'Antibiotics', unitsSold: 1250, revenue: 62500 },
    { medicine: 'Paracetamol 650mg', category: 'Pain Relief', unitsSold: 980, revenue: 9800 },
    { medicine: 'Vitamin D3', category: 'Supplements', unitsSold: 850, revenue: 25500 },
    { medicine: 'Azithromycin 500mg', category: 'Antibiotics', unitsSold: 720, revenue: 43200 },
    { medicine: 'Cetirizine 10mg', category: 'Antiallergic', unitsSold: 690, revenue: 6900 }
  ];

  const trendData = gstData.monthlyData.map(data => ({
    name: data.month.split(' ')[0],
    CGST: data.cgst,
    SGST: data.sgst,
    "Taxable Amount": data.taxableAmount
  })).reverse();

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-sm text-gray-600">
                {entry.name}: <span className="font-medium">{formatCurrency(entry.value)}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'sales':
  return (
      <div className="space-y-6">
            <TabGroup>
              <TabList className="flex space-x-2 border-b border-gray-200">
                <Tab className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 ui-selected:text-blue-600 ui-selected:border-b-2 ui-selected:border-blue-600">
                  Overview
                </Tab>
                <Tab className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 ui-selected:text-blue-600 ui-selected:border-b-2 ui-selected:border-blue-600">
                  Daily Sales
                </Tab>
                <Tab className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 ui-selected:text-blue-600 ui-selected:border-b-2 ui-selected:border-blue-600">
                  Category Analysis
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {/* Sales Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <Card decoration="top" decorationColor="blue">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text>Total Sales</Text>
                          <Title className="mt-2">₹9,73,576</Title>
                        </div>
                        <div className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          +12.5% vs previous period
                        </div>
                      </div>
                    </Card>
                    <Card decoration="top" decorationColor="purple">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text>Average Order Value</Text>
                          <Title className="mt-2">₹485.75</Title>
                        </div>
                        <div className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          +2.2% vs previous period
                        </div>
                      </div>
                    </Card>
                    <Card decoration="top" decorationColor="indigo">
        <div className="flex items-center justify-between">
                        <div>
                          <Text>Total Transactions</Text>
                          <Title className="mt-2">184</Title>
                        </div>
                        <div className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-700">
                          -2.1% vs previous period
          </div>
        </div>
                    </Card>
                  </div>

                  {/* Top Selling Products Table */}
                  <Card className="mt-6">
                    <Title>Top Selling Products</Title>
                    <Text>Products with the highest sales in the selected period</Text>
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm font-medium text-gray-500 border-b">
                            <th className="pb-4 pr-4">Medicine</th>
                            <th className="pb-4 pr-4">Category</th>
                            <th className="pb-4 pr-4">Units Sold</th>
                            <th className="pb-4">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {topSellingProducts.map((product) => (
                            <tr key={product.medicine} className="text-sm text-gray-800">
                              <td className="py-4 pr-4">{product.medicine}</td>
                              <td className="py-4 pr-4">{product.category}</td>
                              <td className="py-4 pr-4">{product.unitsSold}</td>
                              <td className="py-4">{formatCurrency(product.revenue)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabPanel>

                <TabPanel>
                  {/* Daily Sales Chart */}
                  <Card className="mt-6">
                    <Title>Daily Sales Trend</Title>
                    <Text>Sales trend for selected period</Text>
                    <div className="h-96 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={dailySalesData}
                          margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: '#6B7280' }}
                            axisLine={{ stroke: '#E5E7EB' }}
                          >
                            <Label
                              value="Date"
                              position="bottom"
                              offset={20}
                              style={{ fill: '#4B5563', fontSize: 14 }}
                            />
                          </XAxis>
                          <YAxis
                            tick={{ fill: '#6B7280' }}
                            axisLine={{ stroke: '#E5E7EB' }}
                            tickFormatter={formatCurrency}
                          >
                            <Label
                              value="Sales Amount (₹)"
                              angle={-90}
                              position="left"
                              offset={40}
                              style={{ fill: '#4B5563', fontSize: 14 }}
                            />
                          </YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6', r: 4 }}
                            activeDot={{ r: 6, fill: '#2563EB' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Sales Details for Selected Date */}
                  <Card className="mt-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <Title>05 Apr</Title>
                    </div>
                    <Text className="mt-2">Daily sales details</Text>
                    <div className="mt-4">
                      <Text>Sales: {formatCurrency(51461)}</Text>
                    </div>
                  </Card>
                </TabPanel>

                <TabPanel>
                  {/* Category Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card>
                      <Title>Sales by Category</Title>
                      <Text>Distribution of sales across categories</Text>
                      <div className="h-[500px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ left: 0 }}>
                            <Pie
                              data={categoryData}
                              dataKey="value"
                              nameKey="name"
                              cx="48%"
                              cy="50%"
                              startAngle={90}
                              endAngle={450}
                              innerRadius={60}
                              outerRadius={100}
                              fill="#8884d8"
                              paddingAngle={2}
                              labelLine={{
                                stroke: '#666666',
                                strokeWidth: 1,
                                strokeDasharray: '',
                                strokeLinecap: 'round'
                              }}
                              label={({
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                percent,
                                index,
                                name,
                                value
                              }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = name === 'Supplements' 
                                  ? outerRadius * 1.4  // Increased radius for Supplements
                                  : outerRadius * 1.3;
                                
                                let adjustedMidAngle = midAngle;
                                if (name === 'Supplements') {
                                  adjustedMidAngle = midAngle - 8; // Changed from -10 to -8 to move slightly right
                                }
                                
                                const x = cx + radius * Math.cos(-adjustedMidAngle * RADIAN);
                                const y = cy + radius * Math.sin(-adjustedMidAngle * RADIAN);

                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    fill="#000000"
                                    textAnchor={x > cx ? 'start' : 'end'}
                                    dominantBaseline="central"
                                    style={{
                                      fontSize: '13px',
                                      fontFamily: 'Inter, sans-serif',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {`${name} (${value}%)`}
                                  </text>
                                );
                              }}
                            >
                              {categoryData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={[
                                    '#7C3AED', // Antibiotics
                                    '#EC4899', // Pain Relief
                                    '#8B5CF6', // Supplements
                                    '#10B981', // Cold & Cough
                                    '#F59E0B', // Antiallergic
                                  ][index]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Category Performance */}
                    <Card>
                      <Title>Category Performance</Title>
                      <Text>Sales performance by category</Text>
                      <div className="space-y-4 mt-4">
                        {categoryData.map((category) => (
                          <div key={category.name} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: {
                                    'Antibiotics': '#4F46E5',
                                    'Pain Relief': '#EC4899',
                                    'Supplements': '#8B5CF6',
                                    'Cold & Cough': '#10B981',
                                    'Antiallergic': '#F59E0B',
                                  }[category.name],
                                }}
                              ></div>
                              <Text>{category.name}</Text>
                            </div>
                            <Text>{category.value}%</Text>
                          </div>
                        ))}
                      </div>
                    </Card>
          </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6">
            {/* Inventory Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card decoration="top" decorationColor="blue">
                <div className="flex items-center justify-between">
                  <div>
                    <Text>Total Items</Text>
                    <Title className="mt-2">{inventoryData.currentMonth.totalItems}</Title>
          </div>
                  <div className={`px-2 py-1 rounded-full text-sm ${
                    inventoryData.currentMonth.percentChange >= 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {inventoryData.currentMonth.percentChange >= 0 ? '+' : ''}
                    {inventoryData.currentMonth.percentChange}%
          </div>
        </div>
              </Card>
              <Card decoration="top" decorationColor="red">
                <Text>Low Stock Items</Text>
                <Title className="mt-2">{inventoryData.currentMonth.lowStock}</Title>
              </Card>
              <Card decoration="top" decorationColor="yellow">
                <Text>Out of Stock</Text>
                <Title className="mt-2">{inventoryData.currentMonth.outOfStock}</Title>
              </Card>
              <Card decoration="top" decorationColor="green">
                <Text>Total Value</Text>
                <Title className="mt-2">{formatCurrency(inventoryData.currentMonth.totalValue)}</Title>
              </Card>
            </div>

            {/* Inventory Chart */}
            <Card>
              <Title>Inventory Trend</Title>
              <Text>Monthly inventory status</Text>
              <div className="h-96 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryData.monthlyData}
                    margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    >
                      <Label
                        value="Months"
                        position="bottom"
                        offset={20}
                        style={{ fill: '#4B5563', fontSize: 14 }}
                      />
                    </XAxis>
                    <YAxis
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    >
                      <Label
                        value="Items"
                        angle={-90}
                        position="left"
                        offset={40}
                        style={{ fill: '#4B5563', fontSize: 14 }}
                      />
                    </YAxis>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => <span className="text-gray-600">{value}</span>}
                    />
                    <Bar
                      dataKey="totalItems"
                      name="Total Items"
                      fill="#2563EB"
                      radius={[4, 4, 0, 0]}
                    >
                      {inventoryData.monthlyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="#2563EB"
                          fillOpacity={0.9}
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="lowStock"
                      name="Low Stock"
                      fill="#DC2626"
                      radius={[4, 4, 0, 0]}
                    >
                      {inventoryData.monthlyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill="#DC2626"
                          fillOpacity={0.9}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        );

      case 'gst':
        return (
          <div className="space-y-6">
            <TabGroup>
              <TabList className="flex space-x-2 border-b border-gray-200">
                <Tab className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 ui-selected:text-blue-600 ui-selected:border-b-2 ui-selected:border-blue-600">
                  Overview
                </Tab>
                <Tab className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 ui-selected:text-blue-600 ui-selected:border-b-2 ui-selected:border-blue-600">
                  Detailed Analysis
                </Tab>
                <Tab className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 ui-selected:text-blue-600 ui-selected:border-b-2 ui-selected:border-blue-600">
                  Reports
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {/* GST Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <Card decoration="top" decorationColor="blue">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text>Taxable Amount</Text>
                          <Title className="mt-2">{formatCurrency(gstData.currentMonth.taxableAmount)}</Title>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-sm ${gstData.currentMonth.percentChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {gstData.currentMonth.percentChange >= 0 ? '+' : ''}{gstData.currentMonth.percentChange}%
          </div>
        </div>
                    </Card>
                    <Card decoration="top" decorationColor="indigo">
                      <Text>CGST</Text>
                      <Title className="mt-2">{formatCurrency(gstData.currentMonth.cgst)}</Title>
                    </Card>
                    <Card decoration="top" decorationColor="purple">
                      <Text>SGST</Text>
                      <Title className="mt-2">{formatCurrency(gstData.currentMonth.sgst)}</Title>
                    </Card>
                    <Card decoration="top" decorationColor="green">
                      <Text>Total Tax</Text>
                      <Title className="mt-2">{formatCurrency(gstData.currentMonth.totalTax)}</Title>
                    </Card>
                  </div>

                  {/* Trend Chart */}
                  <Card className="mt-6">
                    <Title>GST Trend Analysis</Title>
                    <Text>Last 3 Months Comparison</Text>
                    <div className="h-96 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={trendData}
                          margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis
                            dataKey="name"
                            tick={{ fill: '#6B7280' }}
                            axisLine={{ stroke: '#E5E7EB' }}
                          >
                            <Label
                              value="Months"
                              position="bottom"
                              offset={20}
                              style={{ fill: '#4B5563', fontSize: 14 }}
                            />
                          </XAxis>
                          <YAxis
                            tick={{ fill: '#6B7280' }}
                            axisLine={{ stroke: '#E5E7EB' }}
                            tickFormatter={formatCurrency}
                          >
                            <Label
                              value="Amount (₹)"
                              angle={-90}
                              position="left"
                              offset={40}
                              style={{ fill: '#4B5563', fontSize: 14 }}
                            />
                          </YAxis>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            verticalAlign="top"
                            height={36}
                            formatter={(value) => <span className="text-gray-600">{value}</span>}
                          />
                          <Bar
                            dataKey="CGST"
                            fill="#4F46E5"
                            name="CGST Amount"
                            radius={[4, 4, 0, 0]}
                          >
                            {trendData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill="#4F46E5"
                                fillOpacity={0.9}
                              />
                            ))}
                          </Bar>
                          <Bar
                            dataKey="SGST"
                            fill="#9333EA"
                            name="SGST Amount"
                            radius={[4, 4, 0, 0]}
                          >
                            {trendData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill="#9333EA"
                                fillOpacity={0.9}
                              />
                            ))}
                          </Bar>
                          <Bar
                            dataKey="Taxable Amount"
                            fill="#2563EB"
                            name="Taxable Amount"
                            radius={[4, 4, 0, 0]}
                          >
                            {trendData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill="#2563EB"
                                fillOpacity={0.9}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Detailed Table */}
                  <Card className="mt-6">
                    <Title>Monthly GST Details</Title>
                    <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 border-b">
                            <th className="pb-4 pr-4">Month</th>
                            <th className="pb-4 pr-4">Taxable Amount</th>
                            <th className="pb-4 pr-4">CGST</th>
                            <th className="pb-4 pr-4">SGST</th>
                            <th className="pb-4 pr-4">Total Tax</th>
                            <th className="pb-4">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                          {gstData.monthlyData.map((data) => (
                            <tr key={data.month} className="text-sm text-gray-800">
                              <td className="py-4 pr-4">{data.month}</td>
                              <td className="py-4 pr-4">{formatCurrency(data.taxableAmount)}</td>
                              <td className="py-4 pr-4">{formatCurrency(data.cgst)}</td>
                              <td className="py-4 pr-4">{formatCurrency(data.sgst)}</td>
                              <td className="py-4 pr-4">{formatCurrency(data.totalTax)}</td>
                              <td className="py-4">{formatCurrency(data.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
                    </div>
                  </Card>
                </TabPanel>

                <TabPanel>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Tax Distribution */}
                    <Card>
                      <Title>Monthly Tax Distribution</Title>
                      <Text>Comparison of CGST and SGST</Text>
                      <div className="h-96 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={trendData}
                            margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
                            barGap={0}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                              dataKey="name"
                              tick={{ fill: '#6B7280' }}
                              axisLine={{ stroke: '#E5E7EB' }}
                            >
                              <Label
                                value="Months"
                                position="bottom"
                                offset={20}
                                style={{ fill: '#4B5563', fontSize: 14 }}
                              />
                            </XAxis>
                            <YAxis
                              tick={{ fill: '#6B7280' }}
                              axisLine={{ stroke: '#E5E7EB' }}
                              tickFormatter={formatCurrency}
                            >
                              <Label
                                value="Tax Amount (₹)"
                                angle={-90}
                                position="left"
                                offset={40}
                                style={{ fill: '#4B5563', fontSize: 14 }}
                              />
                            </YAxis>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                              verticalAlign="top"
                              height={36}
                              formatter={(value) => <span className="text-gray-600">{value}</span>}
                            />
                            <Bar
                              dataKey="CGST"
                              fill="#4F46E5"
                              name="CGST Amount"
                              radius={[4, 4, 0, 0]}
                              stackId="tax"
                            >
                              {trendData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill="#4F46E5"
                                  fillOpacity={0.9}
                                />
                              ))}
                            </Bar>
                            <Bar
                              dataKey="SGST"
                              fill="#9333EA"
                              name="SGST Amount"
                              radius={[4, 4, 0, 0]}
                              stackId="tax"
                            >
                              {trendData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill="#9333EA"
                                  fillOpacity={0.9}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Taxable Amount Chart */}
                    <Card>
                      <Title>Taxable Amount Trend</Title>
                      <Text>Monthly progression of taxable amount</Text>
                      <div className="h-96 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={trendData}
                            margin={{ top: 20, right: 30, left: 60, bottom: 30 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                              dataKey="name"
                              tick={{ fill: '#6B7280' }}
                              axisLine={{ stroke: '#E5E7EB' }}
                            >
                              <Label
                                value="Months"
                                position="bottom"
                                offset={20}
                                style={{ fill: '#4B5563', fontSize: 14 }}
                              />
                            </XAxis>
                            <YAxis
                              tick={{ fill: '#6B7280' }}
                              axisLine={{ stroke: '#E5E7EB' }}
                              tickFormatter={formatCurrency}
                            >
                              <Label
                                value="Amount (₹)"
                                angle={-90}
                                position="left"
                                offset={40}
                                style={{ fill: '#4B5563', fontSize: 14 }}
                              />
                            </YAxis>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                              verticalAlign="top"
                              height={36}
                              formatter={(value) => <span className="text-gray-600">{value}</span>}
                            />
                            <Bar
                              dataKey="Taxable Amount"
                              name="Taxable Amount"
                              radius={[4, 4, 0, 0]}
                            >
                              {trendData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill="#2563EB"
                                  fillOpacity={0.9}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </TabPanel>

                <TabPanel>
                  {/* Generate Report Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card>
                      <Title>GSTR-1 Report</Title>
                      <Text className="mt-2">Monthly return of outward supplies</Text>
                      <button className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Generate GSTR-1 Report
                      </button>
                    </Card>
                    <Card>
                      <Title>GSTR-3B Report</Title>
                      <Text className="mt-2">Monthly summary return</Text>
                      <button className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Generate GSTR-3B Report
                      </button>
                    </Card>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        );
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col space-y-6">
            {/* Report Type Selection */}
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setSelectedReport('sales')}
                className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
                  selectedReport === 'sales'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart2 className="w-5 h-5 mr-2" />
                Sales Report
              </button>
              <button
                onClick={() => setSelectedReport('gst')}
                className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
                  selectedReport === 'gst'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                GST Report
              </button>
              <button
                onClick={() => setSelectedReport('inventory')}
                className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
                  selectedReport === 'inventory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="w-5 h-5 mr-2" />
                Inventory Report
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div>
                <Title>{selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report</Title>
                <Text>Detailed analysis and insights</Text>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-5 h-5 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Report Content */}
            {renderReportContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;