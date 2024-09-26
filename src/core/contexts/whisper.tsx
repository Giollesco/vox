import { Audio } from 'expo-av';
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
} from 'expo-av/build/Audio';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { initWhisper, WhisperContext as WhisperLibContext } from 'whisper.rn';

export const WhisperProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Refs
  const whisperRef = useRef<WhisperLibContext>();

  // State for managing recording and transcription
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const loadModel = async () => {
    try {
      setIsLoading(true);
      const whisperContext = await initWhisper({
        filePath: require('../../../assets/whisper/ggml-tiny.en.bin'),
        coreMLModelAsset:
          Platform.OS === 'ios'
            ? {
                filename: 'ggml-tiny.en-encoder.mlmodelc',
                assets: [
                  require('../../../assets/whisper/ggml-tiny.en-encoder.mlmodelc/weights/weight.bin'),
                  require('../../../assets/whisper/ggml-tiny.en-encoder.mlmodelc/model.mil'),
                  require('../../../assets/whisper/ggml-tiny.en-encoder.mlmodelc/coremldata.bin'),
                ],
              }
            : undefined,
      });
      whisperRef.current = whisperContext;
      setIsModelLoaded(true);
      setError(undefined);
    } catch (error) {
      console.error('[WHISPER]: Failed to initialize Whisper', error);
      setError(
        'Došlo je do greške prilikom učitavanja modela. Pokušajte ponovno.'
      );
      setIsModelLoaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadModelWithRetry = async (retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        await loadModel();
        return; // Exit if successful
      } catch (error) {
        if (i === retries - 1) {
          console.error('[WHISPER]: Final attempt to load model failed', error);
        }
        await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
      }
    }
  };

  useEffect(() => {
    loadModelWithRetry(); // Call the retry function when the provider mounts
  }, []);

  // Function to handle transcription process
  const transcribe = async (
    uri: string,
    onSuccess?: (transcribedText: string) => void,
    onError?: () => void
  ): Promise<string | undefined> => {
    if (!isModelLoaded) {
      setError('Model nije učitan. Pokušajte ponovno.');
      onError?.();
      return;
    }

    try {
      if (Platform.OS === 'android') {
        // Convert audio file to WAV format with specific requirements for Android
        const sourceUri = uri;
        const targetFile = `${RNFS.DocumentDirectoryPath}/newFile.wav`; // Example target directory
        await FFmpegKit.execute(
          `-y -i ${sourceUri} -ar 16000 -ac 1 -c:a pcm_s16le ${targetFile}`
        );
        uri = targetFile;
      }

      // Transcribe the audio file using Whisper
      const transcription = whisperRef.current?.transcribe(uri, {
        language: 'en',
        maxLen: 1,
        translate: true,
        onProgress: (progress) => setIsTranscribing(progress < 100),
      });

      const result = await transcription?.promise;
      console.log('[WHISPER]: Transcription result', result);

      if (result?.result) {
        console.log('[WHISPER]: Transcription successful');
        const content = result.result.trim().replaceAll('[BLANK_AUDIO]', '');
        setRecognizedText(content);
        onSuccess?.(slug(content));
        return content;
      } else {
        console.log('[WHISPER]: Transcription failed - no result');
        onError?.();
      }
    } catch (error) {
      console.error('[WHISPER]: Transcription failed', error);
      onError?.();
      throw error;
    }
  };

  // Function to start recording audio
  const startRecording = async (
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    if (isRecording) return;
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('[WHISPER]: Requesting permission..');
        await requestPermission();
      }

      setIsLoading(true);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const AUDIO_WAV = {
        isMeteringEnabled: true,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: '.wav',
          outputFormat: AndroidOutputFormat.DEFAULT,
          audioEncoder: AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000, // Set sample rate to 16kHz
          numberOfChannels: 1, // Set number of channels to mono
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: '.wav',
          outputFormat: IOSOutputFormat.LINEARPCM,
          audioQuality: IOSAudioQuality.MAX,
          sampleRate: 16000, // Set sample rate to 16kHz
          numberOfChannels: 1, // Set number of channels to mono
        },
        web: {
          mimeType: 'audio/wav',
          bitsPerSecond: 128000,
        },
      };

      console.log('[WHISPER]: Starting recording..');
      onSuccess?.();
      const { recording } = await Audio.Recording.createAsync(AUDIO_WAV);
      setRecording(recording);
      setIsRecording(true);
      setIsLoading(false);
      console.log('[WHISPER]: Recording started');
    } catch (err) {
      console.error('[WHISPER]: Failed to start recording', err);
      stopRecording(
        () => {},
        () => {},
        true
      );
      onError?.();
      setIsRecording(false);
      setIsLoading(false);
      setRecording(undefined);
      setRecognizedText('');
    }
  };

  // Function to stop recording audio
  const stopRecording = async (
    onSuccess?: (transcribedText: string) => void,
    onError?: () => void,
    skipTranscription = false
  ) => {
    try {
      console.log('[WHISPER]: Stopping recording..');
      setIsRecording(false);
      await recording?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording?.getURI();
      console.log('[WHISPER]: Recording stopped and stored at', uri);
      if (uri && !skipTranscription) {
        console.log('[WHISPER]: Transcribing audio..');
        await transcribe(uri, onSuccess, onError);
      }
    } catch (err) {
      console.error('[WHISPER]: Failed to stop recording', err);
      onError?.();
    } finally {
      setRecording(undefined);
    }
  };

  function slug(text: string): string {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric characters except spaces and hyphens
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
  }

  return (
    <WhisperContext.Provider
      value={{
        startRecording,
        stopRecording,
        isRecording,
        isLoading,
        recognizedText,
        slugText: slug(recognizedText),
        isTranscribing,
        error,
        isModelLoaded,
        loadModel,
      }}
    >
      {children}
    </WhisperContext.Provider>
  );
};

interface WhisperContextType {
  startRecording: (
    onSuccess?: () => void,
    onError?: () => void
  ) => Promise<void>;
  stopRecording: (
    onSuccess?: (transcribedText: string) => void,
    onError?: () => void,
    skipTranscription?: boolean
  ) => Promise<void>;
  isRecording: boolean;
  isLoading: boolean;
  recognizedText: string;
  slugText: string;
  isTranscribing: boolean;
  error: string | undefined;
  isModelLoaded: boolean;
  loadModel: () => Promise<void>;
}

// Create Whisper context
const WhisperContext = createContext<WhisperContextType | null>(null);

// Custom hook to use the Whisper context
export const useWhisperContext = (): WhisperContextType => {
  const context = useContext(WhisperContext);

  if (!context) {
    throw new Error('useWhisperContext must be used within a WhisperProvider');
  }

  return context;
};
