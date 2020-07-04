let nodeMailer 	= require('nodemailer')
	dotenv 		= require('dotenv')

dotenv.config()

// let transport = nodeMailer.createTransport({
//   host: process.env.host,
//   port: 2525,
//   auth: {
//     user: process.env.user,
//     pass: process.env.pass
//   }
// })

let transport = nodeMailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.userId,
		pass: process.env.userPass
	}
})

// simple text-email
transport.sendMail({
	from: 'shreyans1313@gmail.com',
	to: 'shreyans1313@gmail.com',
	subject: 'Text-Email',
	text: 'Test Email text to send email via Node Js using nodemailer'
}, (err, message) => {
	if(err) {
		console.log("Error occured")
		console.log(err)
		return
	}
	console.log(message)
})

// html based email
transport.sendMail({
	from: 'shreyans1313@gmail.com',
	to: 'shreyans1313@gmail.com',
	subject: 'HTML-Email',
	html: '<h1>Test Email</h1> Text to send email via Node Js using nodemailer'
}, (err, message) => {
	if(err) {
		console.log("Error occured")
		console.log(err)
		return
	}
	console.log(message)
})

// html+attachment based email
transport.sendMail({
	from: 'shreyans1313@gmail.com',
	to: 'shreyans1313@gmail.com',
	subject: 'html-Email with Attachment',
	html: '<h1>Test Email</h1> test email test email',
	attachments: [
		{
			filename: 'testImage.png',
			path: 'https://blog.clickdimensions.com/wp-content/uploads/2017/05/BlogFeatureImage-Two-Options-for-Effectively-Testing-your-Email-Sends.png'
		}
	]
}, (err, message) => {
	if(err) {
		console.log("Error occured")
		console.log(err)
		return
	}
	console.log(message)
})