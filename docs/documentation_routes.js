// Core dependencies
const fs = require('fs')
const path = require('path')

// NPM dependencies
const express = require('express')
const marked = require('marked')
const router = express.Router()

// Getting data from Google Sheets 
const request = require('request')
const csv = require('csvtojson')

// Local dependencies
const utils = require('../lib/utils.js')

// Page routes

// Docs index
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/install', function (req, res) {
  res.render('install')
})

// Pages in install folder are markdown
router.get('/install/:page', function (req, res) {
  // If the link already has .md on the end (for GitHub docs)
  // remove this when we render the page
  if (req.params.page.slice(-3).toLowerCase() === '.md') {
    req.params.page = req.params.page.slice(0, -3)
  }
  redirectMarkdown(req.params.page, res)
  var doc = fs.readFileSync(path.join(__dirname, '/documentation/install/', req.params.page + '.md'), 'utf8')
  var html = marked(doc)
  res.render('install_template', { document: html })
})

// Redirect to the zip of the latest release of the Prototype Kit on GitHub
router.get('/download', function (req, res) {
  var url = utils.getLatestRelease()
  res.redirect(url)
})

// Examples - examples post here
router.post('/tutorials-and-examples', function (req, res) {
  res.redirect('tutorials-and-examples')
})

// Example routes

// Passing data into a page
router.get('/examples/template-data', function (req, res) {
  res.render('examples/template-data', { name: 'Foo' })
})

// Branching
router.post('/examples/branching/over-18-answer', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  const over18 = req.session.data['over-18']

  if (over18 === 'false') {
    res.redirect('/docs/examples/branching/under-18')
  } else {
    res.redirect('/docs/examples/branching/over-18')
  }
})

// Success alerts

router.get('/examples/success-alerts/result', function (req, res) {
    res.render('examples/success-alerts/answer', { showMessage: true })
})

// Error states

// Sets up a check for values in a form input
const isValueSet = (value) => {
  if (value.length > 0) {
    return true
  } else {
    return false
  }
}

router.get('/examples/error-states/result', function (req, res) {
  let nameValid = isValueSet(req.query.your_name_2)
  let foodValid = isValueSet(req.query.fav_food)

  let nameInput = {
    label: {
      text: "What is your name?",
      classes: "govuk-label--m"
    },
    id: "your-name-2",
    name: "your_name_2",
    value: data['your_name_2'],
    classes: "govuk-!-width-one-half"
  }
  
  if (nameValid === false ){
    nameInput.errorMessage = {
      html: 'Enter your name'
    }
  }

  if ( (nameValid) & (foodValid) ) {
    res.render('examples/error-states/answer', { showMessage: true, nameInput: nameInput  })
  } else {
    res.render('examples/error-states/index', { showError: true })
  }
})

// Getting data from Google Sheets
// https://github.com/alphagov/govuk-prototype-kit/pull/682/files

// Example - Google Sheets integration
router.get('/examples/data-from-google-sheets', function (req, res) {
  var googleSheetsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYoPJa7zlceGJiuiMLgcv_Emght1AgfsKd40rySrNqIjDpVRmpcalDuEGp9AlyoWll74I974oLLXzw/pub?gid=0&single=true&output=csv";
  
  csv()
  .fromStream(request.get(googleSheetsUrl))
  .then((googleSheetsData)=>{
    res.render('examples/data-from-google-sheets/example', { googleSheetsData: googleSheetsData } )
  });

})

module.exports = router

// Strip off markdown extensions if present and redirect
var redirectMarkdown = function (requestedPage, res) {
  if (requestedPage.slice(-3).toLowerCase() === '.md') {
    res.redirect(requestedPage.slice(0, -3))
  }
  if (requestedPage.slice(-9).toLowerCase() === '.markdown') {
    res.redirect(requestedPage.slice(0, -9))
  }
}
