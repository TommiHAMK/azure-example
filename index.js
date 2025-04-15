const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();

const app = express();

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars'); 

const dbURI ='mongodb+srv://'+process.env.DBUSERNAME+':'+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'+process.env.DB+'?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI)
.then((result) =>
{
    console.log('Connected to DB');
})
.catch((err) => {
    console.log(err);
});

const Product = require('./models/Product');

app.get('/products' , async (req,res) => {
    try {
        const products = await Product.find();
        res.render('products',
            {
                title: 'Our Products',
                products: products.map(product => product.toJSON())
            }
        )
    }
    catch (error) {
        res.status(404).render('products', {
            title: 'Something is wrong'
        })
        console.log(error);
    }
});

app.get('/', (req,res) => {
    res.render('products',
        {
            title: 'Homepage'
        }
    )
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Listening on port ' + PORT));
