import {DataTypes, Model} from 'sequelize';
import sequelizeConnection from '../db/config';

interface BookAttributes {
  ISBN: string;
  title: string;
  Author: string;
  description: string;
  genre: string;
  price: number;
  quantity: number;
}

interface BookModel extends Model<BookAttributes>, BookAttributes {}

const Book = sequelizeConnection.define<BookModel>(
  'Book',
  {
    ISBN: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Book;
