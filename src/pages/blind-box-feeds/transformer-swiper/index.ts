// pages/blind-box-feeds/transformer-swiper/index.ts

function fillArray(arr: any[], length: number) {
  let result = [];
  let i = 0;

  while (result.length < length) {
    result.push(arr[i % arr.length]);
    i++;
  }

  return result;
}

Component<{
  images: string[];
  current: number;
}, {}, {}, {}, false>({
  properties: {
    images: Array,
  },
  data: {
    images: [],
    current: 0,
  },
  methods: {
    onSwiperChange: function(event: any) {
      const current: number = event?.detail?.current;

      if (current !== undefined) {
        this.setData({
          current,
        });
      }
    },
  },
  attached: function () {
    if (this.properties.images?.length) {
      const images = fillArray(this.properties.images, 6);
      this.setData({ images });
    }
  },
})