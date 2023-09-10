const blogModel = require("../models/blogModel.js");
const authorModel = require("../models/authorModel.js");

const createBlog = async function (req, res) {
    try {
      const data = req.body;
      if (!data.title) {
        return res
          .status(400)
          .send({ status: false, msg: "Blog title is required field" });
      }
      if (!data.body) {
        return res.status(400).send({ status: false, msg: "Blog Content is required" });
      }
 
       //==validating userId==//
       var ObjectId = require('mongoose').Types.ObjectId;
       if (ObjectId.isValid(data.authorId) == false) {
 
         return res.status(400).send({status: false, msg: "Enter a Valid authorId"});
       }
 
      const valid_authorId = await authorModel.findOne({ _id: data.authorId });
      if (!valid_authorId) {
        return res.status(400).send({ status: false, msg: "Please Provide a Valid authorId" });
      }

      if (!data.category) {
        return res.status(400).send({ status: false, msg: "Blog Category is required" });
      }
      
      const newBlog = await blogModel.create(data);
      res
        .status(201)
        .send({
          status: true,
          message: "Blog created successfully",
          data: newBlog,
        });
    } catch (error) {
      return res.status(500).send({ msg: error.message });
    }
  };


  const getBlog = async function (req, res) {
    {
          
          try {
  
  const query = req.query;
  
  if (Object.keys(query).length==0) {
  
    const allBlogs = await blogModel.find({isPublished:true,isDeleted:false});
  
     
    if (allBlogs.length !=0 ) {
  
      return res.status(200).send({status:true, count:allBlogs.length, data:allBlogs})
      
    }
  
  }
  
  if (Object.keys(query).length!=0) {
  
    query.isDeleted = false; query.isPublished = true;

    if (query.tags) {
        let tag = query.tags;
        let tag1 = tag.split(",").map(x => x.trim())
        //if (size1.map(x => isValidSize(x)).filter(x => x === false).length !== 0) return res.status(400).send({ status: false, message: "Size Should be among  S,XS,M,X,L,XXL,XL" })
        query.tags = { $in: tag1 }
      }

        const getByQuery = await blogModel.find(query)
  
             if(getByQuery.length !=0){
              return res.status(200).send({status:true , count:getByQuery.length, data:getByQuery})
            }
  
            if (getByQuery.length ==0){
              return  res.status(404).send({ status: false, msg: "No blogs found by filter"});
            }
    
    
  }
  
        
      } catch (error) {
        res.status(500).send({status:false, error:message.error})
        
      }
      }
    };
 
    //Updates a blog by changing the its title, body, adding tags, adding a subcategory.
const updateBlog = async function (req, res) {
    try {
      let blogId = req.params.blogId;
      let requestBody = req.body;
  
      const { title, body, tags, category, subcategory } = requestBody;
  
     //==validating userId==//
     var ObjectId = require('mongoose').Types.ObjectId;
     if (ObjectId.isValid(blogId) == false) {

       return res.status(400).send({status: false, msg: "Enter a Valid blogId"});
     }
      if (!title) {
        return res.status(400).send({ status: false, message: "Title is required for updatation."});
      }
      if (!body) {
        return res.status(400).send({ status: false, message: "Body is required for updatation."});
      }
      if (!category) {
        return res.status(400).send({ status: false, message: "Category is required for updatation."});
      }
      if (tags) {
        if (tags.length === 0) {
          return res.status(400).send({ status: false, message: "tags is required for updatation."});
        }
      }
      if (subcategory) {
        if (subcategory.length === 0) {
          return res.status(400).send({ status: false, message: "subcategory is required for updatation."});
        }
      }
  
      let Blog = await blogModel.findOne({ _id: blogId });
  
      if (!Blog) {
        return res.status(400).send({ status: false, msg: "No such blog found" });
      }
      
     
      if ( req.body.title || req.body.body || req.body.category || req.body.tags || req.body.subcategory) {
  
        const title = req.body.title;
        const body = req.body.body;
        const category = req.body.category;
        const tags = req.body.tags;
        const subcategory = req.body.subcategory;
        const isPublished = req.body.isPublished;
  
        const updatedBlog = await blogModel.findOneAndUpdate({ _id: req.params.blogId },
          {
            title: title,
            body: body,
            category: category,
            subcategory: subcategory,
            tags: tags,
            //$addToSet: { tags: tags, subcategory: subcategory },
            isPublished: isPublished,
          }, { new: true });
  
        if (updatedBlog.isPublished == true) { updatedBlog.publishedAt = new Date() }
  
        if (updatedBlog.isPublished == false) { updatedBlog.publishedAt = null }
  
        res.status(200).send({ status: true, message: "Successfully updated blog details", data: updatedBlog });
      } else {
        return res.status(400).send({ status: false, msg: "Please provide blog details to update" });
      }
    } catch (err) { res.status(500).send({ status: false, Error: err.message }) }
  };
  
  //DELETE /blogs/:blogId - Mark is Deleted:true if the blogId exists and it is not deleted.
