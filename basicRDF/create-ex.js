let rdfstore = require('rdfstore')
const path = require('path')
const fs = require('fs')


let rstore = rdfstore.create(function(err, store){
  return store
})

let query = "PREFIX  rdfs:<http://www.w3.org/2000/01/rdf-schema#>\
  PREFIX  rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
  PREFIX nidm: <http://purl.org/nidash/nidm#>\
  SELECT ?x ?p ?o \
  { ?x ?p ?o .\
    ?x nidm:race 'American' .\
  }\
"

let data = fs.createReadStream(path.join(__dirname,'/../inputFiles/test4.ttl'))
rstore.load("text/turtle",data, function(err, results){
  console.log("inside store load", results)
  rstore.execute(query, function(success, results) {
    console.log("after query",results)
  })
})
