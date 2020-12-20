install: install-deps

start:
	heroku local -f Procfile.dev

start-backend:
	npx nodemon --exec npx babel-node ./server/bin/app.js

start-frontend:
	npx webpack-dev-server

install-deps:
	npm install

build:
	npm run build

test:
	npm test

lint:
	npx eslint . --ext js,jsx --fix

publish:
	npm publish

.PHONY: test