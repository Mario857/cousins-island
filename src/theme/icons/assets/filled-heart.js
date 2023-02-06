var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgFilledHeart(_ref, svgRef) {
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
    d: "M16.1891 3.19705C17.6854 3.30524 19.0937 3.94467 20.16 4.99997C20.7405 5.58786 21.199 6.28467 21.5093 7.05035C21.8196 7.81603 21.9755 8.63548 21.968 9.4616C21.9606 10.2877 21.79 11.1042 21.466 11.8642C21.142 12.6242 20.671 13.3126 20.08 13.89L14.08 19.94C13.5175 20.5018 12.755 20.8173 11.96 20.8173C11.165 20.8173 10.4025 20.5018 9.84003 19.94L3.84003 13.89C2.71485 12.7726 2.05481 11.2705 1.99283 9.68598C1.93085 8.10149 2.47154 6.55236 3.506 5.35056C4.54047 4.14875 5.99188 3.38353 7.56795 3.20901C9.14402 3.03448 10.7277 3.46361 12 4.40997C13.207 3.51904 14.6928 3.08886 16.1891 3.19705Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgFilledHeart);
export default __webpack_public_path__ + "static/media/filled-heart.b65986c0.svg";
export { ForwardRef as ReactComponent };