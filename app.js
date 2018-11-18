const express = require('express');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.listen(3000);

const memes_controller = require('./controllers/memes_controller');
memes_controller(app);




