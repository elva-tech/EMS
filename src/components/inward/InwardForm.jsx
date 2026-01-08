import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useStock } from '../../hooks/useStock';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { calculateAccepted } from '../../utils/calculations';

const AddSupplierModal = ({ isOpen, onClose }) => {
  const { dispatch } = useStock();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');


  const handleSubmit = () => {
    if (!name || !address) return;
    dispatch({ type: 'ADD_SUPPLIER', payload: { name, address } });
    setName('');
    setAddress('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Supplier">
      <div>
        <Input
          label="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Supplier</Button>
        </div>
      </div>
    </Modal>
  );
};

const InwardForm = ({ onBack }) => {
  const { state, dispatch } = useStock();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    dcNo: '',
    lrNo: '',
    vehicleNo: '',
    supplierId: ''
  });
  const [items, setItems] = useState([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const addItem = () => {
    setItems([...items, {
      itemId: '',
      asPerChallan: 0,
      actualReceipt: 0,
      short: 0,
      excess: 0,
      reject: 0,
      accepted: 0,
      remarks: ''
    }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];

    // Update the field being typed
    newItems[index][field] = field === 'itemId' ? Number(value) : value;

    // Calculation Variables
    const challan = Number(newItems[index].asPerChallan) || 0;
    const actual = Number(newItems[index].actualReceipt) || 0;
    const reject = Number(newItems[index].reject) || 0;

    // logic: Only calculate Short if Actual Receipt is entered ( > 0 )
    if (actual > 0) {
      newItems[index].short = challan - actual;
      newItems[index].accepted = actual - reject;
    } else {
      // Keep them at 0 or empty until Actual Receipt is provided
      newItems[index].short = 0;
      newItems[index].accepted = 0;
    }

    setItems(newItems);
  };

  const handleSubmit = () => {
    if (!formData.date || !formData.dcNo || !formData.lrNo || !formData.vehicleNo || !formData.supplierId || items.length === 0) {
      alert('Please fill all required fields and add at least one item');
      return;
    }

    dispatch({
      type: 'ADD_INWARD',
      payload: { ...formData, items }
    });
    onBack();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Add Inward Entry</h2>

      <div>
        {/* Header Information */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            label="DC No"
            value={formData.dcNo}
            onChange={(e) => setFormData({ ...formData, dcNo: e.target.value })}
            required
          />
          <Input
            label="LR No"
            value={formData.lrNo}
            onChange={(e) => setFormData({ ...formData, lrNo: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            label="Vehicle No"
            value={formData.vehicleNo}
            onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Supplier <span className="text-danger-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.supplierId}
              onChange={(e) => {
                if (e.target.value === 'add-new') {
                  setShowSupplierModal(true);
                } else {
                  setFormData({ ...formData, supplierId: Number(e.target.value) });
                }
              }}
              required
            >
              <option value="">Select Supplier</option>
              {state.suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              <option value="add-new" className="text-blue-600 font-bold font-italic">+ Add New Supplier</option>
            </select>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Items</h3>
            <Button onClick={addItem}>
              <Plus size={20} /> Add Item
            </Button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                  <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Item</th>
                  <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">As Per Challan</th>
                  <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Actual Receipt</th>
                  <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Short</th>
                  <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Reject</th>
                  <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Accepted</th>
                  <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Remarks</th>
                  <th className="border-r border-blue-200 px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="border-r border-gray-200 px-4 py-2">
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={item.itemId}
                        onChange={(e) => {
                          updateItem(idx, 'itemId', Number(e.target.value))
                          e.target.blur();
                        }}
                        onFocus={(e) => (e.target.size = 6)}
                        onBlur={(e) => (e.target.size = 1)}
                        required
                      >

                        <option value="">Select Item</option>
                        {state.items.map(i => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border-r border-gray-200 px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={item.asPerChallan}
                        onChange={(e) => updateItem(idx, 'asPerChallan', Number(e.target.value))}
                        required
                      />
                    </td>
                    <td className="border-r border-gray-200 px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={item.actualReceipt}
                        onChange={(e) => updateItem(idx, 'actualReceipt', Number(e.target.value))}
                        required
                      />
                    </td>
                    <td className="border-r border-gray-200 px-4 py-2">
                      <input
                        type="number"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded bg-gray-100 font-semibold text-gray-600"
                        value={
                          item.actualReceipt > item.asPerChallan
                            ? `+${item.actualReceipt - item.asPerChallan} Excess`
                            : (item.actualReceipt > 0 ? item.short : '')
                        }
                        readOnly
                      />
                    </td>
                    <td className="border-r border-gray-200 px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={item.reject}
                        onChange={(e) => updateItem(idx, 'reject', Number(e.target.value))}
                      />
                    </td>
                    <td className="border-r border-gray-200 px-4 py-2">
                      <input
                        type="number"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded bg-green-50 font-bold text-green-700"
                        value={item.accepted}
                        readOnly
                      />
                    </td>
                    <td className="border-r border-gray-200 px-4 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={item.remarks}
                        onChange={(e) => updateItem(idx, 'remarks', e.target.value)}
                        placeholder="Optional"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 p-1.5 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No items added yet. Click "Add Item" to start.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onBack}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Inward Entry</Button>
        </div>
      </div>

      <AddSupplierModal
        isOpen={showSupplierModal}
        onClose={() => setShowSupplierModal(false)}
      />
    </div>
  );
};

export default InwardForm;