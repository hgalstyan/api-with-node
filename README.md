# api-with-node
Many existing services like Twitter, Facebook, Google Maps, Paypal, and Github allow you to leverage their code in your own applications by talking to their APIs. Using Node to connect to 3rd party APIs provides much greater control than using just AJAX. Server-side communication with APIs offers many more options and greater access to data, but it also require stricter authentication methods.

In this project, you'll use Twitter’s REST API to access your Twitter profile information and render it to a user. The page should automatically authenticate access to your Twitter profile. It should use this access to populate three columns on your page:

* Your 5 most recent tweets.
* Your 5 most recent friends.
* Your 5 most recent private messages.

The ability to look at a layout and see the data behind it is an essential skill for full-stack developers. With the provided HTML and CSS starter files, you'll be able to see what the final result should look like. Replace the example data from the HTML file with your own information, which you'll grab directly from Twitter's API.
# Getting Started
## To start using this APP you should go and [create twitter app](https://apps.twitter.com/)

### Extract this information after subscription
 * Consumer Key (API Key)
 * Consumer Secret (API Secret)
 * Access Token
 * Access Token Secret

 Create a **config.js** file in root of your directory that will contain your application’s authentication code 
 
 ```module.exports = {
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...',
  access_token_secret:  '...',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
};
```
### Also type `npm install` in console to install all the dependecies
 After you added **config.js** you should type **npm start** in console in root of the app `\your\path\to\api-with-node`. Open your browser, and type **localhost:'port_shown_in_console'**. Enjoy
  


 
