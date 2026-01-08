import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useStock } from '../../hooks/useStock';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';

const AddSubContractorModal = ({ isOpen, onClose }) => {
  const { dispatch } = useStock();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    if (!name || !address) return;
    dispatch({ type: 'ADD_SUBCONTRACTOR', payload: { name, address } });
    setName('');
    setAddress('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Sub-contractor">
      <div className="space-y-4">
        <Input
          label="Sub-contractor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
        <Input
          label="Address / Location"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          required
        />
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Sub-contractor</Button>
        </div>
      </div>
    </Modal>
  );
};

const OutwardForm = ({ onBack }) => {
  const { state, dispatch } = useStock();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    indentNo: '', // Replaced DC No with Indent No per PDF 
    vehicleNo: '',
    subContractorId: ''
  });
  const [items, setItems] = useState([{ itemId: '', quantity: 0, remarks: '' }]);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = () => {
    if (!formData.indentNo || !formData.subContractorId || items.some(i => !i.itemId)) {
      alert('Please fill all required fields and select items');
      return;
    }
    dispatch({
      type: 'ADD_OUTWARD',
      payload: { ...formData, items }
    });
    onBack();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">Add Outward Entry</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
        <Input label="Indent No" value={formData.indentNo} onChange={(e) => setFormData({ ...formData, indentNo: e.target.value })} placeholder="IND-0000" required />
        <Input label="Vehicle No" value={formData.vehicleNo} onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })} placeholder="KA-00-XX-0000" required />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-contractor</label>
          <select
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            value={formData.subContractorId}
            onChange={(e) => {
              if (e.target.value === 'add-new') {
                setShowModal(true);
              } else {
                setFormData({ ...formData, subContractorId: Number(e.target.value) });
              }
            }}
          >
            <option value="">Select Sub-contractor</option>
            {state.subContractors.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            <option value="add-new" className="text-blue-600 font-bold font-italic">+ Add New Sub-contractor</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Items Dispatched</h3>
          <Button onClick={() => setItems([...items, { itemId: '', quantity: 0, remarks: '' }])}>
            <Plus size={18} /> Add Item
          </Button>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left font-bold text-blue-900 uppercase tracking-wider w-32">Quantity</th>
                <th className="px-4 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">Remarks</th>
                <th className="px-4 py-3 text-center w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={item.itemId} // or item.itemId
                      onChange={(e) => {
                        updateItem(idx, 'itemId', Number(e.target.value))
                        e.target.blur();
                      }}
                      onFocus={(e) => (e.target.size = 6)} // Shows 6 items and forces a scrollbar
                      onBlur={(e) => (e.target.size = 1)}  // Returns to a normal single line
                      required
                    >
                      <option value="">Select Item</option>
                      {state.items.map(i => (
                        <option key={i.id} value={i.id}>{i.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                      value={item.remarks}
                      onChange={(e) => updateItem(idx, 'remarks', e.target.value)}
                      placeholder="Optional remarks"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
        <Button variant="secondary" onClick={onBack}>Cancel</Button>
        <Button onClick={handleSubmit} className="px-8 shadow-md shadow-blue-100">
          Save Outward Entry
        </Button>
      </div>

      <AddSubContractorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default OutwardForm;