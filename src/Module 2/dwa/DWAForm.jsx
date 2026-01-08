import React, { useState } from 'react';
import { Plus, Trash2, ChevronLeft } from 'lucide-react';
import { useStock } from '../../hooks/useStock';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const AddSubContractorModal = ({ isOpen, onClose, onAdd }) => {
  const { dispatch } = useStock();
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');

  const handleSubmit = () => {
    if (!name || !region) return;
    const newId = Date.now();
    dispatch({ type: 'ADD_SUBCONTRACTOR', payload: { id: newId, name, region } });
    onAdd(newId, region);
    setName(''); setRegion(''); onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Sub-contractor">
      <div className="space-y-4">
        <Input label="Sub-contractor Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" required />
        <Input label="Region / Location" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Enter region" required />
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Sub-contractor</Button>
        </div>
      </div>
    </Modal>
  );
};

const IndentForm = ({ onBack }) => {
  const { state, dispatch } = useStock();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    indentNo: '',
    subContractorId: '',
    region: ''
  });
  const [selectedWOs, setSelectedWOs] = useState([]);
  const [items, setItems] = useState([]);

  const handleSubChange = (e) => {
    if (e.target.value === 'add-new') {
      setShowModal(true);
    } else {
      const sub = state.subContractors.find(s => s.id === Number(e.target.value));
      setFormData({ ...formData, subContractorId: Number(e.target.value), region: sub?.region || '' });
    }
  };

  const handleWOSelection = (woId) => {
    const wo = state.workOrders.find(w => w.id === Number(woId));
    if (selectedWOs.includes(wo.id)) {
      setSelectedWOs(selectedWOs.filter(id => id !== wo.id));
      setItems(items.filter(item => item.woNumber !== wo.woNumber));
    } else {
      setSelectedWOs([...selectedWOs, wo.id]);
      const newItems = wo.items.map(i => ({ itemId: i.itemId, woNumber: wo.woNumber, estimated: i.estimated, issued: i.issued || 0, currentIssuing: 0 }));
      setItems([...items, ...newItems]);
    }
  };

  const updateQty = (woNo, itemId, val) => {
    setItems(items.map(i => (i.woNumber === woNo && i.itemId === itemId) ? { ...i, currentIssuing: Number(val) } : i));
  };

  const handleSubmit = () => {
    if (!formData.indentNo || !formData.subContractorId) return alert('Fill required fields');
    dispatch({ type: 'ADD_INDENT', payload: { ...formData, workOrderIds: selectedWOs, items: items.filter(i => i.currentIssuing > 0) } });
    onBack();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <button onClick={onBack} className="mb-6 flex items-center font-bold text-gray-700">
        <ChevronLeft size={20} /> Back to List
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Fixed Visibility: Added font-bold and shadow-sm to make it stand out */}
        <Input 
          label="Indent No" 
          className="font-bold shadow-sm border-gray-300"
          value={formData.indentNo} 
          onChange={(e) => setFormData({ ...formData, indentNo: e.target.value })} 
          placeholder="IND-0000" 
          required 
        />
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-contractor</label>
          <select 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500" 
            value={formData.subContractorId} 
            onChange={handleSubChange}
          >
            <option value="">Select Sub-contractor</option>
            {state.subContractors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            <option value="add-new" className="text-blue-600 font-bold italic">+ Add New Sub-contractor</option>
          </select>
        </div>

        <Input 
          label="Region" 
          className="bg-gray-50 font-semibold text-gray-600"
          value={formData.region} 
          readOnly 
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Work Orders</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {state.workOrders.filter(w => w.status !== 'Completed').map(wo => (
            <div 
              key={wo.id} 
              onClick={() => handleWOSelection(wo.id)} 
              className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedWOs.includes(wo.id) ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <p className="font-bold text-sm">{wo.woNumber}</p>
              <p className="text-xs text-gray-500">{wo.region}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedWOs.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">WO No</th>
                <th className="px-4 py-3 text-left font-bold text-blue-900 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-center font-bold text-blue-900 uppercase w-32">Balance</th>
                <th className="px-4 py-3 text-center font-bold text-blue-900 uppercase w-32">Issue Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-blue-600">{item.woNumber}</td>
                  <td className="p-3 font-medium text-gray-800">{state.items.find(i => i.id === item.itemId)?.name}</td>
                  <td className="p-3 text-center font-bold text-red-600">{item.estimated - item.issued}</td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      className="w-full p-2 border border-gray-300 rounded text-center font-bold focus:border-blue-500 outline-none" 
                      value={item.currentIssuing} 
                      onChange={(e) => updateQty(item.woNumber, item.itemId, e.target.value)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
        <Button variant="secondary" onClick={onBack}>Cancel</Button>
        <Button onClick={handleSubmit} className="px-8 shadow-md">Create Indent Entry</Button>
      </div>

      <AddSubContractorModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onAdd={(id, reg) => setFormData({...formData, subContractorId: id, region: reg})} 
      />
    </div>
  );
};

export default IndentForm;