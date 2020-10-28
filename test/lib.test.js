'use strict';
/* global describe, it */

var lib = require('../lib/lib.cjs');
var ffmpeg = require('fluent-ffmpeg');

var stream = require('stream');
var net = require('net');
var fs = require('fs');
var chai = require('chai');

describe('pause() & resume()', function () {
    it('should return true on a running ffmpeg command', function (done) {
        var command = ffmpeg()
            .addOption('-y')
            .input('test/samples/video.mkv')
            .output('pipe:1')
            .outputFormat('null')
            .on('error', function (err) {
                done(err);
            })
            .on('end', function() {
                done();
            })
            .on('start', function () {
                chai.expect(lib.pause(command)).to.equal(true);
                chai.expect(lib.resume(command)).to.equal(true);
            });
            command.run();
    });
    it('should return false on an idle ffmpeg command', function () {
        var command = ffmpeg()
            .addOption('-y')
            .input('test/samples/video.mkv')
            .output('pipe:1')
            .outputFormat('null');
        chai.expect(lib.pause(command)).to.equal(false);
        chai.expect(lib.resume(command)).to.equal(false);
    });
})
describe('handleOutputStream()', function () {
    it('should create a socket server', function (done) {
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
    it('should work through fluent-ffmpeg', function (done) {
        var output = lib.handleOutputStream(fs.createWriteStream('test/samples/output.mkv'));
        ffmpeg()
            .addOption('-y')
            .input('test/samples/video.mkv')
            .output(output.path)
            .videoCodec('copy')
            .outputFormat('matroska')
            .on('error', function (err) {
                output.close();
                fs.unlinkSync('test/samples/output.mkv');
                done(err);
            })
            .on('end', function() {
                output.close();
                fs.unlinkSync('test/samples/output.mkv');
                done();
            })
            .run();
    });
});
describe('handleInputStream()', function () {
    it('should create a socket server', function (done) {
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
    it('should work through fluent-ffmpeg', function (done) {
        var input = lib.handleInputStream(fs.createReadStream('test/samples/video.mkv'));
        var output = lib.handleOutputStream(new stream.PassThrough());
        ffmpeg()
            .input(input.path)
            .addInputOption('-y')
            .output('pipe:1')
            .videoCodec('copy')
            .outputFormat('matroska')
            .on('error', function (err) {
                input.close();
                output.close();
                done(err);
            })
            .on('end', function() {
                input.close();
                output.close();
                done();
            })
            .run();
    });
});
describe('tee()', function () {
    it('should return a correct ffmpeg uri', function () {
        chai.expect(lib.tee('[strange] output.mkv ', 'output1.mkv'))
            .matches(/tee:\\\[strange\\]\\ output\.mkv\\ \|output1\.mkv/);
    });
});
