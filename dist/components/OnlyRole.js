"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("react");

class OnlyRole extends _react.Component {
  render() {
    const user = this.props.user;
    const role = this.props.role;

    if (user.roles.some(r => r.value === role)) {
      return this.props.children;
    } else {
      return null;
    }
  }

}

var _default = OnlyRole;
exports.default = _default;