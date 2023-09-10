const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({

    title: {type: String,required: true,trim: true},
    body: {type: String,required: true,trim: true},
    authorId: {type: String,required: true,trim: true},
    tags: {type: [String]},
    category: {type: String, required: true,trim: true},
    subcategory: {type: [String]},
    isPublished: {type:Boolean,default:true},
    isDeleted: {type:Boolean,default:false},
    publishedAt: { type: Date, default: Date.now },

     
    
    }
    , { timestamps: true }); 
    
    module.exports = mongoose.model('blogs', blogSchema);