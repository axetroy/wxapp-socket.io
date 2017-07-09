/**
 * Created by axetroy on 2017/7/8.
 */
const EventTarget = require('event-target-shim');

const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

class WebSocket extends EventTarget {
  constructor(url, protocol) {
    super(...arguments);
    this.CLOSED = 0;
    this.CLOSING = 0;
    this.CONNECTING = 0;
    this.OPEN = 0;
    this._url = url;
    this._protocal = protocol;
    this._readyState = CONNECTING;

    if (!url) {
      throw new TypeError("Failed to construct 'WebSocket': url required");
    }
    if (protocol) {
      throw new Error('subprotocal not supported in weapp');
    }

    wx.onSocketOpen(event => {
      console.info(event);
      this._readyState = OPEN;
      this.dispatchEvent({
        type: 'open'
      });
    });

    wx.onSocketError(event => {
      console.error(event);
      this._readyState = CLOSED;
      console.dir(this);
      this.dispatchEvent({
        type: 'error',
        message: event.errMsg
      });
    });
    wx.onSocketMessage(event => {
      console.info(event);
      let { data, origin, ports, source } = event;
      this.dispatchEvent({
        data,
        origin,
        ports,
        source,
        type: 'message'
      });
    });
    wx.onSocketClose(event => {
      this._readyState = CLOSED;
      const { code, reason, wasClean } = event;
      this.dispatchEvent({
        code,
        reason,
        wasClean,
        type: 'close'
      });
    });
    wx.connectSocket({
      url,
      fail: event =>
        setTimeout(() => {
          this._readyState = CLOSED;
          this.dispatchEvent({
            type: 'error',
            message: event.errMsg
          });
        }, 0)
    });
  }

  get url() {
    return this._url;
  }

  get protocol() {
    return this._protocol;
  }

  get readyState() {
    return this._readyState;
  }

  close() {
    if (this.readyState === CONNECTING) {
      console.warn('close WebSocket which is connecting might not work');
    }
    wx.closeSocket();
  }

  send(data) {
    if (this.readyState !== OPEN) {
      throw new Error('INVALID_STATE_ERR');
    }

    if (typeof data !== 'string') {
      throw new TypeError('only string typed data are supported');
    }

    wx.sendSocketMessage({ data });
  }
}

module.exports = WebSocket;
