import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, SortDesc, Download } from 'lucide-react';
import { Medicine, BatchType } from '../types';
import AddMedicineModal from '../components/AddMedicineModal';

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      barcode: '123456789012',
      batches: [
        {
          type: 'A',
          quantity: 200,
          expiryDate: '2024-06-30', // Short expiry
        },
        {
          type: 'B',
          quantity: 150,
          expiryDate: '2024-11-30', // Medium expiry
        },
        {
          type: 'C',
          quantity: 100,
          expiryDate: '2025-12-31', // Long expiry
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
          expiryDate: '2024-07-15', // Short expiry
        },
        {
          type: 'B',
          quantity: 100,
          expiryDate: '2024-09-30', // Medium expiry
        },
        {
          type: 'C',
          quantity: 50,
          expiryDate: '2025-10-15', // Long expiry
        },
      ],
      stock: 300,
      price: 8.99,
      manufacturer: 'MediCare',
      category: 'Pain Relief',
    },
    {
      id: '3',
      name: 'Amoxicillin 500mg',
      barcode: '456789123456',
      batches: [
        {
          type: 'A',
          quantity: 10,
          expiryDate: '2026-01-15',
        },
        {
          type: 'B',
          quantity: 3,
          expiryDate: '2024-12-30',
        },
        {
          type: 'C',
          quantity: 2,
          expiryDate: '2024-08-15',
        },
      ],
      stock: 15,
      price: 12.99,
      manufacturer: 'HealthPlus',
      category: 'Antibiotics',
    },
  ]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const getBatchTypeLabel = (type: BatchType): string => {
    switch (type) {
      case 'A':
        return 'A';
      case 'B':
        return 'B';
      case 'C':
        return 'C';
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

  // Flatten the medicines array to include batch information
  const medicinesWithBatches = medicines.flatMap((medicine) =>
    medicine.batches.map((batch) => ({
      ...medicine,
      batch,
    }))
  );

  // Get unique categories from medicines
  const categories = Array.from(new Set(medicines.map(medicine => medicine.category)));

  // Get search suggestions with priority
  const getSearchSuggestions = () => {
    if (!searchTerm.trim()) return [];
    
    const searchLower = searchTerm.toLowerCase();
    
    // First, find medicines that start with the search term
    const startsWithMatches = medicines.filter(medicine => 
      medicine.name.toLowerCase().startsWith(searchLower) ||
      medicine.category.toLowerCase().startsWith(searchLower) ||
      medicine.manufacturer.toLowerCase().startsWith(searchLower)
    );
    
    // Then, find medicines that contain the search term but don't start with it
    const containsMatches = medicines.filter(medicine => 
      (medicine.name.toLowerCase().includes(searchLower) && !medicine.name.toLowerCase().startsWith(searchLower)) ||
      (medicine.category.toLowerCase().includes(searchLower) && !medicine.category.toLowerCase().startsWith(searchLower)) ||
      (medicine.manufacturer.toLowerCase().includes(searchLower) && !medicine.manufacturer.toLowerCase().startsWith(searchLower))
    );
    
    // Combine the results with priority
    return [...startsWithMatches, ...containsMatches];
  };

  const handleSuggestionClick = (medicine: Medicine) => {
    setSearchTerm(medicine.name);
    setShowSuggestions(false);
  };

  // Highlight matching text in search results
  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;
    
    const searchLower = searchTerm.toLowerCase();
    const textLower = text.toLowerCase();
    
    if (textLower.startsWith(searchLower)) {
      return (
        <>
          <span className="font-bold bg-yellow-100">{text.substring(0, searchTerm.length)}</span>
          {text.substring(searchTerm.length)}
        </>
      );
    }
    
    const index = textLower.indexOf(searchLower);
    if (index !== -1) {
      return (
        <>
          {text.substring(0, index)}
          <span className="font-bold bg-yellow-100">{text.substring(index, index + searchTerm.length)}</span>
          {text.substring(index + searchTerm.length)}
        </>
      );
    }
    
    return text;
  };

  // Filter by search term, selected batch, and selected category
  const filteredMedicines = medicinesWithBatches.filter(
    (medicine) =>
      (selectedBatch === 'ALL' || medicine.batch.type === selectedBatch) &&
      (selectedCategory === '' || medicine.category === selectedCategory) &&
      (searchTerm === '' ||
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort filtered medicines to prioritize those that start with the search term
  const sortedFilteredMedicines = [...filteredMedicines].sort((a, b) => {
    if (!searchTerm) return 0;
    
    const searchLower = searchTerm.toLowerCase();
    const aStartsWith = 
      a.name.toLowerCase().startsWith(searchLower) ||
      a.category.toLowerCase().startsWith(searchLower) ||
      a.manufacturer.toLowerCase().startsWith(searchLower);
    
    const bStartsWith = 
      b.name.toLowerCase().startsWith(searchLower) ||
      b.category.toLowerCase().startsWith(searchLower) ||
      b.manufacturer.toLowerCase().startsWith(searchLower);
    
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return 0;
  });

  const handleAddMedicine = (newMedicine: Omit<Medicine, 'id'>) => {
    // Generate a new ID (in a real app, this would come from the backend)
    const id = (medicines.length + 1).toString();
    
    // Add the new medicine to the state
    setMedicines([...medicines, { ...newMedicine, id }]);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Create a new medicine with the new category
      const newMedicine: Medicine = {
        id: (medicines.length + 1).toString(),
        name: `New Medicine - ${newCategory}`,
        barcode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // Generate random barcode
        batches: [
          {
            type: 'A',
            quantity: 0,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
          },
          {
            type: 'B',
            quantity: 0,
            expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months from now
          },
          {
            type: 'C',
            quantity: 0,
            expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 months from now
          },
        ],
        stock: 0,
        price: 0,
        manufacturer: 'New Manufacturer',
        category: newCategory.trim(),
      };
      
      setMedicines([...medicines, newMedicine]);
      setNewCategory('');
      setIsAddCategoryModalOpen(false);
    }
  };

  const exportToCSV = () => {
    // Create CSV header
    const headers = ['Name', 'Batch Type', 'Stock', 'Price', 'Expiry Date', 'Days Left', 'Category', 'Manufacturer'];
    const csvContent = [headers];

    // Add data rows
    sortedFilteredMedicines.forEach(medicine => {
      const daysLeft = calculateDaysUntilExpiry(medicine.batch.expiryDate);
      csvContent.push([
        medicine.name,
        medicine.batch.type,
        medicine.batch.quantity.toString(),
        medicine.price.toString(),
        medicine.batch.expiryDate,
        daysLeft.toString(),
        medicine.category,
        medicine.manufacturer
      ]);
    });

    // Convert to CSV string
    const csvString = csvContent.map(row => row.join(',')).join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle keyboard navigation for search suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const suggestions = getSearchSuggestions();
    
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && searchRef.current) {
      const selectedElement = searchRef.current.children[selectedSuggestionIndex + 1] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedSuggestionIndex]);

  // Reset selected index when search term changes
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [searchTerm]);

  // Update click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to handle automatic batch transitions
  const handleBatchTransitions = (medicine: Medicine) => {
    const { transitionDays } = medicine;
    if (!transitionDays) return medicine;

    const updatedBatches = medicine.batches.map(batch => {
      const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiryDate);
      
      // Move from C to B
      if (batch.type === 'C' && daysUntilExpiry <= transitionDays.cToB) {
        return { ...batch, type: 'B' as BatchType };
      }
      
      // Move from B to A
      if (batch.type === 'B' && daysUntilExpiry <= transitionDays.bToA) {
        return { ...batch, type: 'A' as BatchType };
      }
      
      return batch;
    });

    return { ...medicine, batches: updatedBatches };
  };

  // Update medicines with batch transitions
  useEffect(() => {
    const updatedMedicines = medicines.map(handleBatchTransitions);
    setMedicines(updatedMedicines);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your medicine inventory and track expiry dates</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-5 h-5 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Medicine
          </button>
        </div>
        </div>

        {/* Search and Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="relative flex-1" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              aria-expanded={showSuggestions}
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-activedescendant={selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {showSuggestions && searchTerm && (
              <div 
                id="search-suggestions"
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                role="listbox"
              >
                {getSearchSuggestions().length > 0 ? (
                  <>
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-200">
                      {getSearchSuggestions().filter(m => 
                        m.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                        m.category.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                        m.manufacturer.toLowerCase().startsWith(searchTerm.toLowerCase())
                      ).length > 0 && "Exact matches"}
                    </div>
                    {getSearchSuggestions().map((medicine, index) => (
                      <div
                        key={medicine.id}
                        id={`suggestion-${index}`}
                        onClick={() => handleSuggestionClick(medicine)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSuggestionClick(medicine);
                          }
                        }}
                        tabIndex={0}
                        role="option"
                        aria-selected={selectedSuggestionIndex === index}
                        className={`px-4 py-2 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                          selectedSuggestionIndex === index ? 'bg-blue-50' : 'hover:bg-blue-50'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{highlightMatch(medicine.name)}</div>
                          <div className="text-sm text-gray-500">{highlightMatch(medicine.category)}</div>
                        </div>
                        <div className="text-sm text-gray-500">{highlightMatch(medicine.manufacturer)}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-2 text-gray-500">No matches found</div>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value as BatchType | 'ALL')}
                aria-label="Filter by batch type"
              >
                <option value="ALL">All Batches</option>
                <option value="A">Batch A</option>
                <option value="B">Batch B</option>
                <option value="C">Batch C</option>
              </select>
            </div>
            <div className="relative flex items-center gap-2">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                title="Add Category"
                aria-label="Add new category"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                aria-label="Sort medicines"
              >
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="stock">Stock</option>
                <option value="expiry">Expiry Date</option>
              </select>
            </div>
          </div>
            </div>
          </div>

          {/* Medicines Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Type</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedFilteredMedicines.length > 0 ? (
                sortedFilteredMedicines.map((medicine) => {
                  const daysLeft = calculateDaysUntilExpiry(medicine.batch.expiryDate);
                  const status = getExpiryStatus(daysLeft);
                  
                  return (
                    <tr
                      key={`${medicine.id}-${medicine.batch.type}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {searchTerm ? highlightMatch(medicine.name) : medicine.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-md text-sm font-medium ${getBatchTypeColor(medicine.batch.type)}`}>
                            {getBatchTypeLabel(medicine.batch.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            medicine.batch.quantity > 100 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {medicine.batch.quantity} units
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">₹{medicine.price}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{medicine.batch.expiryDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <span className={`${status.color} font-medium px-2 py-1 rounded-md ${status.color.replace('text', 'bg')} bg-opacity-10`}>
                          {daysLeft} days
                      </span>
                    </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{medicine.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                          <button className="p-1 hover:bg-blue-50 rounded-md transition-colors duration-200">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                          <button className="p-1 hover:bg-red-50 rounded-md transition-colors duration-200">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-center text-sm text-gray-500">No medicines found</td>
                </tr>
              )}
              </tbody>
            </table>
        </div>
      </div>

      {/* Add Medicine Modal */}
      <AddMedicineModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMedicine}
      />

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-4"
              aria-label="Category name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCategory();
                } else if (e.key === 'Escape') {
                  setIsAddCategoryModalOpen(false);
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default InventoryPage;
