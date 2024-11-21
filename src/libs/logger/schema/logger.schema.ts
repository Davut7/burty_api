import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
    @Prop()
    host: string;

    @Prop()
    url: string;

    @Prop()
    statusCode: number;

    @Prop()
    method: string;

    @Prop()
    user: string;

    @Prop()
    context: string;

    @Prop()
    message: string;

    @Prop()
    level: string;

    @Prop()
    time: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
