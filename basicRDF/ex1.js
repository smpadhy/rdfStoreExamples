/**
This does not work
**/

var rdfstore = require('rdfstore');

new rdfstore.Store(function(err, store){
  store.execute('LOAD <http://dbpedia.org/resource/Tim_Berners-Lee> INTO GRAPH <http://example.org/people>', function(err,results1) {
    store.setPrefix('dbp', 'http://dbpedia.org/resource/');

    store.node('dbp:Tim_Berners-Lee',  "http://example.org/people", function(err, graph) {

      /*var peopleGraph = graph.filter(store.rdf.filters.type(store.rdf.resolve("foaf:Person")));
      console.log(peopleGraph)*/
      console.log("lee graph:", graph.toArray())
    })
    store.registeredGraphs(function (results, graphs) {
        var values = []
        for (var i = 0; i < graphs.length; i++) {
          values.push(graphs[i].valueOf())
        }
        console.log("values: ", values)
        store.execute('PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
                 PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
                 PREFIX : <http://example.org/>\
                 SELECT ?s FROM NAMED <http://example.org/people> { GRAPH ?g { ?s rdf:type foaf:Person } }',
                 function(err, results) {
                   console.log(results)
                   //console.log(peopleGraph.toArray()[0].subject.valueOf() === results[0].s.value);

                 });
    })


  })

});
