Server of project

---

## Main tech

- `Node.js` with `npm`, `yarn` for dependencies management.
- `Express` framework for building a RESTful API server
- `Typeorm` for work easier with database
- `Mysql`
- `Typescript` language (support build to js files with absolute path)
- `Winston` for logger (already installed with Vietnamese timezone)
- `OpenAPI` for API documentation.

---

## Development

### Access folder

```
cd server
```

### Prepare

I used `node` version `14.17.4` (The `lts` version at the time I write this), but you can also install other `lts` version

```
nvm install 14.17.4
```

or

```
nvm install lts
```

I _recommend_ you to install `yarn` at global scope before install dependencies of this source code

```
npm install -g yarn
```

The first time, you will need to run this script to install dependencies.
`

```
yarn
```

For run with database (I used Mysql), you can config it in `.env` file and some files in folder `src/config`.

Normally, you have to create a schema before run any code relate with database.

**Script to build source code to JS:**

```
yarn build
```

**Then just start the server with**

```
yarn start
```

_To see some other scripts you can open file `package.json` for detail._

---
