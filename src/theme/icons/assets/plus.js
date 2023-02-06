var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgPlus(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 14,
    height: 14,
    viewBox: "0 0 14 14",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M12.8333 6.16671H7.83325V1.16671C7.83325 0.945694 7.74545 0.733732 7.58917 0.577452C7.43289 0.421172 7.22093 0.333374 6.99992 0.333374C6.7789 0.333374 6.56694 0.421172 6.41066 0.577452C6.25438 0.733732 6.16658 0.945694 6.16658 1.16671V6.16671H1.16659C0.945571 6.16671 0.73361 6.2545 0.57733 6.41078C0.421049 6.56706 0.333252 6.77903 0.333252 7.00004C0.333252 7.22105 0.421049 7.43302 0.57733 7.5893C0.73361 7.74558 0.945571 7.83337 1.16659 7.83337H6.16658V12.8334C6.16658 13.0544 6.25438 13.2663 6.41066 13.4226C6.56694 13.5789 6.7789 13.6667 6.99992 13.6667C7.22093 13.6667 7.43289 13.5789 7.58917 13.4226C7.74545 13.2663 7.83325 13.0544 7.83325 12.8334V7.83337H12.8333C13.0543 7.83337 13.2662 7.74558 13.4225 7.5893C13.5788 7.43302 13.6666 7.22105 13.6666 7.00004C13.6666 6.77903 13.5788 6.56706 13.4225 6.41078C13.2662 6.2545 13.0543 6.16671 12.8333 6.16671Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgPlus);
export default __webpack_public_path__ + "static/media/plus.e69beb43.svg";
export { ForwardRef as ReactComponent };