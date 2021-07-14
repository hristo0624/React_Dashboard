import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { computed, autorun } from 'mobx';
import cmsConfig from '../../config/cmsConfig';
import categoriesConfig from '../../config/categoriesConfig';

import Button from "../ui/Button";
import Datasheet from "../datasheet/Datasheet";
import Search from "./Search";
import InfoCard from "./InfoCard";
import Loader from "../ui/Loader";
import strings from "../../config/localization";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

@inject("store")
@observer
export default class Category extends Component {
	constructor(props) {
		super(props);
		this.store = this.store = this.props.store.appState;
		this.state = {
			searchResult: null,
			searchQuery: null,
			datasheet: null,
			isSaving: false,
		}
	}

	// @computed get limitData() {
	// 	return this.props.store.appState.limitData;
	// }

	// @computed get testData() {
	// 	return this.props.store.appState.testData;
	// }

	getInfoCard(category, data, index){
		return <InfoCard 
					id={data[categoriesConfig[category].apiId]}
					prefix={categoriesConfig[category].prefix}
					category={category}
					data={data}
					properties={categoriesConfig[category].info.properties}
					edit={(category, id)=>{this.editRessource(category, id)}}
					delete={(category, id, index)=>{this.deleteRessource(category, id, index)}}
					userrole={this.props.userrole}
					index={index}
				/>
	}

	getSearchResult(response){
		this.setState({searchResult: response});
	}

	addNewRessource(category){
		
		if (this.store.userrole == 'owner_selfmanaged') {
			console.log("Limit Data === ", this.store.limitData.get(this.props.prefix + '_limit'), this.store.limitData.get(this.props.prefix + '_created'))
			let limitValue = this.store.limitData.get(this.props.prefix + '_limit');
			let createdValue = this.store.limitData.get(this.props.prefix + '_created');
			if (limitValue != 0 && limitValue <= createdValue) {
				alert(strings.limitErrorMessage);
				return;
			}
		}
		this.setState({
			datasheet: {
				category: category
			}
		});
	}

	editRessource(category, id){
		this.setState({
			datasheet: {
				category: category,
				id: id,
			}
		})
	}

	deleteRessource(category, id, index){
		const dialog = window.confirm(cmsConfig.alerts.delete.message);
		if(dialog){
			this.store.deleteApiRessource(category, id, index).then((result) => {
				if (this.store.userrole == 'owner_selfmanaged') {
						let createdIndex = '';
						if (category == 'users') {
							createdIndex = 'pers_created';				
						} else if (category == 'elevators') {
							createdIndex = 'elev_created';
						} else if (category == 'estates') {
							createdIndex = 'esta_created';
						}
						let createdValue = this.store.limitData.get(createdIndex);
						if (createdValue && createdValue >= 1) {
							this.store.updateLimitData(createdIndex, false);
							console.log("After Delete New LimitData, ", createdValue, this.store.limitData.toJSON())
						}
					}
			});
		}
	}	

	closeDatasheet(){
		this.setState({
			datasheet: null
		});	
	}

	loadNextData(){
		this.store.loadNextData(this.props.next.href, this.props.id);
	}

	onSortEnd = ({oldIndex, newIndex}) => {
		console.log("Change Order Props Id === ", oldIndex, newIndex);
		if (oldIndex == newIndex) return;
		this.setState({isSaving: true});
		this.store.changeCheckpointsOrder(this.props.id, oldIndex, newIndex).then(() => {
			this.setState({isSaving: false});
		});
  };

	getDataEntries(data, sortable){
		let dataEntrys = '';
		try {
			if (this.props.data != null) {
				if (this.props.data.length > 0) {
					if (sortable == false || sortable == undefined) {
						dataEntrys = data.map((dataEntry, index) =>{
							// console.log("DataEntry ==== ", dataEntry, this.props.prefix);
							return (
								<li className="category-list-entry" key={dataEntry[`${this.props.prefix}_id`]}>
								{this.getInfoCard(this.props.id, dataEntry, index)}
								</li>
							)
						});
					} else {
						const { id, prefix, ...pathProps} = this.props;
						const SortableItem = SortableElement(({dataEntry, index, id, prefix,}) => 
							<li className="category-list-entry category-drag" key={dataEntry[`${prefix}_id`]}>
								{this.getInfoCard(id, dataEntry, index)}
							</li>
						)
						const SortableList = SortableContainer(({data}) => {
							return (
								<div>
									{
										data.map((dataEntry, index) => (
											<SortableItem key={index.toString()} dataEntry={dataEntry} index={index} id={id} prefix={prefix} />
										))
									}
								</div>
							);
						});
						dataEntrys = <SortableList data={data} onSortEnd={this.onSortEnd} lockAxis={'y'} distance={2}/>
					}
				}
				else {
					dataEntrys = <h5>Keine Einträge vorhanden</h5>
				}
			}
			else {
				dataEntrys = <h5>Beim Laden der Daten kam es zu einem Fehler</h5>
			}
		} catch (error) {			
			dataEntrys = <h5>Bei der Verarbeitung der Daten kam es zu einem Fehler</h5>
			alert(error);
		}
		return dataEntrys;
	}

