# Propeller Front End Coding Challenge

[http://propeller-challenge.s3-website-us-east-1.amazonaws.com/](http://propeller-challenge.s3-website-us-east-1.amazonaws.com/)

Looking at the task list I've basically implemented everything - the main reason being that this task was really fun and I really wanted to ship it with all the cooler features !

Implemented features:
- Basic functionality (zooming with +/- buttons)
- Advanced functionality (panning, lazy loading images, smooth scrolling, styling)

There are a few things I'd change if I were to do this challenge again:

- Use WebGL over using the DOM, what I've made works and is performant (enough), but at scale it just won't really work well. Sure I could keep tweaking it to squeeze more performance but really it's just not the right tool for the job.
- Have a app skeleton ready from the get go. I used `create-react-app` but even that wasn't setup exactly how I usually like to dev.
- Implement scoped zooming (zoom origin where the mouse is) instead of the default middle of the image

All in all was very fun.

Cheers,
Michael
