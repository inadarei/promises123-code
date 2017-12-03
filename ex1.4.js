const request = require('request');

function http_get_p(url) {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

const base_url = "https://www.googleapis.com/books/v1/volumes?q=";
const author = "Martin Fowler";
const books_api_url = `${base_url}"inauthor:${author}"`;

http_get_p(books_api_url)
  .then(function (body) {
    console.log(body);
  })
  .catch(function (err) {
    console.log(err);
  });