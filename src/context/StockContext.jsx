import React, { createContext, useReducer } from 'react';
import { initialMockData } from '../data/mockData';

export const StockContext = createContext();

const stockReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SUPPLIER':
      return {
        ...state,
        suppliers: [...state.suppliers, { id: Date.now(), ...action.payload }]
      };

    case 'ADD_SUBCONTRACTOR':
      return {
        ...state,
        subContractors: [...state.subContractors, { id: Date.now(), ...action.payload }]
      };

    case 'ADD_INWARD': {
      const newInward = {
        ...action.payload,
        id: Date.now(),
        inwardNo: `INW-2026-${String(state.inwardEntries.length + 1).padStart(3, '0')}`
      };

      // Update stock
      const inwardStock = { ...state.stock };
      newInward.items.forEach(item => {
        inwardStock[item.itemId] = (inwardStock[item.itemId] || 0) + item.accepted;
      });

      return {
        ...state,
        inwardEntries: [...state.inwardEntries, newInward],
        stock: inwardStock
      };
    }

    case 'ADD_OUTWARD': {
      const newOutward = {
        ...action.payload,
        id: Date.now(),
        outwardNo: `OUT-2026-${String(state.outwardEntries.length + 1).padStart(3, '0')}`
      };

      // Update stock
      const outwardStock = { ...state.stock };
      newOutward.items.forEach(item => {
        outwardStock[item.itemId] = Math.max(0, (outwardStock[item.itemId] || 0) - item.quantity);
      });

      return {
        ...state,
        outwardEntries: [...state.outwardEntries, newOutward],
        stock: outwardStock
      };
    }

    // ==================== MODULE 2 ACTIONS (NEW) ====================

    // DWA Actions
    case 'ADD_DWA': {
      const { dwaNumber } = action.payload; // Extract what you typed
      const newDWA = {
        ...action.payload,
        id: Date.now(),
        // If dwaNumber exists, use it. Otherwise, generate one.
        dwaNumber: dwaNumber ? dwaNumber : `DWA-2026-${String(state.dwaEntries.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        dwaEntries: [newDWA, ...state.dwaEntries]
      };
    }

    // Delivery Instructions Actions
    case 'ADD_DI': {
      const { diNumber } = action.payload;
      const newDI = {
        ...action.payload,
        id: Date.now(),
        diNumber: diNumber ? diNumber : `DI-2026-${String(state.deliveryInstructions.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        deliveryInstructions: [newDI, ...state.deliveryInstructions]
      };
    }

    // Work Order Actions
    case 'ADD_WORK_ORDER': {
      const { woNumber } = action.payload;
      const newWO = {
        ...action.payload,
        id: Date.now(),
        woNumber: woNumber ? woNumber : `WO-2026-${String(state.workOrders.length + 1).padStart(3, '0')}`,
        status: 'Todo',
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        workOrders: [newWO, ...state.workOrders]
      };
    }

    case 'UPDATE_WO_STATUS': {
      return {
        ...state,
        workOrders: state.workOrders.map(wo =>
          wo.id === action.payload.woId
            ? { ...wo, status: action.payload.status }
            : wo
        )
      };
    }

    // Indent Actions
case 'ADD_INDENT': {
  const newIndent = {
    ...action.payload,
    id: Date.now(),
    // indentNo: `IND-2026-${String(state.indents.length + 1).padStart(3, '0')}`,
    status: 'In Progress',
    createdAt: new Date().toISOString()
  };

  // 1. Keep the WO status as it currently is, only update the issued quantities
  const updatedWOsWithIssued = state.workOrders.map(wo => {
    if (action.payload.workOrderIds.includes(wo.id)) {
      return {
        ...wo,
        // status: wo.status, // We leave this alone now!
        status: wo.status === 'Todo' ? 'In Progress' : wo.status,
        items: wo.items.map(woItem => {
          const matchingItem = newIndent.items.find(
            item => item.itemId === woItem.itemId && item.woNumber === wo.woNumber
          );
          if (matchingItem) {
            return {
              ...woItem,
              issued: (woItem.issued || 0) + matchingItem.currentIssuing
            };
          }
          return woItem;
        })
      };
    }
    return wo;
  });

  return {
    ...state,
    indents: [newIndent, ...state.indents],
    workOrders: updatedWOsWithIssued
  };
}

    case 'COMPLETE_INDENT': {
  const indentToComplete = state.indents.find(i => i.id === action.payload.indentId);
  if (!indentToComplete) return state;

  // 1. Mark Indent as Completed
  const updatedIndents = state.indents.map(indent =>
    indent.id === action.payload.indentId ? { ...indent, status: 'Completed' } : indent
  );

  // 2. Mark associated Work Orders as Completed
  const updatedWOs = state.workOrders.map(wo =>
    indentToComplete.workOrderIds.includes(wo.id) ? { ...wo, status: 'Completed' } : wo
  );

  // 3. IMPORTANT: Deduct the issued quantities from the Warehouse Stock
  const newStock = { ...state.stock };
  indentToComplete.items.forEach(item => {
    const currentStock = newStock[item.itemId] || 0;
    // Deduct the quantity issued in this indent from the main warehouse stock
    newStock[item.itemId] = Math.max(0, currentStock - item.currentIssuing);
  });

  return {
    ...state,
    indents: updatedIndents,
    workOrders: updatedWOs,
    stock: newStock // This updates the main inventory numbers
  };
}

    default:
      return state;
  }
};

export const StockProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stockReducer, initialMockData);

  return (
    <StockContext.Provider value={{ state, dispatch }}>
      {children}
    </StockContext.Provider>
  );
};