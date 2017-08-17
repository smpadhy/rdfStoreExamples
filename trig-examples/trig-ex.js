const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')

let data = fs.createReadStream(path.join(__dirname,'/trig-ex.trig'))

new rdfstore.Store(function(err, store) {
  var query = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
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

                    store.registeredGraphs(function (results, graphs) {
                        var values = [];
                        for (var i = 0; i < graphs.length; i++) {
                            values.push(graphs[i].valueOf());
                        }
                        console.log("values", values)
                        //values.sort();
                        //expect(values[0]).toBe('http://example.org/people/alice');
                        //expect(values[1]).toBe('http://example.org/people/bob');
                        store.close(function () {
                            //done();
                        });
                    });
                });
            });



  /*store.load("text/turtle",data, function(err, results){
    store.registeredGraphs(function(success, graphs){
      var graph_uris = graphs.map(function(namedNode){
        console.log(namedNode)
        return namedNode.nominalValue
      })
      console.log("graph_uris: ", graph_uris)
  });*/
  /*store.execute(query1, function(success, results) {
      console.log("after query",results)
    })*/
  //})

})
