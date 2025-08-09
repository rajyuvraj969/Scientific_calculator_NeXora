export const calculateExpression = (expression: string): number => {
  try {
    // Replace calculator symbols with JS operators
    let processedExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString());

    // Handle scientific functions
    processedExpression = processedExpression
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/asin\(/g, 'Math.asin(')
      .replace(/acos\(/g, 'Math.acos(')
      .replace(/atan\(/g, 'Math.atan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/floor\(/g, 'Math.floor(')
      .replace(/ceil\(/g, 'Math.ceil(');

    // Handle power operator
    processedExpression = processedExpression.replace(/\^/g, '**');

    const result = eval(processedExpression);
    
    if (!isFinite(result)) {
      throw new Error('Invalid calculation');
    }
    
    return result;
  } catch (error) {
    throw new Error('Invalid expression');
  }
};

export const factorial = (n: number): number => {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Factorial undefined for negative or non-integer values');
  }
  if (n === 0 || n === 1) return 1;
  if (n > 170) throw new Error('Factorial too large');
  
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

export const degToRad = (degrees: number): number => degrees * (Math.PI / 180);
export const radToDeg = (radians: number): number => radians * (180 / Math.PI);

export const formatNumber = (num: number): string => {
  if (Math.abs(num) < 1e-10 && num !== 0) {
    return num.toExponential(6);
  }
  if (Math.abs(num) >= 1e10) {
    return num.toExponential(6);
  }
  
  const rounded = Math.round(num * 1e10) / 1e10;
  return rounded.toString();
};

export const scientificFunctions = {
  sin: (x: number, isRadians: boolean) => Math.sin(isRadians ? x : degToRad(x)),
  cos: (x: number, isRadians: boolean) => Math.cos(isRadians ? x : degToRad(x)),
  tan: (x: number, isRadians: boolean) => Math.tan(isRadians ? x : degToRad(x)),
  asin: (x: number, isRadians: boolean) => isRadians ? Math.asin(x) : radToDeg(Math.asin(x)),
  acos: (x: number, isRadians: boolean) => isRadians ? Math.acos(x) : radToDeg(Math.acos(x)),
  atan: (x: number, isRadians: boolean) => isRadians ? Math.atan(x) : radToDeg(Math.atan(x)),
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  exp: Math.exp,
  pow: Math.pow,
  abs: Math.abs
};