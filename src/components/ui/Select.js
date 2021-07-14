import React, { Component } from "react";
import Input from "./Input";
import TextIcon from "./TextIcon";
import LimitItem from './LimitItem';

export default class Select extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			isPlaceholderShowing: (props.value) ? false : true,
			additionalShow: (props.value && props.value == props.additionShowValue) ? true : false
		}
	}

	generateRandomKey(){
		return Math.floor(Math.random()*Date.now())
	}

	onChange(event){
		const value = event.target.value;
		if (value == this.props.additionShowValue) {
			
			this.setState({additionalShow: true});
		} else {
			this.setState({additionalShow: false});
		}
		this._changeValue(value)
	}

	_changeValue = (value) => {
		this.props.onChange(value);
		this.setState({
			value: value
		})
	}

	_onAdditionChange = (id, value) => {
		if (value >= 0)
			this.props.additionChange(id, value, true);
		else 
			this.props.additionChange(id, value, false);
	}

	onMouseOver(){
		this.setState({
			isPlaceholderShowing: false
		});
	}

	onMouseOut(){
		if(this.state.value){
			this.setState({
				isPlaceholderShowing: false
			});
		}
		else{
			this.setState({
				isPlaceholderShowing: true
			});
		}
	}

	componentDidMount() {
		const {value, additionShowValue, options, listName} = this.props;		
		if (value && value == additionShowValue) {
			this.setState({additionalShow: true});
		} else {
			this.setState({additionalShow: false});
		}

		if (!value && listName == 'pers_scope') {
			this.setState({value: options[0], isPlaceholderShowing: false});
			this._changeValue(options[0]);
		}
	}

	render() {
		const options = this.props.options.map((option)=>
				<option className='select-option' key={this.generateRandomKey()} value={option}>{option}</option>
			);
		let Icon = <TextIcon icon='check' />;
	

		return(
			<div className={`select ${(this.state.isPlaceholderShowing) ? 'mod-empty' : ''}`}>
				<select
					autoFocus={this.props.autoFocus}
					className='input'
					value={this.state.value}
					name={this.props.listName}
					onMouseOver={()=>{this.onMouseOver()}}
					onMouseOut={()=>{this.onMouseOut()}}
					onChange={(event)=>{this.onChange(event)}}
				>
					<option className='select-option' hidden>{this.props.placeholder}</option>
					{options}
				</select>
				{
					this.state.additionalShow == true && this.props.additions ?
					<div className={'select-additional'}>
						{
							this.props.additions.map(option => {
								return (
									<LimitItem 
										errorMessage={option.error}
										placeholder={option.placeholder}
										noLimitMessage={option.noLimitMessage}
										label={option.label}
										id={option.key}
										value={this.props.additionValue[option.key] ? this.props.additionValue[option.key] : 0}
										onChange={this._onAdditionChange}
										key={option.key}
									/>
								)
							})
						}
						{/* <LimitItem 
							errorMessage={'Number value required!'}
							placeholder={'Limit Number'}
							noLimitMessage={'No Limit'}
							label={'Elevator Limit'}
							id={'elevator_limit'}
							value={20}
							onChange={this._onAdditionChange}
						/>
						<LimitItem 
							errorMessage={'Number value required!'}
							placeholder={'Limit Number'}
							noLimitMessage={'No Limit'}
							label={'Estate Limit'}
							id={'estate_limit'}
							value={0}
							onChange={this._onAdditionChange}
						/>
						<LimitItem 
							errorMessage={'Number value required!'}
							placeholder={'Limit Number'}
							noLimitMessage={'No Limit'}
							label={'User Limit'}
							id={'user_limit'}
							value={0}
							onChange={this._onAdditionChange}
						/> */}
					</div>
					:
					null
				}
				
			</div>
		)
	}
}

