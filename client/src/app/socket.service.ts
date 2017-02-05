import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import * as io from 'socket.io-client';

import ModelEvent from '../models/model-event.model';

declare var window: any;

@Injectable()
export class SocketService {
  // TODO: when introducing namespaces
  // private name: string;
  public static SOCKET_CONNECTED = 'connected';
  public static SOCKET_DISCONNECTED = 'disconnected';
  public static SOCKET_ERROR = 'error';

  public static SOCKET_EVENTS: Array<string> = [
    SocketService.SOCKET_CONNECTED,
    SocketService.SOCKET_DISCONNECTED,
    SocketService.SOCKET_ERROR,
  ];

  public static MODEL_CREATE = 'create';
  public static MODEL_DELETE = 'delete';
  public static MODEL_EVENTS = [
    SocketService.MODEL_CREATE,
    SocketService.MODEL_DELETE
  ];

  private static HOST: string = SocketService._computeHost();
  // private static NAMESPACE = 'generic';

  // socket: SocketIOClient.Service;

  private static _computeHost(): string {
    const { protocol, host} = window.location;
    return `${protocol}//${host}`;
  }

  private static _computeSocketUrl(): string {
    return `${this.HOST}`;
  }

  private static _createSocket(socketUrl): SocketIOClient.Socket {
    const socket = io.connect(socketUrl);

    SocketService.SOCKET_EVENTS.forEach((event) => {
      socket.on(event, (data = '') => {
        console.log('socket /', event, data);
      });
    });

    return socket;
  }

  get(): Observable<ModelEvent> {
    const socketUrl = SocketService._computeSocketUrl();
    const socket = SocketService._createSocket(socketUrl);

    return Observable.create((observer) => {
      SocketService.MODEL_EVENTS.forEach((event) => {
        socket.on(event, (data) => (observer.next(new ModelEvent(event, data))));
      });

      return () => { socket.close(); };
    });
  }
}
