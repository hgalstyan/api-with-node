
//=================
//====VARIABLES====
//=================
const port = 1337;

let presentUser;
let screenName;
let display;
let displays = [];
let backgroundDisplay;
let userNames = [];
let handles = [];
let following;
let dates = [];
let contents = [];
let retweets = [];
let favs = [];

let names = [];
let avatars = [];
let screenNames = [];
let status = [];

let senderAvi;
let receiverAvi;
let receiverName;
let senderMessages = [];
let senderTimes = [];
let receiverMessages = [];
let receiverTimes = [];
//=================
//===DEPENDECIES===
//=================
const express = require("express");
const app = express();
const config = require("./config");
const Twit = require('twit');
let T = new Twit(config);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);

//=================
//===MIDDLEWARES===
//=================
app.set("view engine", "pug");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Function that calaculates relative time from the present time
function timeDifference(previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = new Date() - new Date(previous);

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}
//Middleware for twitter api
app.use(
    (req, res, next) => {
        // GET request for 5 most recent tweets on your timeline
        T.get('statuses/home_timeline', { count: 5 }, (err, data, res) => {
            if (err) {
                return next(err);
            }
            data.forEach(tweet => {
                let date = tweet.created_at;
                let day = timeDifference(date);
                dates.push(day);
                contents.push(tweet.text);
                retweets.push(tweet.retweet_count);
                favs.push(tweet.favorite_count);
                displays.push(tweet.user.profile_image_url);
                userNames.push(tweet.user.name);
                handles.push(tweet.user.screen_name);
            });
        });
        next();
    }, (req, res, next) => {
        // GET request for 5 most recent following
        T.get('friends/list', { screen_name: screenName, count: 5 }, (err, data, res) => {
            if (err) {
                return next(err);
            }
            const { users } = data;

            users.forEach(user => {
                avatars.push(user.profile_image_url);
                names.push(user.name);
                screenNames.push();
                status.push(user.following);
            });
        });
        next();
    }, (req, res, next) => {
        // GET request for 3 most recent sent DMs
        T.get('direct_messages/sent', { count: 3 }, (err, data, res) => {
            if (err) {
                return next(err);
            }
            data.forEach(element => {
                senderMessages.push(element.text);
                let date = element.created_at;
                let time = timeDifference(date);
                senderTimes.push(time);
            });
            let otherName = data[0].recipient.name;
            receiverName = `   ${otherName}`;
            senderAvi = data[0].sender.profile_image_url;
            receiverAvi = data[0].recipient.profile_image_url;
        });
        next();
    }, (req, res, next) => {
        // GET request for 3 most recent received DMs
        T.get('direct_messages', { count: 3 }, (err, data, res) => {
            if (err) {
                return next(err);
            }
            data.forEach(element => {
                receiverMessages.push(element.text);
                let date = element.created_at;
                let time = timeDifference(date);
                receiverTimes.push(time);
            });
        });
        next();
    }, (req, res, next) => {
        // GET request to verify the user's account
        T.get('account/verify_credentials', (err, data, res) => {
            if (err) {
                return next(err);
            }
            presentUser = data;
            screenName = presentUser.screen_name;
            display = presentUser.profile_image_url;
            backgroundDisplay = presentUser.profile_background_image_url;
            following = presentUser.friends_count;
        });
        next();
    }
);



app.get("/",(req,res)=>{
  res.render("app",{
    dates: dates,
        screenName: screenName,
        display: display,
        displays: displays,
        backgroundDisplay: backgroundDisplay,
        userNames: userNames,
        handles: handles,
        contents: contents,
        retweets: retweets,
        favs: favs,
        following: following,
        avatars: avatars,
        names: names,
        screenNames: screenNames,
        status: status,
        receiverName: receiverName,
        senderAvi: senderAvi,
        receiverAvi: receiverAvi,
        senderMessages: senderMessages,
        senderTimes: senderTimes,
        receiverMessages: receiverMessages,
        receiverTimes: receiverTimes
  });
});
// POST route that handles the AJAX post request from tweet.js
app.post('/', (req, res, next) => {
    // Creates an object with the user info and tweet information
    const jsonResponse = {
        tweetText: req.body.newTweet,
        userInfo: presentUser
    }
    res.json(jsonResponse);  // and sends as a response in JSON format
    // Function that posts to your actual twitter
    T.post('statuses/update', { status: req.body.newTweet }, (err, data, res) => {
        if (err) {
            return next(err);
        } else {
            console.log('Your tweet has been sent');
        }
    });
});

// Error handling middleware
app.use((req, res, next) => {
    const err = new Error('Not found!');
    err.status = 404;
    if (err) {
        return next(err);
    }
});
// Middleware that renders an error page
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status || 400);
    res.render('error');
});

app.listen(port, () =>{
  console.log("Application is running on port: "+ port)
});


server.listen(process.env.PORT, process.env.IP);
