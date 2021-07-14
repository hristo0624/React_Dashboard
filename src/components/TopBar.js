import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import TopNav from "./TopNav";
import TextIcon from "./ui/TextIcon";
import NavLink from "./ui/NavLink";


@inject("store")
@observer
export default class TopBar extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store.appState;
	}

	logout(event){
		event.preventDefault();
		this.store.logout();
	}

	render() {
		const { jwt, username } = this.store;
		if(jwt){
			return (
				<div className="topbar">
					<NavLink href='' label='Aufzugwärter' title='Die Aufzugwärter' labelPadding='0px 0px 0px 8px'>
						<TextIcon fontSize='1.25rem' icon="logo" />
					</NavLink>
					<TopNav />
					<div className="topbar-logoutwrapper">
						<div className="topbar-user">
							<span>Benutzer:</span><br/><span>{username}</span>
						</div>
						<NavLink onClick={(event)=>{this.logout(event)}} href='' label='Logout' title='Logout' labelPadding='0px 0px 0px 8px'>
							<TextIcon icon="logout" />
						</NavLink>
					</div>
				</div>
			);
		}
		return (
			<div className="topbar">
				<NavLink href='' label='Aufzugwärter' title='Die Aufzugwärter' labelPadding='0px 0px 0px 8px'>
					<TextIcon fontSize='1.25rem' icon="logo" />
				</NavLink>
				<TopNav />
			</div>
		);
	}
}