	showLoading(){
		return(
			<div id={this.props.id} className={`category ${('#'+this.props.id == this.props.currentCategory) ? 'active' : ''}`}>
				<h2 className="category-header">{this.props.header}</h2>
				<h3 className="category-loader">Daten werden geladen</h3>
			</div>
		)
	}

	showDatasheet(data){
		const category = this.state.datasheet.category;
		let id = this.state.datasheet.id;
		let dataIndex = 0;
		try {
			dataIndex = data.findIndex((element)=>{return element[categoriesConfig[category].apiId] == id});	
			data = data[dataIndex];
		} catch(e) {
			data = null;
			id = null;
		}
		return(
			<div id={this.props.id} className={`category ${('#'+this.props.id == this.props.currentCategory) ? 'active' : ''}`}>
				<h2 className="category-header">{this.props.header}</h2>
				<Datasheet
					category={category}
					data={data}
					dataIndex={dataIndex}
					id={id}
					userrole={this.props.userrole}
					closeDatasheet={()=>{this.closeDatasheet()}}
					apiId={this.props.apiId}
				/>
			</div>
		);	
	}

	getQuery(query){
		if(this.state.searchResult == null || query == '')
		this.setState({
			searchQuery: query
		})
	}

	render() {
		
		if(this.props.isLoading){
			return this.showLoading();
		}

		let data = null;
		let draggable = this.props.draggable ? this.props.draggable : false;
		if(this.state.searchResult == null || this.state.searchQuery == ''){
			data = this.props.data;
		}
		else{
			data = this.state.searchResult;
			draggable = false;
		}

		if (draggable && draggable != false) {
			draggable = true;
		}

		if (this.props.prefix == 'pers' && this.store.userrole == 'owner_selfmanaged' && this.props.data && this.props.data.length > 0) {
			let myData = this.props.data.filter(dataEntry => dataEntry.pers_id == this.store.userid)
			if (myData.length > 0) {
				this.store.setLimitData({
					'elev_limit': myData[0].pese_elevator_limit ? myData[0].pese_elevator_limit : 0,
					'esta_limit': myData[0].pese_estate_limit ? myData[0].pese_estate_limit : 0,
					'pers_limit': myData[0].pese_user_limit ? myData[0].pese_user_limit : 0,
					'elev_created': myData[0].pese_elevator_created ? myData[0].pese_elevator_created : 0,
					'esta_created': myData[0].pese_estate_created ? myData[0].pese_estate_created : 0,
					'pers_created': myData[0].pese_user_created ? myData[0].pese_user_created : 0
				})
			} else {
				this.store.clearLimitData();
			}
		}

		if (this.store.userrole != 'owner_selfmanaged') {
			this.store.clearLimitData();
		}

		if (data && data.length > 0) {
			data = data.filter(dataEntry => {
				if (this.store.userrole != 'owner_selfmanaged') {
					return dataEntry
				}
				
				if (this.props.prefix != 'pers' || dataEntry.pers_id != this.store.userid) { //Exclude owner_selfmanaged himself.
					return dataEntry
				}
			})
		}
		

		if(this.state.datasheet){
			return this.showDatasheet(data);
		}

		let dataEntryies = this.getDataEntries(data, draggable);

		let CreateButton = <Button onClick={()=>{this.addNewRessource(this.props.id)}}  classes='mod-category' icon='new' title={`${this.props.name} anlegen`} />;

		if(this.props.userrole == 'inspector' || this.props.userrole == 'owner' || this.props.id == 'reports'){
			CreateButton = null;
		}

		let LoadNextEntries = null;
		if(this.props.next && (this.state.searchQuery == null || this.state.searchQuery == '') ){
			LoadNextEntries = <Button onClick={()=>{this.loadNextData()}}  classes='mod-category' icon='download' text='Weitere Einträge laden' title={`Weitere Einträge laden`} />;
		}

		const loadingScreen = (this.state.isSaving) ? <Loader text='Daten werden gespeichert' /> : null;

		return (
			<div id={this.props.id} className={`category ${('#'+this.props.id == this.props.currentCategory) ? 'active' : ''}`}>
				<h2 className="category-header">{this.props.header}</h2>
				<div className="category-menu">
					{CreateButton}
					<Search category={this.props.id} getQuery={(query)=>{this.getQuery(query)}} getSearchResult={(response)=>{this.getSearchResult(response)}} placeholder={`${this.props.name} ${strings.search}`} />
				</div>
				<ul className="category-list">
					{dataEntryies}
					{LoadNextEntries}	
				</ul>
				{loadingScreen}
			</div>
		);
	}
}