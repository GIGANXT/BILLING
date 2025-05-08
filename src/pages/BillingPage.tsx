import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X, Minus, Printer } from 'lucide-react';
import { BillItem, Medicine, BatchType } from '../types';
import BarcodeScanner from '../components/BarcodeScanner';

const BillingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<BillItem[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<BatchType | 'ALL'>('ALL');
  const billRef = useRef<HTMLDivElement>(null);
  const [showOCRNotification, setShowOCRNotification] = useState(false);
  const [scannedMedicine, setScannedMedicine] = useState<Medicine | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [selectedItemQuantity, setSelectedItemQuantity] = useState(1);
  const [numberInputBuffer, setNumberInputBuffer] = useState('');
  const [numberInputTimeout, setNumberInputTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Mock medicines with batch information
  const mockMedicines: Medicine[] = [
    {
    id: '1',
    name: 'Paracetamol 500mg',
      barcode: '123456789012',
      batches: [
        {
          type: 'A',
          quantity: 100,
          expiryDate: '2024-06-30', // Short expiry
        },
        {
          type: 'B',
          quantity: 150,
          expiryDate: '2024-11-30', // Medium expiry
        },
        {
          type: 'C',
          quantity: 200,
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
          quantity: 50,
          expiryDate: '2024-07-15', // Short expiry
        },
        {
          type: 'B',
          quantity: 100,
          expiryDate: '2024-09-30', // Medium expiry
        },
        {
          type: 'C',
          quantity: 150,
          expiryDate: '2025-10-15', // Long expiry
        },
      ],
      stock: 300,
      price: 8.99,
      manufacturer: 'MediCare',
      category: 'Pain Relief',
    },
  ];

  // Filter medicines based on search term and selected batch
  const filteredMedicines = mockMedicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'ALL' || medicine.batches.some(batch => batch.type === selectedBatch);
    return matchesSearch && matchesBatch;
  });

  // Flatten the filtered medicines for keyboard navigation
  const flattenedMedicines = filteredMedicines.flatMap(medicine => 
    medicine.batches
      .filter(batch => selectedBatch === 'ALL' || batch.type === selectedBatch)
      .map(batch => ({
        medicine,
        batch
      }))
  );

  // Reset selected index when search term or batch filter changes
  useEffect(() => {
    setSelectedIndex(-1);
    setShowSearchResults(searchTerm.length > 0);
  }, [searchTerm, selectedBatch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchInputRef.current || !showSearchResults) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < flattenedMedicines.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selectedItem = flattenedMedicines[selectedIndex];
        if (selectedItem) {
          addToCart(selectedItem.medicine, selectedItem.batch.type, selectedItemQuantity);
          setSearchTerm('');
          setSelectedIndex(-1);
          setShowSearchResults(false);
          setSelectedItemQuantity(1);
          setNumberInputBuffer('');
        }
      } else if (e.key === 'Escape') {
        setShowSearchResults(false);
        setSelectedIndex(-1);
        setSelectedItemQuantity(1);
        setNumberInputBuffer('');
      } else if (e.key === 'ArrowRight' && selectedIndex >= 0) {
        e.preventDefault();
        setSelectedItemQuantity(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && selectedIndex >= 0) {
        e.preventDefault();
        setSelectedItemQuantity(prev => Math.max(1, prev - 1));
      } else if (/^[0-9]$/.test(e.key) && selectedIndex >= 0) {
        e.preventDefault();
        
        // Clear any existing timeout
        if (numberInputTimeout) {
          clearTimeout(numberInputTimeout);
        }
        
        // Add the digit to the buffer
        const newBuffer = numberInputBuffer + e.key;
        setNumberInputBuffer(newBuffer);
        
        // Set a timeout to apply the number after a short delay
        const timeout = setTimeout(() => {
          const quantity = parseInt(newBuffer, 10);
          if (!isNaN(quantity) && quantity > 0) {
            setSelectedItemQuantity(quantity);
          }
          setNumberInputBuffer('');
        }, 500);
        
        setNumberInputTimeout(timeout);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, flattenedMedicines, showSearchResults, selectedItemQuantity, numberInputBuffer, numberInputTimeout]);

  // Focus search input when component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const calculateGST = (price: number): number => {
    return price * 0.18; // 18% GST
  };

  const addToCart = (medicine: Medicine, batchType: BatchType, quantity: number = 1) => {
    const batch = medicine.batches.find(b => b.type === batchType);
    if (!batch) return;

    const existingItemIndex = cartItems.findIndex(
      (item) => item.medicineId === medicine.id && item.batchType === batchType
    );

    if (existingItemIndex !== -1) {
      // If the item already exists, update its quantity and total
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      updatedCartItems[existingItemIndex].total =
        updatedCartItems[existingItemIndex].quantity *
        updatedCartItems[existingItemIndex].unitPrice;
      setCartItems(updatedCartItems);
    } else {
      // If the item doesn't exist, add it as a new row
      const newItem: BillItem = {
        medicineId: medicine.id,
        medicineName: medicine.name,
        batchType: batchType,
        quantity: quantity,
        unitPrice: medicine.price,
        total: medicine.price * quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const increaseQuantity = (medicineId: string) => {
    const updatedCartItems = [...cartItems];
    const itemIndex = updatedCartItems.findIndex(item => item.medicineId === medicineId);
    
    if (itemIndex !== -1) {
      updatedCartItems[itemIndex].quantity += 1;
      updatedCartItems[itemIndex].total =
        updatedCartItems[itemIndex].quantity * updatedCartItems[itemIndex].unitPrice;
    setCartItems(updatedCartItems);
    }
  };

  const reduceQuantity = (medicineId: string) => {
    const updatedCartItems = [...cartItems];
    const itemIndex = updatedCartItems.findIndex(item => item.medicineId === medicineId);
    
    if (itemIndex !== -1) {
      if (updatedCartItems[itemIndex].quantity > 1) {
      // If quantity is greater than 1, decrement it
        updatedCartItems[itemIndex].quantity -= 1;
        updatedCartItems[itemIndex].total =
          updatedCartItems[itemIndex].quantity * updatedCartItems[itemIndex].unitPrice;
    } else {
      // If quantity is 1, remove the item from the cart
        updatedCartItems.splice(itemIndex, 1);
    }
    setCartItems(updatedCartItems);
    }
  };

  // Group cart items by medicine name for display
  const groupedCartItems = cartItems.reduce((groups, item) => {
    const name = item.medicineName;
    if (!groups[name]) {
      groups[name] = [];
    }
    groups[name].push(item);
    return groups;
  }, {} as Record<string, BillItem[]>);

  // Calculate total quantity for each medicine
  const getTotalQuantity = (items: BillItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Calculate total price for each medicine
  const getTotalPrice = (items: BillItem[]) => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18; // 18% GST
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal + tax - discountAmount;

  const printBill = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    
    const billContent = `
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .bill-header { text-align: center; margin-bottom: 20px; }
            .bill-details { margin-bottom: 20px; }
            .bill-items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .bill-items th, .bill-items td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .bill-summary { margin-top: 20px; }
            .bill-summary div { margin: 5px 0; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="bill-header">
            <h2>Pharmacy Bill</h2>
            <p>Date: ${currentDate}</p>
          </div>
          <div class="bill-details">
            <p>Customer: ${'Walk-in Customer'}</p>
          </div>
          <table class="bill-items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems.map(item => `
                <tr>
                  <td>${item.medicineName}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.unitPrice.toFixed(2)}</td>
                  <td>₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="bill-summary">
            <div>Subtotal: ₹${subtotal.toFixed(2)}</div>
            <div>Tax (18%): ₹${tax.toFixed(2)}</div>
            ${discountPercentage > 0 ? `
              <div>Discount (${discountPercentage}%): -₹${discountAmount.toFixed(2)}</div>
            ` : ''}
            <div class="total">Total: ₹${total.toFixed(2)}</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Handle batch selection for scanned medicine
  const handleBatchSelection = (medicine: Medicine, batchType: BatchType) => {
    addToCart(medicine, batchType);
    setShowOCRNotification(false);
    setScannedMedicine(null);
  };

  // Handle barcode detection
  const handleBarcodeDetected = (barcode: string) => {
    // Prevent duplicate scans
    if (barcode === lastScannedBarcode) return;
    setLastScannedBarcode(barcode);

    // Find medicine by barcode
    const medicine = mockMedicines.find(m => m.barcode === barcode);
    if (medicine) {
      setScannedMedicine(medicine);
      // Automatically add to cart with batch C (longest expiry)
      const batchC = medicine.batches.find(b => b.type === 'C');
      if (batchC) {
        addToCart(medicine, 'C', 1);
      }
    }
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Section - Medicine Search and Selection */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">New Bill</h1>
        </div>

        {/* Barcode Scanner - Always visible */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4">
          <BarcodeScanner
            onBarcodeDetected={handleBarcodeDetected}
            medicines={mockMedicines}
          />
        </div>

        {/* OCR Notification with Batch Selection */}
        {showOCRNotification && scannedMedicine && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative mb-3 sm:mb-4">
            <div className="flex flex-col">
              <div className="font-bold mb-2">Medicine Detected: {scannedMedicine.name}</div>
              <div className="text-sm mb-2">Select a batch to add to cart:</div>
              <div className="flex flex-wrap gap-2">
                {scannedMedicine.batches.map((batch) => (
                  <button
                    key={batch.type}
                    onClick={() => handleBatchSelection(scannedMedicine, batch.type)}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium ${
                      batch.type === 'A' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : batch.type === 'B'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    Batch {batch.type} ({batch.quantity} units)
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowOCRNotification(false);
                  setScannedMedicine(null);
                }}
                className="text-sm text-green-700 underline mt-2 self-end"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

          {/* Medicine Search and Selection */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative flex-1" ref={searchContainerRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSearchResults(searchTerm.length > 0)}
                  className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  aria-label="Search Medicines"
                />
                
                {/* Keyboard Navigation Instructions */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 flex items-center">
                  <span className="hidden sm:inline mr-2">↑↓ to navigate</span>
                  <span className="hidden sm:inline mr-2">Enter to select</span>
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchTerm.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                    {flattenedMedicines.length === 0 ? (
                      <div className="p-3 text-gray-500 text-center">No medicines found</div>
                    ) : (
                      <ul>
                        {flattenedMedicines.map((item, index) => (
                          <li 
                            key={`${item.medicine.id}-${item.batch.type}`}
                            className={`p-2 sm:p-3 cursor-pointer flex flex-col sm:flex-row sm:justify-between sm:items-center ${
                              index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              addToCart(item.medicine, item.batch.type, selectedItemQuantity);
                              setSearchTerm('');
                              setSelectedIndex(-1);
                              setShowSearchResults(false);
                              setSelectedItemQuantity(1);
                              setNumberInputBuffer('');
                            }}
                          >
                            <div>
                              <span className="font-medium text-sm sm:text-base">{item.medicine.name}</span>
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${getBatchTypeColor(item.batch.type)}`}>
                                Batch {item.batch.type}
                              </span>
                              {index === selectedIndex && (
                                <div className="mt-1 flex items-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedItemQuantity(Math.max(1, selectedItemQuantity - 1));
                                    }}
                                    className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300"
                                    aria-label="Decrease Quantity"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="mx-2 font-medium">{selectedItemQuantity}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedItemQuantity(selectedItemQuantity + 1);
                                    }}
                                    className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300"
                                    aria-label="Increase Quantity"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  {numberInputBuffer && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      Entering: {numberInputBuffer}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">
                              ₹{item.medicine.price} • {item.batch.quantity} units
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value as BatchType | 'ALL')}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto text-sm sm:text-base"
                  aria-label="Filter by batch type"
                >
                  <option value="ALL">All Batches</option>
                  <option value="A">Batch A</option>
                  <option value="B">Batch B</option>
                  <option value="C">Batch C</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto -mx-3 sm:mx-0 rounded-lg">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left text-xs sm:text-sm font-medium text-gray-500 border-b">
                    <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 pl-4 sm:pl-2">Name</th>
                    <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 px-2">Batch</th>
                    <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 px-2">Stock</th>
                    <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 px-2">Price</th>
                    <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 px-2">GST</th>
                    <th className="pb-3 pt-2 sm:pt-0 sm:pb-4 pl-2 pr-4 sm:pr-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                {filteredMedicines.map((medicine) => (
                  medicine.batches.map((batch) => {
                    const gst = calculateGST(medicine.price);
                    
                    return (
                      <tr key={`${medicine.id}-${batch.type}`} className="text-xs sm:text-sm text-gray-800 hover:bg-gray-50 transition-colors duration-300">
                        <td className="py-3 sm:py-4 pl-4 sm:pl-2">{medicine.name}</td>
                        <td className="py-2 sm:py-4 px-2 text-center">
                          <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium ${getBatchTypeColor(batch.type)}`}>
                            {getBatchTypeLabel(batch.type)}
                          </span>
                        </td>
                        <td className="py-2 sm:py-4 px-2 text-center">
                          <span
                            className={`inline-block px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium ${
                              batch.quantity > 100 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            {batch.quantity} units
                          </span>
                        </td>
                        <td className="py-2 sm:py-4 px-2 text-center">₹{medicine.price}</td>
                        <td className="py-2 sm:py-4 px-2 text-center">
                          <span className="inline-block px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            ₹{gst.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 sm:py-4 pl-2 pr-4 sm:pr-2 text-center">
                          <button
                            onClick={() => addToCart(medicine, batch.type)}
                            className="mx-auto inline-flex px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-200 transition-colors duration-300 items-center"
                            aria-label="Add to Cart"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Add
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section - Cart and Billing */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-shadow duration-300" ref={billRef}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Cart</h2>
          
            {cartItems.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                Your cart is empty. Add items to get started.
              </div>
            ) : (
              <>
                <div className="overflow-y-auto max-h-[250px] sm:max-h-[300px] mb-4 sm:mb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {Object.entries(groupedCartItems).map(([name, items]) => (
                    <div key={name} className="mb-2 sm:mb-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium text-gray-800 text-sm sm:text-base">{name}</h3>
                        <div className="text-xs sm:text-sm font-medium text-gray-700">
                          ₹{getTotalPrice(items).toFixed(2)}
                        </div>
                      </div>
                    
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <button
                            onClick={() => reduceQuantity(items[0].medicineId)}
                            className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300"
                            aria-label="Reduce Quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="mx-2 font-medium text-xs sm:text-sm">{getTotalQuantity(items)}</span>
                          <button
                            onClick={() => increaseQuantity(items[0].medicineId)}
                            className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-300"
                            aria-label="Increase Quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            // Remove all items with this medicine name
                            setCartItems(cartItems.filter(item => item.medicineName !== name));
                          }}
                          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-300"
                          aria-label="Remove Item"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    
                      {items.length > 1 && (
                        <div className="mt-1 text-xs text-gray-500">
                          {items.map(item => (
                            <div key={item.batchType} className="flex justify-between">
                              <span>Batch {item.batchType}:</span>
                              <span>{item.quantity} units</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              
                <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-3 sm:mb-4">
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>

                  {/* Discount Input */}
                  <div className="flex items-center justify-between mb-2 text-sm sm:text-base">
                    <span className="text-gray-600">Discount:</span>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                        className="w-12 sm:w-16 px-1 sm:px-2 py-1 border border-gray-300 rounded-md text-right mr-2 text-sm"
                        aria-label="Discount Percentage"
                      />
                      <span className="text-gray-600">%</span>
                    </div>
                  </div>
                
                  {discountPercentage > 0 && (
                    <div className="flex justify-between mb-2 text-green-600 text-sm sm:text-base">
                      <span>Discount Amount:</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  {/* Payment Methods Section */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">Payment Method</h3>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <button
                        onClick={() => setSelectedPaymentMethod('cash')}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-colors ${
                          selectedPaymentMethod === 'cash'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-xs sm:text-sm font-medium">Cash</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedPaymentMethod('card')}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-colors ${
                          selectedPaymentMethod === 'card'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-xs sm:text-sm font-medium">Card</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedPaymentMethod('upi')}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-colors ${
                          selectedPaymentMethod === 'upi'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <span className="text-xs sm:text-sm font-medium">UPI</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={printBill}
                  className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-shadow duration-300 flex items-center justify-center text-sm sm:text-base"
                  aria-label="Generate Bill"
                >
                  <Printer className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Generate Bill
                </button>
              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default BillingPage;