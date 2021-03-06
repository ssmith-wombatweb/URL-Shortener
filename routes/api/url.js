const urlModel = require('../../models/url.js');    // Grab URLs model.
const log = require('debug-tool-express'); // Retrieve the logger.

class URL {    // Setup URL class.
  constructor(addr) {
    this.URL = addr;    // Original URL variable.
    // Creates shortened url from Math.random()
    this.shortURL = Math.random()
      .toString(36)
      .substr(2, Math.floor((Math.random() * (10 - 1)) + 1));
  }
}

module.exports = (express) => {    // Export the following function to be used by other modules.
  const router = express.Router();    // Set up router for this module.

  // POST URL CREATION
  router.post('/urls', (req, res) => {
    // Log out short URL creation attempt.
    log.debug({
      logMsg: `Attempting to create a short URL for ${req.body.URL}.`,
      method: req.method,
      url: (req.baseUrl + req.url),
      ip: req.ip,
      level: 'INFO',
    });
    if (req.body.URL) {    // If a URL was sent in the request body.
      // Creates shortened URL with the information submitted and the URL class.
      const postURL = new URL(req.body.URL);

      urlModel.add(    // Run url add passing it the url data, an error function and a success function.
        postURL,
        (error) => {    // The error function takes an error message.
          // Log out server error.
          log.debug({
            logMsg: error,
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'ERROR',
          });

          res.status(500).json(error);    // It responds with a server error and the error message.
        },
        (u) => {    // The success function takes the data from a url.
          // Log out created short URL message.
          log.debug({
            logMsg: `Created a short URL for ${req.body.URL}.`,
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'INFO',
          });
          res.setHeader('Content-Type', 'application/json');
          res.status(201).json({    // It responds with a created status and the url object.
            status: {
              code: 201,
            },
            urls: [u],
          });
        });
    } else {    // Otherwise if there was no URL.
      // Respond with an unprocessable entity error and missing url error message.
      // Log out missing URL message.
      log.debug({
        logMsg: 'No URL provided.',
        method: req.method,
        url: (req.baseUrl + req.url),
        ip: req.ip,
        level: 'ERROR',
      });
      res.status(422).json({
        status: {
          code: 422,
          error: 'You did not provide a url.',
        },
      });
    }
  });

  // GET URLS
  router.get('/urls', (req, res) => {
    // Log out find URLs attempt.
    log.debug({
      logMsg: 'Requesting all URLs.',
      method: req.method,
      url: (req.baseUrl + req.url),
      ip: req.ip,
      level: 'INFO',
    });
    urlModel.findAllUrls(    // Run url findAllUrls passing it an error function and a success function.
      (error) => {    // The error function accepts an error message.
        res.status(500).json(error);     // It responds with a server error and the error message.
        // Log out server error.
        log.debug({
          logMsg: error,
          method: req.method,
          url: (req.baseUrl + req.url),
          ip: req.ip,
          level: 'ERROR',
        });
      },
      (urls) => {    // The success function takes the data from the urls.
        // Request all URLs
        if (urls.length) {    // If there are URLs.
          // Log out the URLs found message.
          log.debug({
            logMsg: 'Received URLs.',
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'INFO',
          });

          res.status(200).json({    // Return the ok status and the urls array.
            status: {
              code: 200,
            },
            urls,
          });
        } else {    // Otherwise respond with no URLS error message.
          // Log out no URLs message.
          log.debug({
            logMsg: 'There are no URLs in the database.',
            method: req.method,
            url: (req.baseUrl + req.url),
            ip: req.ip,
            level: 'ERROR',
          });
          res.status(404).json({
            status: {
              code: 404,
              error: 'There are no urls.',
            },
          });
        }
      });
  });

  // GET URLS BY ID
  router.get('/urls/:id', (req, res) => {
    const request = req;
    request.body.id = req.params.id;    // Grab the ID from the URL.
    // Log out find URL by id attempt.
    log.debug({
      logMsg: `Requested URL with the id of ${request.body.id}.`,
      method: request.method,
      url: (request.baseUrl + request.url),
      ip: request.ip,
      level: 'INFO',
    });

    // Run url findURL passing it the url data, an error function, and a success function.
    urlModel.findUrl(
      request.body,
      (error) => {    // The error function accepts an error message.
        // Log out server error.
        log.debug({
          logMsg: error,
          method: request.method,
          url: (request.baseUrl + request.url),
          ip: request.ip,
          level: 'ERROR',
        });
        res.status(500).json(error);     // It responds with a server error and the error message.
      },
      (u) => {    // The success function takes the data from a url.
        if (u !== null) {    // If the url is not null.
          // Log out found URL by ID.
          log.debug({
            logMsg: `Received URL info for ID ${request.body.id}.`,
            method: request.method,
            url: (request.baseUrl + request.url),
            ip: request.ip,
            level: 'INFO',
          });
          res.status(200).json({              // Respond with the ok status and url.
            status: {
              code: 200,
            },
            urls: [u],
          });
        } else {  // Otherwise respond with no URLS of that id error message.
          // Log out no URL with that ID.
          log.debug({
            logMsg: `There is no url with the id ${request.body.id}.`,
            method: request.method,
            url: (request.baseUrl + request.url),
            ip: request.ip,
            level: 'ERROR',
          });

          res.status(404).json({
            status: {
              code: 404,
              error: `There is no url with the id ${request.body.id}.`,
            },
          });
        }
      });
  });

  // POST URL UPDATE BY ID
  router.post('/urls/:id', (req, res) => {
    const request = req;
    request.body.id = request.params.id;    // Grab the ID from the URL.
    // Log out attempted update by ID.
    log.debug({
      logMsg: `Attempting to update URL with the id of ${request.body.id} to redirect to ${request.body.URL}.`,
      method: request.method,
      url: (request.baseUrl + request.url),
      ip: request.ip,
      level: 'INFO',
    });
    if (request.body.URL) {
      // Run url update passing it the url data, an error function, and a success function.
      urlModel.update(
        request.body,
        () => {    // The error function accepts an error message.
          // Log out no url with id message.
          log.debug({
            logMsg: `There is no url with the id ${request.body.id}.`,
            method: request.method,
            url: (request.baseUrl + request.url),
            ip: request.ip,
            level: 'ERROR',
          });
          // Respond with not found error and no url with the ID error message.
          res.status(404).json({
            status: {
              code: 404,
              error: `There is no url with the id ${request.body.id}.`,
            },
          });
        },
        (u) => {    // The success function takes the updated data from a url.
          // Log out update URL by ID message.
          log.debug({
            logMsg: `Updated URL with the id of ${request.body.id} to redirect to ${u.URL}.`,
            method: request.method,
            url: (request.baseUrl + request.url),
            ip: request.ip,
            level: 'INFO',
          });
          res.status(200).json({    // Respond with the ok status and update URL.
            status: {
              code: 200,
            },
            urls: [u],
          });
        });
    } else {
      // Respond with an unprocessable entity error and missing url error message.
      // Log out missing URL message.
      log.debug({
        logMsg: 'No URL provided.',
        method: req.method,
        url: (req.baseUrl + req.url),
        ip: req.ip,
        level: 'ERROR',
      });
      res.status(422).json({
        status: {
          code: 422,
          error: 'You did not provide a url.',
        },
      });
    }
  });

  router.delete('/urls/:id', (req, res) => {
    const request = req;
    request.body.id = request.params.id;    // Grab the ID form the URL.
    // Log delete URL by ID attempt.
    log.debug({
      logMsg: `Attempting to delete URL with the id of ${request.body.id}.`,
      method: request.method,
      url: (request.baseUrl + request.url),
      ip: request.ip,
      level: 'INFO',
    });
    // Run url destroy passing it the url data, an error function, and a success function.
    urlModel.destroy(
      request.body,
      (error) => {    // The error function accepts an error message.
        // Log out server error message.
        log.debug({
          logMsg: `There is no url with the id ${request.body.id}.`,
          method: request.method,
          url: (request.baseUrl + request.url),
          ip: request.ip,
          level: 'ERROR',
        });
        res.status(500).json(error);    // Respond with server error and error message.
      },
      (u) => {    // The success function takes the response from the deleted url.
        if (u) {    // If the response from the deleted URL is true.
          // Log delete URL by ID success.
          log.debug({
            logMsg: `Deleted URL with the id of ${request.body.id}.`,
            method: request.method,
            url: (request.baseUrl + request.url),
            ip: request.ip,
            level: 'INFO',
          });
          // Respond with the OK status, the id of the delete url and deleted true.
          res.status(200).json({
            status: {
              code: 200,
            },
            urls: [
              {
                id: request.body.id,
                deleted: true,
              },
            ],
          });
        } else {    // If the response from the deleted URL wasn't true.
          // Log out no URL with that ID.
          log.debug({
            logMsg: `There is no url with the id ${request.body.id}.`,
            method: request.method,
            url: (request.baseUrl + request.url),
            ip: request.ip,
            level: 'ERROR',
          });
          // Respond with the 404 not found status and missing url error message.
          res.status(404).json({
            status: {
              code: 404,
              error: `There is no url with the id ${request.body.id}.`,
            },
          });
        }
      });
  });

  return router;    // Return the router.
};
