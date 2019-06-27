import react from 'react';

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
		onChange,
		onChangeText,
		style = {},
		...defaultProps
	} = props;

	return {
		...defaultProps,
		filterable: false,
		style: { ...style, display: 'flex', alignItems: 'center' },
		headerStyle: { ...headerStyle, display: 'flex', alignItems: 'center' },
		Cell: ({ index, original, value }) => (
			<Url {...props} authentication={authentication} data={original} index={index} value={value} />
		)
	};
};
