install: install-deps 

start:
	npx nodemon --exec npx babel-node server/bin/app.js

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npm test

lint:
	npx eslint ./src --ext js,jsx

publish:
	npm publish

.PHONY: test