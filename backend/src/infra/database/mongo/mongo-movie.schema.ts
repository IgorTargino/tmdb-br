import { Schema, model, Document } from 'mongoose';

interface Movie extends Document {
  title: string;
  overview: string;
  poster_path: string;
  likes: number;
}

export const MovieSchema = new Schema<Movie>(
  {
    title: { type: String, required: true },
    overview: { type: String, required: true },
    poster_path: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const MovieModel = model<Movie>('Movie', MovieSchema);
