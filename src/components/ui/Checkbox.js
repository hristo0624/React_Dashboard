import React, { Component } from "react";
import TextIcon from "./TextIcon";

export default class Checkbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			fullShow: false
		}
		this.id = this.generateRandomKey(props.id);
	}

	generateRandomKey(propId){
		if (propId)
		 return propId;
		else 
			return `checkbox_${Math.floor(Math.random()*Date.now())}`;
	}

	onChange(event){
		const value = this.state.value ? false : true;
		if (this.props.mode != 'point') {
			this.setState({
				value: value
			})
		} 
		// console.log("CheckBox Change ID === ", this.props.id);
		// else {
		// 	this.setState({
		// 		value: !event.target.value
		// 	})
		// }
		this.props.onChange(value);
	}

	onMouseEnter = () => {
		this.setState({fullShow: true});
	}

	onMouseLeave = () => {
		this.setState({fullShow: false});
	}

	render() {
		const isChecked = (this.state.value && this.state.value != false) ? 'checked' : '';
		const description = (this.props.description) ? this.props.description : '';
		let Icon = null;
		if(this.props.text){
			Icon = (this.state.value) ? <span className='checkbox-overlay-text'>{this.props.text}</span> : <span className='checkbox-overlay-text'>{this.props.text}</span>;
		}
		else{
			Icon = (this.state.value && this.state.value != false) ? <TextIcon icon='check' /> : null;
		}

		const {mode, prehidden} = this.props;
		
		const addItem = prehidden == false ? <span>&nbsp;≡&nbsp;</span> : <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;

		return (
			<div className={this.state.fullShow == false ? 'checkbox' : 'checkbox-full'} onMouseEnter={() => {this.onMouseEnter()}} onMouseLeave={() => {this.onMouseLeave()}}>
				{mode == 'point' ? addItem : null }
				<input id={this.id} type='checkbox' className='checkbox-input' value={this.state.value} checked={isChecked} onChange={(event)=>{this.onChange(event)}} />
				<label htmlFor={this.id} className='checkbox-description'><span className='checkbox-overlay'>{Icon}</span><span>{description}</span></label>
			</div>
		);
	}
}