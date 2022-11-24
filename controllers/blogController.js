const bcrypt = require('bcryptjs')
const request = require('../settings/db')
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const {validationResult} = require('express-validator')
const parse = require('../settings/parse')


class BlogController {
    async publishPost(req,res){
        try{
            const {blocks,header} = req.body
            console.log(blocks)
            await parse(await request("INSERT INTO `blog` (`blog_id`,`header`,`blocks`) VALUES('" + shortid.generate() + "','" + header + "','" + JSON.stringify(blocks.blocks) + "')")) 
            
            return res.status(200).json({})
        }
        catch(err){
            console.log(err)
            return res.status(400).json({mes: 'Bad request'})
        }
    }
}

module.exports = new BlogController()