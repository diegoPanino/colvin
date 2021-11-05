import {request} from '@octokit/request'
import fakeUsers from './fakeUsernames.js'

//requestApi receive the user and use it 
export async function requestApi(userName){
	let following = []
	let promises = []
	let totPage = 1, page = 0
//when the flag is true, it will be used the real api to check the followback. When false the localserver will return similir results
//when using real api if the limiti is reached while requesting the followback, the first error will be catched and fake user will be returned
//but the others errors will throw unhandled rejection. Should be checked the response's header x-ratelimit-remaining with the numbers of users
	const realApi = false 
	try{
		while(page < totPage){
			page++
			const response = await getFollowing(userName,page)
			console.log('api.js response',response)
			if(page === 1)
				totPage = response.headers.hasOwnProperty('link') ? getTotalPages(response.headers.link) : 1
			const promisesArray = response.data.map(user => {
				const apiStr = realApi ? user.following_url : user.login
				following.push({user:user.login,pic:user.avatar_url})
				return getFollowBack(apiStr,userName,realApi)
				})	
			promises.push(...promisesArray)
			}
		const followBackResult = await Promise.allSettled(promises)
		const followBack = following.filter((user,i) => {
			if(realApi)
				return followBackResult[i].status === 'fulfilled'
			else	
				return followBackResult[i].value.status === 204
		})
	return {status:'ok',list:followBack}
	}
	
	catch(err){
		console.log('api.js Catched error=>',err)
		switch(err.status){
			case 403 : return {status:'api',list:await fakeUsers(userName)}
			case 404 : return {status:'not found',code:err.status,msg:'User not found'}
			default : return {status:'error',code:err.status,msg:'Something went wrong'}
		}

	}
}


function getFollowing(user,page){
	try{
		return request('GET /users/{username}/following',{
			username:user,
			per_page:100,
			page:page
		})
	}
	catch(err){
		if(err.status === 403)
			throw new Error({status:403})
		else
			return err
	}
}
function getFollowBack(requestString,target_user,realReq){
	switch(realReq){
		case true:{
			const requestStrNormalized = requestString.replace('{/other_user}','/{target_user}')
			return request(requestStrNormalized,{target_user:target_user})
		}
		case false:
			return fetch('http://localhost:3001/',{
				method:'post',
				headers:{'Content-Type': 'application/json'},
				body: JSON.stringify({user:requestString})
			})
		default: return false
	}
}
//getTotalPages receive link from the response's header, and look for rel=last and retreive tot number of page for that response
//before split by ',' and use the second result because is where the link with rel=last will be
//then it's look for &page[0-9]+> where it will find the total number of page for the fetched info
function getTotalPages(link){
	const linksArray = link.split(',')
	const linkNums = linksArray[1].match(/&page=\d*>/g).toString().match(/(\d)+/)
	return linkNums[0]
}