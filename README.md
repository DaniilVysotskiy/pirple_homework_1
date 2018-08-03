# A simple "Hello World" API

Creates https server listening on configurable port. To succesfully start the server `key.pem` and `cert.pem` files should be placed to `/config/https` directory.

Returns user's request info on `GET` request to root `/`.

Returns greeting message in JSON format on `GET`/`POST` request to `/hello`.