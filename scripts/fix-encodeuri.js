const fs = require('fs');
const path = require('path');
function walk(dir){
  const entries = fs.readdirSync(dir);
  for(const name of entries){
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if(stat.isDirectory()) walk(full);
    else{
      try{
        let s = fs.readFileSync(full, 'utf8');
        if(s.includes('encodeURI("/"+') || s.includes('encodeURI("/')){
          const ns = s.replace(/encodeURI\(\"\/\"\+|encodeURI\(\"\//g, 'encodeURI(');
          fs.writeFileSync(full, ns, 'utf8');
          console.log('Patched:', full);
        }
      }catch(err){ /* ignore non-text files */ }
    }
  }
}
walk(path.join(__dirname,'..','dist','assets'));
console.log('done');
