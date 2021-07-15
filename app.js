const express = require('express');
const app = express();
const sharp = require('sharp');

// IMPORT ROUTES
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

// USE IMPORTED ROUTES
app.get('/', (req, res) => res.json({message: 'API Server Running'}));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/convert/:size', async (req, res) => {
    const size = +req.params.size;
    try{
        await sharp('images/grim.jpg').resize(size).png().toBuffer((err, data, info) => {
            if(err) return res.status(500).json({error: err});
            res.status(200).set({'Content-Type': 'image/png', 'Content-Length': data.length}).send(data);
        });
        
    }catch(error){
        console.log(error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Running: http://localhost:${port}`));