var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgBell(_ref, svgRef) {
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
    d: "M18 13.18V10C17.9986 8.58312 17.4958 7.21247 16.5806 6.13077C15.6655 5.04908 14.3971 4.32615 13 4.09V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3V4.09C9.60294 4.32615 8.33452 5.04908 7.41939 6.13077C6.50425 7.21247 6.00144 8.58312 6 10V13.18C5.41645 13.3863 4.911 13.7681 4.55294 14.2729C4.19488 14.7778 4.00174 15.3811 4 16V18C4 18.2652 4.10536 18.5196 4.29289 18.7071C4.48043 18.8946 4.73478 19 5 19H8.14C8.37028 19.8474 8.873 20.5954 9.5706 21.1287C10.2682 21.6621 11.1219 21.951 12 21.951C12.8781 21.951 13.7318 21.6621 14.4294 21.1287C15.127 20.5954 15.6297 19.8474 15.86 19H19C19.2652 19 19.5196 18.8946 19.7071 18.7071C19.8946 18.5196 20 18.2652 20 18V16C19.9983 15.3811 19.8051 14.7778 19.4471 14.2729C19.089 13.7681 18.5835 13.3863 18 13.18ZM8 10C8 8.93913 8.42143 7.92172 9.17157 7.17157C9.92172 6.42143 10.9391 6 12 6C13.0609 6 14.0783 6.42143 14.8284 7.17157C15.5786 7.92172 16 8.93913 16 10V13H8V10ZM12 20C11.651 19.9979 11.3086 19.9045 11.0068 19.7291C10.7051 19.5536 10.4545 19.3023 10.28 19H13.72C13.5455 19.3023 13.2949 19.5536 12.9932 19.7291C12.6914 19.9045 12.349 19.9979 12 20ZM18 17H6V16C6 15.7348 6.10536 15.4804 6.29289 15.2929C6.48043 15.1054 6.73478 15 7 15H17C17.2652 15 17.5196 15.1054 17.7071 15.2929C17.8946 15.4804 18 15.7348 18 16V17Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgBell);
export default __webpack_public_path__ + "static/media/bell.6e699c21.svg";
export { ForwardRef as ReactComponent };