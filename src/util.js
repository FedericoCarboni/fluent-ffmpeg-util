function _escape(c) {
    return '\\' + c;
}

export function escapeTeeComponent(s) {
    return ('' + s).replace(/[\\' |[\]]/g, _escape);
}

export var isWin32 = process.platform === 'win32';
