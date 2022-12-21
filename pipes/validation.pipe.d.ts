import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare const isUnverifiableMetaType: (metatype: any) => metatype is undefined;
export declare class ValidationPipe implements PipeTransform<any> {
    transform(value: any, { metatype }: ArgumentMetadata): Promise<any>;
}
