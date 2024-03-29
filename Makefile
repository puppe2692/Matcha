COMPOSE := docker compose
COMPOSE_FILE := compose.yaml

COMPILED := backend/dist \
			backend/node_modules \
			frontend/node_modules

all:
	$(COMPOSE) -f $(COMPOSE_FILE) up --build

ps:
	$(COMPOSE) -f $(COMPOSE_FILE) ps

stop:
	$(COMPOSE) -f $(COMPOSE_FILE) stop

down:
	$(COMPOSE) -f $(COMPOSE_FILE) down -v

clean: down
	docker system prune -f -a --volumes
	rm -rf $(COMPILED)

re: clean all