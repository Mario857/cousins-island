var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgMedium(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 18,
    height: 18,
    viewBox: "0 0 36 36",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M2 0H34C34.5304 0 35.0391 0.210714 35.4142 0.585786C35.7893 0.960859 36 1.46957 36 2V34C36 34.5304 35.7893 35.0391 35.4142 35.4142C35.0391 35.7893 34.5304 36 34 36H2C1.46957 36 0.960859 35.7893 0.585786 35.4142C0.210714 35.0391 0 34.5304 0 34V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0ZM28.6 25.88C28.4 25.78 28.3 25.48 28.3 25.278V10.012C28.3 9.812 28.4 9.512 28.6 9.31L30.51 7.1V7H23.68L18.56 19.956L12.732 7H5.704V7.1L7.51 9.612C7.912 10.012 8.012 10.616 8.012 11.118V22.164C8.112 22.768 8.012 23.47 7.712 24.072L5 27.788V27.888H12.232V27.788L9.52 24.174C9.22 23.57 9.118 22.968 9.22 22.266V12.22C9.32 12.42 9.42 12.42 9.52 12.822L16.348 28.088H16.448L23.08 11.52C22.98 12.12 22.98 12.824 22.98 13.328V25.178C22.98 25.478 22.88 25.678 22.68 25.88L20.67 27.788V27.888H30.512V27.788L28.604 25.88H28.6Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgMedium);
export default __webpack_public_path__ + "static/media/medium.c751138e.svg";
export { ForwardRef as ReactComponent };