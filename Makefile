.PHONY: test
test: build-server build-client test-server test-client

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

.PHONY: client-production-build
client-production-build:
	docker-compose run client npm run build

.PHONY: setup-db
setup-db:
	docker-compose run setup-db

.PHONY: run-server
run-server:
	docker-compose up -d server

.PHONY: deploy
deploy: client-production-build run-server
