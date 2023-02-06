var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgSearch(_ref, svgRef) {
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
    d: "M21.71 20.2899L18 16.6099C19.4401 14.8143 20.1375 12.5352 19.9488 10.2412C19.7601 7.94721 18.6997 5.81269 16.9855 4.27655C15.2714 2.74041 13.0338 1.91941 10.7329 1.98237C8.43207 2.04534 6.24275 2.98747 4.61517 4.61505C2.98759 6.24263 2.04546 8.43194 1.9825 10.7328C1.91954 13.0337 2.74053 15.2713 4.27667 16.9854C5.81281 18.6996 7.94733 19.76 10.2413 19.9487C12.5353 20.1374 14.8144 19.44 16.61 17.9999L20.29 21.6799C20.383 21.7736 20.4936 21.848 20.6154 21.8988C20.7373 21.9496 20.868 21.9757 21 21.9757C21.132 21.9757 21.2627 21.9496 21.3846 21.8988C21.5065 21.848 21.6171 21.7736 21.71 21.6799C21.8903 21.4934 21.991 21.2442 21.991 20.9849C21.991 20.7256 21.8903 20.4764 21.71 20.2899V20.2899ZM11 17.9999C9.61556 17.9999 8.26218 17.5894 7.11103 16.8202C5.95989 16.051 5.06268 14.9578 4.53287 13.6787C4.00306 12.3996 3.86443 10.9921 4.13453 9.63427C4.40463 8.27641 5.07131 7.02912 6.05028 6.05016C7.02925 5.07119 8.27653 4.4045 9.63439 4.13441C10.9923 3.86431 12.3997 4.00293 13.6788 4.53275C14.9579 5.06256 16.0511 5.95977 16.8203 7.11091C17.5895 8.26206 18 9.61544 18 10.9999C18 12.8564 17.2625 14.6369 15.9498 15.9497C14.637 17.2624 12.8565 17.9999 11 17.9999V17.9999Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgSearch);
export default __webpack_public_path__ + "static/media/search.21878fa0.svg";
export { ForwardRef as ReactComponent };