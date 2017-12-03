const request = require('request');

function http_get_p(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

const base_url = "https://www.googleapis.com/books/v1/volumes?q=";

function is_author_popular(author) {
  const books_api_url = `${base_url}"inauthor:${author}"`;

  return new Promise((resolve, reject) => {
    http_get_p(books_api_url).then(body => {
      const json_body = JSON.parse(body);
      if (json_body.totalItems > 10) {
        resolve(`${author} is a very active author!`);
      } else if (json_body.totalItems > 0) {
        resolve(`${author} has published less than 10 books.`);
      } else {
        reject(`${author} is not a published author!`);
      }
    });
  })
}

let author = "Martin Fowler";
is_author_popular(author).then((result) => {
  console.log(result); // only success scenario executes here
}).catch((err) => {
  console.log('ERROR: ' + err);
});

author = "Irakli Nadareishvili";
is_author_popular(author).then((result) => {
  console.log(result); // only success scenario executes here
}).catch((err) => {
  console.log('ERROR: ' + err);
});

author = "Bogus Author";
is_author_popular(author).then((result) => {
  console.log(result); // only success scenario executes here
}).catch((err) => {
  console.log('ERROR: ' + err);
});