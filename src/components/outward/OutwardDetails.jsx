import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useStock } from '../../hooks/useStock';

const OutwardDetails = ({ entry, onBack }) => {
  const { state } = useStock();
  
  // Fix: Ensure ID comparison works by wrapping in Number()
  // const subContractor = state.subContractors.find(s => Number(s.id) === Number(entry.subContractorId));
  const subContractor = state.subContractors.find(s => s.id === entry.subContractorId);

  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <ChevronLeft size={20} /> Back to List
      </button>
      
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Outward Entry Details</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div>
          <p className="text-sm text-gray-600 font-medium">Indent No</p>
          <p className="text-lg font-bold text-gray-900">{entry.indentNo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Date</p>
          <p className="text-lg font-bold text-gray-900">{entry.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Vehicle No</p>
          <p className="text-lg font-bold text-gray-900">{entry.vehicleNo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Sub-contractor</p>
          <p className="text-lg font-bold text-gray-900">{subContractor?.name || 'N/A'}</p>
        </div>
      </div>
      
      <h3 className="text-lg font-bold mb-4 text-gray-900">Items Dispatched</h3>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
              <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Item Name</th>
              <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Quantity Dispatched</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {entry.items.map((item, idx) => {
              // Fix: Added Number() to ensure Item Name shows up
              const itemDetails = state.items.find(i => Number(i.id) === Number(item.itemId));
              return (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="border-r border-gray-200 px-4 py-3 font-medium">
                    {itemDetails?.name || 'Unknown Item'}
                  </td>
                  {/* Fix: Changed property from .accepted to .quantity to match OutwardForm */}
                  <td className="border-r border-gray-200 px-4 py-3 text-blue-700 font-bold text-lg">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-gray-600 italic">
                    {item.remarks || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutwardDetails;