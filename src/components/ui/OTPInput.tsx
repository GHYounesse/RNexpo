import { useEffect, useRef } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

type OTPInputProps = {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  disabled?: boolean;
};

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
}: OTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);
    
  
  const handleChange = (text: string, index: number) => {
    const newOtp = [...value];
    newOtp[index] = text;
    onChange(newOtp);

    if (text && index < length - 1) {
      setTimeout(() => {
        inputs.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          style={styles.input}
          value={value[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(nativeEvent.key, index)
          }
          keyboardType="number-pad"
          maxLength={1}
          editable={!disabled}
          autoFocus={index === 0}
          returnKeyType="next"
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
  },
});
