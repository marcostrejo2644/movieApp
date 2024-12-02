import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMovie, ICharacter } from '../interfaces/movie.interface';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie implements IMovie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  description?: string;

  @Prop({ required: true })
  characters: ICharacter[];

  @Prop({ type: Date, required: true })
  releaseDate?: Date;

  @Prop()
  genre: string;

  @Prop({ default: 0 })
  rating?: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
