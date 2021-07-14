import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import cmsConfig from '../../config/cmsConfig';
import categoriesConfig from '../../config/categoriesConfig';
import DataHandler from '../utils/DataHandler';
import Section from "./Section";
import Button from "../ui/Button";
import Loader from "../ui/Loader";

@inject("store")
@observer
export default class Datasheet extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store.appState;
		this.schema = categoriesConfig[props.category].datasheet.schema.slice(0);
		this.isEditable = (props.userrole == 'admin' || props.userrole == 'manager' || props.userrole == 'owner_selfmanaged');
		this.datasheet = this.initializeDatasheet(this.schema, props.data, this.isEditable, props.category);
		this.state = {
			datasheet: this.datasheet,
			isDatasheetValid: (props.id) ? true : false,
			isSaving: false
		}
		this.store.setDatasheet({
			datasheet: this.datasheet,
			id: props.id,
			category: props.category,
		});
	}

	initializeDatasheet(schema, data, isEditable, category){
		console.log("DataSheet Props Data === ", data);
		let datasheet = {};
		schema.forEach((section, sectionIndex)=>{
			section.properties.forEach((property, propertyIndex)=>{
				let propertyMutable = Object.assign({}, property);
				propertyMutable.autoFocus = (sectionIndex === 0 && propertyIndex === 0) ? true : false;
				
				if(propertyMutable.type == 'list' && propertyMutable.additionalList){
					propertyMutable.setAdditonalList = setAdditonalList => {this.setAdditonalList = setAdditonalList}
				}
				if (propertyMutable.key === 'pers_scope' && this.store.userrole != 'admin'){
					if (data && this.store.username == data.pers_username) {
						propertyMutable.values = propertyMutable.values.slice(1);
					}
					if(this.store.userrole == 'owner_selfmanaged') {
						propertyMutable.values = propertyMutable.values.slice(2, 3);
						propertyMutable.additionExist = false;
					}
					else {
						propertyMutable.values = propertyMutable.values.slice(2);
					}
				}
				if (propertyMutable.key == 'elev_barcode') {
					datasheet[propertyMutable.key] = DataHandler.getComponent(data, propertyMutable, propertyMutable.isEditable, category, (value)=>{this.onChange(value)}, this.props.id)	
				} else {
					datasheet[propertyMutable.key] = DataHandler.getComponent(data, propertyMutable, this.isEditable, category, (value)=>{this.onChange(value)}, this.props.id)
				}
				
			})
		});
		return datasheet;
	}

	onChange(value){
		this.datasheet[value.key].value = value.value;
		this.datasheet[value.key].isValid = value.isValid;
		this.datasheet[value.key].isEdited = value.isEdited;
		if (value.additionValue) {
			this.datasheet[value.key].additionValue = value.additionValue;
			this.datasheet[value.key].additionValueKeys = value.additionValueKeys.slice(0);
		}
		if(value.id){
			this.datasheet[value.key].id = value.id;
		}
		this.validateDatasheet();
		console.log("Datasheet Change ==== ", this.datasheet[value.key].isValid);
		if(value.type == 'reference'){
			this.setAdditonalList(value);
		}
	}

	getDatasheetValue(element){
		
		let type = (element.hasOwnProperty('config')) ? element.config.type : element.type;
		let key = (element.hasOwnProperty('config')) ? element.config.key : element.key;
		let valueKeys = (element.hasOwnProperty('config')) ? element.config.valueKeys : element.valueKeys;
		let resultObjectPath = (type != 'reference') ? valueKeys[0] : key;
		let datasheetValue = (type != 'reference') ? element.value : element.id;
		if(type === 'report'){
			return null;
		}
		if (type == 'point') {
			let resultValue = Object.assign({}, {});
			resultValue[key] = datasheetValue;
			return resultValue;
		}
		if(type != 'list'){
			resultObjectPath = (type != 'reference') ? valueKeys[0] : key;
			datasheetValue = DataHandler.createResultObject(datasheetValue, resultObjectPath);
			
		}
		else{
			let list = {};
			list[key] = [];
			element.value.forEach((elementItem)=>{
				let listElement = {};
				elementItem.forEach((listElementProperty)=>{
					resultObjectPath = (listElementProperty.type != 'reference') ? listElementProperty.valueKeys[0] : listElementProperty.key;
					let property = this.getDatasheetValue(listElementProperty, resultObjectPath);
					listElement[resultObjectPath] = property[resultObjectPath];
				});
				list[key].push(listElement);
			});
			datasheetValue = list;
		}
		return datasheetValue;
	}

	createFinalDatasheet(){
		let datasheet = {};
		let finalDatasheet = {};
		let datasheetValue = null;
		let editedElements = {};
		
		Object.values(this.datasheet).forEach((element)=>{
			datasheetValue = this.getDatasheetValue(element);
			if(datasheetValue != null){
				for(let key in datasheetValue){
					if(element.isEdited){
						editedElements[key] = key;
					}
					if(key in datasheet){
						Object.assign(datasheet[key], datasheetValue[key]);
					}
					else{
						datasheet[key] = datasheetValue[key];
					}

					if (element.isEdited && element.additionValue) {
						element.additionValueKeys.forEach(key => {
							editedElements[key] = key;
						})
					}
				}
			}
			
			if (element.additionValue) {
				for (let key in element.additionValue) {
					datasheet[key] = element.additionValue[key];
				}
			}
		});

		if(this.props.id){
			for(let key in editedElements){
				datasheet[key] = (datasheet[key] !== undefined) ? datasheet[key] : null;
				finalDatasheet[key] = datasheet[key];
			}
		}
		else{
			finalDatasheet =datasheet
		}

		if (this.store.userrole == 'owner_selfmanaged' && this.props.category == 'estates') {
			finalDatasheet['esta_stakeholders'] = [
				{
					pers_id: this.store.userid
				}
			]
		}
		return finalDatasheet;
	}

	validateDatasheet(){
		for(let key in this.datasheet){
			if(this.datasheet[key].isValid == false || this.datasheet[key].isValid == null){
				if(this.datasheet[key].config.hasOwnProperty('optional') == false || this.datasheet[key].config.type == 'password' && this.props.id == null){
					this.setState({
						isDatasheetValid: false
					});
					return false;
				}
			}
		}
		this.setState({
			isDatasheetValid: true
		});
		return true;
	}

	async closeWithSaving(){
		const dialog = window.confirm(cmsConfig.alerts.saveAndClose.message);
		if(dialog){
			this.setState({
				isSaving: true
			});
			const datasheet = this.createFinalDatasheet();
			this.store.setDatasheet({
				datasheet: datasheet,
				id: this.props.id,
				category: this.props.category
			});
			await this.store.updateApiRessource(this.props.category, this.props.dataIndex)
			.then(result => {
				if (this.store.userrole == 'owner_selfmanaged' && result.method == 'post') {
					let createdIndex = '';
					let limitedIndex = '';
					if (this.props.category == 'users') {
						createdIndex = 'pers_created';
						limitedIndex = 'pers_limit';
					} else if (this.props.category == 'elevators') {
						createdIndex = 'elev_created';
						limitedIndex = 'elev_limit';
					} else if (this.props.category == 'estates') {
						createdIndex = 'esta_created';
						limitedIndex = 'esta_limit';
					}
					let createdValue = this.store.limitData.get(createdIndex);
					let limitValue = this.store.limitData.get(limitedIndex);
					if (limitValue && createdValue < limitValue) {
						this.store.updateLimitData(createdIndex, true);
					}
				}
				if (this.props.category == 'users') {
					location.reload();
				}
				return result;
			});
			this.props.closeDatasheet();
		}
	}

	closeWithoutSaving(){
		const dialog = window.confirm(cmsConfig.alerts.discardAndClose.message);
		if(dialog){
			this.props.closeDatasheet();
		}
	}

	componentDidMount(){
		this.validateDatasheet();
		
	}

	render() {
		const {data, id, category, header} = this.props;
		const sections = this.schema.map((section)=>{
			const sectionElements = section.properties.map((property)=>{
					return this.state.datasheet[property.key].component;
			});
			if (section.section.key == 'stakeholders' && this.store.userrole == 'owner_selfmanaged') {
				return null;
			}
			return(
				// <Section key={section.section.key + this.state.random} label={section.section.label}>
				<Section key={section.section.key} label={section.section.label}>
					{sectionElements}
				</Section>
			)
		});

		let SaveButton = (this.state.isDatasheetValid) ? <Button classes='mod-save' onClick={()=>{this.closeWithSaving()}} icon="save" title={`Bearbeitung abschließen`} /> : <h5>Füllen Sie alle Eingabefelder aus.</h5>;
		if (this.store.userrole == 'owner' || this.store.userrole == 'inspector') {
			SaveButton = null;
		}
		const loadingScreen = (this.state.isSaving) ? <Loader text='Daten werden gespeichert' /> : null;

		return (
			<div className="datasheet">
				<div className="datasheet-menu">
					<Button onClick={()=>{this.closeWithoutSaving()}} icon="close" title={`Bearbeitung beenden`} />
					{SaveButton}
				</div>
				<div className="datasheet-list">
					{sections}
				</div>
				{loadingScreen}
			</div>
		);
	}
}

