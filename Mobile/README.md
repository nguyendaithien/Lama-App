# Mobile app of project

This is mobile app of project. Admins can do everything with this app

---

## Main tech

- `Node.js` with `npm`, `yarn` for dependencies management.
- `React Native` (also known as RN) is a popular JavaScript-based mobile app framework that allows you to build natively-rendered mobile apps for iOS and Android.
- `Typescript` language (support build to js files with absolute path)
- `Redux` is a pattern and library for managing and updating application state, using events called "actions". With combo:
  - `Redux Toolkit`
  - `Redux persist`
  - `RN-async-storage`

---

## Development

### Access folder Mobile

```
cd Mobile
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

### Setting up the development environment to build app

I _recommend_ you use `React Native CLI`

Try link below to setup:
https://reactnative.dev/docs/environment-setup

Then, you will need to run this script to install dependencies.

```
yarn
```

Build and connect with Metro

```
yarn start
```

Turn on Android device simulator

```
yarn android
```

For run with database (I used Mysql), you can config it in `.env` file
