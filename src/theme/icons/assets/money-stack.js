var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgMoneyStack(_ref, svgRef) {
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
    d: "M22 17H2C1.73478 17 1.48043 17.1054 1.29289 17.2929C1.10536 17.4804 1 17.7348 1 18C1 18.2652 1.10536 18.5196 1.29289 18.7071C1.48043 18.8946 1.73478 19 2 19H22C22.2652 19 22.5196 18.8946 22.7071 18.7071C22.8946 18.5196 23 18.2652 23 18C23 17.7348 22.8946 17.4804 22.7071 17.2929C22.5196 17.1054 22.2652 17 22 17ZM22 21H2C1.73478 21 1.48043 21.1054 1.29289 21.2929C1.10536 21.4804 1 21.7348 1 22C1 22.2652 1.10536 22.5196 1.29289 22.7071C1.48043 22.8946 1.73478 23 2 23H22C22.2652 23 22.5196 22.8946 22.7071 22.7071C22.8946 22.5196 23 22.2652 23 22C23 21.7348 22.8946 21.4804 22.7071 21.2929C22.5196 21.1054 22.2652 21 22 21ZM6 7C5.80222 7 5.60888 7.05865 5.44443 7.16853C5.27998 7.27841 5.15181 7.43459 5.07612 7.61732C5.00043 7.80004 4.98063 8.00111 5.01921 8.19509C5.0578 8.38907 5.15304 8.56725 5.29289 8.70711C5.43275 8.84696 5.61093 8.9422 5.80491 8.98079C5.99889 9.01937 6.19996 8.99957 6.38268 8.92388C6.56541 8.84819 6.72159 8.72002 6.83147 8.55557C6.94135 8.39112 7 8.19778 7 8C7 7.73478 6.89464 7.48043 6.70711 7.29289C6.51957 7.10536 6.26522 7 6 7ZM20 1H4C3.20435 1 2.44129 1.31607 1.87868 1.87868C1.31607 2.44129 1 3.20435 1 4V12C1 12.7956 1.31607 13.5587 1.87868 14.1213C2.44129 14.6839 3.20435 15 4 15H20C20.7956 15 21.5587 14.6839 22.1213 14.1213C22.6839 13.5587 23 12.7956 23 12V4C23 3.20435 22.6839 2.44129 22.1213 1.87868C21.5587 1.31607 20.7956 1 20 1ZM21 12C21 12.2652 20.8946 12.5196 20.7071 12.7071C20.5196 12.8946 20.2652 13 20 13H4C3.73478 13 3.48043 12.8946 3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12V4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3H20C20.2652 3 20.5196 3.10536 20.7071 3.29289C20.8946 3.48043 21 3.73478 21 4V12ZM12 5C11.4067 5 10.8266 5.17595 10.3333 5.50559C9.83994 5.83524 9.45542 6.30377 9.22836 6.85195C9.0013 7.40013 8.94189 8.00333 9.05764 8.58527C9.1734 9.16721 9.45912 9.70176 9.87868 10.1213C10.2982 10.5409 10.8328 10.8266 11.4147 10.9424C11.9967 11.0581 12.5999 10.9987 13.1481 10.7716C13.6962 10.5446 14.1648 10.1601 14.4944 9.66671C14.8241 9.17336 15 8.59334 15 8C15 7.20435 14.6839 6.44129 14.1213 5.87868C13.5587 5.31607 12.7956 5 12 5ZM12 9C11.8022 9 11.6089 8.94135 11.4444 8.83147C11.28 8.72159 11.1518 8.56541 11.0761 8.38268C11.0004 8.19996 10.9806 7.99889 11.0192 7.80491C11.0578 7.61093 11.153 7.43275 11.2929 7.29289C11.4327 7.15304 11.6109 7.0578 11.8049 7.01921C11.9989 6.98063 12.2 7.00043 12.3827 7.07612C12.5654 7.15181 12.7216 7.27998 12.8315 7.44443C12.9414 7.60888 13 7.80222 13 8C13 8.26522 12.8946 8.51957 12.7071 8.70711C12.5196 8.89464 12.2652 9 12 9ZM18 7C17.8022 7 17.6089 7.05865 17.4444 7.16853C17.28 7.27841 17.1518 7.43459 17.0761 7.61732C17.0004 7.80004 16.9806 8.00111 17.0192 8.19509C17.0578 8.38907 17.153 8.56725 17.2929 8.70711C17.4327 8.84696 17.6109 8.9422 17.8049 8.98079C17.9989 9.01937 18.2 8.99957 18.3827 8.92388C18.5654 8.84819 18.7216 8.72002 18.8315 8.55557C18.9414 8.39112 19 8.19778 19 8C19 7.73478 18.8946 7.48043 18.7071 7.29289C18.5196 7.10536 18.2652 7 18 7Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgMoneyStack);
export default __webpack_public_path__ + "static/media/money-stack.50caa360.svg";
export { ForwardRef as ReactComponent };