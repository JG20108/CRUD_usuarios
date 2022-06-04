const DaoObject = require('../../dao/DaoObject');
module.exports = class IngresosEgresos {
  ingresosEgresosDao = null;

  constructor ( ingresosEgresosDao = null) {
    if (!(ingresosEgresosDao instanceof DaoObject)) {
     throw new Error('An Instance of DAO Object is Required');
    }
    this.ingresosEgresosDao = ingresosEgresosDao;
  }
  async init(){
    await this.ingresosEgresosDao.init();
    this.ingresosEgresosDao.setup();
  }
  async getIngresosEgresosVersion () {
    return {
      entity: 'Ingresos y Egresos',
      version: '1.0.0',
      description: 'CRUD de Ingresos y Egresos'
    };
  }

  async addIngresoEgreso ({
    type, description, amount, category
  }) {
    const result =  await this.ingresosEgresosDao.insertOne(
      {
          type, description, amount, category
      }
    );
    return {
        type, description, amount, category, id: result.lastID
    };
  };

  async getIngresosEgresos () {
    return this.ingresosEgresosDao.getAll();
  }

  async getIngresoEgresoById ({ codigo }) {
    return this.ingresosEgresosDao.getById({codigo});
  }

  async updateIngresoEgreso ({ codigo, type, description, amount, category }) {
    const result = await this.ingresosEgresosDao.updateOne({ codigo, type, description, amount, category });
    return {
      id: codigo,
      type: type,
      description: description,
      amount: amount,
      category: category,
      modified: result.changes
    }
  }

  async deleteIngresoEgreso({ codigo }) {
    const ingresoEgresoToDelete = await this.ingresosEgresosDao.getById({codigo});
    const result = await this.ingresosEgresosDao.deleteOne({ codigo });
    return {
      ...ingresoEgresoToDelete,
      deleted: result.changes
    };
  }
}