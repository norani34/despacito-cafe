const fs = require('fs');
const path = require('path');
const basePrefix = '/despacito-cafe/';
const dir = path.join(__dirname, '..', 'dist', 'assets');
function walk(d){
  for(const f of fs.readdirSync(d)){
    const p = path.join(d,f);
    if(fs.statSync(p).isDirectory()) walk(p);
    else{
      try{
        let s = fs.readFileSync(p,'utf8');
        let ns = s
          .replace(/href:\"\//g, `href:\"${basePrefix}`)
          .replace(/href:\'\//g, `href:\'${basePrefix}`)
          .replace(/to:\"\//g, `to:\"${basePrefix}`)
          .replace(/to:\'\//g, `to:\'${basePrefix}`)
          .replace(/location\.pathname===\"\//g, `location.pathname===\"${basePrefix}`)
          .replace(/window.location.origin \+ '\/\//g, `window.location.origin + '${basePrefix}`)
          .replace(/\"\/menu\"/g, `\"${basePrefix}menu\"`)
          .replace(/'\/menu'/g, `'${basePrefix}menu'`);
        if(ns !== s){ fs.writeFileSync(p, ns, 'utf8'); console.log('Rewrote', p); }
      }catch(e){}
    }
  }
}
walk(dir);
console.log('done');
