.PHONY: help dev test migrate migration clean install lint

help:
	@echo "ObsidianList Backend - Available Commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Run development server with hot reload"
	@echo "  make test       - Run tests with coverage"
	@echo "  make migrate    - Apply database migrations"
	@echo "  make migration  - Generate new migration (use MSG='message')"
	@echo "  make lint       - Run linters (ruff, black)"
	@echo "  make clean      - Remove cache and temp files"

install:
	pip install -r requirements.txt

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest --cov=app --cov-report=term-missing --cov-report=html

migrate:
	alembic upgrade head

migration:
	@if [ -z "$(MSG)" ]; then \
		echo "Error: Please provide a message with MSG='your message'"; \
		exit 1; \
	fi
	alembic revision --autogenerate -m "$(MSG)"

lint:
	ruff check app/ --fix
	black app/

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf htmlcov
	rm -rf .coverage
