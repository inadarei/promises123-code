const request = require('request');

const base_url = "https://www.googleapis.com/books/v1/volumes?q=";
const books_api_url = base_url + '"inauthor:martin fowler"';

request(books_api_url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  } else {
    console.log(error);
  }
});