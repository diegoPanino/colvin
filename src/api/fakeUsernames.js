export default function fakeUsers(seed){
	console.log('FAKE USERS')
	const randomNumber = Math.floor(Math.random()*500)
	return fetch(`https://randomuser.me/api/?inc=name&seed=${seed}&results=${randomNumber}&noinfo&nat=es`)
	.then(response => response.json())
	.then(data => {
		const list = data.results.map(user => { return user.name.last})
		return list
	})
	.catch(err=>console.log(err))
}