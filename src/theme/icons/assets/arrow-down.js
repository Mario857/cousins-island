var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgArrowDown(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 12,
    height: 10,
    viewBox: "0 0 12 10",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M10.7583 4.40833C10.6809 4.33023 10.5887 4.26823 10.4871 4.22592C10.3856 4.18362 10.2767 4.16183 10.1667 4.16183C10.0566 4.16183 9.94773 4.18362 9.84618 4.22592C9.74463 4.26823 9.65246 4.33023 9.57499 4.40833L6.83333 7.15833V0.833333C6.83333 0.61232 6.74553 0.400358 6.58925 0.244078C6.43297 0.0877975 6.22101 0 5.99999 0C5.77898 0 5.56702 0.0877975 5.41074 0.244078C5.25446 0.400358 5.16666 0.61232 5.16666 0.833333V7.15833L2.42499 4.40833C2.26807 4.25141 2.05524 4.16326 1.83333 4.16326C1.61141 4.16326 1.39858 4.25141 1.24166 4.40833C1.08474 4.56525 0.996582 4.77808 0.996582 5C0.996582 5.22192 1.08474 5.43475 1.24166 5.59167L5.40833 9.75833C5.48758 9.8342 5.58103 9.89367 5.68333 9.93333C5.78308 9.97742 5.89093 10.0002 5.99999 10.0002C6.10905 10.0002 6.21691 9.97742 6.31666 9.93333C6.41895 9.89367 6.51241 9.8342 6.59166 9.75833L10.7583 5.59167C10.8364 5.5142 10.8984 5.42203 10.9407 5.32048C10.983 5.21893 11.0048 5.11001 11.0048 5C11.0048 4.88999 10.983 4.78107 10.9407 4.67952C10.8984 4.57797 10.8364 4.4858 10.7583 4.40833Z",
    fill: "white",
    fillOpacity: 0.88
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgArrowDown);
export default __webpack_public_path__ + "static/media/arrow-down.95ef19d8.svg";
export { ForwardRef as ReactComponent };