var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgGlitchSign(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M16.6674 8.625L11.8508 2.45C11.6088 2.19808 11.3177 1.99855 10.9954 1.8638C10.6732 1.72904 10.3267 1.66192 9.97743 1.66661C9.62817 1.6713 9.28359 1.74769 8.96508 1.89105C8.64656 2.03441 8.36089 2.24167 8.12578 2.5L3.33411 8.625C3.06882 9.03462 2.92706 9.51197 2.92578 10C2.9397 10.4678 3.08087 10.923 3.33411 11.3167L3.38411 11.375L8.16745 17.55C8.40296 17.7993 8.68725 17.9976 9.00265 18.1323C9.31805 18.2671 9.6578 18.3355 10.0008 18.3333C10.3554 18.333 10.706 18.2587 11.0303 18.1152C11.3546 17.9718 11.6454 17.7622 11.8841 17.5L16.6674 11.375C16.9289 10.9619 17.0635 10.4813 17.0546 9.9925C17.0457 9.50373 16.8937 9.02829 16.6174 8.625H16.6674ZM15.3591 10.4083L10.6341 16.425C10.4749 16.5717 10.2692 16.6578 10.053 16.6685C9.83679 16.6791 9.62367 16.6136 9.45078 16.4833L4.70911 10.3917C4.63832 10.2728 4.59823 10.1382 4.59245 10C4.59368 9.87054 4.62207 9.74279 4.67578 9.625L9.40078 3.60833C9.56002 3.46167 9.76566 3.37551 9.98188 3.36485C10.1981 3.35419 10.4112 3.41971 10.5841 3.55L15.2758 9.61666C15.3624 9.75079 15.4087 9.90699 15.4091 10.0667C15.4034 10.1848 15.3752 10.3008 15.3258 10.4083H15.3591Z",
    fill: "#FF60F7"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgGlitchSign);
export default __webpack_public_path__ + "static/media/glitch-sign.8dcd693c.svg";
export { ForwardRef as ReactComponent };