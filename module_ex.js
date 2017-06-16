const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const uuid = require('uuid-random')
const loadJsonFile = require('load-json-file')
const jquery = require('jQuery')

const rdfHelper = require('./graphCreate.js')

global.setup = rdfHelper.rdfStoreSetup()
global.store = setup.store
global.rgraph = setup.graph

loadJsonFile('proj-plan-Test8-a159e2a2.json').then(ob => {
      console.log("ob:==>", ob)
      rdfHelper.saveToRDFstore(ob)
})
