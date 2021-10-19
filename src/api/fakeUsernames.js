export default function fakeUsers(seed){
	console.log('FAKE USERS LIST')
	const randomNumber = Math.floor(Math.random()*500)
	return fetch(`https://randomuser.me/api/?inc=name,picture&seed=${seed}&results=${randomNumber}&noinfo&nat=es`)
	.then(response => response.json())
	.then(data => {
		return data.results.map(user => { return {name:user.name.last,pic:user.picture.large}})
	})
	.catch(err=>console.log(err))
}
