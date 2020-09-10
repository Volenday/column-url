import React, { memo, Suspense, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Skeleton } from 'antd';
import InputUrl from '@volenday/input-url';

import Url from './url';

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
		Cell: props => (
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
		),
		Filter: props => (
			<Suspense fallback={<Skeleton active={true} paragraph={null} />}>
				<Filter {...props} />
			</Suspense>
		)
	};
};

const Filter = memo(({ column: { filterValue, setFilter } }) => {
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
