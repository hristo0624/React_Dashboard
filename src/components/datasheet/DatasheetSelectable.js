import React, { Component } from "react";
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Input from '../ui/Input';
import Item from '../ui/Item';
import Select from '../ui/Select';

export default class DatasheetSelectable extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.value = null;
		console.log("DataSheetSelectable ==== ", props.config);
		this.values = props.config.values.map((data)=>data.label);
		this.additionShowString = ''
		
		if (props.config.additionExist == true) {
			this.additionShowString = props.config.values.find((option) => {
				return option.additions && option.additions.length > 0;
			}).label;
		}

		this.additions = [];
		if (props.config.additionExist == true && props.config.additionShowValue != '') {
			this.additions = props.config.values.find((option) => {
				return option.value == props.config.additionShowValue && option.additions;
			}).additions
		}

		this.state = {
			mainValue: ''
		}
	}

	onChange(value){
		value = this.props.config.values.find((option)=>{return option.label == value || option.value == value}).value;
		this.setState({mainValue: value});
		super.onChange(value);
	}

	_additionChange = (id, value, valid) => {
		let initalValue = this.props.additionValue;
		if (value == undefined || value == null) {
			initalValue[id] = 0;
		} else {
			initalValue[id] = value;
		}

		super.onChange(this.state.mainValue, null, initalValue, true, valid);
	}

	onBlur(value){
	}

	componentDidMount() {
		const {value} = this.props;
		if (value) {
			let initalValue = this.props.config.values.find((option)=>{return option.label == value || option.value == value }).value;
			this.setState({mainValue: initalValue});
		}
	}

	render() {
		const {value, className, isEditable, additionValue} = this.props;
		const {placeholder, label, values, key} = this.props.config;
		if(isEditable){
			return(
				<Item label={label} optional={!this.props.config.optional}>
					<Select
						autoFocus={this.props.config.autoFocus}
						onBlur={(value)=>{this.onBlur(value)}} 
						options={this.values} 
						listName={key} 
						onChange={(value)=>{this.onChange(value)}} 
						placeholder={placeholder} 
						value={value} 
						additionShowValue={this.additionShowString}
						additionChange={this._additionChange}
						additions={this.additions}
						additionValue={additionValue}
					/>
				</Item>
			)
		}
		else{
			return(
				<Item className={this.props.className} label={label}>
					<TextProperty label={label} value={value} />
				</Item>
			)
		}
	}
}