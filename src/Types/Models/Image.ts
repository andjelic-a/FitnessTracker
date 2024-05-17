export default class Image {
  id: number;
  imageURL: string;
  exercise: number;

  constructor(id: number, imageURL: string, exercise: number) {
    this.id = id;
    this.imageURL = imageURL;
    this.exercise = exercise;
  }
}
