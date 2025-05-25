import { useState, useEffect } from "react";

/**
 * VoiceInput component - Handles voice input for the chat interface
 * @param {Object} props - Component props
 * @param {Function} props.onTranscript - Callback function for when transcript is ready
 * @param {Function} props.onSubmit - Optional callback to automatically submit after voice input
 * @returns {JSX.Element} Voice input component
 */
const VoiceInput = ({ onTranscript, onSubmit, isMobile }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    // Configure recognition
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    // Set up event handlers
    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    // Clean up
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      if (transcript) {
        onTranscript(transcript);

        // If onSubmit is provided, automatically submit the transcript
        if (onSubmit && transcript.trim()) {
          setTimeout(() => {
            onSubmit();
          }, 500); // Small delay to allow the transcript to be set in the parent component
        }

        setTranscript("");
      }
    } else {
      setTranscript("");
      recognition.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return (
      <div className="tooltip tooltip-left" data-tip="Voice input not supported in this browser">
        <button
          className={`btn btn-circle btn-disabled ${isMobile ? 'btn-xs' : 'btn-sm'}`}
          disabled
        >
          <span className={`material-icons ${isMobile ? 'text-xs' : ''}`}>mic_off</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {isListening && transcript && (
        <div className={`absolute bottom-full mb-2 right-0 bg-base-200 p-2 rounded-lg text-sm ${
          isMobile ? 'max-w-48' : 'max-w-xs'
        }`}>
          {transcript}
        </div>
      )}
      <button
        type="button"
        onClick={toggleListening}
        className={`btn btn-circle ${isMobile ? 'btn-xs' : 'btn-sm'} ${
          isListening ? 'btn-error animate-pulse' : 'btn-outline'
        }`}
        aria-label={isListening ? "Stop listening" : "Start voice input"}
      >
        <span className={`material-icons ${isMobile ? 'text-xs' : ''}`}>
          {isListening ? 'mic' : 'mic_none'}
        </span>
      </button>
    </div>
  );
};

export default VoiceInput;
