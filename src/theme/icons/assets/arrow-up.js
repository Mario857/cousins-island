var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgArrowUp(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M17.7099 11.2899L12.7099 6.2899C12.6148 6.19886 12.5027 6.12749 12.3799 6.0799C12.1365 5.97988 11.8634 5.97988 11.6199 6.0799C11.4972 6.12749 11.385 6.19886 11.2899 6.2899L6.28994 11.2899C6.1967 11.3831 6.12274 11.4938 6.07228 11.6156C6.02182 11.7375 5.99585 11.868 5.99585 11.9999C5.99585 12.2662 6.10164 12.5216 6.28994 12.7099C6.47825 12.8982 6.73364 13.004 6.99994 13.004C7.26624 13.004 7.52164 12.8982 7.70994 12.7099L10.9999 9.4099V16.9999C10.9999 17.2651 11.1053 17.5195 11.2928 17.707C11.4804 17.8945 11.7347 17.9999 11.9999 17.9999C12.2652 17.9999 12.5195 17.8945 12.707 17.707C12.8946 17.5195 12.9999 17.2651 12.9999 16.9999V9.4099L16.2899 12.7099C16.3829 12.8036 16.4935 12.878 16.6154 12.9288C16.7372 12.9796 16.8679 13.0057 16.9999 13.0057C17.132 13.0057 17.2627 12.9796 17.3845 12.9288C17.5064 12.878 17.617 12.8036 17.7099 12.7099C17.8037 12.6169 17.8781 12.5063 17.9288 12.3845C17.9796 12.2626 18.0057 12.1319 18.0057 11.9999C18.0057 11.8679 17.9796 11.7372 17.9288 11.6153C17.8781 11.4935 17.8037 11.3829 17.7099 11.2899Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgArrowUp);
export default __webpack_public_path__ + "static/media/arrow-up.42cbaa17.svg";
export { ForwardRef as ReactComponent };