import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Modal,
} from 'react-native';
import { History } from 'lucide-react-native';
import HistoryModal from './HistoryModal';

const buttons = [
  ['H', 'C', '()', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['⌫', '0', '.', '='],
];

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [isNewOperation, setIsNewOperation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [inputOperation, setInputOperation] = useState('');
  

  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  const handlePress = (value: string) => {
    setError(null);

    switch (value) {
      case 'H':
        setIsHistoryModalVisible(true);
        break;
      case 'C':
        clearAll();
        break;
      case '⌫':
        handleBackspace();
        break;
      case '()':
        handleParentheses();
        break;
      case '=':
        calculateResult();
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        handleOperator(value);
        break;
      case '%':
        handlePercent();
        break;
      default:
        handleNumber(value);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setOperation('');
    setLastResult(null);
    setIsNewOperation(false);
    setInputOperation('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setOperation(operation.slice(0, -1));
      setInputOperation(inputOperation.slice(0,-1));
    } else {
      setDisplay('0');
      setOperation('');
      setInputOperation('');
    }
  };

  const handleParentheses = () => {
    const newOperation = operation.includes('(') && !operation.includes(')') 
      ? operation + ')' 
      : operation + '(';
    setOperation(newOperation);
    updateDisplay(newOperation);
  };

  const calculateResult = () => {
    try {
      let result = eval(operation.replace(/÷/g, '/').replace(/×/g, '*'));
  
      // Check for division by zero or other invalid results
      if (!isFinite(result)) {
        throw new Error('Division by zero');
      }
  
      result = parseFloat(result.toFixed(8)); // Optional: Limit decimal precision
  
      // Store result and update state
      setLastResult(result);
      setDisplay(result.toString());
      setIsNewOperation(true); // Indicate that a new operation is starting

      // Save history of this operation
      setHistory([...history, `${operation} = ${result}`]); 
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error');
      setDisplay('Error');
    }
  };
  

  const handleOperator = (value: string) => {
    const operators = ['+', '-', '×', '÷'];

    if (operators.includes(operation.slice(-1))) {
      return; // Block the operation if the last character is already an operator
    }
    if (isNewOperation) {
      // When starting a new operation, use the last result and append the operator
      setOperation(`${lastResult}${value}`);
      setInputOperation(`${lastResult}${value}`);
      setDisplay(lastResult?.toString() || '0');
      setIsNewOperation(false);
    } else {
      
      setOperation(operation + value);
      setInputOperation(operation + value);
      setDisplay(operation + value);
      // Evaluate the current operation before adding a new operator
      try {
        const currentResult = eval(operation.replace(/÷/g, '/').replace(/×/g, '*'));
        setDisplay(currentResult.toString());
        setLastResult(currentResult);
        
      } catch {
        setError('Invalid Operation');
        setDisplay('Error');
      }
    }
  };

  const handlePercent = () => {
    setOperation(operation + '/100');
    setInputOperation(inputOperation + '%');
    setDisplay(display + '%');
  };

  const handleNumber = (value: string) => {
    if (isNewOperation) {
      // If it's a new operation, reset the operation with the new value
      setDisplay(value);
      setOperation(value);
      setInputOperation(value);
      setIsNewOperation(false);
    } else {
      const newOperation = operation + value;
      setOperation(newOperation);
    setInputOperation(newOperation);
    setDisplay(newOperation);
  
      try {
        // Dynamically evaluate the operation
        const currentResult = eval(newOperation.replace(/÷/g, '/').replace(/×/g, '*'));
        setDisplay(currentResult.toString());
        setLastResult(currentResult);
       
      } catch {
        setError('Invalid Input');
        setDisplay('Error');
      }
    }
  };

  const updateDisplay = (value: string) => {
    setDisplay(value);
    setInputOperation(operation);
  };

  const handleHistoryPress = (item: string) => {
    const [, result] = item.split('=');
    if (result) {
      setDisplay(result.trim());
      setOperation(result.trim());
      setLastResult(parseFloat(result));
      setInputOperation(result.trim());
      setIsNewOperation(true);
    }
    setIsHistoryModalVisible(false);
  };
 

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.operationText}>{inputOperation}</Text>
        <Text style={styles.displayText}>{error || display}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => (
              <TouchableOpacity
                key={button}
                style={[
                  styles.button,
                  button === 'H' && styles.historyButton
                ]}
                onPress={() => handlePress(button)}
              >
                {button === 'H' ? (
                  <History style={styles.historyIcon} />
                ) : (
                  <Text style={styles.buttonText}>{button}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <HistoryModal
        isVisible={isHistoryModalVisible}
        onClose={() => setIsHistoryModalVisible(false)}
        history={history}
        onHistoryItemPress={handleHistoryPress}
      />
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-end',
  },
  displayContainer: {
    padding: 20,
    alignItems: 'flex-end',
    
  },
  displayText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    
  },
  operationText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    margin: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 24,
    color: '#333',
  },
  historyButton: {
    backgroundColor: '#e0e0e0',
  },
  historyIcon: {
    width: 24,
    height: 24,
    color: '#333',
  },
});

const darkStyles = StyleSheet.create({
  ...lightStyles,
  container: {
    ...lightStyles.container,
    backgroundColor: '#121212',
  },
  displayText: {
    ...lightStyles.displayText,
    color: '#fff',
  },
  operationText: {
    ...lightStyles.operationText,
    color: '#999',
  },
  button: {
    ...lightStyles.button,
    backgroundColor: '#333',
  },
  buttonText: {
    ...lightStyles.buttonText,
    color: '#fff',
  },
  historyButton: {
    backgroundColor: '#4a4a4a',
  },
  historyIcon: {
    ...lightStyles.historyIcon,
    color: '#fff',
  },
});

