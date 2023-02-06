var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgAngleDown(_ref, svgRef) {
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
    d: "M16.9999 9.1697C16.8126 8.98345 16.5591 8.87891 16.2949 8.87891C16.0308 8.87891 15.7773 8.98345 15.5899 9.1697L11.9999 12.7097L8.45995 9.1697C8.27259 8.98345 8.01913 8.87891 7.75495 8.87891C7.49076 8.87891 7.23731 8.98345 7.04995 9.1697C6.95622 9.26266 6.88183 9.37326 6.83106 9.49512C6.78029 9.61698 6.75415 9.74769 6.75415 9.8797C6.75415 10.0117 6.78029 10.1424 6.83106 10.2643C6.88183 10.3861 6.95622 10.4967 7.04995 10.5897L11.2899 14.8297C11.3829 14.9234 11.4935 14.9978 11.6154 15.0486C11.7372 15.0994 11.8679 15.1255 11.9999 15.1255C12.132 15.1255 12.2627 15.0994 12.3845 15.0486C12.5064 14.9978 12.617 14.9234 12.7099 14.8297L16.9999 10.5897C17.0937 10.4967 17.1681 10.3861 17.2188 10.2643C17.2696 10.1424 17.2957 10.0117 17.2957 9.8797C17.2957 9.74769 17.2696 9.61698 17.2188 9.49512C17.1681 9.37326 17.0937 9.26266 16.9999 9.1697Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgAngleDown);
export default __webpack_public_path__ + "static/media/angle-down.cd0c93f7.svg";
export { ForwardRef as ReactComponent };