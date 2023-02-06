var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgArrowSort(_ref, svgRef) {
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
    d: "M9.71019 10.2099L12.0002 7.90994L14.2902 10.2099C14.3831 10.3037 14.4937 10.3781 14.6156 10.4288C14.7375 10.4796 14.8682 10.5057 15.0002 10.5057C15.1322 10.5057 15.2629 10.4796 15.3848 10.4288C15.5066 10.3781 15.6172 10.3037 15.7102 10.2099C15.8039 10.117 15.8783 10.0064 15.9291 9.88452C15.9798 9.76266 16.006 9.63195 16.006 9.49994C16.006 9.36793 15.9798 9.23722 15.9291 9.11536C15.8783 8.9935 15.8039 8.8829 15.7102 8.78994L12.7102 5.78994C12.6172 5.69621 12.5066 5.62182 12.3848 5.57105C12.2629 5.52028 12.1322 5.49414 12.0002 5.49414C11.8682 5.49414 11.7375 5.52028 11.6156 5.57105C11.4937 5.62182 11.3831 5.69621 11.2902 5.78994L8.29019 8.78994C8.10188 8.97824 7.99609 9.23364 7.99609 9.49994C7.99609 9.76624 8.10188 10.0216 8.29019 10.2099C8.47849 10.3982 8.73388 10.504 9.00019 10.504C9.26649 10.504 9.52188 10.3982 9.71019 10.2099ZM14.2902 14.7899L12.0002 17.0899L9.71019 14.7899C9.61695 14.6967 9.50626 14.6227 9.38444 14.5723C9.26261 14.5218 9.13204 14.4958 9.00019 14.4958C8.86833 14.4958 8.73776 14.5218 8.61594 14.5723C8.49411 14.6227 8.38342 14.6967 8.29019 14.7899C8.19695 14.8832 8.12299 14.9939 8.07253 15.1157C8.02207 15.2375 7.99609 15.3681 7.99609 15.4999C7.99609 15.6318 8.02207 15.7624 8.07253 15.8842C8.12299 16.006 8.19695 16.1167 8.29019 16.2099L11.2902 19.2099C11.3831 19.3037 11.4937 19.3781 11.6156 19.4288C11.7375 19.4796 11.8682 19.5057 12.0002 19.5057C12.1322 19.5057 12.2629 19.4796 12.3848 19.4288C12.5066 19.3781 12.6172 19.3037 12.7102 19.2099L15.7102 16.2099C15.8985 16.0216 16.0043 15.7662 16.0043 15.4999C16.0043 15.2336 15.8985 14.9782 15.7102 14.7899C15.5219 14.6016 15.2665 14.4958 15.0002 14.4958C14.7339 14.4958 14.4785 14.6016 14.2902 14.7899Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgArrowSort);
export default __webpack_public_path__ + "static/media/arrow-sort.0e2ceb6f.svg";
export { ForwardRef as ReactComponent };