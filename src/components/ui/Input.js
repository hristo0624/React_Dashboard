import React, { Component } from "react";
import TextIcon from "./TextIcon";

export default class Input extends Component {
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

	_removeLabelFromValue(value){
		return value.replace(/\s\[.*\]$/, '');
	}

	onChange(event){
		let value = event.target.value;
		if(this.props.dataType == 'reference'){
			value = this._removeLabelFromValue(value)
		}
		this.setState({
			value: value
		})
		this.props.onChange(value);
	}

	resetInput(value){
		value = (value != null) ? value : '';
		this.setState({
			value: value
		})
	}

	render() {
		const isValid = (this.props.isValid != null) ? this.props.isValid : true;
		const InputIcon = (this.props.inputIcon) ? <span className="input-icon"><TextIcon icon={this.props.inputIcon} /></span> : null;
		return (
			<div className='input-wrapper'>
				<input
					list={(this.props.list) ? this.props.list : null}
					type={this.props.type}
					className={`input ${(isValid) ? '' : 'mod-invalid'} ${(InputIcon) ? 'mod-icon' : ''} ${this.state.className}`}
					value={this.state.value}
					placeholder={this.props.placeholder}
					onChange={(event)=>{this.onChange(event)}}
					onBlur={(event)=>{this.onBlur(event)}}
					onFocus={(event)=>{this.onFocus(event)}}
					autoFocus={this.props.autoFocus}
					title={this.props.title}
				/>
				{InputIcon}
			</div>
		);
	}
}