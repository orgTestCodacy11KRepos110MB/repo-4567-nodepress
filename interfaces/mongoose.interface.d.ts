import { Document } from 'mongoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { PaginateModel } from '@app/utils/paginate';
export declare type MongooseModel<T> = ModelType<T> & PaginateModel<T & Document>;
