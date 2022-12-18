const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')
const path = require("path");

class BlogController {
    async deletePost(req,res){
        try{
            const {blog_id} = req.body

            await parse(await request(`DELETE FROM blog WHERE blog_id = "${blog_id}"`) )
            
            return res.status(200).json({})
        }
        catch(err){
            return res.status(400).json({mes: 'Bad request'})
        }
    }

    async publishPost(req,res){
        try{
            const {blocks,header,blog_id} = req.body

            


            if(blog_id && header && blocks.length){
                await parse(await request(`UPDATE blog SET header="${header}", blocks='${JSON.stringify(blocks)}' WHERE blog_id = "${blog_id}"`) )
            }
            else if(header && blocks.length){
                await parse(await request("INSERT INTO `blog` (`blog_id`,`header`,`blocks`,`date`) VALUES('" + shortid.generate() + "','" + header + "','" + JSON.stringify(blocks) + "','" + Date.now() + "')")) 
            }
            
            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
            return res.status(400).json({mes: 'Bad request'})
        }
    }

    async uploadImg(req,res){
        try{
            console.log(1)
            const { image } = req.files;

            if (!image) return res.sendStatus(400);

            const name = Math.random()*100000000000000000;

            image.mv(path.join(__dirname,"../public/blog/" + name + ".png"));
            
            return res.status(200).json({
                "success" : 1,
                "file": {
                    "url" : `http://62.113.96.105:5001/static/blog/${name}.png`,
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