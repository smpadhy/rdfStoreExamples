const path = require('path')
const fs = require('fs')
const rdfstore = require('rdfstore')

let query3= " PREFIX smo: <http://example.org/>\
SELECT ?tweet ?date ?account (GROUP_CONCAT(?hashtag) as ?hashtags) where {\
  ?tweet smo:tweeted_at ?date ;\
         smo:has_hashtag ?hashtag ;\
         smo:tweeted_by ?account ;\
         smo:english_tweet true .\
}\
GROUP BY ?tweet ?date ?account\
"

let data = fs.createReadStream(path.join(__dirname,'/tweet.ttl'))
new rdfstore.Store(function(err, store) {
  store.load("text/turtle",data,function(err, results){
    if(err){
      console.log(err)
    }
    console.log("inside store load", results)
    store.execute(query3,function(success,results3) {
      console.log("------Starting Query 3 ----------")
      console.log("after query 3---->: ",results3)
    })
  })

})
