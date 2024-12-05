import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Calculator from '../../components/calculator';

export default function CalculatorPage() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Calculator />
      </View>
    </SafeAreaProvider>
  );
}

