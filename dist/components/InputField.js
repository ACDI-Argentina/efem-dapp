"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _styles = require("@material-ui/core/styles");

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const InputField = (0, _styles.withStyles)(theme => {
  return {
    root: {
      '& .MuiInput-root:before': {
        borderBottomWidth: '2px',
        borderBottomColor: theme.palette.primary.dark
      },
      '& .MuiInput-root:hover': {
        borderBottomColor: 'red'
      }
    }
  };
})(_TextField.default);
var _default = InputField;
exports.default = _default;