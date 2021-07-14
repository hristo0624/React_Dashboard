import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import TextIcon from "../ui/TextIcon";
import cmsConfig from '../../config/cmsConfig';

@inject("store")
@observer
export default class Search extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store.appState;
		this.state = {
			query: '',
			searchResult: null
		}
	}

	onClick(){
		if(this.props.onClick){
			this.props.onClick();
			return;
		}
	}

	async changeQuery(event){
		const value = event.target.value;
		this.setState({query: value});
		this.props.getQuery(value);
		if(value == ''){
			this.props.getSearchResult(null);
			return;
		}
		try {
			const response = await this.store.search(this.props.category, value);
			let result = [];
			if(response.status === 200){
				if(this.props.getSearchResult){
					if(Array.isArray(response.data) == false){
						result = response.data._embedded[`${cmsConfig.api.version}${this.props.category}`];
						if (this.props.category === 'reports'){
							result.sort((a, b) => {
								if (a.repo_creation > b.repo_creation){
									return -1;
								}
								else if (a.repo_creation < b.repo_creation){
									return 1;
								}
								else {
									return 0;
								}
							})
						}
						this.props.getSearchResult(result);						
					}
					else{
						this.props.getSearchResult(result);
					}
					this.setState({
						searchResult: result
					})
				}
			}
			return;
		} catch(e) {
			if(this.props.getSearchResult){
				this.props.getSearchResult(null);
				this.setState({
					searchResult: null
				})
			}
		}		
	}


	render() {
		
		return (
			<div className="search">
				<input className="search-input" type="search" value={this.state.query} onChange={(event)=>{this.changeQuery(event)}} placeholder={this.props.placeholder} />
				<span className="search-icon"><TextIcon icon='loupe' /></span>
			</div>
		);
	}
}

