const rp = require('request-promise');

const base_url = "https://www.googleapis.com/books/v1/volumes?q=";
const books_api_url = `${base_url}"inauthor:martin fowler"`;

rp(books_api_url)
  .then(body => {
    console.log(body);
  })
  .catch(err => {
    console.log(err);
  });