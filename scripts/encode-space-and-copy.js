const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname,'..','dist');
function walk(d){
  let results = [];
  for(const name of fs.readdirSync(d)){
    const full = path.join(d,name);
    const stat = fs.statSync(full);
    if(stat.isDirectory()) results = results.concat(walk(full));
    else if(name.includes(' ')) results.push(full);
  }
  return results;
}
const files = walk(dist);
console.log('Found', files.length, 'files with spaces');
for(const f of files){
  const dir = path.dirname(f);
  const base = path.basename(f);
  const encoded = base.replace(/ /g, '%20');
  const dest = path.join(dir, encoded);
  if(!fs.existsSync(dest)){
    fs.copyFileSync(f,dest);
    console.log('Copied', f, '->', dest);
  }
}
// Now replace occurrences inside assets bundles
const assetsDir = path.join(dist,'assets');
const bundles = fs.readdirSync(assetsDir).filter(n=>n.endsWith('.js')).map(n=>path.join(assetsDir,n));
for(const orig of files){
  const rel = path.relative(dist, orig).split(path.sep).join('/');
  const encodedRel = rel.replace(/ /g,'%20');
  for(const b of bundles){
    let s = fs.readFileSync(b,'utf8');
    if(s.includes(rel)){
      s = s.split(rel).join(encodedRel);
        // Also fix absolute-leading paths that start with a slash so they work on GitHub Pages
        s = s.split('/modes/').join('./modes/');
        s = s.split("/The Atmosphere/").join('./The Atmosphere/');
        s = s.split('/The%20Atmosphere/').join('./The%20Atmosphere/');
        // handle single-quoted occurrences too
        s = s.split("'/modes/").join("'./modes/");
        s = s.split("'/The Atmosphere/").join("'./The Atmosphere/");
        s = s.split("'/The%20Atmosphere/").join("'./The%20Atmosphere/");
        fs.writeFileSync(b,s,'utf8');
        console.log('Rewrote in bundle', b, rel, '->', encodedRel, 'and fixed leading-slash image paths');
    }
  }
}
console.log('done');

// Ensure any remaining absolute-leading image paths are fixed in bundles
for(const b of bundles){
  let s = fs.readFileSync(b,'utf8');
  const before = s;
  s = s.split('/modes/').join('./modes/');
  s = s.split("/The Atmosphere/").join('./The Atmosphere/');
  s = s.split('/The%20Atmosphere/').join('./The%20Atmosphere/');
  s = s.split("'/modes/").join("'./modes/");
  s = s.split("'/The Atmosphere/").join("'./The Atmosphere/");
  s = s.split("'/The%20Atmosphere/").join("'./The%20Atmosphere/");
  if(s !== before){
    fs.writeFileSync(b,s,'utf8');
    console.log('Fixed leading-slash image paths in bundle', b);
  }
}
