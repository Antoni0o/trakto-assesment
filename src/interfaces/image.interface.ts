import { Tags } from 'exifreader';

export class Image {
  localpath: Localpath;
  metadata: Tags;
}

class Localpath {
  original: string;
  thumb: string;
}
