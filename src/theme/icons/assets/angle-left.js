var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgAngleLeft(_ref, svgRef) {
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
    d: "M8.32196 10.9458L13.982 5.2958C14.0749 5.20207 14.1855 5.12768 14.3074 5.07691C14.4292 5.02614 14.5599 5 14.692 5C14.824 5 14.9547 5.02614 15.0765 5.07691C15.1984 5.12768 15.309 5.20207 15.402 5.2958C15.5882 5.48316 15.6927 5.73661 15.6927 6.0008C15.6927 6.26498 15.5882 6.51844 15.402 6.7058L10.452 11.7058L15.402 16.6558C15.5882 16.8432 15.6928 17.0966 15.6928 17.3608C15.6928 17.625 15.5882 17.8784 15.402 18.0658C15.3093 18.1603 15.1989 18.2355 15.077 18.287C14.9551 18.3384 14.8243 18.3652 14.692 18.3658C14.5597 18.3652 14.4288 18.3384 14.3069 18.287C14.185 18.2355 14.0746 18.1603 13.982 18.0658L8.32196 12.4158C8.22045 12.3222 8.13944 12.2085 8.08404 12.082C8.02863 11.9555 8.00002 11.8189 8.00002 11.6808C8.00002 11.5427 8.02863 11.4061 8.08404 11.2796C8.13944 11.1531 8.22045 11.0394 8.32196 10.9458Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgAngleLeft);
export default __webpack_public_path__ + "static/media/angle-left.8e55bfe7.svg";
export { ForwardRef as ReactComponent };