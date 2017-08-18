const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const uuid = require('uuid-random')
const loadJsonFile = require('load-json-file')
const jquery = require('jQuery')
const moment = require('moment')
const rdfHelper = require('./graphCreatev2.js')

global.setup = rdfHelper.rdfStoreSetup()
global.store = setup.store
//global.rgraph = setup.graph
store.setPrefix("ex", "http://example.org/")
store.setPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
store.setPrefix("foaf", "http://xmlns.com/foaf/0.1/")
store.setPrefix("prov", "http://www.w3.org/ns/prov#")
store.setPrefix("dc", "http://purl.org/dc/terms/")
store.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#")


let query = 'PREFIX xsd:<http://www.w3.org/2001/XMLSchema#> \
PREFIX ex:<http://example.org/> \
SELECT * \
FROM NAMED <http://example.org/test> \
{GRAPH <http://example.org/test> { ?s ex:date ?date . \
  FILTER (?date > "2014-05-23T10:20:13+05:30"^^xsd:dateTime) \
} }'

let data = fs.createReadStream(path.join(__dirname,'/dateTest.ttl'))
store.load('text/turtle',data, "ex:test",function(err,results){
  store.graph("ex:test", function(err, graph){
    // process graph
    console.log("ex:test graph: ", graph.toArray())
  })
  store.execute(query,function(err, results1){
    if(err){
      console.log("err")
    }
    console.log("ex:test results :  \n", results1)
  })
  store.registeredGraphs(function (results, graphs) {
        var values = []
        for (var i = 0; i < graphs.length; i++) {
          values.push(graphs[i].valueOf())
        }
        console.log("values: ", values)
  })
})

let query1 = 'PREFIX xsd:<http://www.w3.org/2001/XMLSchema#> \
PREFIX ex:<http://example.org/> \
SELECT * \
FROM NAMED <http://example.org/sub2> \
{GRAPH <http://example.org/sub2> {?s ex:date ?o. \
  FILTER (?o > "2014-05-23T10:20:13+05:30"^^xsd:dateTime) \
} }'
//FILTER (?date > "2014-05-23T10:20:13+05:30"^^xsd:dateTime) \
var graph1 = store.rdf.createGraph()

let n1 = store.rdf.createNamedNode(store.rdf.resolve("ex:sub2"))
graph1.add(store.rdf.createTriple(n1,
    store.rdf.createNamedNode(store.rdf.resolve("ex:date")),
    store.rdf.createLiteral("2014-05-23T11:20:13+05:30",null,"http://www.w3.org/2001/XMLSchema#dateTime")))
graph1.add(store.rdf.createTriple(n1,
  store.rdf.createNamedNode(store.rdf.resolve("ex:date")),
  store.rdf.createLiteral(moment().format(),null,"http://www.w3.org/2001/XMLSchema#dateTime")))

store.insert(graph1, "ex:sub2", function (err, results) {
  store.graph("ex:sub2", function(err, graph){
    // process graph
    //console.log("ex:sub2 graph: ", graph.toArray())
  })
  store.execute(query1, function(err, results1){
    if(err){
      console.log("err")
    }
    console.log("ex:sub2 results : ", results1)
  })
})
