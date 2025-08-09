import React from 'react';
import Calculator from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Smart Calculator
          </h1>
          <p className="text-gray-300">
            Basic and advanced modes for all your calculation needs
          </p>
        </div>
        <Calculator />
      </div>
    </div>
  );
}

export default App;