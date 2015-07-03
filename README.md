Shortly: Deployment
==============

In this sprint, you will learn about deployment and various build tools. The tools and techniques you gain experience with here will allow you to kick off your group project with a bang.

## Orientation

We're giving you a canonical version of the Shortly-express repo to start with. Before diving in, do a code review. Take a few minutes with your partner and compare this canonical repo to your work from the last sprint. How was your app architected differently? Could your code be DRYer, or was it well organized? Are there any functional differences between your apps and this one? You can often learn as much from reading code as you can from writing it.


## Basic requirements

### Check out the Heroku tutorials
 * [ ] Create a free account at Heroku and [try the deployment tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

### Reconfigure your app to work in both environments (locally and in production)

 * [ ] Change your port number in shortly.js to 'process.env.PORT || 3468'. This will use either Heroku's default port number when it's deployed, and will use port 3468 on your local environment.

## Create a Gruntfile:

**Note:** Building and deploying an app involves a number of important tasks that need to be performed in a certain order. When you're trying to rapidly prototype your app, this can become repetitive and is prone to error. Grunt is a super useful tool that can automate a wide variety of tasks for you. Still not convinced? Read [this](http://24ways.org/2013/grunt-is-not-weird-and-hard/) article about the advantages of using Grunt. Let Grunt do the work!

 * [ ] Use [Grunt](http://gruntjs.com/) to create a build script
 * [ ] Concatenate files before deployment
 * [ ] Uglify your code using Grunt before deployment -- Don't forget to update your views to point to the minified versions of your asset files in the public/dist folder (CSS, JS). The folder public/dist is already .gitignored for you, but make sure that you aren't committing your compiled scripts and CSS to your Github repo.
 * [ ] Run jshint before deployment -- if jshint fails, the build process should exit
 * [ ] Run your Mocha tests before deployment -- if any tests fail, the build process should exit

When you're done, you will have programmed a hierarchy of tasks that can be run with a single command. Run `grunt deploy` to build and host your app on a local dev server, and run `grunt deploy --prod` when you're ready to push up to the production server (Heroku).


## Build and deploy a personal website

A personal website is great for your brand. It does not need to be overly fancy, but should showcase some of your front end abilities as a software engineer. **OPTIONAL**: You can use a service like [Namecheap](http://www.namecheap.com) to register a cheap personal domain. Your website should include the following:

  * [ ] Your contact information
  * [ ] A link to your Github page
  * [ ] A link to your Linkedin page
  * [ ] A link to your blog
 
This is a great opportunity to look into frameworks that you are interested in, whether it's one we've already covered or one you would like to look more into. If you plan on diving into an unfamilar framework, start with a basic "Hello World" tutorial and then deploy it - then start adding buttons, and design, etc, and slowly build up to your personal page. 

