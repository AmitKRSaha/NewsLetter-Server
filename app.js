    var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost:4200");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    // app.use(bodyParser.json());  
    app.use(express.static('uploads'));
    app.use('/uploads', express.static('uploads'))
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    /** API path that will upload the files */
    app.post('/uploadscreenshot', function (req, res) {
        const path = 'uploads/'+ req.body.name +'.png'; 
        // console.log('path: '  + req.body.canvas);  
        var  body  = req.body.canvas;         
           
        const base64Data =  body.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            require('fs').writeFile(path, base64Data, 'base64', (err) => {
                console.log(err);
            });
        // req.on('data',  function  (chunk)  {    
        //     body  +=  chunk;  
        // });  
        // req.on('end',  function  ()  {    
        //      console.log('body: '  +  body);  
             
        //     const base64Data =  body.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        //     require('fs').writeFile(path, base64Data, 'base64', (err) => {
        //         console.log(err);
        //     });
           
        // });    
        res.json({
            path: path,
            error_code: 0,
            err_desc: null
        });
    });

    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
			console.log(req.file);
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({path:req.file.filename, filepath:req.file.path, error_code:0,err_desc:null});
        });
    });

    app.get('/', function(req, res){
        res.send('hello world');
      });

      
    app.listen('3001', function(){
        console.log('running on 3001...');
    });