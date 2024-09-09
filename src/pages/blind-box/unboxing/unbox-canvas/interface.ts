export type IData = {
  show: boolean;
  width: number;
  height: number;
  unboxing: boolean;
}
 
export type IMethods = {
  _queryCanvas(): void;
  _initCanvas(): void;
  _loadImg(key: string, url: string): Promise<IBaseImg>;
  _drawCardImg(index?: number, offsetY?: number): void;
  _handleUnbox(): Promise<any>;
  _handleFadeout(): Promise<any>;
  _addTrialCount(): void;
  _executeDrawRequest(): Promise<any>;
  handleActiveUnbox(): Promise<any>;
  onTouchStart(event: WechatMiniprogram.TouchCanvas): void;
  onTouchMove(event: WechatMiniprogram.TouchCanvas): void;
  onTouchEnd(event: WechatMiniprogram.TouchCanvas): void;
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