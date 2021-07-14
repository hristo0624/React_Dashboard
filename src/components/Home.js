import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import cmsConfig from '../config/cmsConfig';
import categoriesConfig from '../config/categoriesConfig';

import Category from "./categories/Category";
// import SortableCategory from "./categories/SortableCategory";

@inject("store")
@observer
export default class Home extends Component {
	constructor(props) {
		super(props);
		this.store = this.store = this.props.store.appState;

		this.store.loadInitialData();
	}

	render() {
		const { jwt, userrole, currentCategory, limitData } = this.store;

		const isLoading = (this.store.cmsData == null) ? true : false;
		if(jwt && userrole){
			let categoryItems = cmsConfig.roles[userrole].categories.map((category)=> {
				return (
					<Category 
						isLoading={isLoading} 
						apiId={categoriesConfig[category].apiId} 
						id={category}
						key={category}
						currentCategory={this.store.currentCategory}
						header={categoriesConfig[category].title}
						prefix={categoriesConfig[category].prefix}
						name={categoriesConfig[category].name}
						data={(isLoading ? [] : this.store.cmsData[category].data)}
						userrole={userrole}
						// limitData={limitData}
						next={(isLoading ? null : this.store.cmsData[category].next)}
						draggable={category == 'checkpoints' ? true : false}
					/>
				)
			}
				
			);
			return (
				<div className="page">
					<main className="home">
						{categoryItems}

					</main>
				</div>
			);
		}
		return (
			<div className="page">
				<main className="home">					
				</main>
			</div>
		);
	}
}
