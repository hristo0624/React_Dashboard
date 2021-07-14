import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import cmsConfig from '../../config/cmsConfig';
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Datalist from '../ui/Datalist';
import Item from '../ui/Item';


@inject("store")
@observer
export default class DatasheetReference extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.store = props.store.appState;
		this.defaultValue = props.value;
		this.state = {
			dataListOptions: this.setInitialOptions(props.config),
			isValid: props.isValid,
			validityMessage: 'Eingabe darf nicht leer sein'
		}
		this.lastOption = [];
	}

	_removeLabelFromValue(value){
		return value.replace(/\s\[.*\]$/, '');
	}

	onBlur(event){
		try {
			const option = (this.lastOption.displayedValue == this._removeLabelFromValue(event.target.value)) ? this.lastOption.displayedValue : null;
			if(option){
				this.defaultValue = option.displayedValue
			}
			else{
				if(this.props.config.optional == null){
					this.resetInput(this.defaultValue);
					this.setState({dataListOptions: this.setInitialOptions(this.props.config)});
				}
				else{
					if(event.target.value != ''){
						this.resetInput(this.defaultValue);
						this.setState({dataListOptions: this.setInitialOptions(this.props.config)});
					}
				}
			}
		} catch(e) {
			this.resetInput(this.defaultValue);
			console.log(e);
		}
		
	}
	onFocus(event){
	}


	setInitialOptions(config){
		
		try {
			let options = {};
			let value = null;
			let categoryData = this.store.cmsData[config.apiCategory].data.slice(0);
			console.log("categoryData === ", this.store.cmsData[config.apiCategory].data.slice(0));
			if(config.additionalList){
				config.additionalList.list.forEach((listItem)=>{
					let index = categoryData.findIndex(data => data[config.additionalList.value] == listItem[config.additionalList.value]);
					if(index >= 0){
						categoryData.splice(index, 1);
					}
				})
			}
			if(config.currentList){
				config.currentList.forEach((list)=>{
					list.forEach((listItem)=>{
						const index = categoryData.findIndex(data => data[config.apiId] == listItem.id);
						if(index >= 0){
							categoryData.splice(index, 1);
						}
					})
				})
			}
			categoryData.forEach((resource)=>{
				// console.log("Resource === ", resource);
				if (this.store.userrole == 'owner_selfmanaged' && config.apiCategory == 'users') {
					if (resource.pers_id != this.store.userid)	{
						value = this.DataHandler.getText(resource, config.optionValues);
						options[resource[config.apiId]] = {
							value: resource[config.apiId],
							displayedValue: value,
							label: this.DataHandler.getText(resource, config.optionLableValues, true),
						}
					}
				} else {
					value = this.DataHandler.getText(resource, config.optionValues);
					options[resource[config.apiId]] = {
						value: resource[config.apiId],
						displayedValue: value,
						label: this.DataHandler.getText(resource, config.optionLableValues, true),
					}
				}
			})
			return Object.values(options);
		} catch(e) {
			return [];
		}
	}

	async onChange(value){
		if((value == '' || value.length == 1) && this.state.dataListOptions.length == 0){
			this.state = {
				dataListOptions: this.setInitialOptions(this.props.config)
			}
		}
		value = this._removeLabelFromValue(value);
		let option = this.state.dataListOptions.find((option)=>{return option.displayedValue == value});
		if(option == null){
			if(this.props.config.apiCategory == null){
				await this.getSearchResult(value);
			}			
			option = this.state.dataListOptions.find((option)=>{return option.displayedValue == value});
		}
		else{
			this.lastOption = option;
			this.setState({
				dataListOptions: []
			});
		}
		this.setState({
			value: value,
		});
		if(option){
			super.onChange(option.displayedValue, option.value);
		}
		if(this.props.config.optional && value == ''){
			super.onChange(null, null);
		}
	}

	async getSearchResult(query){
		try {
			const category = this.props.config.category;
			const response = await this.store.search(category, query);
			let result = [];
			if(response.status === 200){
				result = (Array.isArray(response.data) == false) ? response.data._embedded[`${cmsConfig.api.version}${category}`] : [];
				let options = {};
				let value = null;		
				result.forEach((resource) => {
					value = this.DataHandler.getText(resource, this.props.config.optionValues);
					options[resource[this.props.config.apiId]] = {
						value: resource[this.props.config.apiId],
						displayedValue: value,
						label: this.DataHandler.getText(resource, this.props.config.optionLableValues, true),
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

	componentWillReceiveProps(nextProps){
		this.state = {
			dataListOptions: this.setInitialOptions(nextProps.config)
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
						autoFocus={this.props.config.autoFocus}
						options={this.state.dataListOptions}
						listName={key}
						onChange={(value)=>{this.onChange(value)}}
						onBlur={(event)=>{this.onBlur(event)}}
						onFocus={(event)=>{this.onFocus(event)}}
						placeholder={placeholder}
						value={value}
						resetInput={resetInput => {this.resetInput = resetInput}}
						isValid={this.state.isValid}
						title={value}
						dataType='reference'
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