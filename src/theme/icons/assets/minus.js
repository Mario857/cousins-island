var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgMinus(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 14,
    height: 2,
    viewBox: "0 0 14 2",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M12.8333 0.166626H1.16659C0.945571 0.166626 0.73361 0.254424 0.57733 0.410704C0.421049 0.566984 0.333252 0.778946 0.333252 0.999959C0.333252 1.22097 0.421049 1.43293 0.57733 1.58922C0.73361 1.7455 0.945571 1.83329 1.16659 1.83329H12.8333C13.0543 1.83329 13.2662 1.7455 13.4225 1.58922C13.5788 1.43293 13.6666 1.22097 13.6666 0.999959C13.6666 0.778946 13.5788 0.566984 13.4225 0.410704C13.2662 0.254424 13.0543 0.166626 12.8333 0.166626Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgMinus);
export default __webpack_public_path__ + "static/media/minus.fb175101.svg";
export { ForwardRef as ReactComponent };