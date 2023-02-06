var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgExchange(_ref, svgRef) {
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
    d: "M21.7099 9.29019L17.7099 5.29019C17.6167 5.19695 17.506 5.12299 17.3841 5.07253C17.2623 5.02207 17.1318 4.99609 16.9999 4.99609C16.7336 4.99609 16.4782 5.10188 16.2899 5.29019C16.1016 5.47849 15.9958 5.73388 15.9958 6.00019C15.9958 6.26649 16.1016 6.52188 16.2899 6.71019L18.5899 9.00019H6.9999C6.73468 9.00019 6.48033 9.10554 6.29279 9.29308C6.10525 9.48062 5.9999 9.73497 5.9999 10.0002C5.9999 10.2654 6.10525 10.5198 6.29279 10.7073C6.48033 10.8948 6.73468 11.0002 6.9999 11.0002H20.9999C21.1973 10.9992 21.39 10.9398 21.5538 10.8295C21.7175 10.7191 21.8449 10.5628 21.9199 10.3802C21.9965 10.1981 22.0174 9.99736 21.98 9.80337C21.9426 9.60938 21.8487 9.43081 21.7099 9.29019ZM16.9999 13.0002H2.9999C2.80247 13.0012 2.60975 13.0606 2.44603 13.1709C2.28231 13.2812 2.15492 13.4376 2.0799 13.6202C2.00332 13.8023 1.98239 14.003 2.01977 14.197C2.05714 14.391 2.15114 14.5696 2.2899 14.7102L6.2899 18.7102C6.38286 18.8039 6.49346 18.8783 6.61532 18.9291C6.73718 18.9798 6.86788 19.006 6.9999 19.006C7.13191 19.006 7.26261 18.9798 7.38447 18.9291C7.50633 18.8783 7.61693 18.8039 7.7099 18.7102C7.80362 18.6172 7.87802 18.5066 7.92879 18.3848C7.97956 18.2629 8.00569 18.1322 8.00569 18.0002C8.00569 17.8682 7.97956 17.7375 7.92879 17.6156C7.87802 17.4937 7.80362 17.3831 7.7099 17.2902L5.4099 15.0002H16.9999C17.2651 15.0002 17.5195 14.8948 17.707 14.7073C17.8945 14.5198 17.9999 14.2654 17.9999 14.0002C17.9999 13.735 17.8945 13.4806 17.707 13.2931C17.5195 13.1055 17.2651 13.0002 16.9999 13.0002Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgExchange);
export default __webpack_public_path__ + "static/media/exchange.6d559066.svg";
export { ForwardRef as ReactComponent };