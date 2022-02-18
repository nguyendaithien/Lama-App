## Requirement
* Nodejs and npm (npm will be installed along with npm)
* Mysql

# Run project
## Install dependencies
```
npm i
```

### Create username and password for mysql
```
username: duyle
password: duyle95
```

### Create database and import data
* Create database name project_management with character set utf8mb4 for supporting Vietnameses
```
CREATE DATABASE project_management CHARACTER SET utf8mb4;
```
* Go to folder database_schema under path: /server/database_schema to import data
```
```

* Import data to database `project_management`. Choose the latest version of blog_data
```
mysql -u username -p project_management < ./project_management*.sql
```

### Run the application
```
NODE_ENV=development node index.js
```

### Test API
Go to url/backend/api-docs to test API. Ví dụ 
```
localhost:4000/backend/api-docs
```

### Test

```
npm i -g mocha
mocha -R spec **/*.spec.js --exit
```
