FROM python:2.7-stretch

WORKDIR /app

COPY . .

RUN pip install lxml psycopg2 ijson

CMD ["python", "update_db"]
