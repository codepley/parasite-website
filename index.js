const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const Post = require('./models/posts')

dotenv.config()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(methodOverride('_method'))

mongoose.connect(process.env.MONGO_URL)
    .then(console.log("Successfully Connected to DataBase"))
    .catch(err => console.log(err))

// let posts = [
//     {
//         id: uuidv4(),
//         title: "First Para",
//         content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
//     },
//     {
//         id: uuidv4(),
//         title: "Second Para",
//         content: "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
//     }
// ]

app.set('view engine', 'ejs');


// Home Page
app.get('/', async (req, res) => {
    const posts = await Post.find({}).sort({$natural:-1});
    res.render('home', {posts});
})

// Page for creating new Para
app.get('/new', (req, res) => {
    res.render('new-para');
})

app.post('/new', async (req, res) => {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.redirect('/');

    /*****************************************************
                Without Mongo
    const {title, content} = req.body;
    posts.unshift({title, content, id: uuidv4()});
    res.redirect('/');
    ******************************************************/
})

// Page to view Para
app.get('/view/:id', async (req, res) => {
    const {id} = req.params;
    const foundPara = await Post.findById(id);
    res.render('view-para', { foundPara });
})

// Route to edit para
app.put('/view/:id', async (req, res) => {

    const post = await Post.findByIdAndUpdate(req.params.id, {$set: req.body,}, {new: true});
    await post.save();
    res.redirect(`/view/${post._id}`);

    // Without MongoDB
    // const {id} = req.params;
    // const newTitleText = req.body.title;
    // const newContentText = req.body.content;
    // const foundPara = posts.find(p => p.id === id);
    // foundPara.title = newTitleText;
    // foundPara.content = newContentText;
    // res.redirect(`/view/${id}`);
})

// Route to delete para
app.delete('/view/:id', async (req, res) => {
    const {id} = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/');
})

// Route to get edit page
app.get('/:id/edit', async (req, res) => {
    const {id} = req.params;
    // const foundPara = posts.find(p => p.id === id);
    const found = await Post.findById(id);
    const foundPara = found._doc;
    res.render('edit-para', {foundPara});
})

app.listen(8080, () => {
    console.log('ON PORT 8080');
})