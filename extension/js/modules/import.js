
  export default function(context, options = {}){
    console.log(context.meta);
    let doc = globalThs.document;
    if (doc) {
      console.log(doc.documentElement);
    }
  };