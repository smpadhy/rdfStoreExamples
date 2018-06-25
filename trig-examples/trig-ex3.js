const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')
const N3 = require('n3')
const rdfHelper = require('../AdvancedRDFGraph/graphCreatev2.js')

global.setup = rdfHelper.rdfStoreSetup()
global.store = setup.store

store.setPrefix("ex", "http://example.org/")
/*store.setPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
store.setPrefix("foaf", "http://xmlns.com/foaf/0.1/")
store.setPrefix("prov", "http://www.w3.org/ns/prov#")
store.setPrefix("dc", "http://purl.org/dc/terms/")
store.setPrefix("xsd", "http://www.w3.org/2001/XMLSchema#")*/

let data = fs.createReadStream(path.join(__dirname,'/alice.ttl'))
let data1 = fs.createReadStream(path.join(__dirname,'/bob.ttl'))
let query = 'PREFIX foaf:<http://xmlns.com/foaf/0.1/> \
PREFIX ex: <http://example.org/> \
PREFIX dc: <http://purl.org/dc/terms/>\
SELECT ?o \
       FROM NAMED <ex:bob> { GRAPH <ex:bob> { ?s foaf:mbox ?o} }';

//var parser = N3.Parser()
//parser.parse(data, console.log)

/*var query = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
                   PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
                   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                   PREFIX : <http://example.org/people/>\
                   INSERT DATA {\
                     GRAPH :alice {\
                       :alice\
                           rdf:type        foaf:Person ;\
                           foaf:name       "Alice" ;\
                           foaf:mbox       <mailto:alice@work> ;\
                           foaf:knows      :bob \
                       .\
                     }\
                   }'
          store.execute(query, function (err, results) {
            var query1 = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
                       PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
                       PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                       PREFIX : <http://example.org/people/>\
                       INSERT DATA {\
                         GRAPH :bob {\
                            :bob\
                                rdf:type        foaf:Person ;\
                                foaf:name       "Bob" ; \
                                foaf:knows      :alice ;\
                                foaf:mbox       <mailto:bob@home> \
                                .\
                         }\
                       }'
              store.execute(query1, function (err, results) {
*/

              //})

  store.load('text/turtle',data,"ex:alice",function(err,results){
    store.load('text/turtle',data1,"ex:bob",function(err,results){
      store.registeredGraphs(function (results, graphs) {
        var values = []

        for (var i = 0; i < graphs.length; i++) {
          values.push(graphs[i].valueOf())
          //console.log("graphs: ", graphs[i])
        }
        console.log("values", values)

      })
      /*store.execute(query, function(err, results){
        console.log("results:  ", results)
      })*/
      var defaultGraph = []
      var namedGraphs  = [{'token':'uri', 'value': 'http://example.org/people/bob'}, {'token':'uri', 'value': 'http://example.org/people/alice'}]
      //var namedGraphs  = [{'token':'uri', 'value': 'ex:bob'},{'token':'uri', 'value': 'ex:alice'}]
      //var namedGraphs  = [{'ex:bob'}, {}'ex:alice']
      //{'token':'uri', 'value': 'ex:alice'}

      store.executeWithEnvironment("SELECT * { ?s ?p ?o }", defaultGraph, namedGraphs, function(err, results) {
        if(err) {
	        console.log("err:", err)
        }
        console.log("results: ", results)
      });
    })
  })
