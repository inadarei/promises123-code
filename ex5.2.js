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

async function msa_authors() {
  let book_url = `${base_url}isbn:1491956224`; // "Microservice Architecture"
  const book_info = await http_get(book_url);
  const json_response = JSON.parse(book_info);
  const authors = json_response.items[0].volumeInfo.authors;
  let author_promises = [];
  authors.map(author => {
    let author_url = `${base_url}"inauthor:${author}"`;
    author_promises.push(namedRP(author, author_url));
  });

  return Promise.all(author_promises);
}

async function run() {
  try {
    const author_responses = await msa_authors();
    console.log("Final results:");
    console.log(author_responses);
  } catch (err) {
    // http request or parsing or something else failed...
    console.log(err);
  }
}
run();

async function namedRP (name, url) {
  const author_info = await http_get(url);
  json_body = JSON.parse(author_info);
  let response = {};
  response.count = json_body.totalItems;
  response.name = name;
  return response;
};

// Expected output:
//
// Final results:
// [ { name: 'Irakli Nadareishvili', count: 1 },
//   { name: 'Ronnie Mitra', count: 1 },
//   { name: 'Matt McLarty', count: 1 },
//   { name: 'Mike Amundsen', count: 4 } ]
