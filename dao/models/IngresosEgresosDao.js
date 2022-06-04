const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class IngresosEgresosDao extends DaoObject{
  constructor(db = null){
    console.log('IngresosEgresosDao db: ', db);
    super(db);
  }
  setup(){
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS ingresosEgresos (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, description TEXT,  date TEXT, amount DECIMAL, category TEXT);';
      this.conn.run(createStatement);
    }
  }

  getAll(){
    return this.all(
      'SELECT * from ingresosEgresos;', []
    );
  }

  getById( {codigo} ){
    const sqlstr= 'SELECT * from ingresosEgresos where id=?;';
    const sqlParamArr = [codigo];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({type, description, amount, category}) {
    const date = new Date().toISOString();
    const sqlstr = 'INSERT INTO ingresosEgresos (type, description, date, amount, category) values (?, ?, ?, ?, ?);';
    const sqlParamArr = [type, description, date, amount, category];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({codigo, type, description, amount, category}){
    const sqlstr= 'UPDATE ingresosEgresos set type = ?, description = ?, date = ?, amount = ?, category = ? where id = ?;';
    const sqlParamArr = [type, description, amount, category, codigo];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ codigo }) {
    const sqlstr = 'DELETE FROM ingresosEgresos where id = ?;';
    const sqlParamArr = [codigo];
    return this.run(sqlstr, sqlParamArr);
  }
}