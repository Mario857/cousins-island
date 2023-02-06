var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgGlobe(_ref, svgRef) {
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
    d: "M21.4092 8.64013C21.4092 8.64013 21.4092 8.64013 21.4092 8.59013C20.7046 6.66635 19.4261 5.00541 17.7467 3.83199C16.0673 2.65857 14.068 2.0293 12.0192 2.0293C9.97047 2.0293 7.97115 2.65857 6.29173 3.83199C4.6123 5.00541 3.33382 6.66635 2.62922 8.59013C2.62922 8.59013 2.62922 8.59013 2.62922 8.64013C1.84234 10.811 1.84234 13.1892 2.62922 15.3601C2.62922 15.3601 2.62922 15.3601 2.62922 15.4101C3.33382 17.3339 4.6123 18.9948 6.29173 20.1683C7.97115 21.3417 9.97047 21.971 12.0192 21.971C14.068 21.971 16.0673 21.3417 17.7467 20.1683C19.4261 18.9948 20.7046 17.3339 21.4092 15.4101C21.4092 15.4101 21.4092 15.4101 21.4092 15.3601C22.1961 13.1892 22.1961 10.811 21.4092 8.64013ZM4.25922 14.0001C3.91245 12.6893 3.91245 11.3109 4.25922 10.0001H6.11922C5.95925 11.3287 5.95925 12.6716 6.11922 14.0001H4.25922ZM5.07922 16.0001H6.47922C6.71394 16.892 7.04943 17.7542 7.47922 18.5701C6.49852 17.9021 5.67872 17.0242 5.07922 16.0001ZM6.47922 8.00013H5.07922C5.67009 6.97921 6.47941 6.10159 7.44922 5.43013C7.02977 6.24737 6.70436 7.10954 6.47922 8.00013ZM10.9992 19.7001C9.77098 18.7988 8.90837 17.4854 8.56922 16.0001H10.9992V19.7001ZM10.9992 14.0001H8.13922C7.95261 12.6733 7.95261 11.3269 8.13922 10.0001H10.9992V14.0001ZM10.9992 8.00013H8.56922C8.90837 6.51489 9.77098 5.20144 10.9992 4.30013V8.00013ZM18.9192 8.00013H17.5192C17.2845 7.10828 16.949 6.24606 16.5192 5.43013C17.4999 6.0982 18.3197 6.97607 18.9192 8.00013ZM12.9992 4.30013C14.2275 5.20144 15.0901 6.51489 15.4292 8.00013H12.9992V4.30013ZM12.9992 19.7001V16.0001H15.4292C15.0901 17.4854 14.2275 18.7988 12.9992 19.7001ZM15.8592 14.0001H12.9992V10.0001H15.8592C16.0458 11.3269 16.0458 12.6733 15.8592 14.0001ZM16.5492 18.5701C16.979 17.7542 17.3145 16.892 17.5492 16.0001H18.9492C18.3497 17.0242 17.5299 17.9021 16.5492 18.5701ZM19.7392 14.0001H17.8792C17.9605 13.3366 18.0006 12.6686 17.9992 12.0001C18.0003 11.3316 17.9602 10.6637 17.8792 10.0001H19.7392C20.086 11.3109 20.086 12.6893 19.7392 14.0001Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgGlobe);
export default __webpack_public_path__ + "static/media/globe.47d705df.svg";
export { ForwardRef as ReactComponent };