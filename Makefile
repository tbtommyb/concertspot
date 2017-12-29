.PHONY: test
test: build-server test-server test-client

.PHONY: test-server
test-server:
	docker-compose run server npm run test

.PHONY: test-client
test-client:
	docker-compose run client npm run test

.PHONY: build-server
build-server:
	docker-compose build server

.PHONY: build-client
build-client:
	docker-compose build client
