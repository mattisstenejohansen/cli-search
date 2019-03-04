'use strict'
/* =====================|
    Importing modules
|======================*/
// UI
const chalk = require('chalk'); // for coloring CLI text
const boxen = require('boxen'); // to create the Infinity Logo
const ora = require('ora'); // spinning and loading animations

// Prompt
const { Input, MultiSelect } = require('enquirer'); // main module for prompts
const opn = require('opn'); // open links from the terminal

// Local database
const low = require('lowdb') // simple JSON database
const FileSync = require('lowdb/adapters/FileSync') // belongs to above package
const Store = require('data-store'); // cache

// System
const sleep = require('sleep'); // to pause and start processes

/* =====================|
  Setting up application
|======================*/

// Setting up the database
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ engines: [], search: {}, count: 0 }) // Set some defaults (required if the JSON file is empty)
  .write()

/* =====================|
    Start application
|======================*/

// Prints the logo to the terminal
console.log(boxen('Infinity Search', {padding: 1, margin: 1, borderStyle: 'double'}));

// sleep.sleep(1) // not during dev

// Introduction subtitle
console.log(chalk.green(
    'Welcome to the ' +
    chalk.blue.underline.bold('Infinity Search Engine') +
    '!'
));


/* =====================|
  Search Engine Logic
|======================*/

// a function to store and retrieve search engine choices.
function engine(selectedEngine, inquiry){
	// console.log(answer); // quickly test which engines are selected
	// If Google is selected
	if (selectedEngine.includes('Google')){
		console.log('Its found at Google!')
		opn('http://www.google.com/search?q=' + process.argv[2] + ' ' + process.argv[3])
		// TODO: add searches and engine chosen to db.json
	} else if (selectedEngine.includes('YouTube')){
		console.log('Its found at YouTube!')
		opn('https://www.youtube.com/results?search_query=' + process.argv[2] + ' ' + process.argv[3])
		// TODO: add searches and engine chosen to db.json
	}

	return selectedEngine;
}

/* =====================|
  Choose Search Engine(s)
|======================*/



const getSearchEngine = new MultiSelect({
  name: 'engines',
  message: 'Pick the search engines you want to search: ',
	history: {
		store: new Store({ path: `${__dirname}/engines.json` }),
		autosave: true
	},
  choices: [
    { name: 'Google', value: '#00ffff' },
    { name: 'Yahoo!', value: '#000000' },
    { name: 'YouTube', value: '#0000ff' },
    { name: 'vimeo', value: '#ff00ff' },
    { name: 'Shodan', value: '#008000' },
  ],
  onSubmit() {
    if (this.selected.length === 0) {
      this.enable(this.focused);
    }
	}
})
const search = new Input({
	  name: 'search',
	  message: 'Search the selected engines:',
	  history: {
	    store: new Store({ path: `${__dirname}/search.json` }),
	    autosave: true
	  }
	});

getSearchEngine.run()
  .then(selectedEngine => engine(selectedEngine)) // sends the input to the engines() function
  .catch(console.error); // catch if there is a promise error

	/* =====================|
	  			 Search
	|======================*/


	search.run()
	  .then(inquiry => engine(inquiry))
	  .catch(console.error);

/* DB logic to copy/paste
	// Add a post
	db.get('engines')
	  .push({ id: 1, title: 'Google'})
	  .write()

	// Set a user using Lodash shorthand syntax
	db.set('user.name', 'typicode')
	  .write()

	// Increment count
	db.update('count', n => n + 1)
	  .write()
*/
