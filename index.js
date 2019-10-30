import React from 'react';

import Url from './url';

export default props => {
	const {
		authentication = {
			username: '',
			password: '',
			usernameField: null,
			passwordField: null
		},
		editable = false,
		headerStyle = {},
		id,
		multiple = false,
		onChange,
		onChangeText,
		style = {},
		...defaultProps
	} = props;

	return {
		...defaultProps,
		filterable: false,
		style: { ...style, display: multiple ? 'block' : 'flex', alignItems: 'center' },
		headerStyle: { ...headerStyle, display: 'flex', alignItems: 'center' },
		Cell: ({ original, value }) => {
			if (typeof value == 'undefined') return null;

			return <Url {...props} authentication={authentication} data={original} multiple={multiple} value={value} />;
		}
	};
};
