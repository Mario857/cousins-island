var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgAngleRight(_ref, svgRef) {
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
    d: "M15.54 11.2895L9.87998 5.63955C9.78702 5.54582 9.67642 5.47143 9.55456 5.42066C9.4327 5.36989 9.30199 5.34375 9.16998 5.34375C9.03797 5.34375 8.90726 5.36989 8.78541 5.42066C8.66355 5.47143 8.55294 5.54582 8.45998 5.63955C8.27373 5.82691 8.16919 6.08036 8.16919 6.34455C8.16919 6.60873 8.27373 6.86219 8.45998 7.04955L13.41 12.0495L8.45998 16.9995C8.27373 17.1869 8.16919 17.4404 8.16919 17.7045C8.16919 17.9687 8.27373 18.2222 8.45998 18.4095C8.5526 18.504 8.66304 18.5792 8.78492 18.6307C8.90679 18.6822 9.03767 18.709 9.16998 18.7095C9.30229 18.709 9.43317 18.6822 9.55505 18.6307C9.67692 18.5792 9.78737 18.504 9.87998 18.4095L15.54 12.7595C15.6415 12.6659 15.7225 12.5523 15.7779 12.4258C15.8333 12.2993 15.8619 12.1627 15.8619 12.0245C15.8619 11.8864 15.8333 11.7498 15.7779 11.6233C15.7225 11.4968 15.6415 11.3832 15.54 11.2895Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgAngleRight);
export default __webpack_public_path__ + "static/media/angle-right.94f93739.svg";
export { ForwardRef as ReactComponent };