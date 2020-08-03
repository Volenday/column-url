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
		id,
		multiple = false,
		onChange,
		...defaultProps
	} = props;

	return {
		...defaultProps,
		Cell: ({ row: { original }, value }) => {
			if (typeof value === 'undefined') return null;

			return <Url {...props} authentication={authentication} data={original} multiple={multiple} value={value} />;
		},
		Filter: ({ column: { filterValue, setFilter } }) => {
			let timeout = null;

			return (
				<Formik
					enableReinitialize={true}
					initialValues={{ filter: filterValue ? filterValue : '' }}
					onSubmit={values => setFilter(values.filter === '' ? values.filter : new RegExp(values.filter))}
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
							value={typeof values.filter.source !== 'undefined' ? values.filter.source : values.filter}
						/>
					)}
				</Formik>
			);
		}
	};
};
