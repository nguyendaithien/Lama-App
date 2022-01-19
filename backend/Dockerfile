FROM node:15.0.1-alpine3.10

# Create app directory
WORKDIR /usr/src/app/project-management

# Install dependencies
COPY . ./

RUN npm install

EXPOSE 4000

CMD ["./bootstrap_production.sh"]