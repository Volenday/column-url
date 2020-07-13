import React from 'react';
import { Formik } from 'formik';
import InputUrl from '@volenday/input-url';

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
		style: { ...style, display: multiple ? 'block' : 'flex', alignItems: 'center' },
		headerStyle: { ...headerStyle, display: 'flex', alignItems: 'center' },
		Cell: ({ original, value }) => {
			if (typeof value == 'undefined') return null;

			return <Url {...props} authentication={authentication} data={original} multiple={multiple} value={value} />;
		},
		Filter: ({ filter, onChange }) => {
			let timeout = null;

			return (
				<Formik
					enableReinitialize={true}
					initialValues={{ filter: filter ? filter.value : '' }}
					onSubmit={values => onChange(values.filter)}
					validateOnBlur={false}
					validateOnChange={false}>
					{({ handleChange, submitForm, values }) => (
						<InputUrl
							id="filter"
							onChange={e => {
								handleChange(e);
								if (values.filter != '' && e.target.value == '') {
									submitForm(e);
								} else {
									timeout && clearTimeout(timeout);
									timeout = setTimeout(() => submitForm(e), 300);
								}
							}}
							onPressEnter={submitForm}
							placeholder="Search..."
							withLabel={false}
							value={values.filter}
						/>
					)}
				</Formik>
			);
		}
	};
};
