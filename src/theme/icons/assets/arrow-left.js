var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgArrowLeft(_ref, svgRef) {
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
    d: "M17 11.0002H9.41002L12.71 7.71019C12.8983 7.52188 13.0041 7.26649 13.0041 7.00019C13.0041 6.73388 12.8983 6.47849 12.71 6.29019C12.5217 6.10188 12.2663 5.99609 12 5.99609C11.7337 5.99609 11.4783 6.10188 11.29 6.29019L6.29002 11.2902C6.19898 11.3853 6.12761 11.4974 6.08002 11.6202C5.98 11.8636 5.98 12.1367 6.08002 12.3802C6.12761 12.5029 6.19898 12.6151 6.29002 12.7102L11.29 17.7102C11.383 17.8039 11.4936 17.8783 11.6154 17.9291C11.7373 17.9798 11.868 18.006 12 18.006C12.132 18.006 12.2627 17.9798 12.3846 17.9291C12.5065 17.8783 12.6171 17.8039 12.71 17.7102C12.8037 17.6172 12.8781 17.5066 12.9289 17.3848C12.9797 17.2629 13.0058 17.1322 13.0058 17.0002C13.0058 16.8682 12.9797 16.7375 12.9289 16.6156C12.8781 16.4937 12.8037 16.3831 12.71 16.2902L9.41002 13.0002H17C17.2652 13.0002 17.5196 12.8948 17.7071 12.7073C17.8947 12.5198 18 12.2654 18 12.0002C18 11.735 17.8947 11.4806 17.7071 11.2931C17.5196 11.1055 17.2652 11.0002 17 11.0002Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgArrowLeft);
export default __webpack_public_path__ + "static/media/arrow-left.4e942d6f.svg";
export { ForwardRef as ReactComponent };