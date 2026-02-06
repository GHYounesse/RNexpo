import { AppText } from '@/src/components/ui/AppText';
import { TextInput,View } from 'react-native';
import { tokens } from '@/src/theme';
type AppInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
};
export function AppInput({ value, onChangeText, placeholder, error }: AppInputProps) {

    return (
        <View style={{ marginVertical: tokens.space.sm ,width:'100%'}}>
            <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} 
            placeholderTextColor={tokens.colors.textSecondary} 
            style={{
                borderWidth: 1,
                borderColor: error ? tokens.colors.error : tokens.colors.border,
                paddingVertical: tokens.space.sm,
                paddingHorizontal: tokens.space.md,
                borderRadius: 8,
                color: tokens.colors.textPrimary,
            }} />
            {error ? <AppText variant="caption" color="error" >{error}</AppText> : null}
        </View>

    );
}