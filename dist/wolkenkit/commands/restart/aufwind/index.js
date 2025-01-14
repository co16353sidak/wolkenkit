'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var shared = require('../../shared');

var aufwind =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(_ref, progress) {
    var configuration, directory, env, _ref$privateKey, privateKey, tunnel, applicationName, endpoint;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            configuration = _ref.configuration, directory = _ref.directory, env = _ref.env, _ref$privateKey = _ref.privateKey, privateKey = _ref$privateKey === void 0 ? undefined : _ref$privateKey;

            if (directory) {
              _context.next = 3;
              break;
            }

            throw new Error('Directory is missing.');

          case 3:
            if (env) {
              _context.next = 5;
              break;
            }

            throw new Error('Environment is missing.');

          case 5:
            if (configuration) {
              _context.next = 7;
              break;
            }

            throw new Error('Configuration is missing.');

          case 7:
            if (progress) {
              _context.next = 9;
              break;
            }

            throw new Error('Progress is missing.');

          case 9:
            progress({
              message: "Deploying application to aufwind...",
              type: 'info'
            });
            _context.next = 12;
            return shared.startTunnel({
              configuration: configuration,
              privateKey: privateKey
            }, progress);

          case 12:
            tunnel = _context.sent;
            applicationName = configuration.application.name;
            endpoint = {
              protocol: 'http:',
              method: 'POST',
              hostname: tunnel.host,
              port: tunnel.port,
              pathname: "/v1/applications/".concat(applicationName, "/restart/").concat(env)
            };
            _context.next = 17;
            return shared.streamApplication({
              directory: directory,
              endpoint: endpoint,
              tunnel: tunnel
            }, progress);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function aufwind(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = aufwind;