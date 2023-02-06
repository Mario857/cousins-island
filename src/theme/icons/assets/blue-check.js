var _rect, _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgBlueCheck(_ref, svgRef) {
  var title = _ref.title,
      titleId = _ref.titleId,
      props = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/React.createElement("svg", _extends({
    width: 18,
    height: 18,
    viewBox: "0 0 18 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, _rect || (_rect = /*#__PURE__*/React.createElement("rect", {
    x: 4,
    y: 4,
    width: 11,
    height: 10,
    fill: "white"
  })), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M18 9.42188C18 10.0512 17.8488 10.6348 17.5465 11.1691C17.2441 11.7035 16.8398 12.1219 16.3301 12.4137C16.3441 12.5086 16.3512 12.6562 16.3512 12.8566C16.3512 13.8094 16.0312 14.618 15.3984 15.2859C14.7621 15.9574 13.9957 16.2914 13.0992 16.2914C12.6984 16.2914 12.3152 16.2176 11.9531 16.0699C11.6719 16.6465 11.2676 17.1105 10.7367 17.4656C10.2094 17.8242 9.6293 18 9 18C8.35664 18 7.77305 17.8277 7.25273 17.4762C6.72891 17.1281 6.32812 16.6605 6.04688 16.0699C5.68477 16.2176 5.30508 16.2914 4.90078 16.2914C4.0043 16.2914 3.23438 15.9574 2.59102 15.2859C1.94766 14.618 1.62773 13.8059 1.62773 12.8566C1.62773 12.7512 1.6418 12.6035 1.66641 12.4137C1.15664 12.1184 0.752344 11.7035 0.45 11.1691C0.151172 10.6348 0 10.0512 0 9.42188C0 8.75391 0.16875 8.13867 0.502734 7.5832C0.836719 7.02773 1.28672 6.61641 1.84922 6.34922C1.70156 5.94844 1.62773 5.54414 1.62773 5.14336C1.62773 4.19414 1.94766 3.38203 2.59102 2.71406C3.23438 2.04609 4.0043 1.70859 4.90078 1.70859C5.30156 1.70859 5.68477 1.78242 6.04688 1.93008C6.32812 1.35352 6.73242 0.889453 7.26328 0.534375C7.79063 0.179297 8.3707 0 9 0C9.6293 0 10.2094 0.179297 10.7367 0.530859C11.2641 0.885938 11.6719 1.35 11.9531 1.92656C12.3152 1.77891 12.6949 1.70508 13.0992 1.70508C13.9957 1.70508 14.7621 2.03906 15.3984 2.71055C16.0348 3.38203 16.3512 4.19062 16.3512 5.13984C16.3512 5.58281 16.2844 5.98359 16.1508 6.3457C16.7133 6.61289 17.1633 7.02422 17.4973 7.57969C17.8312 8.13867 18 8.75391 18 9.42188ZM8.6168 12.1324L12.3328 6.56719C12.4277 6.41953 12.4559 6.25781 12.4242 6.08555C12.3891 5.91328 12.3012 5.77617 12.1535 5.68477C12.0059 5.58984 11.8441 5.5582 11.6719 5.58281C11.4961 5.61094 11.3555 5.69531 11.25 5.84297L7.97695 10.7648L6.46875 9.26016C6.33516 9.12656 6.18047 9.06328 6.0082 9.07031C5.83242 9.07734 5.68125 9.14062 5.54766 9.26016C5.42812 9.37969 5.36836 9.53086 5.36836 9.71367C5.36836 9.89297 5.42812 10.0441 5.54766 10.1672L7.61836 12.2379L7.72031 12.3187C7.83984 12.3996 7.96289 12.4383 8.08242 12.4383C8.31797 12.4348 8.49727 12.3363 8.6168 12.1324Z",
    fill: "#3D81DB"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgBlueCheck);
export default __webpack_public_path__ + "static/media/blue-check.8cb624be.svg";
export { ForwardRef as ReactComponent };