const deleteBlogById = async function (req, res) {
    try {
      //let authorIdFromToken = req.authorId
      let blogId= req.params.blogId
  
       //==validating userId==//
     var ObjectId = require('mongoose').Types.ObjectId;
     if (ObjectId.isValid(blogId) == false) {

       return res.status(400).send({status: false, msg: "Enter a Valid blogId"});
     }
    
  
      let Blog = await blogModel.findOne({ _id: blogId })
      if (!Blog) {
        return res.status(400).send({ status: false, msg: "No such blog found" });
      }
     
      //let data = await blogModel.findOne({ _id: blogId})
      if (Blog.isDeleted == false) {
        let Update = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: Date() }, { new: true })
        res.status(200).send({ status: true, message: "successfully deleted blog" })
      } else {
        return res.status(404).send({ status: false, msg: "Blog already deleted" });
      }
    } catch (err) { res.status(500).send({ status: false, Error: err.message }) }
  };

  // DELETE /blogs?queryParams - delete blogs by using specific queries or filters.
const deleteBlogByQuery = async function (req, res) {
    try {
      const filterQuery = { isDeleted: false, deletedAt: null }
      const queryParams = req.query
     // const authorIdFromToken = req.authorId
  
  
      const { authorId, category, tags, subcategory, isPublished } = queryParams

      
  
      if (authorId) {
         //==validating userId==//
     var ObjectId = require('mongoose').Types.ObjectId;
     if (ObjectId.isValid(authorId) == false) {

       return res.status(400).send({status: false, msg: "Enter a Valid authorId"});
     }
        filterQuery['authorId'] = authorId
      }
      if (category) {
        filterQuery['category'] = category.trim()
      }
      if (isPublished) {
        filterQuery['isPublished'] = isPublished
      }
      if (tags) {
        const tagsArr = tags.trim().split(',').map(tag => tag.trim());
        filterQuery['tags'] = { $all: tagsArr }
      }
      if (subcategory) {
        const subcatArr = subcategory.trim().split(',').map(x => x.trim());
        filterQuery['subcategory'] = { $all: subcatArr }
      }
      const findBlogs = await blogModel.find(filterQuery);
  
      if (Array.isArray(findBlogs) && findBlogs.length === 0) {
        res.status(404).send({ status: false, message: 'No matching blogs found' })
        return
      }
      let blogToBeDeleted = []
      findBlogs.map(blog => {
        if (blog.isDeleted === false) {
          blogToBeDeleted.push(blog._id)
        }
      })
      if (blogToBeDeleted.length === 0) {
        res.status(404).send({ status: false, message: ' No blogs found for deletion.' })
        return
      }
      await blogModel.updateMany({ _id: { $in: blogToBeDeleted } }, { $set: { isDeleted: true, deletedAt: new Date() } })
      res.status(200).send({ status: true, message: 'Blog deleted successfully' });
    } catch (err) {
      return res.status(500).send({ status: false, Error: err.message })
    }
  };
  
  
    


module.exports = {createBlog, getBlog, updateBlog, deleteBlogById, deleteBlogByQuery};