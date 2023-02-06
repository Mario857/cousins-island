var _path;

var _excluded = ["title", "titleId"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import * as React from "react";

function SvgTelegram(_ref, svgRef) {
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
    d: "M11.9943 2C10.0165 2 8.0831 2.58649 6.43861 3.6853C4.79412 4.78412 3.51239 6.3459 2.75552 8.17317C1.99864 10.0004 1.80061 12.0111 2.18646 13.9509C2.57231 15.8907 3.52472 17.6725 4.92325 19.0711C6.32177 20.4696 8.1036 21.422 10.0434 21.8079C11.9832 22.1937 13.9939 21.9957 15.8211 21.2388C17.6484 20.4819 19.2102 19.2002 20.309 17.5557C21.4078 15.9112 21.9943 13.9778 21.9943 12C21.9944 10.6868 21.7358 9.38634 21.2333 8.17304C20.7308 6.95973 19.9942 5.8573 19.0656 4.92869C18.137 4.00008 17.0346 3.26349 15.8213 2.76098C14.608 2.25847 13.3076 1.99989 11.9943 2ZM15.1738 17.1525C15.1364 17.2458 15.0794 17.33 15.0068 17.3996C14.9341 17.4691 14.8475 17.5223 14.7526 17.5556C14.6577 17.5889 14.5568 17.6015 14.4566 17.5926C14.3565 17.5837 14.2594 17.5535 14.1718 17.504L11.4572 15.3946L9.71483 17.002C9.67441 17.0319 9.62711 17.0511 9.57731 17.0579C9.52751 17.0647 9.47679 17.0589 9.42983 17.0409L9.76383 14.0525L9.77452 14.061L9.78135 14.002C9.78135 14.002 14.6664 9.55445 14.8654 9.36496C15.0668 9.17596 15.0004 9.13496 15.0004 9.13496C15.0118 8.90443 14.6388 9.13496 14.6388 9.13496L8.16631 13.299L5.47082 12.381C5.47082 12.381 5.05682 12.2325 5.01782 11.906C4.97682 11.582 5.48431 11.406 5.48431 11.406L16.2013 7.14849C16.2013 7.14849 17.0823 6.75597 17.0823 7.406L15.1738 17.1525Z",
    fill: "currentColor"
  })));
}

var ForwardRef = /*#__PURE__*/React.forwardRef(SvgTelegram);
export default __webpack_public_path__ + "static/media/telegram.da90280c.svg";
export { ForwardRef as ReactComponent };