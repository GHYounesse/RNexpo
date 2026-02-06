import { tokens } from '@/src/theme';
import { Text } from '@/components/ui/text';
import React from 'react';


type AppTextProps = {
    children: React.ReactNode;
    variant?: 'body' | 'heading' | 'caption';
    color?:'primary' | 'secondary' | 'error' ;
};

export function AppText({ children, variant = 'body', color = 'primary' }: AppTextProps) {
    const fontSize = variant === 'heading' ? tokens.fontSizes.lg : variant === 'caption' ? tokens.fontSizes.sm : tokens.fontSizes.md;
    const textColor =
        color === 'secondary'
            ? tokens.colors.textSecondary
            : color === 'error'
            ? tokens.colors.error
            : tokens.colors.textPrimary;
    return (
        <Text style={{ fontSize, color: textColor }}>
            {children}
        </Text>
    );
}