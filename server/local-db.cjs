/* Node's built-in SQLite. D1-compatible statements, no packages. */
const {DatabaseSync}=require('node:sqlite');
const fs=require('node:fs'),path=require('node:path');
function openDatabase(filename){
 const sqlite=new DatabaseSync(filename);sqlite.exec('PRAGMA foreign_keys = ON;');
 sqlite.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY);');
 const dir=path.resolve(__dirname,'../database/migrations');
 for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.sql')).sort())if(!sqlite.prepare('SELECT name FROM local_migrations WHERE name = ?').get(name)){
  sqlite.exec('BEGIN');try{sqlite.exec(fs.readFileSync(path.join(dir,name),'utf8'));sqlite.prepare('INSERT INTO local_migrations (name) VALUES (?)').run(name);sqlite.exec('COMMIT');}catch(error){sqlite.exec('ROLLBACK');throw error;}
 }
 function prepare(sql){const values=[];return {bind(...args){values.splice(0,values.length,...args);return this;},async first(){return sqlite.prepare(sql).get(...values)||null;},async all(){return {results:sqlite.prepare(sql).all(...values)};},async run(){const result=sqlite.prepare(sql).run(...values);return {success:true,meta:{changes:Number(result.changes)}};}};}
 return {prepare,async batch(statements){sqlite.exec('BEGIN');try{const result=[];for(const statement of statements)result.push(await statement.run());sqlite.exec('COMMIT');return result;}catch(error){sqlite.exec('ROLLBACK');throw error;}},close:()=>sqlite.close(),sqlite};
}
module.exports={openDatabase};
