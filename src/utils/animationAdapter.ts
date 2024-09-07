import Easing from "./easing";

type Animation = (progress: number) => void;

const animationAdapter = (
  requestAnimationFrame: (step: Animation) => void,
  duration: number,
  animation: Animation,
) => {
  let startTime = 0;

  return new Promise((resolve) => {
    const step = (currentTime: number) => {
      // 第一帧绘制时记录下开始的时间
      !startTime && (startTime = currentTime);
      // 已经过去的时间(ms)
      const timeElapsed = currentTime - startTime;
      // 动画执行的进度 {0,1}
      let progress = Math.min(timeElapsed / duration, 1);
      // 加入二次方缓动函数
      progress = Easing.Quadratic.In(progress);

      animation(progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve(true);
      }
    };

    requestAnimationFrame(step);
  });
};

export default animationAdapter;