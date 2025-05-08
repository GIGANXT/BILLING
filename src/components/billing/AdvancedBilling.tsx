import React, { useState } from 'react';
import { RotateCcw, Plus, Minus, AlertTriangle } from 'lucide-react';
import { BillItem, BatchType } from '../../types';

interface SplitBillShare {
  customerName: string;
  items: Array<{
    itemId: string;
    batchType: BatchType;
    quantity: number;
    amount: number;
  }>;
  total: number;
}

const AdvancedBilling: React.FC<{
  billItems: BillItem[];
  onProcessReturn: (returnData: Return) => void;
  onSplitBill: (shares: SplitBillShare[]) => void;
}> = ({ billItems, onProcessReturn, onSplitBill }) => {
  const [splitShares, setSplitShares] = useState<SplitBillShare[]>([
    { customerName: '', items: [], total: 0 },
    { customerName: '', items: [], total: 0 },
  ]);

  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnReason, setReturnReason] = useState('');

  const addSplitShare = () => {
    setSplitShares([...splitShares, { customerName: '', items: [], total: 0 }]);
  };

  const removeSplitShare = (index: number) => {
    setSplitShares(splitShares.filter((_, i) => i !== index));
  };

  const updateShareItem = (shareIndex: number, itemId: string, batchType: BatchType, quantity: number) => {
    const item = billItems.find((bi) => bi.medicineId === itemId);
    if (!item) return;

    const newShares = [...splitShares];
    const shareItems = newShares[shareIndex].items;
    const existingItemIndex = shareItems.findIndex((si) => si.itemId === itemId && si.batchType === batchType);

    if (existingItemIndex >= 0) {
      if (quantity === 0) {
        shareItems.splice(existingItemIndex, 1);
      } else {
        shareItems[existingItemIndex].quantity = quantity;
        shareItems[existingItemIndex].amount = quantity * item.unitPrice;
      }
    } else if (quantity > 0) {
      shareItems.push({
        itemId,
        batchType,
        quantity,
        amount: quantity * item.unitPrice,
      });
    }

    newShares[shareIndex].total = shareItems.reduce((sum, si) => sum + si.amount, 0);
    setSplitShares(newShares);
    onSplitBill(newShares);
  };

  const handleReturnItem = (item: BillItem) => {
    const existingReturn = returnItems.find(
      (ri) => ri.medicineId === item.medicineId && ri.batchType === item.batchType
    );
    if (existingReturn) {
      setReturnItems(
        returnItems.map((ri) =>
          ri.medicineId === item.medicineId && ri.batchType === item.batchType
            ? { ...ri, quantity: ri.quantity + 1, total: (ri.quantity + 1) * ri.unitPrice }
            : ri
        )
      );
    } else {
      setReturnItems([
        ...returnItems,
        {
          medicineId: item.medicineId,
          batchType: item.batchType,
          quantity: 1,
          unitPrice: item.unitPrice,
          total: item.unitPrice,
        },
      ]);
    }
  };

  const processReturn = () => {
    if (returnItems.length === 0 || !returnReason) return;

    const returnData: Return = {
      id: `RET-${Date.now()}`,
      billId: 'CURRENT-BILL-ID', // Replace with actual bill ID
      customerId: 'CUSTOMER-ID', // Replace with actual customer ID
      date: new Date().toISOString(),
      items: returnItems,
      reason: returnReason,
      refundAmount: returnItems.reduce((sum, item) => sum + item.total, 0),
      status: 'pending',
    };

    onProcessReturn(returnData);
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
        return 'bg-red-100 text-red-800';
      case 'B':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Split Bill Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Split Bill</h3>
          <button
            onClick={addSplitShare}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Person
          </button>
        </div>

        <div className="space-y-4">
          {splitShares.map((share, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={share.customerName}
                  onChange={(e) => {
                    const newShares = [...splitShares];
                    newShares[index].customerName = e.target.value;
                    setSplitShares(newShares);
                    onSplitBill(newShares);
                  }}
                  className="px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                {index > 1 && (
                  <button
                    onClick={() => removeSplitShare(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {billItems.map((item) => (
                  <div key={`${item.medicineId}-${item.batchType}`} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{item.medicineName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBatchTypeColor(item.batchType)}`}>
                          {getBatchTypeLabel(item.batchType)}
                        </span>
                        {item.batchType === 'C' && (
                          <span className="flex items-center text-xs text-red-600">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Short Expiry
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateShareItem(
                              index,
                              item.medicineId,
                              item.batchType,
                              (share.items.find((si) => si.itemId === item.medicineId && si.batchType === item.batchType)?.quantity || 0) - 1
                            )
                          }
                          className="p-1 text-gray-600 hover:text-gray-800"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">
                          {share.items.find((si) => si.itemId === item.medicineId && si.batchType === item.batchType)?.quantity || 0}
                        </span>
                        <button
                          onClick={() =>
                            updateShareItem(
                              index,
                              item.medicineId,
                              item.batchType,
                              (share.items.find((si) => si.itemId === item.medicineId && si.batchType === item.batchType)?.quantity || 0) + 1
                            )
                          }
                          className="p-1 text-gray-600 hover:text-gray-800"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Share Total:</span>
                  <span className="font-bold">${share.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Return/Refund Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Process Return/Refund</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {billItems.map((item) => (
              <div
                key={`${item.medicineId}-${item.batchType}`}
                className="p-4 border rounded-lg cursor-pointer hover:border-blue-500"
                onClick={() => handleReturnItem(item)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{item.medicineName}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBatchTypeColor(item.batchType)}`}>
                        {getBatchTypeLabel(item.batchType)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      ${item.unitPrice.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          <textarea
            placeholder="Return Reason"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />

          {returnItems.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Return Summary</h4>
              {returnItems.map((item) => {
                const originalItem = billItems.find(
                  (bi) => bi.medicineId === item.medicineId && bi.batchType === item.batchType
                );
                return (
                  <div key={`${item.medicineId}-${item.batchType}`} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span>{originalItem?.medicineName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBatchTypeColor(item.batchType)}`}>
                        {getBatchTypeLabel(item.batchType)}
                      </span>
                    </div>
                    <span>
                      {item.quantity} x ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)}
                    </span>
                  </div>
                );
              })}
              <div className="mt-2 pt-2 border-t flex items-center justify-between font-medium">
                <span>Total Refund Amount:</span>
                <span>${returnItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            onClick={processReturn}
            disabled={returnItems.length === 0 || !returnReason}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Process Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedBilling;