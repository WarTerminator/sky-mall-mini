// pages/blind-box/unboxing/unbox-canvas/index.ts
import blindBoxService from "../../../../api/blind-box";
import { tryJsonParse } from "../../../../utils/index";
import animationAdapter from "../../../../utils/animationAdapter";
import { ICustomProperty, IData, IMethods } from "./interface";
import WXToast from "../../../../utils/WXToast";

const TRIAL_SRG_KEY = 'trial-unbox-count';

const WHOLE_PACK_IMG = 'https://img.war6sky.com/2024/08/0780bc644f8c48eb899c7600fff1b70a.png';
const RIPPED_PART_IMG = 'https://img.war6sky.com/2024/08/82cf56b82a974a22a2de2a789be8cf3c.png';
const LEFT_PART_IMG = 'https://img.war6sky.com/2024/08/916b9247581a473d9b061aa23cd0c341.png';

const IMG_MULTIPLIER = 1.5;

const OFFSET_MAP = [
  [9/30, 1/3],
  [21/30, 1/3],
  [9/30, 2/3],
  [21/30, 2/3],
];

Component<IData, any, IMethods, ICustomProperty, false>({
  properties: {
    assetIds: {
      type: Array,
    },
    blindBox: {
      type: Object,
    },
    isTrial: {
      type: Boolean,
    }
  },
  data: {
    show: true,
    width: 750,
    height: 1624,
    unboxing: false,
  },
  lifetimes: {
    attached: function () {
      const { windowWidth, windowHeight } = wx.getSystemInfoSync();
      this.setData({
        width: windowWidth,
        height: windowHeight,
      });

      this._queryCanvas();
    },
  },
  methods: {
    // 查询canvas节点
    _queryCanvas() {
      const query = this.createSelectorQuery();
      query.select('#blind-box-canvas').fields({ node: true, size: true }).exec((res) => {
        if (res?.[0]?.node) {
          this._canvas = res[0].node;
          this._canvasCtx = this._canvas.getContext('2d');
          this._initCanvas();
        }
      });
    },
    // 初始化canvas，渲染卡包图片
    _initCanvas() {
      const canvas = this._canvas;
      const ctx = this._canvasCtx;

      // canvas有个默认大小，并不会跟随dom的style变化，需要手动设置
      canvas.width = this.data.width * 2;
      canvas.height = this.data.height * 2;

      this._loadImg('_rippedPartImg', RIPPED_PART_IMG);
      this._loadImg('_leftPartImg', LEFT_PART_IMG);
      this._loadImg('_wholePackImg', WHOLE_PACK_IMG).then(res => {
        const { renderWidth, renderHeight, img } = res;
        this._originX = (canvas.width - renderWidth) / 2;
        this._originY = (canvas.height - renderHeight) / 2;
        ctx.drawImage(img, this._originX, this._originY, renderWidth, renderHeight);

        const cards = this.properties.blindBox?.cards || [];

        cards.forEach((item: any, index: number) => {
          if (item.bagPic) {
            const imgUrl = `https://objects.buff-box.com/${item.bagPic}`;
            this._loadImg(`_cardImg_${index}`, imgUrl).then(() => {
              this._drawCardImg(index);
            });
          }
        });

        // 虚线
        ctx.strokeStyle = '#CFCFCF';
        ctx.setLineDash([20, 12]);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this._originX - 40, this._originY + 50);
        ctx.lineTo(this._originX + renderWidth + 40, this._originY + 50);
        ctx.stroke();
      });
    },
    _loadImg(key, url) {
      return new Promise((resolve, reject) => {
        const img = this._canvas.createImage();

        img.addEventListener?.('error', reject);
        img.addEventListener?.('load', () => {
          const renderWidth = img.width / IMG_MULTIPLIER;
          const renderHeight = img.height / IMG_MULTIPLIER;

          this[key] = { img, renderWidth, renderHeight };
          resolve(this[key]);
        });
        img.src = url;
      });
    },
    // 绘制封面卡片图片
    _drawCardImg(index, offsetY = 0) {
      const ctx = this._canvasCtx;
      const originX = this._originX || 0;
      const originY = this._originY || 0;
      const { renderWidth: wholeWidth, renderHeight: wholeHeight } = this._wholePackImg;

      const draw = (i: number) => {
        const cardImg = this[`_cardImg_${i}`]?.img;

        if (!cardImg) return;

        const multiplier = (() => {
          if (cardImg.width > cardImg.height) {
            return cardImg.width / 186;
          }

          return cardImg.height / 248;
        })();

        const renderWidth = cardImg.width / multiplier;
        const renderHeight = cardImg.height / multiplier;

        const position = [renderWidth * -0.5, renderHeight * -0.5, renderWidth, renderHeight];
        const [offsetRatioX, offsetRatioY] = OFFSET_MAP[i];

        ctx.save();
        ctx.translate(originX + wholeWidth * offsetRatioX, originY + wholeHeight * offsetRatioY + offsetY);
        ctx.drawImage(cardImg, ...position);
        ctx.restore();
      };

      if (typeof index === 'number') {
        draw(index);
      } else {
        for (let i = 0; i < 4; i++) {
          draw(i);
        }
      }
    },
    // 拆包
    _handleUnbox() {
      const canvas = this._canvas;
      const ctx = this._canvasCtx;
      const originX = this._originX || 0;
      const originY = this._originY || 0;
      const rippedPart = this._rippedPartImg;
      const leftPart = this._leftPartImg;

      const rip = (progress: number) => {
        // 撕开部分的旋转角度
        const angle = Math.PI / 180 * (progress > 0.4 ? 20 : progress * 50);
        // 切块1 - 撕开的部分
        const clip1 = [
          0,
          0,
          rippedPart.img.width * progress,
          rippedPart.img.height,
        ];
        const position1 = [
          0 - rippedPart.renderWidth * progress,
          0 - rippedPart.renderHeight,
          rippedPart.renderWidth * progress,
          rippedPart.renderHeight,
        ];

        // 切块2 - 即将撕开的部分，会被切块1挡住
        const clip2Cos = Math.cos(angle);
        const clip2 = [
          rippedPart.img.width * progress,
          0,
          rippedPart.img.width * (1 - progress),
          rippedPart.img.height,
        ];
        const position2 = [
          originX + rippedPart.renderWidth * progress,
          originY + rippedPart.renderHeight * (1 - clip2Cos),
          rippedPart.renderWidth * (1 - progress),
          rippedPart.renderHeight * clip2Cos,
        ];

        // 切块3 - 下方剩余的卡包
        const position3 = [originX, originY, leftPart.renderWidth, leftPart.renderHeight];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(leftPart.img, ...position3);
        ctx.drawImage(rippedPart.img, ...clip2, ...position2);

        ctx.save();
        ctx.translate(position2[0], originY + rippedPart.renderHeight);
        ctx.rotate(angle);
        ctx.drawImage(rippedPart.img, ...clip1, ...position1);
        ctx.restore();

        this._drawCardImg();
      };

      return animationAdapter(canvas.requestAnimationFrame, 800, rip);
    },
    // 隐藏卡包
    _handleFadeout() {
      const canvas = this._canvas;
      const ctx = this._canvasCtx;
      const originX = this._originX || 0;
      const originY = this._originY || 0;
      const rippedPart = this._rippedPartImg;
      const leftPart = this._leftPartImg;

      const fadeout = (progress: number) => {
        const rippedPartPosition = [
          0 - rippedPart.renderWidth,
          0 - rippedPart.renderHeight,
          rippedPart.renderWidth,
          rippedPart.renderHeight,
        ];
        const rippedPartTranslatePosition = [
          originX + rippedPart.renderWidth * (1 + 2 * progress),
          originY + rippedPart.renderHeight * (1 - 10 * progress),
        ];
        // translateY 140%
        const leftPartPosition = [
          originX,
          originY + leftPart.renderHeight * 1.4 * progress,
          leftPart.renderWidth,
          leftPart.renderHeight
        ];

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.globalAlpha = progress > 0.25 ? 0 : 1 - progress * 4;
        ctx.translate(...rippedPartTranslatePosition);
        ctx.rotate(Math.PI / 180 * 20);
        ctx.drawImage(rippedPart.img, ...rippedPartPosition);
        ctx.restore();

        ctx.globalAlpha = 1 - progress * 1; // 渐隐
        ctx.drawImage(leftPart.img, ...leftPartPosition);

        this._drawCardImg(undefined, leftPart.renderHeight * 1.4 * progress);
      };

      return animationAdapter(canvas.requestAnimationFrame, 400, fadeout);
    },
    _addTrialCount() {
      const date = new Date().toLocaleDateString();
      const srgKey = `${TRIAL_SRG_KEY}-${date}`;
      let count = Number(wx.getStorageSync(srgKey) || 0);
      count += 1;
      wx.setStorageSync(srgKey, count);
    },
    // 激活拆包
    async _executeDrawRequest() {
      try {
        let res = [];

        if (this.properties.isTrial) {
          res = await blindBoxService.executeTrialDraw({
            assetId: this.properties.blindBox.gameItemId,
          });

          this._addTrialCount();
        } else {
          res = await blindBoxService.executeDraw({
            userAssetId: this.properties.assetIds,
            assetId: this.properties.blindBox.gameItemId,
          });
        }

        if (!res.length) {
          throw {
            data: '抽卡结果异常',
          }
        }

        const cards = res.reduce((acc: any[], item: any) => {
          const records = (item.records || []).map((record: any) => {
            return {
              ...record,
              extra: tryJsonParse(record.items || record.childItem),
              // TODO: 临时的判断
              special: record.ruleType === 'b',
            }
          });
          acc = [...acc, ...records];
          return acc;
        }, []);

        return cards;
      } catch (error) {
        throw error;
      }
    },
    async handleActiveUnbox() {
      if (this._unboxing) return;
      
      this._unboxing = true;

      try {
        const cards = await this._executeDrawRequest();
        this.triggerEvent('success', { cards });
      } catch(e) {
        this._unboxing = false;
        
        await WXToast(e?.data);
        this.triggerEvent('error');
        
        return;
      }

      this.setData({
        unboxing: true,
      });
      
      await this._handleUnbox();
      this.triggerEvent('unboxed');

      await this._handleFadeout();
      this.setData({
        show: false,
      });
      this._unboxing = false;
    },
    onTouchStart(event) {
      if (this._unboxing) return;

      const touch = event.touches?.[0] || {};
      const x = (touch.x || 0) * 2;
      const y = (touch.y || 0) * 2;

      if (y > this._originY && y < this._originY + 200) {
        this._swiping = true;
        this._swipeX = x;
      }
    },
    onTouchMove(event) {
      if (this._unboxing || !this._swiping) return;

      const touch = event.touches?.[0] || {};
      const x = (touch.x || 0) * 2;

      if (x > this._swipeX + 150) {
        this._swiping = false;
        this._swipeX = undefined;
        this._swiped = true;
      }
    },
    onTouchEnd() {
      if (this._unboxing) return;

      if (this._swiped) {
        this._swiped = false;
        this.handleActiveUnbox();
      }
    }
  }
})