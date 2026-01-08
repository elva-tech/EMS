import React, { useState, useMemo } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { useStock } from '../../hooks/useStock';
import Button from '../common/Button';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import InwardForm from './InwardForm';
import InwardDetails from './InwardDetails';

const InwardModule = () => {
  const { state } = useStock();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const itemsPerPage = 10;
  
  const filteredEntries = useMemo(() => {
    return state.inwardEntries.filter(entry => {
      const supplier = state.suppliers.find(s => s.id === entry.supplierId);
      return (
        entry.inwardNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [state.inwardEntries, state.suppliers, searchTerm]);
  
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage]);
  
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  
  if (showForm) return <InwardForm onBack={() => setShowForm(false)} />;
  if (selectedEntry) return <InwardDetails entry={selectedEntry} onBack={() => setSelectedEntry(null)} />;

  const columns = [
    { 
      header: 'NO.', 
      // Line below fixed to prevent NaN
      render: (row, idx) => {
  // If the table provides idx, use it. 
  // Otherwise, calculate based on the position in the filtered list
  const actualIndex = idx !== undefined ? idx : paginatedEntries.indexOf(row);
  return ((currentPage - 1) * itemsPerPage) + actualIndex + 1;
}
    },
    { header: 'Inward No', key: 'inwardNo' },
    { header: 'Date', key: 'date' },
    { header: 'Supplier', render: (row) => state.suppliers.find(s => s.id === row.supplierId)?.name },
    { header: 'DC No', key: 'dcNo' },
    { header: 'Vehicle No', key: 'vehicleNo' },
    { 
      header: 'Items', 
      render: (row) => (
        <span className="text-blue-600 font-bold">
          {row.items.length} Units
        </span>
      )
    }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Inward Entries</h2>
          <p className="text-gray-600 mt-1">Manage incoming stock entries</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} /> Add Inward
        </Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Inward No or Supplier..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={paginatedEntries}
          onRowClick={setSelectedEntry}
        />
        
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default InwardModule;