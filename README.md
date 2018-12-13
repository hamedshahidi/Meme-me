# Meme-me 
## A place for sharing / rating memes

Meme-me is a fun media sharing web application where you can view and rate memes and even upload and share your own ones. It is a window for a quick escape from the rush of the day which leaves a smile on your lips 🙂
 
**Technologies:**<br>
 | Express | JavaScript | HTML/CSS | MySQL | Node JS |
 
  **License:**<br>
 GNU General Public License version 3.0
 
 **Developer team:**<br>
 [Hamed Shahidi](https://www.linkedin.com/in/hamed-shahidi/)<br>
 [Hung Nguyen](https://www.linkedin.com/in/hung-nguyen-tran-gia-860321139/)<br>
 [Kristófer Knutsen](https://www.linkedin.com/in/k-knutsen/)<br>
 

 
 
 
![Poster of Meme-me](https://github.com/hamedshahidi/Meme-me/raw/master/poster_meme_me.png
)

# How to setup a working version of Meme-me for yourself
## Getting started


### Foundation:

- Install Node JS.
- Set up Apache web server.
- Setup Database (MySQL or MariaDB).


### Installation:
- Clone or download the git repository
If cloning in terminal do as follows:
go to the folder you wish to clone the repo into, which will be root folder of the project.
Then execute commands bellow:

 ```
 git init
 ```

 ```
 git clone https://github.com/hamedshahidi/Meme-me.git
 ```
 - Now use this command to install project dependencies:
 ```
 npm install
 ```
- In root folder find  **_.env-template_** file and rename it to  **_.env_** .
- Open  **_.env_**  in a text editor and update it with your database information.
- Use **_database_meme_me.txt_** to create required database and settings.


## Running
Execute the following command in project root folder to run the application:
```
node app.js
```


## You are ready!

In your browser go to
**https://_[your ip address]_/node/** or simply **_[your ip address]_/node/**

...and join the fun :wink:
 












