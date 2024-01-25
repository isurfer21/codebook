# codebook
A web-based interface to coding environments for any programming languages.

## Introduction

**Codebook** is a [node.js](https://nodejs.org/en) + [react](https://react.dev/) based web application to provide a coding environment, similar to [Jupyter Notebook](https://jupyter.org/) for any programming language, if it has a CLI for its SDK.

## Prerequisite

To use codebook, install the compilers for all of the languages that you intend to use in the application, and ensure that those compilers are globally accessible via command line.

## Getting started

To resolve the API and App dependencies, run this command:

```sh
npm install
```

To start the application, run this command:

```sh
npm start 
```

### Development

To start the application in **development** mode, run this command:

```sh
npm run dev
```

### Troubleshoot

Normally, installation process also generate the production build of the App. However, if the `./app/build` directory does not exist, run the following command to create it:

```sh
npm run app-build
```