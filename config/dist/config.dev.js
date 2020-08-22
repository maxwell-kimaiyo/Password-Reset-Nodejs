"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var _default = {
  PORT: process.env.PORT || 9000,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/User'
};
exports["default"] = _default;