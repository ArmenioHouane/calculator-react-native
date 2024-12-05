import React, { useState, useEffect, useCallback } from 'react';
import { Text, TextInput, View, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = 'aa900429d11afce8127de625';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('MZN');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  const fetchExchangeRate = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${fromCurrency}`);
      const data = await response.json();
      const rate = data.conversion_rates[toCurrency];
      setExchangeRate(rate);
      setAvailableCurrencies(Object.keys(data.conversion_rates));
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  useEffect(() => {
    if (exchangeRate && amount) {
      const converted = (Number(amount) * exchangeRate).toFixed(2);
      setConvertedAmount(converted);
    }
  }, [amount, exchangeRate]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const buttons = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', 'C'],
  ];

  const handleButtonPress = (value: string) => {
    if (value === 'C') {
      setAmount('0');
    } else if (value === 'DEL') {
      setAmount(prev => prev.slice(0, -1) || '0');
    } else if (amount === '0' && value !== '.') {
      setAmount(value);
    } else {
      setAmount(prev => prev + value);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conversionContainer}>
        <View style={styles.currencyContainer}>
          <Picker
            selectedValue={fromCurrency}
            style={styles.picker}
            onValueChange={(itemValue) => setFromCurrency(itemValue)}
          >
            {availableCurrencies.map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.currencyContainer}>
          <Picker
            selectedValue={toCurrency}
            style={styles.picker}
            onValueChange={(itemValue) => setToCurrency(itemValue)}
          >
            {availableCurrencies.map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
          <Text style={styles.convertedText}>{convertedAmount}</Text>
        </View>
      </View>
      <View style={styles.keypad}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => (
              <Pressable
                key={button}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed
                ]}
                onPress={() => handleButtonPress(button)}
              >
                <Text style={styles.buttonText}>{button}</Text>
              </Pressable>
            ))}
          </View>
        ))}
        <View style={styles.row}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            onPress={() => handleButtonPress('DEL')}
          >
            <Ionicons name="backspace-outline" size={24} color="white" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  conversionContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    fontSize: 48,
    color: '#fff',
    textAlign: 'right',
    minWidth: 200,
  },
  convertedText: {
    fontSize: 48,
    color: '#fff',
    textAlign: 'right',
    minWidth: 200,
  },
  keypad: {
    flex: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#666',
  },
  buttonText: {
    fontSize: 36,
    color: '#fff',
  },
  picker: {
    width: 120,
    color: '#fff',
    backgroundColor: '#000',
  },
});

export default CurrencyConverter;

