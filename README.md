This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## getting started
node version `v12.19.1`


## Available Scripts

In the project directory, you can run:


### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


### `npm run build`

this command 
before you run it change noEmit to false in 
in tsconfig.json 

"noEmit": false,

this command will output the built version in a director outside, and above the current folder (frontend)
see webpack.config.js
`const BUILD_DIR = path.resolve(__dirname, '../superset/static/assets');`

then with your local superset server running, you can access it on localhost:8090



## testing

We have 1. code tests (unit/integration) using jest and 2. e2e tests using cypress

### `npm run jest`
or run a specific file
`npm run jest src/shared/store/reducers/notebookReducer.test.ts`


### `npm run cypress`