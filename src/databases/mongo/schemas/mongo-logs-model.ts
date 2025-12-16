import { Schema, model, Document } from 'mongoose';

export interface Log {
  id: string;
  message: string;
  clientId: number;
  apiId: number;
  ip: string;
  component: string;
  action: string;
  affectedRecordID: string;
  user: string;
  date: Date;
}

export interface LogDocument extends Log, Document {}

const LogSchema = new Schema<LogDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    message: {
      type: String,
      required: true
    },

    clientId: {
      type: Number,
      required: true,
      index: true
    },

    apiId: {
      type: Number,
      required: true,
      index: true
    },

    ip: {
      type: String,
      required: true
    },

    component: {
      type: String,
      required: true
    },

    action: {
      type: String,
      required: true
    },

    affectedRecordID: {
      type: String,
      required: false
    },

    user: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true,
      default: () => new Date()
    }
  },
  {
    timestamps: true
  }
);

export const LogModel = model<LogDocument>('Log', LogSchema);
