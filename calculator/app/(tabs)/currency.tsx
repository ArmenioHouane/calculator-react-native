import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CurrencyConverter from '@/components/currency-calculator';

export default function CalculatorPage() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <CurrencyConverter />
      </View>
    </SafeAreaProvider>
  );
}

