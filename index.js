import express from'express'
import path from'path'
import mongoose from'mongoose'
import cookieParser from 'cookie-parser'
import expressLayouts from'express-ejs-layouts'
import Authrouter from'./routes/Authrouter.js'
import config from './config/config';
import flash from 'connect-flash'
import session from'express-session'
const PORT = config.PORT
const mongodbUrl = config.MONGODB_URL;
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.log(error.reason));


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge:300000
    },
  })
);

app.use(flash());

app.use('/public', express.static('public'));
app.get('/layouts/', function(req, res) {
  res.render('view');
})
app.use('/', Authrouter) 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.listen(PORT, () => console.log('Server running on http://localhost:9000/'));




