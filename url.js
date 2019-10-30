import React, { Component, Fragment } from 'react';
import ReactPlayer from 'react-player';
import GenerateThumbnail from '@volenday/generate-thumbnail';
import Encode from '@volenday/encode';
import InputUrl from '@volenday/input-url';
import { Formik } from 'formik';

import { Button, Modal } from 'antd';
import 'antd/es/button/style/css';
import 'antd/es/modal/style/css';

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

export default class Url extends Component {
	state = {
		playbackRate: 1,
		visible: false
	};

	render() {
		const { playbackRate, visible } = this.state;
		const { authentication, editable, data, id, multiple = false, onChange, value } = this.props;
		const { username = '', password = '', usernameField = '', passwordField = '' } = authentication;

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
					getValue(usernameField, data)
				)}&password=${Encode(getValue(passwordField, data))}`;
			}

			return (
				<Fragment>
					{editable && !multiple && (
						<Formik
							initialValues={{ [id]: value }}
							onSubmit={values => onChange({ ...values, Id: data.Id })}
							validateOnBlur={false}
							validateOnChange={false}>
							{({ handleChange, submitForm, values }) => (
								<Fragment>
									<InputUrl
										id={id}
										onBlur={submitForm}
										onChange={handleChange}
										onPressEnter={e => {
											submitForm(e);
											e.target.blur();
										}}
										styles={{ minWidth: '90%', width: '90%' }}
										withLabel={false}
										value={values[id]}
									/>
									<Button style={{ width: '10%' }} onClick={() => this.setState({ visible: true })}>
										<i style={{ marginLeft: '-5px' }} class="fas fa-link"></i>
									</Button>
								</Fragment>
							)}
						</Formik>
					)}

					{!editable && multiple && (
						<Fragment>
							{value.split(',').map((d, i) => (
								<a href={d} key={`${d}-${i}`} style={{ display: 'block' }} target="_blank">
									{d}
								</a>
							))}
						</Fragment>
					)}

					{!editable && !multiple && (
						<a
							href={value}
							onClick={e => {
								e.preventDefault();
								this.setState({ visible: true });
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
							onOk={() => this.setState({ visible: false })}
							onCancel={() => this.setState({ visible: false })}
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
												onClick={() => this.setState({ playbackRate: 0.5 })}>
												0.5
											</button>
											<button
												type="button"
												class={`btn ${playbackRate == 1 ? 'btn-primary' : 'btn-default'}`}
												onClick={() => this.setState({ playbackRate: 1 })}>
												1
											</button>
											<button
												type="button"
												class={`btn ${playbackRate == 1.5 ? 'btn-primary' : 'btn-default'}`}
												onClick={() => this.setState({ playbackRate: 1.5 })}>
												1.5
											</button>
											<button
												type="button"
												class={`btn ${playbackRate == 2 ? 'btn-primary' : 'btn-default'}`}
												onClick={() => this.setState({ playbackRate: 2 })}>
												2
											</button>
										</div>
									</div>
								</div>
							</div>
						</Modal>
					)}
				</Fragment>
			);
		}

		if (editable && !multiple) {
			return (
				<Formik
					initialValues={{ [id]: value }}
					onSubmit={values => onChange({ ...values, Id: data.Id })}
					validateOnBlur={false}
					validateOnChange={false}>
					{({ handleChange, submitForm, values }) => (
						<Fragment>
							<InputUrl
								id={id}
								onBlur={submitForm}
								onChange={handleChange}
								onPressEnter={e => {
									submitForm(e);
									e.target.blur();
								}}
								styles={{ minWidth: '90%', width: '90%' }}
								withLabel={false}
								value={values[id]}
							/>
							<Button href={values[id]} style={{ width: '10%' }} target="_blank">
								<i style={{ marginLeft: '-5px' }} class="fas fa-link"></i>
							</Button>
						</Fragment>
					)}
				</Formik>
			);
		}

		if (multiple) {
			return (
				<Fragment>
					{value && value.length
						? value.split(',').map((d, i) => (
								<a href={d} key={`${d}-${i}`} style={{ display: 'block' }} target="_blank">
									{d}
								</a>
						  ))
						: ''}
				</Fragment>
			);
		}

		return (
			<a href={value} target="_blank">
				{value}
			</a>
		);
	}
}
