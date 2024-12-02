export interface IMovie {
  title: string;
  description?: string;
  genre: string;
  characters: ICharacter[];
  rating?: number;
  director?: string;
  releaseDate?: Date;
}

export interface ICharacter {
  character: string;
  actor?: string;
  gender?: string;
}

export interface IUpdateMovie extends Partial<IMovie> {
  id: string;
}
