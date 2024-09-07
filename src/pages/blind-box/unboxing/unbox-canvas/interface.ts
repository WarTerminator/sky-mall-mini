export type IData = {
  show: boolean;
  width: number;
  height: number;
}
 
export type IMethods = {
  _queryCanvas(): void;
  _initCanvas(): void;
  _loadImg(key: string, url: string): Promise<IBaseImg>;
  _drawCardImg(index?: number, offsetY?: number): void;
  _handleUnbox(): Promise<any>;
  _handleFadeout(): Promise<any>;
  _executeDrawRequest(): Promise<any>;
  handleActiveUnbox(): Promise<any>;
}

interface IBaseImg {
  img: any;
  x: number;
  y: number;
  renderWidth: number;
  renderHeight: number;
}

export type ICustomProperty = {
  _unboxing: boolean;
  _canvas: any;
  _canvasCtx: any;
  _originX: number;
  _originY: number;
  _rippedPartImg: IBaseImg;
  _leftPartImg: IBaseImg;
  _wholePackImg: IBaseImg;
  [key: string]: any;
}