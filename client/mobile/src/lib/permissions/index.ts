import { request, check, PERMISSIONS } from 'react-native-permissions';
import { Platform } from 'react-native';

export async function ensureWebRTCPermission() {
  const cameraPermission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  const microphonePermission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;

  const [cameraPermissionStatus, microphonePermissionStatus] =
    await Promise.all([check(cameraPermission), check(microphonePermission)]);

  if (microphonePermissionStatus !== 'granted') {
    await request(microphonePermission);
  }

  if (cameraPermissionStatus !== 'granted') {
    await request(cameraPermission);
  }
}
