FROM python:3.11-slim

WORKDIR /usr/src/app

COPY . .

RUN pip install --no-cache-dir -r requirements_SF.txt

CMD ["python", "scraper_falseo.py"]
