import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'skyway-js';
import './App.css';

function App() {
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const theirVideoElement = useRef<HTMLVideoElement | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const [theirId, setTheirId] = useState('');
  const [peer, setPeer] = useState<Peer | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoElement.current) {
          videoElement.current.srcObject = stream;
          videoElement.current.play();
          localStream.current = stream;
        }
      })
      .catch((error) => {
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
      });

    const peer = new Peer({
      key: import.meta.env.VITE_SKYWAY_API_KEY,
      debug: 3,
    });
    peer.on('open', () => {
      setPeer(peer);
    });
    peer.on('call', (mediaConnection) => {
      if (localStream.current) {
        mediaConnection.answer(localStream.current);
        setEventListener(mediaConnection);
      }
    });
  }, []);

  const setEventListener = (mediaConnection: MediaConnection) => {
    mediaConnection.on('stream', (stream) => {
      if (theirVideoElement.current) {
        theirVideoElement.current.srcObject = stream;
        theirVideoElement.current.play();
      }
    });
  };

  return (
    <div>
      <video width="400px" autoPlay muted playsInline ref={videoElement} />
      <p>{peer?.id}</p>
      {}
      <input
        type="text"
        onChange={(e) => {
          setTheirId(e.target.value);
        }}
      />
      <button
        onClick={() => {
          if (peer && localStream.current) {
            console.log('hoge');
            const mediaConnection = peer.call(theirId, localStream.current);
            setEventListener(mediaConnection);
          }
        }}
      >
        発信
      </button>
      <video width="400px" autoPlay muted playsInline ref={theirVideoElement} />
    </div>
  );
}

export default App;
