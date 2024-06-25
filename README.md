# :house_with_garden: House Price Prediction

This repository contains a Python script that generates a model, stores it in a file and then uses it to generate a house price prediction based on the property parameters.

## Stack

- Backend = Flask
- Frontend = React with use of [Material UI](https://mui.com/)

## How to run locally

Use `docker-compose up` to run backend and frontend together in one container with all requirements.

```sh
docker-compose up
# And open http://127.0.0.1:5000
```

## Possible future improvements

Backend:

- [ ] Cache the requests in Redis
- [ ] Use Gunicorn or some WSGI
- [ ] Take care of CORS
- [ ] Add tests for the sample inputs
- [ ] Add versioning to the API + docs endpoint

Frontend:

- [ ] Refine the details - favicon, title etc.
- [ ] Cypress tests

General:

- [ ] Add linter + pre-commit
