require('dotenv').config();
const express = require('express');

const fileUpload = require('express-fileupload');
const multer = require('multer');
var upload = multer();
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const storeRoutes = require('./routes/storeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const stakingRoutes = require('./blockchain/staking/router/stakingRouter');
const subCatRoutes = require('./routes/subCatRoute');
const stakingRoleRoutes = require('./routes/stakingRoleRoutes');
const {connectDB} = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

connectDB();

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ 
  extended: false ,
  limit: '50mb'
}));

app.use(cors({
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  

}));
app.use(fileUpload({useTempFiles: true}));
app.use(upload.array()); 
app.use(express.static('public'));




app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/access')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/dashboard', function(req, res){
  res.sendFile(path.join(__dirname + '/public/access/dashboard.html'));
});

app.get('/reset', function(req, res){
  res.sendFile(path.join(__dirname + '/public/access/reset.html'));
});

app.get('/usuarios', function(req, res){
  res.sendFile(path.join(__dirname + '/public/access/usuarios.html'));
});



app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/subcategories', subCatRoutes);
app.use('/api/stakingRole', stakingRoleRoutes);

const PORT = process.env.NODE_LOCAL_PORT || 3000
app.listen(PORT, () => console.log(`Docker Server running on port ${PORT}`))

process.on('warning', e => console.warn(e.stack));
