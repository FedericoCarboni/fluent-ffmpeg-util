'use strict';
/* global it */

var lib = require('../lib/lib');

var stream = require('stream');
var net = require('net');
var chai = require('chai');

it('handleOutputStream()', function (done) {
    var stream_1 = new stream.PassThrough();
    var handle = lib.handleOutputStream(stream_1);
    var connection = net.connect(handle.path.slice(5));
    connection.write('ping', 'utf8');
    stream_1.on('data', function (chunk) {
        chai.expect(chunk.toString()).to.equal('ping');
        connection.end();
        done();
    });
});
it('handleInputStream()', function (done) {
    var stream_1 = new stream.PassThrough();
    var handle = lib.handleInputStream(stream_1);
    var connection = net.connect(handle.path.slice(5));
    stream_1.write('ping', 'utf8');
    connection.on('data', function (chunk) {
        chai.expect(chunk.toString()).to.equal('ping');
        stream_1.end();
        done();
    });
});
it('tee()', function () {
    chai.expect(lib.tee('[strange] output.mkv ', 'output1.mkv'))
        .matches(/tee:\\\[strange\\]\\ output\.mkv\\ \|output1\.mkv/);
});
