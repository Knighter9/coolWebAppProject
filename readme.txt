Quick Note: 
- I was not able to get the tunnel.js to work on my personal machine, for this project. I was able to use it on
homework 6 but for some reason I was getting errors with it on this project. I attempted to debug but it didn't work. 

- I move my project folder to a cselabs machine and then just sshed for development. I was able to use port-forwarding 
so that I could see the website in my browser. 

If using the tunnel.js to run then you first must do the following. 

PART A
1. open up a seperate terminal in the direcotry of the project folder
2. cd into the direcotry containing the tunnel.js file which should also be the directory in which you launch the server.js file
3. run the tunnel.js file using the command 
    1. node tunnel.js
4. follow the prompts form the tunnel.js file, when completed proceed to PART B

PART B
To launch the server: 
1. Run the server.js file by entering the command 
    1. node server.js

2. The website should be served on port = 4131. 
3. You can view the website by going to your browser and entering 
    1. http://localhost:4131/


Important Urls. 

- The url "/join" servers a landing page with an option to login or register as new user

- The url "/login" serves a login page

- The url "/register" servers a page to register as a new user

The following urls are for logged in and authenticated users 

- The url "/" is only accessible to users that are loggged in. It shows the 10 most
recent posts or the 10 most popular posts depending on the current post view selected by the user
- There is a pagenation implemenation on this route

- The url "/users/<user_id>/" shows a landing page for an authenticated user. From here the user can select a button 
to view/delete/edit their posts. They also have a link to create a new post


- The url "/createPost" displays a textarea field or an authenticated user to create a post 

- the url "/users/<user_id>/myPosts displays a page containing the users most recent posts. The user can edit or delete posts from this page

- the url "/logout" logs a user out of their current session 


Features implement: 
- authenticated users. Certain pages can only be viewed by registered and authenticated users 
    - implemented with express-session library
    - used bcrypt for password storage

- logged in users can choose to display posts by most recent or most liked posts

- logged in users can like posts, 

- logged in users can edit or delete only their own posts 

- pagenation of posts is implemented. The 10 most liked or recent posts are displayed on any given page. 

- logged in users can create posts. 