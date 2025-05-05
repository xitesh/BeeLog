const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


if (!fs.existsSync('data.json')) {
    fs.writeFileSync('data.json', '[]', 'utf-8');
}

app.get('/', (req, res) => {
    
    const blogData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    res.render('home', { blogs: blogData});
})

app.get('/new', (req, res) => {
    res.render('new');
})

app.post('/new', (req, res) => {
    const { title, description, image, author, created_on } = req.body;
    const blogs = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

    const now = new Date(created_on);
const formatted = now.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short', // or 'long' for full month
  year: 'numeric'
});

    const newBlog = {

        id: Date.now(),
        title,
        description,
        image,
        author,
        created_on:formatted
    }

    blogs.push(newBlog);
    fs.writeFileSync('data.json', JSON.stringify(blogs, null, 2));
    res.redirect('/')
    // console.log(body)
})

app.get('/show/:id', (req, res) => {
    const id = Number(req.params.id); // Convert to number if your blog ids are numbers
    const blogs = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

    const blog = blogs.find(b => b.id === id);

    if (!blog) {
        return res.status(404).send('Blog not found');
    }

    res.render('show', { blog });
})

app.post('/delete/:id', (req, res) => {
    const id = Number(req.params.id);
    let blogs = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    blogs = blogs.filter(blog => blog.id !== id);
    fs.writeFileSync('data.json', JSON.stringify(blogs, null, 2));
    res.redirect('/');
})

app.listen(3000, () => {
    console.log(`Server is running at http://127.0.0.1:3000`);
})

