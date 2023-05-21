import * as mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema(
  {
    localpath: {
      original: String,
      thumb: String,
    },
    metadata: [
      {
        key: String,
        value: String,
      },
    ],
  },
  { strict: false },
);
