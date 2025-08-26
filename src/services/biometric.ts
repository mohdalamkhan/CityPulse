import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: string;
}

export interface BiometricAvailability {
  available: boolean;
  biometryType: string | null;
  error?: string;
}

class BiometricAuthService {
  private rnBiometrics: ReactNativeBiometrics;

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: false, // Only use biometrics, not device PIN/password
    });
  }

  async isBiometricAvailable(): Promise<BiometricAvailability> {
    try {
      const { available, biometryType } =
        await this.rnBiometrics.isSensorAvailable();

      if (available) {
        let biometryTypeString = 'Unknown';
        switch (biometryType) {
          case BiometryTypes.TouchID:
            biometryTypeString = 'Touch ID';
            break;
          case BiometryTypes.FaceID:
            biometryTypeString = 'Face ID';
            break;
          case BiometryTypes.Biometrics:
            biometryTypeString = 'Biometrics';
            break;
          default:
            biometryTypeString = 'Biometrics';
        }

        return {
          available: true,
          biometryType: biometryTypeString,
        };
      }

      return {
        available: false,
        biometryType: null,
        error: 'Biometric authentication not available',
      };
    } catch (error: any) {
      return {
        available: false,
        biometryType: null,
        error: error.message || 'Failed to check biometric availability',
      };
    }
  }

  async authenticateWithBiometrics(
    promptMessage: string = 'Authenticate with biometrics',
  ): Promise<BiometricResult> {
    try {
      const availabilityResult = await this.isBiometricAvailable();

      if (!availabilityResult.available) {
        return {
          success: false,
          error:
            availabilityResult.error ||
            'Biometric authentication not available',
        };
      }

      const { success } = await this.rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });

      if (success) {
        return {
          success: true,
          biometryType: availabilityResult.biometryType || 'Biometrics',
        };
      } else {
        return {
          success: false,
          error: 'Biometric authentication failed or was cancelled',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Biometric authentication error',
      };
    }
  }


}

export const biometricAuthService = new BiometricAuthService();
export default biometricAuthService;
