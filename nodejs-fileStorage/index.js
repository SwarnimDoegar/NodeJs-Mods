let express = require('express')
let app = express()
// let crypto = require('crypto')
let path = require('path')
let mongoose = require('mongoose')
let multer = require('multer')
let GridFsStorage = require('multer-gridfs-storage')

// DB
const mongoURL = 'mongodb://localhost:27017/node-file-upl'

// connection
const conn = mongoose.createConnection(mongoURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

// init gfs
let gfs
conn.once('open', () => {
	gfs = new mongoose.mongo.GridFSBucket(conn.db, {
		bucketName: 'uploads'
	})
})

// storage
const storage = new GridFsStorage({
	url: mongoURL,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			// crypto.randomBytes(16, (err, buf) => {
				// if(err) {
				// 	return reject(err)
				// }
				// const filename = buf.toString('hex') + path.extname(file.originalname)
				const filename = file.originalname
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads'
				}
				resolve(fileInfo)
			// })
		})
	}
})

const upload = multer({
	storage
})

// const storage = new GridFsStorage({url : mongoURL})

app.use(express.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
	// res.render('index')
	if(!gfs) {
		console.log('Some error occured, check connection to db')
		res.send('Some error occured, check connection to db')
		process.exit(0)
	}
	gfs.find().toArray((err,  files) => {
		if(!files || files.length === 0) {
			return res.render('index', { files: false })
		} else {
			const f = files.map(file => {
				if (file.contentType === 'image/png' || file.contentType === 'image/jpeg') {
					file.isImage = true;
				} else {
					file.isImage = false;
				}
				return file;
			})
			return res.render('index', {files: f})
		}
	})
})

app.post('/upload', upload.single('file'), (req, res) => {
	res.redirect('/')
})

app.get('/image/:filename', (req, res) => {
	const file = gfs.find({
		filename: req.params.filename
	})
	.toArray((err, files) => {
		if(!files || files.length === 0) {
			return res.status(404).json({
				err: 'no files exist'
			})
		}
		gfs.openDownloadStreamByName(req.params.filename).pipe(res)
	})
})

app.post('/files/del/:id', (req, res) => {
	gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
		if(err)
			return res.status(404).json({err: err.message })
		res.redirect('/')
	})
})
const port = 5001;

app.listen(port, () => {
	console.log(`Server started running at ${port}`)
})