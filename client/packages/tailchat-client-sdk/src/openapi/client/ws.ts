import { TailchatBaseClient } from './base';
import io, { Socket } from 'socket.io-client';
import * as msgpackParser from 'socket.io-msgpack-parser';
import type { ChatMessage } from 'tailchat-types';

export class TailchatWsClient extends TailchatBaseClient {
  public socket: Socket | null = null;

  constructor(
    public url: string,
    public appId: string,
    public appSecret: string,
    public useMsgpack: boolean = true
  ) {
    super(url, appId, appSecret);
  }

  connect(): Promise<Socket> {
    return new Promise<Socket>(async (resolve, reject) => {
      await this.waitingForLogin();

      const token = this.jwt;
      let socket: Socket;
      if (this.useMsgpack) {
        socket = this.socket = io(this.url, {
          transports: ['websocket'],
          auth: {
            token,
          },
          forceNew: true,
          parser: msgpackParser,
        });
      } else {
        socket = this.socket = io(this.url, {
          transports: ['websocket'],
          auth: {
            token,
          },
          forceNew: true,
        });
      }

      socket.once('connect', () => {
        // 连接成功
        this.emit('chat.converse.findAndJoinRoom')
          .then((res) => {
            console.log('Joined rooms', res.data);
            resolve(socket);
          })
          .catch((err) => {
            reject(err);
          });
      });
      socket.once('error', () => {
        reject();
      });

      socket.on('disconnect', (reason) => {
        console.log(`disconnect due to ${reason}`);
        this.socket = null;
      });

      socket.onAny((ev) => {
        console.log('onAny', ev);
      });
    });
  }

  disconnect() {
    if (!this.socket) {
      console.warn('You should call it after connect');
      return;
    }

    this.socket.disconnect();
    this.socket = null;
  }

  emit(eventName: string, eventData: any = {}) {
    if (!this.socket) {
      console.warn('You should call it after connect');
      throw new Error('You should call it after connect');
    }

    return this.socket.emitWithAck(eventName, eventData);
  }

  on(eventName: string, callback: (payload: any) => void) {
    if (!this.socket) {
      console.warn('You should call it after connect');
      return;
    }

    this.socket.on(eventName, callback);
  }

  once(eventName: string, callback: (payload: any) => void) {
    if (!this.socket) {
      console.warn('You should call it after connect');
      return;
    }

    this.socket.once(eventName, callback);
  }

  off(eventName: string, callback: (payload: any) => void) {
    if (!this.socket) {
      console.warn('You should call it after connect');
      return;
    }

    this.socket.off(eventName, callback);
  }

  onMessage(callback: (messagePayload: ChatMessage) => void) {
    this.on('notify:chat.message.add', callback);
  }

  onMessageUpdate(callback: (messagePayload: ChatMessage) => void) {
    this.on('notify:chat.message.update', callback);
  }
}
