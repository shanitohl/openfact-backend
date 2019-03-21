'use strict'

const mongoose = require("mongoose");

const User = require("../models/user");

function signUp(req, res) {
    const user = new User({
        email:req.body.email,
        displayName:req.body.displayName
    });

    user.save((err)=>{
        if(err) res.status(500).
    })

}

function signIn(req, res) {

}

module.exports = {
    signUp,
    signIn
}