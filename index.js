const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { error } = require('console');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Use middleware for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the index page with the list of files
app.get('/', function(req, res) {

    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).send('Server error');
        }
        res.render('index', { files: files });
    });
});




// Route to handle form submission
app.post('/create', function(req, res) {
    console.log(req.body); // Log form data


    // Handle form submission logic here (e.g., saving data to a file or database)
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.description, function(err) {
        if (err) {
            console.log(err.message);
        }
    });

    res.redirect('/'); // Redirect back to the home page
});


app.get('/file/:filename', function(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'files', filename); // Adjust 'files' to your actual directory
  
    fs.readFile(filePath, 'utf8', function(err, data) {
      if (err) {
        console.error(err.message);
        return res.status(404).send('File not found');
      }
      res.render('show', { filename: filename, content: data });
    });
  });

  app.get('/edit/:filename' , function(req , res) {

    res.render('edit' , {filename : req.params.filename}) ; 
    
  })

  app.post('/edit' , function(req , res) {
    console.log(req.body) ; 

    fs.rename(`./files/${req.body.Previous}` , `./files/${req.body.New}` , function(err) {
        if(err) {
            console.log(err.message) ; 
        }
        res.redirect('/') ;
    }) ; 
  })





// Start the server
app.listen(3000, function() {
    console.log('Server is running on port 3000');
});