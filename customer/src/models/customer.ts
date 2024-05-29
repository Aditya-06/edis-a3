import {DataTypes, Model} from 'sequelize';
import sequelizeConnection from '../db/config'; // Replace with your Sequelize connection path

interface CustomerAttributes {
  id?: number;
  userId: string;
  name: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
}

interface CustomerModel extends Model<CustomerAttributes>, CustomerAttributes {}

const Customer = sequelizeConnection.define<CustomerModel>(
  'Customer',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: 'Customer',
    timestamps: false,
  }
);

export default Customer;
