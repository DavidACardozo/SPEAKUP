import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';

const SpeechButton = ({ palabraCorrecta }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState(null);

  const numeroAPalabra = {
    "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
    "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten",
    "20": "twenty", "30": "thirty", "40": "forty", "50": "fifty"
  };

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus(null);
    };

    recognition.onresult = (event) => {
      if (event.results && event.results[0]) {
        let transcript = event.results[0][0].transcript.toLowerCase().trim();
        
        if (numeroAPalabra[transcript]) {
          transcript = numeroAPalabra[transcript];
        }

        if (transcript.includes(palabraCorrecta.toLowerCase()) || transcript === palabraCorrecta.toLowerCase()) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      }
    };

    recognition.onerror = () => {
      setStatus('error');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    setTimeout(() => {
      recognition.stop();
    }, 5000);
  };

  return (
    <div className="d-flex align-items-center gap-2 justify-content-center">
      <Button 
        variant={isListening ? "danger" : status === 'error' ? "outline-warning" : "outline-primary"} 
        size="sm" 
        onClick={handleListen}
        disabled={isListening}
        className="rounded-pill"
      >
        {isListening ? "🎙️ Escuchando..." : status === 'error' ? "🔄 Reintentar" : "🎤 Practicar"}
      </Button>
      {status === 'success' && <Badge bg="success">¡Correcto!</Badge>}
      {status === 'error' && <Badge bg="warning" text="dark">Intenta de nuevo</Badge>}
    </div>
  );
};

export default SpeechButton;