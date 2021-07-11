const express = require('express');
const app = express();
const sharp = require('sharp');

app.get('/convert', async (req, res) => {
    try{
        await sharp('images/grim.jpg').resize(600).png().toBuffer((err, data, info) => {
            if(err) return res.status(500).json({error: err});
            res.status(200).set({'Content-Type': 'image/png', 'Content-Length': data.length}).send(data);
        });
        
    }catch(error){
        console.log(error);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server Running: http://localhost:${port}`));