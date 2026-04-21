const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'dist', 'assets');
function walk(d){
  for(const f of fs.readdirSync(d)){
    const p = path.join(d,f);
    if(fs.statSync(p).isDirectory()) walk(p);
    else{
      try{
        let s = fs.readFileSync(p,'utf8');
        let ns = s.replace(/"\/"\+b\.image\.replace/g, 'b.image.replace');
        ns = ns.replace(/"\/"\+b\.image/g, 'b.image');
        ns = ns.replace(/'\/\'\+b\.image\.replace/g, 'b.image.replace');
        ns = ns.replace(/'\/\'\+b\.image/g, 'b.image');
        if(ns !== s){
          fs.writeFileSync(p, ns, 'utf8');
          console.log('Fixed', p);
        }
      }catch(err){ /* ignore binary files */ }
    }
  }
}
walk(dir);
console.log('done');
