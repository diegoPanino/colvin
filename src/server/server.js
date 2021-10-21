const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

//Server that mimic the response of GitHub api to check if a user is following the target user

const app = express()
app.use(cors())
/*app.use((req,res,next)=>{
	res.setHeader("Access-Control-Allow-Origin","http://localhost:3000")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type")
	next()
})*/
app.use(bodyParser.json())

app.get('/',(req,res)=>{res.send('<marquee>Fake followback Api</marquee>')})

app.post('/',(req,res)=>{
	const {user} = req.body
	let count = 0
	try{
		for(let i = 0; i < user.length;i++)
			count = user.charCodeAt(i) + count
		if(count % 3 === 0)
			res.status(204).send('No content')
		else
			res.status(404).send('Not found')
		
	}
	catch(err){
		console.log(err)
		res.status(404).send('Not found')
	}
	
})

app.listen(3001,()=>{
	console.log('Listening on port 3001')
})