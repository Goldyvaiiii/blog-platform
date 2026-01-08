const express = require('express');
const router = express.Router();
const post = require('../models/post');




router.get('', async (req, res) => {
  const locals = {
    title: "NodeJS Blog",
    description: "Simple Blog Website using Express and Mongo Db"
  }

  try {
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }





});



router.get('/post/:id', async (req, res) => {
  try {

    let slug = req.params.id;

    const data = await post.findById(slug);

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
      currentRoute: `/post/${slug}`
    }

    res.render('post', { locals, data, currentRoute: `/post/${slug}` });

  } catch (error) {
    console.log(error);
  }
});


router.post('/search', async (req, res) => {
  try {

    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });


  } catch (error) {
    console.log(error);
  }
});












router.get('/about', (req, res) => {
  const locals = ({
    title: "About",
    description: "Simple Blog created with NodeJs, Express & MongoDb."
  })
  res.render('about', {
    locals,
    currentRoute: '/about'
  });
});

router.get('/contact', (req, res) => {
  const locals = {
    title: "Contact",
    description: "Simple Blog created with NodeJs, Express & MongoDb."
  }
  res.render('contact', {
    locals,
    currentRoute: '/contact'
  });
});


async function insertPostData() {
  try {
    await post.deleteMany({});
    await post.insertMany([
      {
        title: "Building a Blog",
        body: "This is the body text"
      },
      {
        title: "Node.js Basics",
        body: "Learn the fundamentals of Node.js and how to build scalable applications."
      },
      {
        title: "Understanding MongoDB",
        body: "A comprehensive guide to NoSQL databases and how MongoDB stores data."
      },
      {
        title: "Express.js Routing",
        body: "Mastering routing in Express.js for better application structure."
      },
      {
        title: "EJS Templating",
        body: "How to use EJS to generate dynamic HTML content in your Node.js apps."
      },
      {
        title: "Deployment Strategies",
        body: "Best practices for deploying your Node.js application to the cloud."
      },
      {
        title: "Frontend Integration",
        body: "Connecting your backend API with a modern frontend framework."
      },
      {
        title: "Authentication Flows",
        body: "Implementing secure user authentication with JWT and sessions."
      },
      {
        title: "Error Handling",
        body: "Techniques for managing errors gracefully in production environments."
      },
      {
        title: "Performance Optimization",
        body: "Tips and tricks to make your Node.js application run faster."
      },
    ]);
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;

