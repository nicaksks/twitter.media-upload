import axios, { AxiosInstance } from 'axios';
import { queryId, payload } from '../utils/constants';
import { readdir, readFile, readFileSync } from 'node:fs';

export default class Twitter {

  public readonly _instance: AxiosInstance;
  public readonly _upload: string = 'https://upload.twitter.com/1.1/media/upload.json?';
  public readonly _path: string = './src/assets/';

  constructor() {
    this._instance = axios.create({
      headers: {
        "Cookie": process.env.COOKIE,
        "x-csrf-token": process.env.TOKEN,
        "Authorization": process.env.BEARER
      }
    });
  }

  private async upload(): Promise<void> {

    const image = await this.image();
    const bytes = await this.imageBytes(image);
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

  private image(): Promise<string> {
    return new Promise((resolve, reject) => {
      readdir('./src/assets/', async (err, images) => {
        if (err) reject(err);
        if (!images.length) throw new Error('Add images in src/assets.');
        const i = Math.floor(Math.random() * images.length);
        resolve(images[i]);
      });
    });
  }

  private imageBytes(image: string): Promise<number> {
    return new Promise((resolve, reject) => {
      readFile(`./src/assets/${image}`, (err, data) => {
        if (err) reject(err);
        resolve(data.byteLength);
      });
    });
  }

  private async post(id: number): Promise<void> {

    try {
      const { data } = await this._instance.post(`https://twitter.com/i/api/graphql/${queryId}/CreateTweet`, payload(id))
      if (data.data.create_tweet) return console.log('[4|4] |-> Tweet successfully created!');
      if (data.errors[0].code === 187) return console.log('Error |-> Duplicate tweet.');
    } catch (e) {
      console.error(e);
    };
  }

  public async start() {
    await this.upload();
    setInterval(async () => {
      await this.upload();
    }, 20 * 60 * 1000)
  }

}