import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import cmsConfig from '../config/cmsConfig';
import NavLink from "./ui/NavLink";

@inject("store")
@observer
export default class TopNav extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store.appState;
	}

	scrollToLink(event){
		this.store.setCurrentCategory(event.target.hash);	 
	}

	render() {
		const { jwt, userrole, currentCategory } = this.store;
		if(jwt && userrole){
			const navItems = cmsConfig.roles[userrole].categories.map((category)=>
				<li key={category}>
					<NavLink onClick={(event)=>{this.scrollToLink(event)}} href={`#${category}`} title={cmsConfig.categories[category].title} currentCategory={currentCategory} label={cmsConfig.categories[category].title} />
				</li>
			);
			return (
				<nav>
					<ul>
						{navItems}
					</ul>				
				</nav>
			);
		}
		
		return (
			<nav>				
			</nav>
		);
	}
}
