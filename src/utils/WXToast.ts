function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('延时完成');
    }, time);
  });
};

export default function WXToast(title: string, icon?: 'none' | 'success' | 'error', duration?: number) {
  icon = icon || 'none';
  duration = duration || 2000;

  wx.showToast({
    title,
    icon,
    duration,
  });

  return delay(duration);
};