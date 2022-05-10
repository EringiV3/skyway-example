import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'skyway-js';
import './App.css';

function App() {
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const theirVideoElement = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [theirId, setTheirId] = useState('');
  const [peer, setPeer] = useState<Peer | null>(null);

  useEffect(() => {
    // カメラ映像取得
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // 成功時にvideo要素にカメラ映像をセットし、再生
        if (videoElement.current) {
          videoElement.current.srcObject = stream;
          videoElement.current.play();
          // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
          setLocalStream(stream);
        }
      })
      .catch((error) => {
        // 失敗時にはエラーログを出力
        console.error('mediaDevice.getUserMedia() error:', error);
        return;
      });

    const peer = new Peer({
      key: '7e3423a7-1da9-43cd-aadc-baaa69a0e9e9',
      debug: 3,
    });
    peer.on('open', () => {
      setPeer(peer);
    });
    peer.on('call', (mediaConnection) => {
      if (localStream) {
        mediaConnection.answer(localStream);
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
          if (peer && localStream) {
            const mediaConnection = peer.call(theirId, localStream);
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
