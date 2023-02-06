var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgClose(_ref, svgRef) {
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
    d: "M13.41 11.9999L19.71 5.70994C19.8983 5.52164 20.0041 5.26624 20.0041 4.99994C20.0041 4.73364 19.8983 4.47825 19.71 4.28994C19.5217 4.10164 19.2663 3.99585 19 3.99585C18.7337 3.99585 18.4783 4.10164 18.29 4.28994L12 10.5899L5.71 4.28994C5.5217 4.10164 5.2663 3.99585 5 3.99585C4.7337 3.99585 4.4783 4.10164 4.29 4.28994C4.1017 4.47825 3.99591 4.73364 3.99591 4.99994C3.99591 5.26624 4.1017 5.52164 4.29 5.70994L10.59 11.9999L4.29 18.2899C4.19627 18.3829 4.12188 18.4935 4.07111 18.6154C4.02034 18.7372 3.9942 18.8679 3.9942 18.9999C3.9942 19.132 4.02034 19.2627 4.07111 19.3845C4.12188 19.5064 4.19627 19.617 4.29 19.7099C4.38296 19.8037 4.49356 19.8781 4.61542 19.9288C4.73728 19.9796 4.86799 20.0057 5 20.0057C5.13201 20.0057 5.26272 19.9796 5.38458 19.9288C5.50644 19.8781 5.61704 19.8037 5.71 19.7099L12 13.4099L18.29 19.7099C18.383 19.8037 18.4936 19.8781 18.6154 19.9288C18.7373 19.9796 18.868 20.0057 19 20.0057C19.132 20.0057 19.2627 19.9796 19.3846 19.9288C19.5064 19.8781 19.617 19.8037 19.71 19.7099C19.8037 19.617 19.8781 19.5064 19.9289 19.3845C19.9797 19.2627 20.0058 19.132 20.0058 18.9999C20.0058 18.8679 19.9797 18.7372 19.9289 18.6154C19.8781 18.4935 19.8037 18.3829 19.71 18.2899L13.41 11.9999Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgClose);
export default __webpack_public_path__ + "static/media/close.05d6a570.svg";
export { ForwardRef as ReactComponent };