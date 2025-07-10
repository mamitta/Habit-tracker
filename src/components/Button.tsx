import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type ButtonVariant = 'primary' | 'muted' | 'icon';

type ButtonProps = {
  title?: string;
  variant?: ButtonVariant;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ 
    title, 
    variant = 'primary', 
    iconName,
    iconSize = 24,
    iconColor,
    ...touchableProps 
  }, ref) => {
    const buttonClass = `${styles.base} ${styles.variants[variant]} ${touchableProps.className || ''}`;
    
    const getIconColor = () => {
      if (iconColor) return iconColor;
      switch (variant) {
        case 'primary': return '#ffffff';
        case 'muted': return '#6b7280';
        case 'icon': return '#374151';
        default: return '#374151';
      }
    };

    return (
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={buttonClass}>
        {variant === 'icon' && iconName ? (
          <MaterialCommunityIcons 
            name={iconName} 
            size={iconSize} 
            color={getIconColor()} 
          />
        ) : (
          <Text className={styles.textVariants[variant]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = {
  base: 'items-center justify-center rounded-[28px] shadow-md p-4',
  
  variants: {
    primary: 'bg-gray-500 active:bg-gray-600',
    muted: 'bg-transparent shadow-none active:bg-gray-100',
    icon: 'bg-transparent shadow-none p-2',
  },

  textVariants: {
    primary: 'text-white text-lg font-semibold text-center',
    muted: 'text-gray-500 text-sm font-medium text-center',
    icon: '',
  },
};