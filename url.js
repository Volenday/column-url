import React, { memo, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import GenerateThumbnail from '@volenday/generate-thumbnail';
import Encode from '@volenday/encode';
import InputUrl from '@volenday/input-url';
import { Controller, useForm } from 'react-hook-form';
import { Button, Modal } from 'antd';

const getValue = (fields, data) => {
	fields = fields.split('.');

	if (fields.length == 1) {
		return data[fields[0]];
	} else {
		let newFields = [...fields];
		newFields = newFields.reverse();

		let value = data[newFields.pop()];
		if (value) {
			while (newFields.length != 0) {
				value = value[newFields.pop()];
			}
			return value;
		} else {
			return '';
		}
	}
};

const Url = memo(
	({ other: { authentication, editable, id, multiple = false, onChange, styles }, row: { original }, value }) => {
		if (typeof value === 'undefined') return null;

		const [playbackRate, setPlayBackRate] = useState(1);
		const [visible, setVisible] = useState(false);

		const { control, handleSubmit } = useForm({ defaultValues: { [id]: value } });

		const formRef = useRef();

		const submit = data => onChange({ ...data, Id: data.Id });

		const { password = '', passwordField = '', username = '', usernameField = '' } = authentication;
		const originalValue = value;

		const fileValue = GenerateThumbnail(value);

		if (fileValue.type == 'video') {
			const streamUrl = 'https://streamer.aha.volenday.com/';
			let videoUrl = value;
			if (username != '' && password != '') {
				videoUrl = `${streamUrl}?url=${encodeURIComponent(value)}&username=${Encode(
					username
				)}&password=${Encode(password)}`;
			} else if (usernameField && passwordField) {
				videoUrl = `${streamUrl}?url=${encodeURIComponent(value)}&username=${Encode(
					getValue(usernameField, original)
				)}&password=${Encode(getValue(passwordField, original))}`;
			}

			return (
				<>
					{editable && !multiple && (
						<form onSubmit={handleSubmit(submit)} ref={formRef} style={styles}>
							<Controller
								control={control}
								name={id}
								render={({ name, onChange, value }) => (
									<InputUrl
										id={name}
										onBlur={() =>
											originalValue !== value &&
											formRef.current.dispatchEvent(new Event('submit', { cancelable: true }))
										}
										onChange={e => onChange(e.target.value)}
										onPressEnter={e => e.target.blur()}
										value={value}
										withLabel={false}
									/>
								)}
							/>
							<Button style={{ width: '10%' }} onClick={() => setVisible(true)}>
								<i style={{ marginLeft: '-5px' }} class="fas fa-link"></i>
							</Button>
						</form>
					)}

					{!editable && multiple && (
						<>
							{value.split(',').map((d, i) => (
								<a href={d} key={`${d}-${i}`} style={{ display: 'block' }} target="_blank">
									{d}
								</a>
							))}
						</>
					)}

					{!editable && !multiple && (
						<a
							href={value}
							onClick={e => {
								e.preventDefault();
								setVisible(true);
							}}>
							{value}
						</a>
					)}

					{visible && (
						<Modal
							centered
							footer={null}
							title={value}
							visible={visible}
							onOk={() => setVisible(false)}
							onCancel={() => setVisible(false)}
							width="80vw">
							<div class="row">
								<div class="col-md-9 col-sm-9 col-xs-12">
									<ReactPlayer
										controls={true}
										url={videoUrl}
										height="100%"
										width="100%"
										playbackRate={playbackRate}
										playing={true}
									/>
								</div>
								<div class="col-md-3 col-sm-3 col-xs-12">
									<div class="form-group">
										<label>URL</label>
										<br />
										<a href={value} target="_blank">
											{value}
										</a>
									</div>

									<div class="form-group">
										<label>Speed</label>
										<br />
										<div class="btn-group" role="group">
											<button
												type="button"
												class={`btn ${playbackRate == 0.5 ? 'btn-primary' : 'btn-default'}`}
												onClick={() => setPlayBackRate(0.5)}>
												0.5
											</button>
											<button
												type="button"
												class={`btn ${playbackRate == 1 ? 'btn-primary' : 'btn-default'}`}
												onClick={() => setPlayBackRate(1)}>
												1
											</button>
											<button
												type="button"
												class={`btn ${playbackRate == 1.5 ? 'btn-primary' : 'btn-default'}`}
												onClick={() => setPlayBackRate(1.5)}>
												1.5
											</button>
											<button
												type="button"
												class={`btn ${playbackRate == 2 ? 'btn-primary' : 'btn-default'}`}
												onClick={() => setPlayBackRate(2)}>
												2
											</button>
										</div>
									</div>
								</div>
							</div>
						</Modal>
					)}
				</>
			);
		}
	}
);

export default Url;
