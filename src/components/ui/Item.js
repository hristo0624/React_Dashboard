import React, { Component } from "react";


export default class Item extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {optional} = this.props;
		let isValid = (this.props.isValid == null) ? true : this.props.isValid;
		const validityMessage = (isValid == false) ? <span className="item-label-validity">{this.props.validityMessage}</span> : null;
		const isRequired = optional ? <span className="item-label-validity">*</span> : null
		return (
			<div title={this.props.title} className={`item ${this.props.className ? this.props.className : ''} ${isValid ? '' : 'mod-invalid'}`}>
				<label className="item-label">
					<span>{this.props.label}</span>
					{isRequired}
					{validityMessage}
				</label>
				{this.props.children}
			</div>
		);
	}
}

