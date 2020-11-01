function _escape(c) {
    return '\\' + c;
}

var ESCAPE_REGEX = /[\\' |[\]]/g;

export function escapeTeeComponent(s) {
    return ('' + s).replace(ESCAPE_REGEX, _escape);
}

export var isWin32 = process.platform === 'win32';
