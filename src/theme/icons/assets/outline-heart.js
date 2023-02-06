var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgOutlineHeart(_ref, svgRef) {
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
    d: "M20.16 5.00004C19.0999 3.93725 17.6948 3.28858 16.1983 3.17121C14.7018 3.05384 13.2127 3.47551 12 4.36004C10.7276 3.41368 9.14396 2.98455 7.56789 3.15908C5.99182 3.33361 4.54041 4.09882 3.50594 5.30063C2.47148 6.50244 1.93079 8.05156 1.99277 9.63606C2.05475 11.2206 2.71479 12.7227 3.83997 13.84L10.05 20.06C10.57 20.5718 11.2704 20.8587 12 20.8587C12.7296 20.8587 13.43 20.5718 13.95 20.06L20.16 13.84C21.3275 12.6653 21.9829 11.0763 21.9829 9.42004C21.9829 7.76377 21.3275 6.17478 20.16 5.00004V5.00004ZM18.75 12.46L12.54 18.67C12.4693 18.7414 12.3852 18.798 12.2925 18.8367C12.1998 18.8753 12.1004 18.8953 12 18.8953C11.8995 18.8953 11.8001 18.8753 11.7074 18.8367C11.6147 18.798 11.5306 18.7414 11.46 18.67L5.24997 12.43C4.46573 11.6284 4.02658 10.5515 4.02658 9.43004C4.02658 8.30858 4.46573 7.2317 5.24997 6.43004C6.04913 5.64103 7.12694 5.19861 8.24997 5.19861C9.373 5.19861 10.4508 5.64103 11.25 6.43004C11.3429 6.52377 11.4535 6.59817 11.5754 6.64893C11.6973 6.6997 11.828 6.72584 11.96 6.72584C12.092 6.72584 12.2227 6.6997 12.3445 6.64893C12.4664 6.59817 12.577 6.52377 12.67 6.43004C13.4691 5.64103 14.5469 5.19861 15.67 5.19861C16.793 5.19861 17.8708 5.64103 18.67 6.43004C19.465 7.22119 19.9186 8.29223 19.9335 9.41373C19.9485 10.5352 19.5236 11.618 18.75 12.43V12.46Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgOutlineHeart);
export default __webpack_public_path__ + "static/media/outline-heart.1f3bc2ae.svg";
export { ForwardRef as ReactComponent };