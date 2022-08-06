"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Container = _interopRequireDefault(require("@material-ui/core/Container"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Warning = _interopRequireDefault(require("@material-ui/icons/Warning"));

var _Card = _interopRequireDefault(require("@material-ui/core/Card"));

var _CardHeader = _interopRequireDefault(require("@material-ui/core/CardHeader"));

var _CardContent = _interopRequireDefault(require("@material-ui/core/CardContent"));

var _Avatar = _interopRequireDefault(require("@material-ui/core/Avatar"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _styles = require("@material-ui/core/styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ErrorBoundary extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Cacheando el error', error, errorInfo); // Catch errors in any components below and re-render with error message

    this.setState({
      error,
      errorInfo
    }); // You can also log error messages to an error reporting service here
  }

  render() {
    const {
      classes
    } = this.props;

    if (this.state.errorInfo) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Container.default, {
        maxWidth: "sm"
      }, /*#__PURE__*/_react.default.createElement(_Card.default, {
        className: classes.root
      }, /*#__PURE__*/_react.default.createElement(_CardHeader.default, {
        avatar: /*#__PURE__*/_react.default.createElement(_Avatar.default, {
          className: classes.avatar
        }, /*#__PURE__*/_react.default.createElement(_Warning.default, null)),
        title: "An error has been ocurred",
        subheader: this.state.error && /*#__PURE__*/_react.default.createElement(_Typography.default, {
          variant: "caption",
          color: "error"
        }, this.state.error.message)
      }), /*#__PURE__*/_react.default.createElement(_CardContent.default, null, this.state.error && /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle1"
      }, "Error message"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        color: "error"
      }, this.state.error.message)), this.state.errorInfo.componentStack && /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle1"
      }, "Component"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        color: "error"
      }, this.state.errorInfo.componentStack)), this.state.error && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, this.state.error.fileName && /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle1"
      }, "Error file name"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        color: "error"
      }, this.state.error.fileName)), this.state.error.lineNumber && /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle1"
      }, "Error line number"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        color: "error"
      }, this.state.error.lineNumber)), this.state.error.stack && /*#__PURE__*/_react.default.createElement(_Grid.default, {
        item: true,
        xs: 12
      }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "subtitle1"
      }, "Error stack"), /*#__PURE__*/_react.default.createElement(_Typography.default, {
        variant: "caption",
        color: "error"
      }, this.state.error.stack)))))));
    } else {
      // Normally, just render children
      return this.props.children;
    }
  }

}

ErrorBoundary.propTypes = {
  children: _propTypes.default.node.isRequired
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: '2em'
  },
  avatar: {
    backgroundColor: theme.palette.error.main
  }
});

var _default = (0, _styles.withStyles)(styles)(ErrorBoundary);

exports.default = _default;