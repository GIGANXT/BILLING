import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { Medicine, BatchType } from '../types';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medicine: Omit<Medicine, 'id'>) => void;
}

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [category, setCategory] = useState('');
  const [batches, setBatches] = useState([
    { type: 'A' as BatchType, quantity: '', expiryDate: '' },
    { type: 'B' as BatchType, quantity: '', expiryDate: '' },
    { type: 'C' as BatchType, quantity: '', expiryDate: '' },
  ]);
  const [transitionDays, setTransitionDays] = useState({
    cToB: '90', // Days before expiry to move from C to B
    bToA: '30', // Days before expiry to move from B to A
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for incomplete batches (has quantity but no expiry date or vice versa)
    const incompleteBatches = batches.filter(batch => 
      (batch.quantity && batch.quantity !== '0' && !batch.expiryDate) || 
      (!batch.quantity && batch.expiryDate)
    );
    
    if (incompleteBatches.length > 0) {
      alert('Some batches have incomplete information. Please provide both quantity and expiry date for each batch you want to add.');
      return;
    }
    
    // Filter out empty batches (no quantity and no expiry date)
    const validBatches = batches.filter(batch => 
      (batch.quantity && batch.quantity !== '0' && batch.expiryDate)
    );
    
    // Validate that at least one batch has data
    if (validBatches.length === 0) {
      alert('Please add at least one batch with quantity and expiry date');
      return;
    }
    
    // Calculate total stock from valid batches only
    const totalStock = validBatches.reduce((sum, batch) => sum + (parseInt(batch.quantity) || 0), 0);
    
    // Create the new medicine object
    const newMedicine: Omit<Medicine, 'id'> = {
      name,
      price: parseFloat(price),
      manufacturer,
      category,
      stock: totalStock,
      batches: validBatches.map(batch => ({
        type: batch.type,
        quantity: parseInt(batch.quantity) || 0,
        expiryDate: batch.expiryDate,
      })),
      // Add transition days information
      transitionDays: {
        cToB: parseInt(transitionDays.cToB),
        bToA: parseInt(transitionDays.bToA),
      },
    };
    
    onAdd(newMedicine);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setManufacturer('');
    setCategory('');
    setBatches([
      { type: 'A', quantity: '', expiryDate: '' },
      { type: 'B', quantity: '', expiryDate: '' },
      { type: 'C', quantity: '', expiryDate: '' },
    ]);
    setTransitionDays({
      cToB: '90',
      bToA: '30',
    });
  };

  const handleBatchChange = (index: number, field: 'quantity' | 'expiryDate', value: string) => {
    const updatedBatches = [...batches];
    updatedBatches[index] = { ...updatedBatches[index], [field]: value };
    setBatches(updatedBatches);
  };

  const handleTransitionDaysChange = (field: 'cToB' | 'bToA', value: string) => {
    setTransitionDays({
      ...transitionDays,
      [field]: value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add New Medicine</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Medicine Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                id="manufacturer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Antiviral">Antiviral</option>
                <option value="Antifungal">Antifungal</option>
                <option value="Antihistamine">Antihistamine</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Batch Information</h3>
            <p className="text-sm text-gray-600 mb-3">
              Fill in details for the batches you want to add. You can add just one, two, or all three batches as needed.
              <strong className="block mt-1">At least one batch is required.</strong>
            </p>
            <div className="space-y-3">
              {batches.map((batch, index) => (
                <div key={batch.type} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border border-gray-200 rounded-md relative">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch {batch.type} <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                        batch.type === 'A' ? 'bg-red-100 text-red-700 border border-red-200' :
                        batch.type === 'B' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                        'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {batch.type}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={batch.quantity}
                      onChange={(e) => handleBatchChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      placeholder="Leave empty to skip this batch"
                    />
                    <p className="text-xs text-gray-500 mt-1">Both quantity and expiry date required if adding this batch</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={batch.expiryDate}
                      onChange={(e) => handleBatchChange(index, 'expiryDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Required if adding this batch"
                    />
                    <p className="text-xs text-gray-500 mt-1">Required if quantity is provided</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Automatic Batch Transitions
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Specify how many days before expiry a medicine should automatically move between batches.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days before expiry to move from Batch C to B
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={transitionDays.cToB}
                    onChange={(e) => handleTransitionDaysChange('cToB', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="1"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-500">days</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  When a medicine is {transitionDays.cToB} days from expiry, it will move from Batch C to Batch B
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days before expiry to move from Batch B to A
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={transitionDays.bToA}
                    onChange={(e) => handleTransitionDaysChange('bToA', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="1"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-500">days</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  When a medicine is {transitionDays.bToA} days from expiry, it will move from Batch B to Batch A
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;