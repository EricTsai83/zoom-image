"use client";
import { useState, useRef } from "react";

function ImageZoom() {
  const [zoomStyles, setZoomStyles] = useState({
    opacity: 0,
    zoomX: "50%",
    zoomY: "50%",
    transformX: 0,
    transformY: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgZoomRef = useRef<HTMLImageElement>(null);

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    if (containerRef.current) {
      // 找到 container 的位置資訊
      const containerRect = containerRef.current.getBoundingClientRect();
      // 根據滑鼠在瀏覽器上的位置減去container的位置得出滑鼠在container 上的位置
      const positionPx = event.clientX - containerRect.left;
      // 將位置轉化成百分比來代表
      const positionX = (positionPx / containerRect.width) * 100;

      const positionPy = event.clientY - containerRect.top;
      const positionY = (positionPy / containerRect.height) * 100;
      // 因為這裡的設計是會隱藏一個 scale 1.5 的圖片，當 user 將滑鼠指到原圖片的中心點時，positionX會是50，隱藏的圖片不需位移，但當滑鼠移動要中心點右側時，positionX會大於50，所以需要將被隱藏的圖片往左移動，這樣滑鼠指到的地方才會跟原圖片的位置一樣。而3.5 是偏移係數，可以透過放大縮小，來讓隱藏圖片顯示的位置跟原圖被指到的位置一致。
      const transformX = -(positionX - 50) / 3.5;
      const transformY = -(positionY - 50) / 3.5;

      setZoomStyles({
        opacity: 1,
        zoomX: `${positionX}%`,
        zoomY: `${positionY}%`,
        transformX,
        transformY,
      });
    }
  }

  function handleMouseOut() {
    setZoomStyles((prevStyles) => ({
      ...prevStyles,
      opacity: 0,
    }));
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div
        ref={containerRef}
        className="relative w-max"
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
      >
        <img src="image.jpg" alt="Main" className="w-[500px]" />
        <img
          ref={imgZoomRef}
          src="image.jpg"
          alt="Zoomed"
          className="absolute left-0 top-0 pointer-events-none"
          style={{
            opacity: zoomStyles.opacity,
            transform: `scale(1.5) translate(${zoomStyles.transformX}%, ${zoomStyles.transformY}%)`,
            clipPath: `circle(100px at ${zoomStyles.zoomX} ${zoomStyles.zoomY})`,
          }}
        />
      </div>
    </div>
  );
}

export default ImageZoom;
