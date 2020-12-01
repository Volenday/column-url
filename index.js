import React, { memo, Suspense, useRef } from 'react';
import { Skeleton } from 'antd';

import Url from './url';

const browser = typeof process.browser !== 'undefined' ? process.browser : true;

export default ({
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
}) => {
	return {
		...defaultProps,
		Cell: props =>
			browser ? (
				<Suspense fallback={<Skeleton active={true} paragraph={null} />}>
					<Url
						{...props}
						other={{
							authentication,
							editable,
							id,
							multiple: false,
							onChange,
							styles: { minWidth: '90%', width: '90%' }
						}}
					/>
				</Suspense>
			) : null,
		Filter: props =>
			browser ? (
				<Suspense fallback={<Skeleton active={true} paragraph={null} />}>
					<Filter {...props} />s
				</Suspense>
			) : null
	};
};

const Filter = memo(({ column: { filterValue, setFilter } }) => {
	const InputUrl = require('@volenday/input-url').default;
	const { Controller, useForm } = require('react-hook-form');
	const { control, handleSubmit } = useForm({ defaultValues: { filter: filterValue ? filterValue : '' } });

	const submit = data => setFilter(data.filter);

	const formRef = useRef();

	let timeout = null;

	return (
		<form onSubmit={handleSubmit(submit)} ref={formRef}>
			<Controller
				control={control}
				name="filter"
				render={({ name, onChange, value }) => (
					<InputUrl
						id={name}
						onChange={e => {
							onChange(e.target.value);

							if (value !== '' && e.target.value === '') {
								formRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
							} else {
								timeout && clearTimeout(timeout);
								timeout = setTimeout(
									() => formRef.current.dispatchEvent(new Event('submit', { cancelable: true })),
									300
								);
							}
						}}
						onPressEnter={() => formRef.current.dispatchEvent(new Event('submit', { cancelable: true }))}
						placeholder="Search..."
						value={value}
						withLabel={false}
					/>
				)}
			/>
		</form>
	);
});
