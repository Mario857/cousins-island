var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgAngleUp(_ref, svgRef) {
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
    d: "M7.0003 14.8298C7.18766 15.0161 7.44111 15.1206 7.7053 15.1206C7.96948 15.1206 8.22293 15.0161 8.4103 14.8298L12.0003 11.2898L15.5403 14.8298C15.7277 15.0161 15.9811 15.1206 16.2453 15.1206C16.5095 15.1206 16.7629 15.0161 16.9503 14.8298C17.044 14.7369 17.1184 14.6262 17.1692 14.5044C17.22 14.3825 17.2461 14.2518 17.2461 14.1198C17.2461 13.9878 17.22 13.8571 17.1692 13.7352C17.1184 13.6134 17.044 13.5028 16.9503 13.4098L12.7103 9.16981C12.6173 9.07608 12.5067 9.00169 12.3849 8.95092C12.263 8.90015 12.1323 8.87401 12.0003 8.87401C11.8683 8.87401 11.7376 8.90015 11.6157 8.95092C11.4939 9.00169 11.3833 9.07608 11.2903 9.16981L7.0003 13.4098C6.90657 13.5028 6.83217 13.6134 6.7814 13.7352C6.73064 13.8571 6.7045 13.9878 6.7045 14.1198C6.7045 14.2518 6.73064 14.3825 6.7814 14.5044C6.83217 14.6262 6.90657 14.7369 7.0003 14.8298Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgAngleUp);
export default __webpack_public_path__ + "static/media/angle-up.51c517e1.svg";
export { ForwardRef as ReactComponent };