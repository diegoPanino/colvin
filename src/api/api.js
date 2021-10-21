import {request} from '@octokit/request'
// eslint-disable-next-line
import fakeUsers from './fakeUsernames.js'

/*export async function requestApi(userName){
	let following = []
	let followBack = []
	let promises = []
	let totPage = 1, page = 1
	let followingPromises = []
	let followBackPromises = []
	try{
		const response = await getFollowing(userName,page)
		totPage = response.headers.hasOwnProperty('link') ? getTotalPages(response.headers.link) : 1
		following = response.data.map(user=> {return {user:user.login,pic:user.avatar_url}})
		while(page<totPage){
			page++
			followingPromises.push(getFollowing(userName,page))
		}
		const followPromiseResult = await Promise.allSettled(followingPromises)
		followPromiseResult.map(promise=>{
			return promise.value.data.map(user=>{following.push({user:user.login,pic:user.avatar_url}) })})
		followBackPromises = following.map(user => {return getFollowBack(user.user,userName,false)})
		const followBackPromisesResult = await Promise.allSettled(followBackPromises)
		followBack = following.filter((user,i) => {
			return followBackPromisesResult[i].value.status === 204
		})
		return followBack
	}
	catch(err){
		console.log(err)
		switch(err.status){
			case 404 : return {err:err,status:err.status,msg:'User not found'}
			default : return {err:err,status:err.status,msg:'Something went wrong'}
		}

	}
}*/


function getFollowing(user,page){
	return request('GET /users/{username}/following',{
		username:user,
		per_page:80,
		page:page
	})
}
function getFollowBack(requestString,target_user,realReq){
	switch(realReq){
		case true:
			return request(requestString,{target_user:target_user})
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
//then it's look for &page[0-9]+> where it fill find the total number of page for the fetched info
function getTotalPages(link){
	const linksArray = link.split(',')
	const linkNums = linksArray[1].match(/&page=\d*>/g).toString().match(/(\d)+/)
	return linkNums[0]
}


/********************************************************2nd attempt*********************************************************************/
export async function requestApi(userName){
	let following = []
	let promises = []
	let totPage = 1, page = 0
	try{
		while(page < totPage){
			page++
			const response = await getFollowing(userName,page)
			if(page === 1)
				totPage = response.headers.hasOwnProperty('link') ? getTotalPages(response.headers.link) : 1
			const promisesArray = response.data.map(user => {
				following.push({user:user.login,pic:user.avatar_url})
				return getFollowBack(user.login,userName,false)
				})	
			promises.push(...promisesArray)
			}
		const followBackResult = await Promise.allSettled(promises)
		const followBack = following.filter((user,i) => {
			return followBackResult[i].value.status === 204
		})
	return followBack
	}
	
	catch(err){
		console.log(err)
		switch(err.status){
			case 404 : return {err:err,status:err.status,msg:'User not found'}
			default : return {err:err,status:err.status,msg:'Something went wrong'}
		}

	}
}






/***************************************1st attempt**********************************************************************************/
/*
aimport {request} from '@octokit/request'
import fakeUsers from './fakeUsernames.js'
//requestFollowing use GitHub api, and request the user's following.
//it will do the first request and get the first batch of users.
//With that users it will call requestFollowBack and add the result to the scoped followBackUsers.
//check the total numbers of page for the response and while not all are requested push the following request into an array of promises
//each request has a then where for that batch of users requestFollowBack is called
//the result of the total pages request is then waited, cleaned with reducePromise and added to the followBackUsers array that is the
//return value, an array of obj with {name:follow back username, pic: avatar user picture}
//the errors can catch if the searched user does not exist and return specific value
//for the others errors, especially because there is 60request/h limit, will return a fake list user with the same format {user,pic}
export async function requestFollowing(user){
	const followBackUsers = []
	const promisesArray = []
	let totPage,page = 1
	try{
		const following = await request('GET /users/{username}/following',{
	      username:user,
	      per_page:100,
	      accept:'application/vnd.github.v3+json'
	    })
	   	totPage = following.headers.hasOwnProperty('link') ? getTotalPages(following.headers.link) : 1
	    console.log('REQUEST api.js -> ',following)
	  	followBackUsers.push(...await requestFollowBack(following.data,user))
	    if(totPage > 1){
	    	while(page < totPage){
	    		page++
	    		promisesArray.push(request('GET /users/{username}/following',{
	    			username:user,
	    			per_page:100,
	    			page:page,
	    			accept:'application/vnd.github.v3+json'
	    			})
	    		.then(response => requestFollowBack(response.data,user))
	    		)//push
	    	}//while
	    	const promisesResult = await Promise.allSettled(promisesArray)
	    	followBackUsers.push(...reducePromise(promisesResult))
	    }//else
	    return followBackUsers
	}//try
	catch(err){
		if(err.status === 403){
			console.log(err)
			return fakeUsers(user)
		}
		else if(err.status === 404){
			console.log(err)
			return fakeUsers(user)
		}
	}
}

//with map loop on each follower and call the api to check if the follower is following the user searched in the input prompt. 
//The api return 204 for yes or 404 for no, with no value. Each of this api call is waited with Promises.allSettled,
// and each one, as soon as respond, if yes return and obj with name and pic. 
//I decided to attach this value in this way to have it into the array of promises returned by Promises.allSettled
//is then called reducePromise passing the array of promises to clean up the output result
//status 403, may mean that the 60request/h limit has been reach 
//so is gonna be call fakeUser with our searched user like seed, to generate a list of fake user and pics

async function requestFollowBack(users,target_user){                    
	return Promise.allSettled(users.map(user => {						
//REAL API
/*		return request('GET /users/{username}/following/{target_user}',{
			username:user.login,										
			target_user:target_user,									
			accept:'application/vnd.github.v3+json'						
			})

/FAKE API
		return fetch('http://localhost:3001/',{
			method: 'post',
			headers:{'Content-Type': 'application/json'},
			body: JSON.stringify({user:user.login})
			})
//
		.then(response => { 
			console.log('response=>',response)
			if(response.status === 204)
				return {name:user.login,pic:user.avatar_url}																																												
		})																
	}))
	.then(responses => {
		console.log('RESPONSES=>',responses)
		return reducePromise(responses)})
	.catch(err => {
		if(err.status === 403){
			console.log(err)
			return fakeUsers(target_user)
		}
		else{
			console.log(err)
			return 0
		}
	})
}
//getTotalPages receive link from the response's header, and look for rel=last and retreive tot number of page for that response
//before split by ',' and use the second result because is where the link with rel=last will be
//then it's look for &page[0-9]+> where it fill find the total number of page for the fetched info
function getTotalPages(link){
	const linksArray = link.split(',')
	const linkNums = linksArray[1].match(/&page=\d*>/g).toString().match(/(\d)+/)
	return linkNums[0]
}

//reducePromise receive the result array of Promises.allSettled where each item is and obj with status and value.
//it's use reduce to loop on each item, filter the ones with status 'fulfilled' and add to the result array
//return a flatten one, because when receveing data from more pages the result array is nested
function reducePromise(data){
	return data.reduce((result,item)=>{
		if(item.status === 'fulfilled')
			result.push(item.value)
		return result.flat()
	},[])
}
*/