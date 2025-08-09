export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
  memory: number;
  history: string[];
  isRadians: boolean;
  error: string | null;
  showAdvanced: boolean;
}

export interface ButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}