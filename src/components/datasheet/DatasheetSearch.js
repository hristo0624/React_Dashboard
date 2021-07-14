import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import cmsConfig from '../../config/cmsConfig';
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Datalist from '../ui/Datalist';
import Item from '../ui/Item';


@inject("store")
@observer
export default class DatasheetSearch extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.store = props.store.appState;
		this.state = {
			dataListOptions: [],
			isValid: props.isValid,
			validityMessage: 'Eingabe darf nicht leer sein'
		}
	}

	async onChange(value){
		await this.getSearchResult(value);
		super.onChange(value);
	}

	async getSearchResult(query){
		if(query == '' || this.state.dataListOptions.findIndex((option)=>{return option.value == query || option.displayedValue == query}) != -1){
			this.setState({
				dataListOptions: []
			});
			return;
		}
		try {
			const response = await this.store.search(this.props.category, query);
			let result = [];
			if(response.status === 200){
				if(Array.isArray(response.data) == false){
					result = response.data._embedded[`${cmsConfig.api.version}${this.props.category}`];
				}
				let options = {};
				let value = null;
				result.forEach((resource)=>{
					value = this.DataHandler.getText(resource, this.props.config.searchKeys);
					options[value] = {
						value: value,
						displayedValue: value,
						label: null
					}
				});
				this.setState({
					dataListOptions: Object.values(options)
				});
			}
			return;
		} catch(error) {
			console.log(error);
			this.setState({
				dataListOptions: []
			});
		}		
	}	

	render() {
		const {value, className, isEditable} = this.props;
		const {label, key} = this.props.config;
		const placeholder = (this.props.config.optional) ? `${label} (optional)` : label;
		if(isEditable){
			return(
				<Item label={placeholder} isValid={this.state.isValid} validityMessage={this.state.validityMessage} optional={!this.props.config.optional}>
					<Datalist 
					options={this.state.dataListOptions} 
					listName={key} 
					onChange={(value)=>{this.onChange(value)}} 
					placeholder={placeholder} 
					value={value}
					isValid={this.state.isValid}
					autoFocus={this.props.config.autoFocus}
					/>
				</Item>
			)
		}
		else{
			return(
				<Item className={this.props.className} label={this.props.label}>
					<TextProperty label={label} value={value} />
				</Item>
			)
		}
	}
}