import React, { Component } from "react";
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Item from '../ui/Item';
import TextIcon from '../ui/TextIcon';

export default class DatasheetListElement extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.state = {
			isAddingNewElement: false,
			elementProperties: props.value
		}
	}

	validate(value, isValid = true){
		if(isValid == false){
			return false;
		}
		if(value == null || value == '' || value == []){
			return false
		}
		else{
			return true;
		}
	}

	onChange(value){
		const index = this.state.elementProperties.findIndex((element)=>{return element.key == value.key});
		let properties = this.state.elementProperties;
		properties[index] = value;
		properties[index].isValid = this.validate(value.value, value.isValid);
		this.props.onChange({
			value: properties, 
			index: this.props.index,
			isValid: properties[index].isValid
		});
	}

	removeListElement(){
		this.props.removeListElement(this.props.index);
	}

	render() {
		const {isEditable, index} = this.props;
		const {label} = this.props.config;

		const className = (isEditable) ? '' : 'datasheetlist-element';
		const RemoveElementButton = (isEditable) ? <div className='datasheetlist-element-remove'><div className='datasheetlist-element-icon-wrapper' onClick={()=>{this.removeListElement()}}><TextIcon icon='remove' /></div></div> : null;


		let isNotReference = false;
		const properties = this.state.elementProperties.map((entry, entryIndex)=>{
			isNotReference = (entry.type != 'reference') ? isEditable : false;
			return(
				<div className='datasheetlist-element-item' key={`${index}_${entryIndex}`}>
					{this.DataHandler.getComponent(entry.value, this.props.config.valueKeys[entryIndex], isNotReference, entry.category, (value)=>{this.onChange(value)}).component}
				</div>
			)
		});
		
		return(
			<div className={className} key={index}>
				{RemoveElementButton}
				{properties}
			</div>
		)
	}
}