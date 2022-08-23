import { useLayoutEffect, useMemo, useState } from 'react';
import type { Peer, TailchatMeetingClient } from 'tailchat-meeting-sdk';

export function useClientState(client: TailchatMeetingClient) {
  const [volume, setVolume] = useState<{
    volume: number;
    scaledVolume: number;
  }>({ volume: 0, scaledVolume: 0 });
  const [peers, setPeers] = useState<Peer[]>([]);
  const [webcamSrcObject, setWebcamSrcObject] = useState<
    MediaStream | undefined
  >();
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);

  useLayoutEffect(() => {
    const webcamProduceHandler = (webcamProducer) => {
      if (webcamProducer.track) {
        setWebcamEnabled(true);
        setWebcamSrcObject(new MediaStream([webcamProducer.track]));
      }
    };
    const webcamCloseHandler = () => {
      setWebcamSrcObject(null);
      setWebcamEnabled(false);
    };
    const micProduceHandler = (micProducer) => {
      (micProducer.appData as any).volumeWatcher.on('volumeChange', (data) => {
        setVolume(data);
      });
      setMicEnabled(true);
    };
    const micCloseHandler = () => {
      setMicEnabled(false);
    };
    const peersUpdatedHandler = (peers) => {
      setPeers([...peers]);
    };

    client.on('webcamProduce', webcamProduceHandler);
    client.on('webcamClose', webcamCloseHandler);
    client.on('micProduce', micProduceHandler);
    client.on('micClose', micCloseHandler);
    client.room.on('peersUpdated', peersUpdatedHandler);

    setPeers(client.room.peers);

    return () => {
      client.off('webcamProduce', webcamProduceHandler);
      client.off('webcamClose', webcamCloseHandler);
      client.off('micProduce', micProduceHandler);
      client.off('micClose', micCloseHandler);
      client.room.off('peersUpdated', peersUpdatedHandler);
    };
  }, [client]);

  function switchWebcam() {
    if (!client) {
      return;
    }

    if (client.webcamEnabled) {
      client.disableWebcam();
    } else {
      client.enableWebcam();
    }
  }

  function switchMic() {
    if (!client) {
      return;
    }

    if (client.micEnabled) {
      client.disableMic();
    } else {
      client.enableMic();
    }
  }

  return {
    volume,
    peers,
    webcamSrcObject,
    webcamEnabled,
    micEnabled,
    switchWebcam,
    switchMic,
  };
}
