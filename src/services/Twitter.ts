import axios, { AxiosInstance } from 'axios';
import { QUERY_ID, payload } from '../utils/constants';
import { readdirSync, readFileSync } from 'node:fs';

export default class Twitter {

  private readonly _instance: AxiosInstance;
  private readonly _upload: string = 'https://upload.twitter.com/1.1/media/upload.json?';
  private readonly _path: string = './src/assets/';

  constructor() {
    this._instance = axios.create({
      headers: {
        "Cookie": process.env.COOKIE,
        "x-csrf-token": process.env.TOKEN,
        "Authorization": process.env.BEARER
      }
    });
    this.upload();
  }

  private async upload(): Promise<void> {

    const image = this.random_image;
    const bytes = this.imageBytes(image);
    const format = image.split('.')[1];

    const query = new URLSearchParams({
      command: "INIT",
      total_bytes: bytes.toString(),
      media_type: `image/${format}`,
      media_category: "tweet_image"
    }).toString();

    try {
      const { data } = await this._instance.post(this._upload + query);
      console.log('[1|4] |-> Image started to be uploaded.');
      await this.upload_append(data.media_id_string, image);
    } catch (e) {
      console.error('[1|4] |-> An error occurred while uploading the image. ', e);
    }
  }

  private async upload_append(id: number, image: string): Promise<void> {

    const base64 = readFileSync(this._path + image, { encoding: 'base64' });
    const formData = new FormData();
    formData.append('media_data', base64);

    try {
      await this._instance.post(`${this._upload}command=APPEND&media_id=${id}&segment_index=0`, formData);
      console.log('[2|4] |-> The image is almost uploaded.');
      await this.upload_finalize(id);
    } catch (e) {
      console.error('[2|4] |-> An error occurred while uploading the image. ', e);
    };

  }

  private async upload_finalize(id: number): Promise<void> {

    try {
      const { data } = await this._instance.post(`${this._upload}command=FINALIZE&media_id=${id}`);
      console.log('[3|4] |-> Image uploaded successfully!')
      await this.post(data.media_id_string)
    } catch (e) {
      console.error('[3|4] |-> An error occurred while uploading the image. ', e);
    };
  }

  private get random_image(): string {
    const images = readdirSync('./src/assets/');
    if (!images.length) throw new Error('Add images in src/assets.');
    
    const i = Math.floor(Math.random() * images.length);
    return images[i];
  }

  private imageBytes(image: string): number {
    const bytes = readFileSync(`./src/assets/${image}`);
    if (!bytes.length) throw new Error('Error checking the number of bytes in the image.');

    return bytes.byteLength;
  }

  private async post(id: number): Promise<void> {
    try {
      const { data } = await this._instance.post(`https://twitter.com/i/api/graphql/${QUERY_ID}/CreateTweet`, payload(id))
      if (data.data.create_tweet) return console.log('[4|4] |-> Tweet successfully created!');
      if (data.errors[0].code === 187) return console.log('Error |-> Duplicate tweet.');
    } catch (e) {
      console.error(e);
    };
  }
}