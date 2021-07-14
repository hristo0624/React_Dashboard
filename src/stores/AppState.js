import { observable, action, ObservableMap } from 'mobx';
import cmsConfig from '../config/cmsConfig';
import axios from 'axios';
import Cookies from 'js-cookie'
const arrayMove = require('array-move');

export default class AppState {
	constructor() {
		const jwt = Cookies.get('jwt');
		const username = Cookies.get('username');
		const userrole = Cookies.get('userrole');
		const userid = Cookies.get('userid');
		const limitData = Cookies.get('limitData');
		this.setJWT(jwt);
		if(username){
			this.setUsername(username);
		}
		if(userrole){
			this.setUserrole(userrole);
		}
		if(userid){
			this.setUserID(userid);
		}

		if (limitData && limitData != '') {
			this.setLimitData(JSON.parse(limitData));
		}
	}

	@observable username = '';
	@observable userrole = null;
	@observable jwt = null;
	@observable userid = '';

	@observable currentCategory = location.hash || '#elevators';

	@observable cmsData = {};
	@observable datasheets = {};
	@observable limitData = new ObservableMap();
	@observable testData = 2;

	@action setUsername(username){
		this.username = username;
		Cookies.set('username', username, { expires: 7 });
	}

	@action setUserID(userid) {
		this.userid = userid;
		Cookies.set('userid', userid, { expires: 7 });
	}

	@action setUserrole(userrole){
		this.userrole = userrole;
		Cookies.set('userrole', userrole, { expires: 7 });
	}

	@action setJWT(jwt){
		if(jwt == null  || jwt == 'null'){
			jwt = null;
		}
		this.jwt = jwt;
		Cookies.set('jwt', jwt, { expires: 0.5 });
	}

	@action setCurrentCategory(currentCategory){
		this.currentCategory = currentCategory;
	}

	@action setCMSData(cmsData){
		this.cmsData = cmsData;
	}

	@action setDatasheet(data){
		this.datasheets[data.category] = {
			id: data.id,
			datasheet: data.datasheet
		};
	}

	@action setLimitData(limitData) {
		this.limitData = new ObservableMap();
		this.limitData.replace(limitData);
		Cookies.set('limitData', JSON.stringify(limitData));
	}

	@action clearLimitData() {
		// this.limitData = new ObservableMap();
		// this.limitData.clear();
		Cookies.set('limitData', '');
	}

	@action updateLimitData(key, changeDirection) {
		let originalLimitValue = this.limitData.get(key);
		if (originalLimitValue == undefined || originalLimitValue == null)
			originalLimitValue = 0;
		if (changeDirection == true) {
			this.limitData.set(key, originalLimitValue + 1);
		} else {
			if (originalLimitValue > 1)
				this.limitData.set(key, originalLimitValue - 1);
			else 
				this.limitData.set(key, 0);
		}
		let shallowCopy = this.limitData.toJSON();
		console.log("Update Limit Value === ", this.limitData.get(key));
		Cookies.set('limitData', JSON.stringify(shallowCopy));
	}

	@action setTestData() {
		this.testData = this.testData + 1;
	}

	@action async resetPassword(username){
		return await this.apiRequest(`${cmsConfig.api.login}${cmsConfig.api.passwordReset}`, '', 'post', {pers_username: username});	
	}

	@action async changePassword(username, password, newPassword){
		return await this.apiRequest(`${cmsConfig.api.login}${cmsConfig.api.passwordChange}`, '', 'post', {pers_username: username, pers_password: password, pers_new_password: newPassword});
	}

	@action async login(username, password) {
		try {
			const { data } = await axios({
				method: 'get',
				url: `${cmsConfig.api.baseURL}${cmsConfig.api.login}`,
				auth: {
					username: username,
					password: password
				}
			});
			this.setUsername(username);
			this.setUserrole(data.pers_scope);
			this.setJWT(data.pers_token);
			this.setUserID(data.pers_id);
		} catch(error) {
			if(error.message == 'timeout'){
				throw new Error('timeout');
			}
			if(error.hasOwnProperty('response')){
				if(error.response.data.message.includes('username')){
					throw new Error('username');
				}
				else if (error.response.data.message.includes('password')) {
					throw new Error('password');
				}
			}
			throw new Error();
		}
	}

	@action logout(){		
		Cookies.remove('jwt');
		this.setJWT(null);
	}

	@action test() {
		this.setLimitData({pers_created: this.limitData.pers_created + 1});
	}

