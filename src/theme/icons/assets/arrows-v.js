var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgArrowsV(_ref, svgRef) {
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
    d: "M15.2899 16.2899L12.9999 18.5899V5.4099L15.2899 7.7099C15.3829 7.80363 15.4935 7.87802 15.6154 7.92879C15.7372 7.97956 15.8679 8.00569 15.9999 8.00569C16.132 8.00569 16.2627 7.97956 16.3845 7.92879C16.5064 7.87802 16.617 7.80363 16.7099 7.7099C16.8037 7.61693 16.8781 7.50633 16.9288 7.38447C16.9796 7.26261 17.0057 7.13191 17.0057 6.9999C17.0057 6.86788 16.9796 6.73718 16.9288 6.61532C16.8781 6.49346 16.8037 6.38286 16.7099 6.2899L12.7099 2.2899C12.6148 2.19886 12.5027 2.12749 12.3799 2.0799C12.1365 1.97988 11.8634 1.97988 11.6199 2.0799C11.4972 2.12749 11.385 2.19886 11.2899 2.2899L7.28994 6.2899C7.1967 6.38313 7.12274 6.49383 7.07228 6.61565C7.02182 6.73747 6.99585 6.86804 6.99585 6.9999C6.99585 7.13176 7.02182 7.26232 7.07228 7.38415C7.12274 7.50597 7.1967 7.61666 7.28994 7.7099C7.38318 7.80313 7.49387 7.8771 7.61569 7.92756C7.73751 7.97802 7.86808 8.00399 7.99994 8.00399C8.1318 8.00399 8.26237 7.97802 8.38419 7.92756C8.50601 7.8771 8.6167 7.80313 8.70994 7.7099L10.9999 5.4099V18.5899L8.70994 16.2899C8.52164 16.1016 8.26624 15.9958 7.99994 15.9958C7.73364 15.9958 7.47825 16.1016 7.28994 16.2899C7.10164 16.4782 6.99585 16.7336 6.99585 16.9999C6.99585 17.2662 7.10164 17.5216 7.28994 17.7099L11.2899 21.7099C11.385 21.8009 11.4972 21.8723 11.6199 21.9199C11.7396 21.9728 11.8691 22.0001 11.9999 22.0001C12.1308 22.0001 12.2602 21.9728 12.3799 21.9199C12.5027 21.8723 12.6148 21.8009 12.7099 21.7099L16.7099 17.7099C16.8982 17.5216 17.004 17.2662 17.004 16.9999C17.004 16.7336 16.8982 16.4782 16.7099 16.2899C16.6167 16.1967 16.506 16.1227 16.3842 16.0722C16.2624 16.0218 16.1318 15.9958 15.9999 15.9958C15.7336 15.9958 15.4782 16.1016 15.2899 16.2899Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgArrowsV);
export default __webpack_public_path__ + "static/media/arrows-v.fda1d849.svg";
export { ForwardRef as ReactComponent };