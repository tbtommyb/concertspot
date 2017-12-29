.PHONY: test
test: build-server test-server

.PHONY: test-server
test-server:
	docker-compose run server npm run test

.PHONY: build-server
build-server:
	docker-compose build server
