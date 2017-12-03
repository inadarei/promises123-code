const request = require('request');

function http_get(url) {
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

// Google Books API Reference: https://developers.google.com/books/docs/v1/using
const base_url = "https://www.googleapis.com/books/v1/volumes?q=";

let book_url = `${base_url}isbn:1491956224`; // "Microservice Architecture"
http_get(book_url)
  .then(response_body => {
    const json_response = JSON.parse(response_body);
    const authors = json_response.items[0].volumeInfo.authors;
    let author_promises = [];
    authors.map(author => {
      let author_url = `${base_url}"inauthor:${author}"`;
      author_promises.push(namedRP(author, author_url));
    });

    return Promise.all(author_promises);
  })
  .then(author_responses => {
    console.log("Final results:");
    console.log(author_responses);
  })
  .catch(err => {
    // http request or parsing or something else failed...
    console.log(err);
  });

var namedRP = function (name, url) {
  return new Promise((resolve, reject) => {
    http_get(url)
      .then(body => {
        let response = {};
        json_body = JSON.parse(body);
        response.count = json_body.totalItems;
        response.name = name;
        resolve(response);
      }).catch(err => {
        reject(err);
      });
  });
};

// Expected output:
//
// Final results:
// [ { name: 'Irakli Nadareishvili', count: 1 },
//   { name: 'Ronnie Mitra', count: 1 },
//   { name: 'Matt McLarty', count: 1 },
//   { name: 'Mike Amundsen', count: 4 } ]