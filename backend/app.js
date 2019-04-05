var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')    
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({storage: storage});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/uploads', upload.single('avatar'), (req, res) => {
    console.log(req.file.path);
    console.log(req.body.description);
    if(!req.file) {
        console.log('no file received');
        return res.send({
            success: false
        });
    } else {
        console.log('file received');
        return res.send({
            success: true
        });
    }
});

app.listen(3000, () => {
    console.log('app is listening on port 3000!');
});