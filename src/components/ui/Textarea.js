import React, { Component } from "react";
import TextIcon from "./TextIcon";

export default class Textarea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			className: ''
		}
		if(props.resetInput){
			props.resetInput((value)=>{this.resetInput(value)})
		}
	}

	onFocus(event){
		this.setState({
			className: 'no-drag'
		});
		if(this.props.onFocus){
			this.props.onFocus(event);
		}
	}

	onBlur(event){
		this.setState({
			className: ''
		});
		if(this.props.onBlur){
			this.props.onBlur(event);
		}
	}

	onChange(event){
		const value = event.target.value;
		this.setState({
			value: value
		})
		this.props.onChange(value);
	}

	resetInput(value){
		this.setState({
			value: value
		})
	}

	render() {
		const isValid = (this.props.isValid != null) ? this.props.isValid : true;
		return (
			<textarea
				autoFocus={this.props.autoFocus}
				list={(this.props.list) ? this.props.list : null}
				value={this.state.value}
				placeholder={this.props.placeholder}
				onChange={(event)=>{this.onChange(event)}}
				onBlur={(event)=>{this.onBlur(event)}}
				onFocus={(event)=>{this.onFocus(event)}}
				className={`textarea ${(isValid) ? '' : 'mod-invalid'} ${this.state.className}`}
			>
			</textarea>
		);
	}
}