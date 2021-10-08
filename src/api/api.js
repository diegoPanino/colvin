import {request} from '@octokit/request'
import fakeUsers from './fakeUsernames.js'

export async function requestFollowing(user){
	try{
		const following = await request('GET /users/{username}/following',{
	      username:user,
	      per_page:100,
	      accept:'application/vnd.github.v3+json'
	    })
	    const isComplete = !following.headers.hasOwnProperty('link')
	    if(isComplete){
	    	console.log('request ',following)
	    	return requestFollowBack(following.data,user)
	    }
	    else
	    	console.log('no complete')
	}
	catch(err){
		if(err.status === 403)
			return fakeUsers(user)
		else
			return 0
	}
}

async function requestFollowBack(users,target_user){
	return Promise.allSettled(users.map(user => {
		return request('GET /users/{username}/following/{target_user}',{
			username:user.login,
			target_user:target_user,
			accept:'application/vnd.github.v3+json'
		}).then(response => {
			if(response.status === 204)
				return user.login
		})
	}))
	.then(responses => {
		/*const values = responses.filter(response=> {
			return response.status === 'fulfilled'
		})*/
		console.log(responses)
		//return values.value
	})
	.catch(err => {
		if(err.status === 403)
			return fakeUsers(target_user)
		else
			return 0
	})
}
	






























/*
let followBack = {
	userName:'',
	count:0,
	userNames:[]
}

export function requestFollowing(username){
	request ('GET /users/{username}/following',{
      username:username,
      per_page:100,
      accept:'application/vnd.github.v3+json'
    }).then(response => {
    	console.log('api.js -resp- ->',response)
    	const isComplete = !response.headers.hasOwnProperty('link')
    	if(isComplete)
    		requestFollowBack(response.data,username)
    	    followBack.userName = username
    		followBack.count = followBack.userNames.length
    })
    .catch(async err =>{
    	console.log('1st REQUEST ERROR')
    	followBack.userNames = fakeUsers(username)

    })
    return followBack
}

function requestFollowBack(users,target_user){
	// eslint-disable-next-line
	users.map(user =>{
		request('GET /users/{username}/following/{target_user}',{
			username:user.login,
			target_user:target_user,
			accept:'application/vnd.github.v3+json'
		})
		.then(response =>{
			if(response.status === 204)
				followBack.userNames.push(user.login)
		})
		.catch(async err => {
			console.log('2nd REQUEST ERROR')
			followBack.userNames = fakeUsers(target_user)
		})
	})
}
*/