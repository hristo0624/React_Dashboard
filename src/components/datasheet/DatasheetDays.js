import React, { Component } from "react";
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Input from '../ui/Input';
import Item from '../ui/Item';
import Checkbox from '../ui/Checkbox';

export default class DatasheetDays extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.days = this.props.value.slice(0);
		this.state = {
			isValid: props.isValid,
			validityMessage: 'Es muss mindestens ein Tag ausgewählt werden'
		}
	}

	sortDates(a,b){
		return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'case' });
	}

	sortDays(days){
		const order = { So: 1, Mo: 2, Di: 3, Mi: 4, Do: 5, Fr: 6, Sa: 7 };
		days.sort(function (a, b) {
			return order[a] - order[b];
		});
		return days;
	}

	onChange(value){
		value = this.props.config.values[value.index].value;
		const valueIndex = this.days.indexOf(value);
		if(valueIndex == -1){
			this.days.push(value);			
		}
		else{
			this.days.splice(valueIndex, 1);
		}
		let dates = [];
		let days = [];
		this.days.forEach((day)=>{
			if(day.match(/\d+/)){
				dates.push(day);
			}
			else{
				days.push(day);
			}
		})
		dates.sort(this.sortDates);
		days = this.sortDays(days);
		this.days = dates.concat(days);
		super.onChange(this.days)
	}

	render() {
		const {value, className, isEditable} = this.props;
		const {label, values} = this.props.config;
		const checkboxes = values.map((checkbox, index)=>{
			return <Checkbox value={(value.indexOf(checkbox.value) >= 0) ? checkbox.value : ''} onChange={(result)=>{this.onChange({value: result, index: index})}} key={index} text={checkbox.label} />
		})

		if(isEditable){
			return(
				<Item label={label} isValid={this.state.isValid} validityMessage={this.state.validityMessage}>
					<div className='datasheetdays'>
						{checkboxes}
					</div>
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