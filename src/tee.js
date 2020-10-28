import { handleOutputStream } from './streams';
import { escapeTeeComponent } from './util';

export function tee() {
    for (var s = arguments.length, i = 0, destinations = Array(s); i < s; i++) {
        var dest = arguments[i];
        destinations[i] = typeof dest === 'string' ?
            escapeTeeComponent(dest) :
            handleOutputStream(dest).path;
    }
    return 'tee:' + destinations.join('|');
}
