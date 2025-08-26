import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY } from '../../constants';

interface SimpleToastProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onHide: () => void;
}

const SimpleToast: React.FC<SimpleToastProps> = ({ message, type, visible, onHide }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.toast,
          { backgroundColor: type === 'success' ? COLORS.success : COLORS.error }
        ]}
      >
        <Icon 
          name={type === 'success' ? 'checkmark-circle' : 'close-circle'} 
          size={20} 
          color={COLORS.white} 
        />
        <Text style={styles.toastText}>
          {String(message)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
});

export default SimpleToast; 