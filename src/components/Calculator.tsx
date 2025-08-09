import React, { useState, useCallback } from 'react';
import Button from './Button';
import Display from './Display';
import { CalculatorState } from '../types/calculator';
import { 
  calculateExpression, 
  factorial, 
  formatNumber, 
  scientificFunctions 
} from '../utils/calculator-operations';

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    memory: 0,
    history: [],
    isRadians: true,
    error: null,
    showAdvanced: false
  });

  const updateState = useCallback((updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const inputNumber = useCallback((num: string) => {
    if (state.waitingForNewValue) {
      updateState({ display: num, waitingForNewValue: false });
    } else {
      updateState({ display: state.display === '0' ? num : state.display + num });
    }
  }, [state.display, state.waitingForNewValue, updateState]);

  const inputDecimal = useCallback(() => {
    if (state.waitingForNewValue) {
      updateState({ display: '0.', waitingForNewValue: false });
    } else if (state.display.indexOf('.') === -1) {
      updateState({ display: state.display + '.' });
    }
  }, [state.display, state.waitingForNewValue, updateState]);

  const clear = useCallback(() => {
    setState({
      display: '',
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
      memory: state.memory,
      history: state.history,
      isRadians: state.isRadians,
      error: null
    });
  }, [state.memory, state.history, state.isRadians]);

  const deleteLast = useCallback(() => {
    if (state.display.length > 1) {
      updateState({ display: state.display.slice(0, -1) });
    } else {
      updateState({ display: '' });
    }
  }, [state.display, updateState]);

  const calculate = useCallback(() => {
    try {
      if (!state.display) return;

      const result = calculateExpression(state.display);
      const formattedResult = formatNumber(result);
      const calculation = `${state.display} = ${formattedResult}`;
      
      updateState({
        display: formattedResult,
        history: [...state.history, calculation],
        waitingForNewValue: true
      });
    } catch (error) {
      setError('Invalid calculation');
    }
  }, [state.display, state.history, updateState, setError]);

  const performUnaryOperation = useCallback((operation: string) => {
    try {
      if (!state.display) return;

      const num = parseFloat(state.display);
      let result: number;

      switch (operation) {
        case 'sin':
          result = scientificFunctions.sin(num, state.isRadians);
          break;
        case 'cos':
          result = scientificFunctions.cos(num, state.isRadians);
          break;
        case 'tan':
          result = scientificFunctions.tan(num, state.isRadians);
          break;
        case 'asin':
          result = scientificFunctions.asin(num, state.isRadians);
          break;
        case 'acos':
          result = scientificFunctions.acos(num, state.isRadians);
          break;
        case 'atan':
          result = scientificFunctions.atan(num, state.isRadians);
          break;
        case 'log':
          result = scientificFunctions.log(num);
          break;
        case 'ln':
          result = scientificFunctions.ln(num);
          break;
        case 'sqrt':
          result = scientificFunctions.sqrt(num);
          break;
        case 'exp':
          result = scientificFunctions.exp(num);
          break;
        case '!':
          result = factorial(num);
          break;
        case '1/x':
          result = 1 / num;
          break;
        case 'x²':
          result = num * num;
          break;
        case '±':
          result = -num;
          break;
        default:
          return;
      }

      const formattedResult = formatNumber(result);
      const calculation = `${operation}(${state.display}) = ${formattedResult}`;
      
      updateState({
        display: formattedResult,
        history: [...state.history, calculation],
        waitingForNewValue: true
      });
    } catch (error: any) {
      setError(error.message || 'Invalid operation');
    }
  }, [state.display, state.history, state.isRadians, updateState, setError]);

  const inputOperator = useCallback((operator: string) => {
    if (state.display) {
      updateState({ 
        display: state.display + ` ${operator} `,
        waitingForNewValue: false 
      });
    }
  }, [state.display, updateState]);

  const memoryOperation = useCallback((operation: string) => {
    const currentValue = parseFloat(state.display) || 0;
    
    switch (operation) {
      case 'MC':
        updateState({ memory: 0 });
        break;
      case 'MR':
        updateState({ display: formatNumber(state.memory), waitingForNewValue: true });
        break;
      case 'M+':
        updateState({ memory: state.memory + currentValue });
        break;
      case 'M-':
        updateState({ memory: state.memory - currentValue });
        break;
      case 'MS':
        updateState({ memory: currentValue });
        break;
    }
  }, [state.display, state.memory, updateState]);

  const insertConstant = useCallback((constant: string) => {
    let value: string;
    switch (constant) {
      case 'π':
        value = formatNumber(Math.PI);
        break;
      case 'e':
        value = formatNumber(Math.E);
        break;
      default:
        return;
    }
    
    if (state.waitingForNewValue || !state.display) {
      updateState({ display: value, waitingForNewValue: false });
    } else {
      updateState({ display: state.display + value });
    }
  }, [state.display, state.waitingForNewValue, updateState]);

  const toggleAngleUnit = useCallback(() => {
    updateState({ isRadians: !state.isRadians });
  }, [state.isRadians, updateState]);

  const toggleAdvanced = useCallback(() => {
    updateState({ showAdvanced: !state.showAdvanced });
  }, [state.showAdvanced, updateState]);

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Scientific Calculator</h1>
        <div className="flex gap-2">
          <Button
            onClick={toggleAdvanced}
            className={`px-3 py-1 text-xs rounded-md ${
              state.showAdvanced 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-gray-200'
            }`}
          >
            {state.showAdvanced ? 'ADV' : 'BASIC'}
          </Button>
          {state.showAdvanced && (
            <Button
              onClick={toggleAngleUnit}
              className={`px-3 py-1 text-xs rounded-md ${
                state.isRadians 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-gray-200'
              }`}
            >
              {state.isRadians ? 'RAD' : 'DEG'}
            </Button>
          )}
          <Button
            onClick={() => memoryOperation('MR')}
            className={`px-3 py-1 text-xs rounded-md ${
              state.memory !== 0 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-600 text-gray-200'
            }`}
          >
            M
          </Button>
        </div>
      </div>

      <Display 
        value={state.display} 
        history={state.history} 
        error={state.error}
      />

      {state.showAdvanced ? (
        // Advanced Scientific Calculator Layout
        <div className="grid grid-cols-6 gap-2">
          {/* Row 1 - Memory and Clear functions */}
          <Button onClick={() => memoryOperation('MC')} className="bg-orange-600 hover:bg-orange-700 text-white text-xs">MC</Button>
          <Button onClick={() => memoryOperation('MR')} className="bg-orange-600 hover:bg-orange-700 text-white text-xs">MR</Button>
          <Button onClick={() => memoryOperation('M+')} className="bg-orange-600 hover:bg-orange-700 text-white text-xs">M+</Button>
          <Button onClick={() => memoryOperation('M-')} className="bg-orange-600 hover:bg-orange-700 text-white text-xs">M-</Button>
          <Button onClick={() => memoryOperation('MS')} className="bg-orange-600 hover:bg-orange-700 text-white text-xs">MS</Button>
          <Button onClick={clear} className="bg-red-600 hover:bg-red-700 text-white">AC</Button>

          {/* Row 2 - Scientific functions */}
          <Button onClick={() => performUnaryOperation('sin')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">sin</Button>
          <Button onClick={() => performUnaryOperation('cos')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">cos</Button>
          <Button onClick={() => performUnaryOperation('tan')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">tan</Button>
          <Button onClick={() => performUnaryOperation('ln')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">ln</Button>
          <Button onClick={() => performUnaryOperation('log')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">log</Button>
          <Button onClick={deleteLast} className="bg-gray-600 hover:bg-gray-700 text-white">⌫</Button>

          {/* Row 3 - Inverse functions */}
          <Button onClick={() => performUnaryOperation('asin')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">sin⁻¹</Button>
          <Button onClick={() => performUnaryOperation('acos')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">cos⁻¹</Button>
          <Button onClick={() => performUnaryOperation('atan')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">tan⁻¹</Button>
          <Button onClick={() => performUnaryOperation('!')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">x!</Button>
          <Button onClick={() => inputOperator('^')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">xʸ</Button>
          <Button onClick={() => inputOperator('÷')} className="bg-purple-600 hover:bg-purple-700 text-white">÷</Button>

          {/* Row 4 - More functions */}
          <Button onClick={() => insertConstant('π')} className="bg-green-600 hover:bg-green-700 text-white text-xs">π</Button>
          <Button onClick={() => insertConstant('e')} className="bg-green-600 hover:bg-green-700 text-white text-xs">e</Button>
          <Button onClick={() => performUnaryOperation('sqrt')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">√x</Button>
          <Button onClick={() => performUnaryOperation('x²')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">x²</Button>
          <Button onClick={() => performUnaryOperation('1/x')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">1/x</Button>
          <Button onClick={() => inputOperator('×')} className="bg-purple-600 hover:bg-purple-700 text-white">×</Button>

          {/* Row 5 - Numbers */}
          <Button onClick={() => performUnaryOperation('exp')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">eˣ</Button>
          <Button onClick={() => performUnaryOperation('abs')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">|x|</Button>
          <Button onClick={() => performUnaryOperation('±')} className="bg-gray-600 hover:bg-gray-700 text-white text-xs">±</Button>
          <Button onClick={() => inputNumber('7')} className="bg-gray-700 hover:bg-gray-600 text-white">7</Button>
          <Button onClick={() => inputNumber('8')} className="bg-gray-700 hover:bg-gray-600 text-white">8</Button>
          <Button onClick={() => inputNumber('9')} className="bg-gray-700 hover:bg-gray-600 text-white">9</Button>

          {/* Row 6 */}
          <Button onClick={() => inputOperator('(')} className="bg-gray-600 hover:bg-gray-700 text-white">(</Button>
          <Button onClick={() => inputOperator(')')} className="bg-gray-600 hover:bg-gray-700 text-white">)</Button>
          <Button onClick={() => inputOperator('-')} className="bg-purple-600 hover:bg-purple-700 text-white">-</Button>
          <Button onClick={() => inputNumber('4')} className="bg-gray-700 hover:bg-gray-600 text-white">4</Button>
          <Button onClick={() => inputNumber('5')} className="bg-gray-700 hover:bg-gray-600 text-white">5</Button>
          <Button onClick={() => inputNumber('6')} className="bg-gray-700 hover:bg-gray-600 text-white">6</Button>

          {/* Row 7 */}
          <Button onClick={() => inputNumber('00')} className="bg-gray-700 hover:bg-gray-600 text-white col-span-2">00</Button>
          <Button onClick={() => inputOperator('+')} className="bg-purple-600 hover:bg-purple-700 text-white">+</Button>
          <Button onClick={() => inputNumber('1')} className="bg-gray-700 hover:bg-gray-600 text-white">1</Button>
          <Button onClick={() => inputNumber('2')} className="bg-gray-700 hover:bg-gray-600 text-white">2</Button>
          <Button onClick={() => inputNumber('3')} className="bg-gray-700 hover:bg-gray-600 text-white">3</Button>

          {/* Row 8 */}
          <Button onClick={() => inputNumber('0')} className="bg-gray-700 hover:bg-gray-600 text-white col-span-3">0</Button>
          <Button onClick={inputDecimal} className="bg-gray-700 hover:bg-gray-600 text-white">.</Button>
          <Button onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white col-span-2">=</Button>
        </div>
      ) : (
        // Basic Calculator Layout
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 - Clear and basic operations */}
          <Button onClick={clear} className="bg-red-600 hover:bg-red-700 text-white col-span-2">Clear</Button>
          <Button onClick={deleteLast} className="bg-gray-600 hover:bg-gray-700 text-white">⌫</Button>
          <Button onClick={() => inputOperator('÷')} className="bg-purple-600 hover:bg-purple-700 text-white">÷</Button>

          {/* Row 2 - Numbers and multiply */}
          <Button onClick={() => inputNumber('7')} className="bg-gray-700 hover:bg-gray-600 text-white">7</Button>
          <Button onClick={() => inputNumber('8')} className="bg-gray-700 hover:bg-gray-600 text-white">8</Button>
          <Button onClick={() => inputNumber('9')} className="bg-gray-700 hover:bg-gray-600 text-white">9</Button>
          <Button onClick={() => inputOperator('×')} className="bg-purple-600 hover:bg-purple-700 text-white">×</Button>

          {/* Row 3 - Numbers and subtract */}
          <Button onClick={() => inputNumber('4')} className="bg-gray-700 hover:bg-gray-600 text-white">4</Button>
          <Button onClick={() => inputNumber('5')} className="bg-gray-700 hover:bg-gray-600 text-white">5</Button>
          <Button onClick={() => inputNumber('6')} className="bg-gray-700 hover:bg-gray-600 text-white">6</Button>
          <Button onClick={() => inputOperator('-')} className="bg-purple-600 hover:bg-purple-700 text-white">-</Button>

          {/* Row 4 - Numbers and add */}
          <Button onClick={() => inputNumber('1')} className="bg-gray-700 hover:bg-gray-600 text-white">1</Button>
          <Button onClick={() => inputNumber('2')} className="bg-gray-700 hover:bg-gray-600 text-white">2</Button>
          <Button onClick={() => inputNumber('3')} className="bg-gray-700 hover:bg-gray-600 text-white">3</Button>
          <Button onClick={() => inputOperator('+')} className="bg-purple-600 hover:bg-purple-700 text-white row-span-2">+</Button>

          {/* Row 5 - Zero, decimal, and equals */}
          <Button onClick={() => inputNumber('0')} className="bg-gray-700 hover:bg-gray-600 text-white col-span-2">0</Button>
          <Button onClick={inputDecimal} className="bg-gray-700 hover:bg-gray-600 text-white">.</Button>

          {/* Row 6 - Additional functions */}
          <Button onClick={() => performUnaryOperation('x²')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">x²</Button>
          <Button onClick={() => performUnaryOperation('sqrt')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">√x</Button>
          <Button onClick={() => performUnaryOperation('±')} className="bg-gray-600 hover:bg-gray-700 text-white text-xs">±</Button>
          <Button onClick={calculate} className="bg-green-600 hover:bg-green-700 text-white">=</Button>
        </div>
      )}
    </div>
  );
};

export default Calculator;