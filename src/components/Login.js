import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import cmsConfig from '../config/cmsConfig';
import Loader from "./ui/Loader";

@inject("store")
@observer
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store.appState;
		this.state = {
			username: this.store.username,
			password: '',
			newPassword: '',
			isLoading: false,
			isPasswordReset: false,
			isPasswordChange: false,
			loadingText: 'Sie werden eingeloggt'
		}
	}

	changeUsername(event){
		this.setState({username: event.target.value.toLowerCase()});
	}

	changePassword(event){
		this.setState({password: event.target.value});
	}

	changeNewPassword(event){
		this.setState({newPassword: event.target.value});
	}

	async handleSubmit(event){
		event.preventDefault();
		this.setState({
			isLoading: true,
			loadingText: 'Sie werden eingeloggt'
		});
		try {
			await this.store.login(this.state.username, this.state.password);
		} catch(error) {
			this.setState({
				isLoading: false
			});
			this.handleError(error);
		}
		
	}

	async handlePasswordReset(event){
		event.preventDefault();
		this.setState({
			isLoading: true,
			loadingText: 'Ein neues Passwort wird erstellt und an Ihre E-Mail Adresse versand'
		});
		try {
			const result = await this.store.resetPassword(this.state.username);			
			if(result.status && result.status == 200){
				this.setState({
					isLoading: false,
					isPasswordReset: false,
					isPasswordChange: false,
				});
				return;
			}
			if(result.response.status == 403){
				throw new Error('username');
			}
			else if(result.response.status == 404){
				throw new Error('notfound');
			}
			else{
				throw new Error();
			}			
			
		} catch(error) {
			this.setState({
				isLoading: false
			});
			this.handleError(error);
		}		
	}

	async handlePasswordChange(event){
		event.preventDefault();
		this.setState({
			isLoading: true,
			loadingText: 'Ihr neues Passwort wird gespeichert'
		});
		try {
			const result = await this.store.changePassword(this.state.username, this.state.password, this.state.newPassword);
			if(result.status && result.status == 200){
				this.setState({
					isLoading: false,
					isPasswordReset: false,
					isPasswordChange: false,
					password: '',
					newPassword: ''
				});
				return;
			}

			if(result.response.status == 403){
				if(result.response.data.message.includes('username')){
					throw new Error('username');
				}
				else if (result.response.data.message.includes('password')) {
					throw new Error('password');
				}
			}
			else if(result.response.status == 404){
				throw new Error('notfound');
			}
			else{
				throw new Error();
			}
		} catch(error) {
			this.setState({
				isLoading: false
			});
			this.handleError(error);
		}		
	}

	handleError(error){
		switch (error.message) {
			case 'username':
				alert(`${cmsConfig.alerts.login.wrongUsername.title}\n${cmsConfig.alerts.login.wrongUsername.message}`);
			break;
			case 'password':
				alert(`${cmsConfig.alerts.login.wrongPassword.title}\n${cmsConfig.alerts.login.wrongPassword.message}`);
			break;
			case 'notfound':
				alert(`${cmsConfig.alerts.login.notfound.title}\n${cmsConfig.alerts.login.notfound.message}`);
			break;
			default:
				alert(`${cmsConfig.alerts.login.serverTimeout.title}\n${cmsConfig.alerts.login.serverTimeout.message}`);
			break;
		}
	}

	showLogin(){
		this.setState({
			isPasswordChange: false,
			isPasswordReset: false
		})
	}

	showPasswordReset(){
		this.setState({
			isPasswordChange: false,
			isPasswordReset: true
		})
	}

	showPasswordChange(){
		this.setState({
			isPasswordChange: true,
			isPasswordReset: false
		})
	}

	render() {
		
		if(this.state.isLoading){
			return (
				<div className="page login">
					<main>
						<Loader text={this.state.loadingText} />
					</main>
				</div>
			)
		}

		if(this.state.isPasswordReset){
			return (
				<div className="page login">
					<main>
						<form className="login-form" onSubmit={(event)=>{this.handlePasswordReset(event)}} acceptCharset="utf-8">							
							<span className="login-input-label">Benutzername*</span>
							<input required className="login-input mod-password" onChange={(event)=>{this.changeUsername(event)}} type="text" name="" value={this.state.username} placeholder="Benutzername" />
							<div className="login-extras">
								<span onClick={()=>{this.showLogin()}} className="login-extras-button">Login</span>
								<span onClick={()=>{this.showPasswordChange()}} className="login-extras-button">Passwort ändern</span>
							</div>
							<div className="login-button-wrapper" >
								<input className="login-button" type="submit" value="Passwort wiederherstellen" />
							</div>
							<p className="login-password-text">
								*Bitte geben Sie Ihren Benutzernamen ein. Es wird ein neues Passwort erstellt und an Ihre E-Mail-Adresse(n) versand.
							</p>
						</form>
						
					</main>
				</div>
			)
		}

		if(this.state.isPasswordChange){
			return (
				<div className="page login">
					<main>
						<form className="login-form" onSubmit={(event)=>{this.handlePasswordChange(event)}} acceptCharset="utf-8">							
							<span className="login-input-label">Benutzername*</span>
							<input required className="login-input" onChange={(event)=>{this.changeUsername(event)}} type="text" name="" value={this.state.username} placeholder="Benutzername" />
							<span className="login-input-label">Altes Passwort*</span>
							<input pattern=".{8,}" required className="login-input " onChange={(event)=>{this.changePassword(event)}} type="password" name="" value={this.state.password} placeholder="Altes Passwort" />
							<span className="login-input-label">Neues Passwort*</span>
							<input pattern=".{8,}" required className="login-input mod-password" onChange={(event)=>{this.changeNewPassword(event)}} type="password" name="" value={this.state.newPassword} placeholder="Neues Passwort" />
							<div className="login-extras">
								<span onClick={()=>{this.showLogin()}} className="login-extras-button">Login</span>
								<span onClick={()=>{this.showPasswordReset()}} className="login-extras-button">Passwort wiederherstellen</span>
							</div>
							<div className="login-button-wrapper" >
								<input className="login-button" type="submit" value="Passwort ändern" />
							</div>
							<p className="login-password-text">
								*Bitte geben Sie Ihren Benutzernamen und Ihr altes Passwort ein sowie ein neues Passwort bestehend aus mindestens 8 Zeichen.
							</p>
						</form>
						
					</main>
				</div>
			)
		}
		
		return (
			<div className="page login">
				<main>
					<form className="login-form" onSubmit={(event)=>{this.handleSubmit(event)}} acceptCharset="utf-8">
						<span className="login-input-label">Benutzername</span>
						<input required className="login-input" onChange={(event)=>{this.changeUsername(event)}} type="text" name="" value={this.state.username} placeholder="Benutzername" />
						<span className="login-input-label">Passwort</span>
						<input pattern=".{8,}" required className="login-input mod-password" onChange={(event)=>{this.changePassword(event)}} type="password" name="" value={this.state.password} placeholder="Passwort" />
						<div className="login-extras">
							<span onClick={()=>{this.showPasswordReset()}} className="login-extras-button">Passwort wiederherstellen</span>
							<span onClick={()=>{this.showPasswordChange()}} className="login-extras-button">Passwort ändern</span>
						</div>
						<div className="login-button-wrapper" >
							<input className="login-button" type="submit" value="Login" />
						</div>
					</form>
					
				</main>
			</div>
		);
	}
}