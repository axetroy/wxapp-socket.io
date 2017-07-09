//index.js

const io = require('../../index');

var app = getApp();
Page({
  data: {
    success: 0,
    fail: 0
  },
  onLoad: function() {
    console.dir(io);

    var socket = io('wss://socket2http.herokuapp.com');
    socket.on('connect', function() {
      console.log('connect');
    });
    socket.on('event', function(data) {});
    socket.on('disconnect', function() {});
    socket.on('error', function(err) {
      console.error(err);
    });
  }
});
