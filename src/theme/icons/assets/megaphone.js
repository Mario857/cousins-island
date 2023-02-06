var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgMegaphone(_ref, svgRef) {
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
    d: "M19.9912 2.00195C19.8599 2.00188 19.7298 2.02769 19.6084 2.07792C19.4871 2.12815 19.3768 2.20181 19.2839 2.29468C19.1911 2.38755 19.1174 2.49782 19.0672 2.61918C19.017 2.74054 18.9911 2.87061 18.9912 3.00195V3.63867C18.1478 4.68438 17.0819 5.52887 15.871 6.11067C14.66 6.69248 13.3346 6.99696 11.9912 7.00195H5.99121C5.19583 7.00282 4.43327 7.31917 3.87085 7.88159C3.30843 8.44401 2.99208 9.20657 2.99121 10.002V12.002C2.99208 12.7973 3.30843 13.5599 3.87085 14.1223C4.43327 14.6847 5.19583 15.0011 5.99121 15.002H6.475L4.07227 20.6084C4.00698 20.7604 3.98047 20.9263 3.99512 21.0911C4.00978 21.256 4.06514 21.4146 4.15624 21.5528C4.24734 21.6909 4.37133 21.8043 4.51706 21.8827C4.6628 21.9611 4.82572 22.0021 4.99121 22.002H8.99121C9.18696 22.0021 9.37843 21.9446 9.54182 21.8368C9.7052 21.729 9.83329 21.5755 9.91016 21.3955L12.6339 15.04C13.8646 15.1303 15.0636 15.472 16.157 16.0439C17.2505 16.6158 18.215 17.4058 18.9912 18.365V19.002C18.9912 19.2672 19.0966 19.5215 19.2841 19.7091C19.4716 19.8966 19.726 20.002 19.9912 20.002C20.2564 20.002 20.5108 19.8966 20.6983 19.7091C20.8859 19.5215 20.9912 19.2672 20.9912 19.002V3.00195C20.9913 2.87061 20.9655 2.74054 20.9152 2.61918C20.865 2.49782 20.7914 2.38755 20.6985 2.29468C20.6056 2.2018 20.4953 2.12815 20.374 2.07792C20.2526 2.02769 20.1226 2.00188 19.9912 2.00195V2.00195ZM5.99121 13.002C5.72605 13.0018 5.4718 12.8964 5.2843 12.7089C5.0968 12.5214 4.99139 12.2671 4.99121 12.002V10.002C4.99139 9.73679 5.09681 9.48254 5.2843 9.29505C5.4718 9.10755 5.72605 9.00213 5.99121 9.00195H6.99121V13.002H5.99121ZM8.33203 20.002H6.50781L8.65039 15.002H10.4746L8.33203 20.002ZM18.9912 15.5238C17.0195 13.8994 14.5459 13.0082 11.9912 13.0019H8.99121V9.0019H11.9912C14.5459 8.99537 17.0195 8.10406 18.9912 6.47956V15.5238Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgMegaphone);
export default __webpack_public_path__ + "static/media/megaphone.c65cdcbb.svg";
export { ForwardRef as ReactComponent };