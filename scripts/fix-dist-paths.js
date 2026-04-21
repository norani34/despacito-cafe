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
        if(s.includes('dist/')){
          const ns = s.replace(/dist\//g, '');
          fs.writeFileSync(full, ns, 'utf8');
          console.log('Updated:', full);
        }
      }catch(err){/* skip binary files */}
    }
  }
}
walk(path.join(__dirname, '..', 'dist'));
console.log('Done');
