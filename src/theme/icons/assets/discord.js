var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgDiscord(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 18,
    height: 21,
    viewBox: "0 0 36 42",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M14.152 18C15.352 18 16.324 18.9 16.302 20C16.302 21.1 15.354 22 14.152 22C12.972 22 12 21.1 12 20C12 18.9 12.95 18 14.152 18ZM21.848 18C23.05 18 24 18.9 24 20C24 21.1 23.05 22 21.848 22C20.668 22 19.698 21.1 19.698 20C19.698 18.9 20.646 18 21.848 18ZM31.782 0C34.108 0 36 1.932 36 4.326V42L31.578 38.01L29.088 35.658L26.454 33.158L27.546 37.044H4.218C1.892 37.044 0 35.112 0 32.718V4.326C0 1.932 1.892 0 4.218 0H31.78H31.782ZM23.842 27.426C28.388 27.28 30.138 24.234 30.138 24.234C30.138 17.472 27.174 11.99 27.174 11.99C24.214 9.724 21.394 9.786 21.394 9.786L21.106 10.122C24.604 11.214 26.228 12.79 26.228 12.79C24.3181 11.714 22.2133 11.0287 20.036 10.774C18.6549 10.618 17.2599 10.6314 15.882 10.814C15.758 10.814 15.654 10.836 15.532 10.856C14.812 10.92 13.062 11.192 10.862 12.18C10.102 12.536 9.648 12.79 9.648 12.79C9.648 12.79 11.356 11.13 15.058 10.038L14.852 9.786C14.852 9.786 12.034 9.724 9.072 11.992C9.072 11.992 6.11 17.472 6.11 24.234C6.11 24.234 7.838 27.278 12.384 27.426C12.384 27.426 13.144 26.482 13.764 25.684C11.15 24.884 10.164 23.204 10.164 23.204C10.164 23.204 10.368 23.352 10.738 23.562C10.758 23.582 10.778 23.604 10.82 23.624C10.882 23.668 10.944 23.688 11.006 23.73C11.52 24.024 12.034 24.254 12.506 24.444C13.35 24.78 14.358 25.116 15.532 25.348C17.2906 25.6927 19.0988 25.6995 20.86 25.368C21.8858 25.1849 22.8867 24.8822 23.842 24.466C24.562 24.192 25.364 23.792 26.208 23.226C26.208 23.226 25.18 24.948 22.484 25.726C23.102 26.524 23.844 27.426 23.844 27.426H23.842Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgDiscord);
export default __webpack_public_path__ + "static/media/discord.5bc0c41f.svg";
export { ForwardRef as ReactComponent };