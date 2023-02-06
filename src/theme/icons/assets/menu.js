var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgMenu(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    fill: "currentColor",
    viewBox: "0 0 24 24",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _path || (_path = /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6 21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6zM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12 21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12zM4 17C3.44772 17 3 17.4477 3 18 3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18 21 17.4477 20.5523 17 20 17H4z"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgMenu);
export default __webpack_public_path__ + "static/media/menu.5673ddf2.svg";
export { ForwardRef as ReactComponent };