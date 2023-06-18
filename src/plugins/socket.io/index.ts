import { SocketEvent } from '@/common/constants';
import io, { Socket } from 'socket.io-client';

const SOCKET_BASE_URL = process.env.VUE_APP_SOCKET_URL as string;

export const initSocket = (): Socket => {
    const socket = io(SOCKET_BASE_URL, {
        autoConnect: false,
        reconnection: true,
        transports: ['websocket'],
    });

    return socket;
};

export class SocketProvider {
    static socket: Socket;

    static init() {
        this.socket = io(SOCKET_BASE_URL, {
            autoConnect: true,
            reconnection: true,
            transports: ['websocket'],
        });
        return this.socket;
    }

    static connect(userId: string) {
        this.socket.emit(SocketEvent.USER_LOGIN, {
            userId,
        });
    }

    static disconnect() {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }
}
