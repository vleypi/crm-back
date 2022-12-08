const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')
const path = require("path");

class BlogController {
    async publishPost(req,res){
        try{
            const {blocks,header} = req.body
 
            await parse(await request("INSERT INTO `blog` (`blog_id`,`header`,`blocks`) VALUES('" + shortid.generate() + "','" + header + "','" + JSON.stringify(blocks.blocks) + "')")) 
            
            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
            return res.status(400).json({mes: 'Bad request'})
        }
    }

    async uploadImg(req,res){
        try{
            const { image } = req.files;

            if (!image) return res.sendStatus(400);

            console.log(image)

            const name = Math.random()*100000000000000000;

            image.mv(path.join(__dirname,"../public/blog/" + name + ".png"));
            
            return res.status(200).json({
                "success" : 1,
                "file": {
                    "url" : `http://localhost:5001/static/blog/${name}.png`,
                },
                "stretched": true
            });
        }
        catch(err){
            console.log(err)
            return res.status(400).json({});
        }
    }
}

module.exports = new BlogController()