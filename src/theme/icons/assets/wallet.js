var _path

var _excluded = ['title', 'titleId']

function _extends() {
	_extends =
		Object.assign ||
		function (target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i]
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key]
					}
				}
			}
			return target
		}
	return _extends.apply(this, arguments)
}

function _objectWithoutProperties(source, excluded) {
	if (source == null) return {}
	var target = _objectWithoutPropertiesLoose(source, excluded)
	var key, i
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source)
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i]
			if (excluded.indexOf(key) >= 0) continue
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue
			target[key] = source[key]
		}
	}
	return target
}

function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {}
	var target = {}
	var sourceKeys = Object.keys(source)
	var key, i
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i]
		if (excluded.indexOf(key) >= 0) continue
		target[key] = source[key]
	}
	return target
}

import * as React from 'react'

function SvgWallet(_ref, svgRef) {
	var title = _ref.title,
		titleId = _ref.titleId,
		props = _objectWithoutProperties(_ref, _excluded)

	return /*#__PURE__*/ React.createElement(
		'svg',
		_extends(
			{
				width: 18,
				height: 16,
				viewBox: '0 0 18 16',
				fill: 'currentColor',
				xmlns: 'http://www.w3.org/2000/svg',
				ref: svgRef,
				'aria-labelledby': titleId,
			},
			props
		),
		title
			? /*#__PURE__*/ React.createElement(
					'title',
					{
						id: titleId,
					},
					title
			  )
			: null,
		_path ||
			(_path = /*#__PURE__*/ React.createElement('path', {
				d: 'M14.8337 3.83333L14.0003 3.83333V3C14.0003 2.33696 13.7369 1.70107 13.2681 1.23223C12.7993 0.763392 12.1634 0.5 11.5003 0.5L3.16699 0.5C2.50395 0.5 1.86807 0.763392 1.39923 1.23223C0.930384 1.70107 0.666992 2.33696 0.666992 3L0.666992 13C0.666992 13.663 0.930384 14.2989 1.39923 14.7678C1.86807 15.2366 2.50395 15.5 3.16699 15.5L14.8337 15.5C15.4967 15.5 16.1326 15.2366 16.6014 14.7678C17.0703 14.2989 17.3337 13.663 17.3337 13L17.3337 6.33333C17.3337 5.67029 17.0703 5.03441 16.6014 4.56557C16.1326 4.09673 15.4967 3.83333 14.8337 3.83333ZM3.16699 2.16667L11.5003 2.16667C11.7213 2.16667 11.9333 2.25446 12.0896 2.41074C12.2459 2.56702 12.3337 2.77899 12.3337 3V3.83333L3.16699 3.83333C2.94598 3.83333 2.73402 3.74554 2.57774 3.58926C2.42146 3.43298 2.33366 3.22101 2.33366 3C2.33366 2.77899 2.42146 2.56702 2.57774 2.41074C2.73402 2.25446 2.94598 2.16667 3.16699 2.16667ZM15.667 10.5H14.8337C14.6126 10.5 14.4007 10.4122 14.2444 10.2559C14.0881 10.0996 14.0003 9.88768 14.0003 9.66667C14.0003 9.44565 14.0881 9.23369 14.2444 9.07741C14.4007 8.92113 14.6126 8.83333 14.8337 8.83333H15.667V10.5ZM15.667 7.16667H14.8337C14.1706 7.16667 13.5347 7.43006 13.0659 7.8989C12.5971 8.36774 12.3337 9.00362 12.3337 9.66667C12.3337 10.3297 12.5971 10.9656 13.0659 11.4344C13.5347 11.9033 14.1706 12.1667 14.8337 12.1667H15.667V13C15.667 13.221 15.5792 13.433 15.4229 13.5893C15.2666 13.7455 15.0547 13.8333 14.8337 13.8333L3.16699 13.8333C2.94598 13.8333 2.73402 13.7455 2.57774 13.5893C2.42146 13.433 2.33366 13.221 2.33366 13L2.33366 5.35833C2.60138 5.45251 2.88319 5.50042 3.16699 5.5L14.8337 5.5C15.0547 5.5 15.2666 5.5878 15.4229 5.74408C15.5792 5.90036 15.667 6.11232 15.667 6.33333V7.16667Z',
				fill: 'currentColor',
			}))
	)
}

var ForwardRef = /*#__PURE__*/ React.forwardRef(SvgWallet)
export default __webpack_public_path__ + 'static/media/wallet.b3f2a87f.svg'
export { ForwardRef as ReactComponent }
