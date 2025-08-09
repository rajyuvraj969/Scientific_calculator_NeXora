import React from 'react';

interface DisplayProps {
  value: string;
  history: string[];
  error: string | null;
}

const Display: React.FC<DisplayProps> = ({ value, history, error }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-700">
      <div className="mb-4">
        <div className="text-gray-400 text-xs mb-2 font-mono">History</div>
        <div className="h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
          {history.length === 0 ? (
            <div className="text-gray-600 text-sm">No calculations yet</div>
          ) : (
            history.slice(-3).map((item, index) => (
              <div key={index} className="text-gray-400 text-sm font-mono mb-1">
                {item}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-4">
        <div className="text-right">
          {error ? (
            <div className="text-red-400 text-xl font-mono">
              Error: {error}
            </div>
          ) : (
            <div className="text-white text-3xl font-mono font-light">
              {value || '0'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Display;