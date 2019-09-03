const bodyParser = require("body-parser"),
	  methodOverride = require("method-override"),
	  expressSanitizer = require("express-sanitizer"),
	  mongoose = require("mongoose"),
	  express = require("express"),
	  app = express();

// App Configuration
mongoose.connect("mongodb://localhost/blog", {useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public")); // Serve custom css from public directory
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// Mongoose Model Configuration
const blogSchema = new mongoose.Schema({
	title: String,
	image: 
		{
			type: String, 
			default: "https://images.unsplash.com/photo-1567074679818-fc11171fab11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80"
		},
	body: String,
	created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

// Routes

app.get("/", function(req, res) {
	res.redirect("/blogs");
})

// Index Route
app.get("/blogs", function(req, res) {
	Blog.find({}, function(err, blogs) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("index", {blogs: blogs});
		}
	});
});

// New Route
app.get("/blogs/new", function(req, res) {
	res.render("new");
});

// Create Route
app.post("/blogs", function(req, res) {
	// Sanitize blog body
	req.body.blog.body = req.sanitize(req.body.blog.body);
	// Create blog from form
	Blog.create(req.body.blog, function(err, newBlog) {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect("/blogs");
		}
	});
	
});

// Show Route
app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if (err) {
			res.redirect("/blogs");
		}
		else {
			res.render("show", {blog: blog});
		}
	});
});

// Edit Route
app.get("/blogs/:id/edit", function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if (err) {
			res.redirect("/blogs");
		}
		else {
			res.render("edit", {blog: blog});
		}
	});
});

// Update Route
app.put("/blogs/:id", function(req, res) {
	// Sanitize blog body
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
		if (err) {
			res.redirect("/blogs");
		}
		else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// Delete Route
app.delete("/blogs/:id", function(req, res) {
	Blog.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/blogs");
		}
		else {
			res.redirect("/blogs");
		}
	});
});


// Set up server
app.listen(3000, function() {
	console.log("Server has started on Port 3000");
});