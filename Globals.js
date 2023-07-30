import React, { useState } from 'react';

// Create a context to share and access state in child components
export const StateContext = React.createContext();

export const StateProvider = ({ children }) => {
  // Define different states using the useState hook
  
  // Array of allowed amounts for ingredients
  /*const allowedAmounts = [
    { name: 'Leche', amount: 5, unit: 'litros' },
    { name: 'Vainilla', amount: 100, unit: 'mililitros' },
    { name: 'Vainilla', amount: 0.1, unit: 'litros' },
    { name: 'Azucar', amount: 850, unit: 'gramos' },
    { name: 'Grenetina', amount: 175, unit: 'gramos' },
    { name: 'Azucar', amount: 0.85, unit: 'kilos' },
    { name: 'Grenetina', amount: 0.175, unit: 'kilos' }
  ];*/

  return (
    <StateContext.Provider
      value={{
      }}
    >
      {children}
    </StateContext.Provider>
  );
};