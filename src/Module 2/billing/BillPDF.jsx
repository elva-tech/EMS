import React from 'react';
import { useStock } from '../../hooks/useStock';

const BillPDF = React.forwardRef(({ workOrder }, ref) => {
  const { state } = useStock();
  const dwa = state.dwaEntries?.find(d => d.id === workOrder.dwaId);

  // Helper to calculate costs based on your image logic
const calculateTotals = () => {
  let totalMat = 0;
  let totalErec = 0;
  
  // 1. We map over the items specifically attached to THIS Work Order
  const rows = (workOrder.items || []).map(woItem => {
    // 2. Find the rate information from the master items list in state
    const masterItem = state.items.find(i => i.id === woItem.itemId);
    
    // 3. Get rates from masterItem, fallback to 0 if not found
    const mRate = masterItem?.materialRate || 0;
    const eRate = masterItem?.erectionRate || 0;
    
    // 4. Use 'issued' if it's a completed job, fallback to 'estimated' for preview
    // This ensures that even if issued is 0, you see the potential cost
    const qty = woItem.issued > 0 ? woItem.issued : (woItem.estimated || 0); 
    
    const mCost = mRate * qty;
    const eCost = eRate * qty;
    
    totalMat += mCost;
    totalErec += eCost;

    return {
      name: masterItem?.name || 'Unknown Item',
      unit: masterItem?.unit || 'Nos',
      qty,
      mRate,
      eRate,
      mCost,
      eCost,
      rowTotal: mCost + eCost
    };
  });

  return { rows, totalMat, totalErec, grandTotal: totalMat + totalErec };
};

  const { rows, totalMat, totalErec, grandTotal } = calculateTotals();

  return (
    <div ref={ref} className="bg-white p-8 text-[11px] font-sans text-black" id="printable-bill">
      <div className="border-[1.5px] border-black">
        {/* Header Section */}
        <div className="grid grid-cols-12 border-b border-black">
          <div className="col-span-5 p-3 border-r border-black">
            <p className="font-bold text-xs mb-1">To,</p>
            <p className="font-bold uppercase">The Executive Engineer(Ele)</p>
            <p>O&M Division, BESCOM,</p>
            <p>Tumkur.</p>
          </div>
          <div className="col-span-7">
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-1.5 border-r border-black font-bold">Bill No: {workOrder.woNumber}</div>
              <div className="p-1.5 text-right font-bold">GSTIN: 29AAICM6834H1Z2</div>
            </div>
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-1.5 border-r border-black font-bold">DWA No: {dwa?.dwaNumber || 'BESCOM/DWA/2024/7594'}</div>
              <div className="p-1.5 text-right">Date: {workOrder.date}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-1.5 border-r border-black">WO No: {workOrder.woNumber}</div>
              <div className="p-1.5 text-right">Subdiv: RSD 2</div>
            </div>
          </div>
        </div>

        {/* Consumer Info */}
        <div className="grid grid-cols-12 border-b border-black bg-gray-50 font-bold uppercase">
          <div className="col-span-3 p-1.5 border-r border-black">Name of Consumer</div>
          <div className="col-span-5 p-1.5 border-r border-black font-normal uppercase">Thimmaiah S/O Ramaiah</div>
          <div className="col-span-2 p-1.5 border-r border-black">RR No:</div>
          <div className="col-span-2 p-1.5">TRIP11143</div>
        </div>

        {/* Billing Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black bg-gray-100 font-bold text-center uppercase text-[9px]">
              <td className="border-r border-black p-1 w-8" rowSpan="2">Sl No</td>
              <td className="border-r border-black p-1" rowSpan="2">Particulars</td>
              <td className="border-r border-black p-1 w-10" rowSpan="2">Unit</td>
              <td className="border-r border-black p-1 w-10" rowSpan="2">Qty</td>
              <td className="border-r border-black p-1" colSpan="2">Materials Cost</td>
              <td className="border-r border-black p-1" colSpan="2">Erection Cost</td>
              <td className="p-1 w-24" rowSpan="2">Total Amount (Rs)</td>
            </tr>
            <tr className="border-b border-black bg-gray-100 text-[8px] font-bold">
              <td className="border-r border-black p-1 text-center">Unit Rate</td>
              <td className="border-r border-black p-1 text-center">Cost</td>
              <td className="border-r border-black p-1 text-center">Unit Rate</td>
              <td className="border-r border-black p-1 text-center">Cost</td>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-black text-right h-8">
                <td className="border-r border-black p-1 text-center">{i + 1}</td>
                <td className="border-r border-black p-1 text-left uppercase text-[10px]">{row.name}</td>
                <td className="border-r border-black p-1 text-center">{row.unit}</td>
                <td className="border-r border-black p-1 font-bold">{row.qty}</td>
                <td className="border-r border-black p-1">{row.mRate.toFixed(2)}</td>
                <td className="border-r border-black p-1">{row.mCost.toFixed(2)}</td>
                <td className="border-r border-black p-1">{row.eRate.toFixed(2)}</td>
                <td className="border-r border-black p-1">{row.eCost.toFixed(2)}</td>
                <td className="p-1 font-bold">{row.rowTotal.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-50 text-right h-10 border-t border-black">
              <td className="border-r border-black p-1 text-center uppercase" colSpan="5">Total Amount in Rs:</td>
              <td className="border-r border-black p-1">{totalMat.toFixed(2)}</td>
              <td className="border-r border-black p-1"></td>
              <td className="border-r border-black p-1">{totalErec.toFixed(2)}</td>
              <td className="p-1 text-lg">₹{grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-16 flex justify-between px-6">
        <div className="text-center">
          <p className="font-bold mb-12">Contractor Signature</p>
          <div className="border-t border-black w-40"></div>
        </div>
        <div className="text-center">
          <p className="font-bold mb-12">Executive Engineer (Ele)</p>
          <div className="border-t border-black w-40"></div>
        </div>
      </div>
    </div>
  );
});

export default BillPDF;