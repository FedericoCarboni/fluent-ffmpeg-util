import { v4 } from 'uuid';
import { createServer } from 'net';

import { isWin32 } from './util';

var unixsock = isWin32 ? function () {
    return '//./pipe/fluent-ffmpeg-' + v4() + '.sock';
} : function () {
    return '/tmp/fluent-ffmpeg-' + v4() + '.sock';
};

var sockpath = isWin32 ? function (sock) {
    return 'file:' + sock;
} : function (sock) {
    return 'unix:' + sock;
};

function handleStream(stream, writable) {
    var sock = unixsock();
    var path = sockpath(sock);
    var server = createServer(function (socket) {
        var onError = function () {
            if (socket.writable)
                socket.end();
            stream.off('end', onEnd);
            stream.off('error', onError);
            socket.off('error', onError);
        };
        var onEnd = function () {
            stream.off('end', onEnd);
            stream.off('error', onError);
            socket.off('error', onError);
        };
        stream.on('end', onEnd);
        stream.on('error', onError);
        socket.on('error', onError);
        if (writable)
            socket.pipe(stream);
        else
            stream.pipe(socket);
        server.close();
    });
    server.listen(sock);
    return {
        path: path,
        close: function () {
            if (server.listening)
                server.close();
        }
    };
}

export function handleOutputStream(stream) {
    return handleStream(stream, true);
}

export function handleInputStream(stream) {
    return handleStream(stream, false);
}