	@action loadInitialData(){
		if(this.userrole){
			this.setCMSData(null);
			let routes = [];
			cmsConfig.roles[this.userrole].categories.forEach((category)=>{
				routes.push(this.apiRequest(cmsConfig.api[category]));
			})

			if (this.userrole == 'owner_selfmanaged') {
				cmsConfig.roles[this.userrole].apiCategories.forEach((category)=>{
					routes.push(this.apiRequest(cmsConfig.api[category]));
				})
			}

			Promise.all(routes)
			.then((response)=>{
				let cmsData = {};
				let category = '';
				response.forEach((responseElement)=>{
					category = responseElement.config.url.split('/').pop();
					if(responseElement.status == 200){
						if(Array.isArray(responseElement.data) == false && responseElement.data._embedded[`${cmsConfig.api.version}${category}`].length > 0){
							cmsData[category] = {
								data: responseElement.data._embedded[`${cmsConfig.api.version}${category}`],
								next: (responseElement.data._links.next) ? responseElement.data._links.next : null
							}

							console.log("Total CMS Data === ", cmsData);
						}
						else{
							cmsData[category] = {data: [], next: null}
						}
					}
					else{
						cmsData[category] = {data: null, next: null}
					}
				});
				this.setCMSData(cmsData);
			})
		}
		
	}

	@action loadNextData(href, category){
		href = href.split('/');
		this.apiRequest(`/${href[href.length - 1]}`)
		.then((response)=>{
			if(response.status == 200){
				let data = null;
				if(Array.isArray(response.data) == false && response.data._embedded[`${cmsConfig.api.version}${category}`].length > 0){
					data = {
						data: response.data._embedded[`${cmsConfig.api.version}${category}`],
						next: (response.data._links.next) ? response.data._links.next : null
					}
				}
				else{
					data = {data: [], next: null}
				}
				let cmsData = this.cmsData;
				cmsData[category].data = cmsData[category].data.concat(data.data);
				cmsData[category].next = data.next;
				this.setCMSData(cmsData)
			}
		})
	}

	@action request(url, parameter = '', method = 'get', data = null){
		return axios({
			method: method,
			url: `${cmsConfig.api.baseURL}${url}${parameter}`,
			headers: {
				'Authorization': this.jwt
			},
			data: data
		});
	}

	// http://adampaxton.com/handling-multiple-javascript-promises-even-if-some-fail/
	@action apiRequest(url, parameter, method, data){
		return new Promise((resolve, reject) => {
			return this.request(url, parameter, method, data)
			.then((response)=>{
				resolve(response);
			})
			.catch((error)=>{
				reject(error);
			})
		})
		.catch((error)=>{
			return error;
		})
	}


	@action search(category, query){
		query = query.replace(' ', '+');
		return new Promise((resolve, reject) => {
			return this.request(`${cmsConfig.api[category]}`, `?search=${query}`)
			.then((response)=>{
				resolve(response);
			})
			.catch((error)=>{
				reject(error);
			})
		})
		.catch((error)=>{
			return error;
		})
	}


	@action checkIfExists(category, query){
		return new Promise((resolve, reject) => {
			return this.request(`${cmsConfig.api[category]}`, `?check=${query}`)
			.then((response)=>{
				resolve(response);
			})
			.catch((error)=>{
				reject(error);
			})
		})
		.catch((error)=>{
			return error;
		})		
	}

	@action updateApiRessource(category, dataIndex){
		const datasheet = this.datasheets[category];
		if(datasheet){
			const method = (datasheet.id) ? 'patch' : 'post';
			const id = (datasheet.id) ? datasheet.id : '';
			console.log("Before API Post === ", datasheet.datasheet);
			return this.apiRequest(cmsConfig.api[category], `/${id}`, method, datasheet.datasheet)
			.then((result) => {
				console.log("After API Post === ", result);
				try {
					if(Array.isArray(result.data) && result.data.length == 0){
						location.reload();
					}
					if(dataIndex == -1){
						if(category != 'checkpoints')
							this.cmsData[category].data.unshift(result.data);
						else
							this.cmsData[category].data.push(result.data);
					}
					else{
						this.cmsData[category].data[dataIndex] = result.data;
					}
				} catch(e) {
					// console.log("Result ==== ", this.cmsData[category].data);
					alert(e);
				}
				result.method = method;
				return result;
			});
		} else {
			return new Prosmise((resolve, reject) => {
				reject(true);
			})
		}
	}

	@action deleteApiRessource(category, id, index){
		return this.apiRequest(cmsConfig.api[category], `/${id}`, 'delete')
		.then(result => {
			if(result.data.length > 0){
				this.cmsData[category].data.splice(index, 1);
			}
			return result;
		})
		
	}

	@action changeCheckpointsOrder(category, oldIndex, newIndex) {
		let nativeArray = this.cmsData[category].data.slice();
		let newArray = arrayMove(nativeArray, oldIndex, newIndex);
		this.cmsData[category].data = newArray;
		let putData = {
			oldIndex: oldIndex,
			newIndex: newIndex,
			chpo_id: 'fake_id' //Only for passing validation
		}
		return this.apiRequest(cmsConfig.api[category], '', 'patch', putData);
	}

	// @action async getById(category, id, apiId, link){
	// 	link = link.split(category)
	// 	link = `/${category}${link[1]}`
	// 	const index = this.cmsData[category].data.findIndex(element => element[apiId] == id);
	// 	const response = await this.apiRequest(link, '', 'get', null);
	// 	if(response.status == 200){
	// 		delete response.data.meta;
	// 		this.cmsData[category].data[index] = response.data;
	// 		return response.data;
	// 	}
	// 	else{
	// 		return null;
	// 	}		
	// }
}
