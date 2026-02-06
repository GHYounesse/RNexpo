import { tokens } from "@/src/theme";
import { Button, ButtonText } from "@/components/ui/button";

type AppButtonProps = {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';    
    onPress?: () => void;
};
export function AppButton({ children, variant = 'primary', onPress }: AppButtonProps) {
    const bgColor =variant === 'secondary'? tokens.colors.surface : variant === 'danger' ? tokens.colors.error : tokens.colors.primary;
    const textColor = variant === 'secondary' ? tokens.colors.textPrimary : tokens.colors.primaryText;
    return (
        <Button style={{ backgroundColor: bgColor,paddingVertical:tokens.space.sm,paddingHorizontal:tokens.space.md,borderRadius:8 }} onPress={onPress}>
            <ButtonText style={{ color: textColor }}>{children}</ButtonText>
        </Button>
    );
}