// Define the handlers
const handlers = {
  root: (data, callback) => {
    callback(200, {message: `You're on dummy HTTP REST API. Here is info we get from your request: ${data ? JSON.stringify(data) : 'No data'}`})
  },
  hello: (data, callback) => {
    callback(200, {message: `Hi, there! You passed data: ${data ? JSON.stringify(data) : 'No data'}`});
  },
  notFound: (data, callback) => {
    callback(404, {message: 'Page not found'});
  }
};

// Define a request router
const router = {
  hello: handlers.hello
}

module.exports = { router, handlers };