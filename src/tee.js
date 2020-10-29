import { handleOutputStream } from './streams';
import { escapeTeeComponent, isWin32 } from './util';

export var NULL = isWin32 ? 'NUL' : '/dev/null';

export function tee() {
    var n = arguments.length, dest;
    if (n === 0)
        return NULL;
    if (n === 1)
        return typeof (dest = arguments[0]) === 'string' ? dest : handleOutputStream(dest).path;
    for (var i = 0, destinations = Array(n); i < n; i++)
        destinations[i] = typeof (dest = arguments[i]) === 'string' ?
            escapeTeeComponent(dest) :
            handleOutputStream(dest).path;
    return 'tee:' + destinations.join('|');
}
