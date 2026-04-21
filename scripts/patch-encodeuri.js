const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'dist', 'assets');
function walk(d){
  for(const f of fs.readdirSync(d)){
    const p = path.join(d, f);
    if(fs.statSync(p).isDirectory()) walk(p);
    else{
      let s = fs.readFileSync(p, 'utf8');
      if(s.includes('encodeURI("/"+') || s.includes('encodeURI("/')){
        const ns = s.replace(/encodeURI\(\"\/\"\+|encodeURI\(\"\//g, 'encodeURI(');
        fs.writeFileSync(p, ns, 'utf8');
        console.log('Patched', p);
      }
    }
  }
}
walk(dir);
console.log('Done');
