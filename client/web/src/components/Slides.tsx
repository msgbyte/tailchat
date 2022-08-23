import { Carousel } from 'antd';
import type { CarouselProps, CarouselRef } from 'antd/lib/carousel';
import React, { useImperativeHandle, useRef } from 'react';

import './Slides.less';

export interface SlidesRef {
  next: () => void;
  prev: () => void;
}

/**
 * 类似于走马灯, 但是用于分步操作
 *
 * 会随内容的变化动态改变高度
 *
 * Reference: https://react-slick.neostack.com/docs/api
 */
export const Slides = React.forwardRef<SlidesRef, CarouselProps>(
  (props, ref) => {
    const carouselRef = useRef<CarouselRef>(null);

    useImperativeHandle(
      ref,
      () => ({
        next() {
          carouselRef.current?.next();
        },
        prev() {
          carouselRef.current?.prev();
        },
      }),
      []
    );

    return (
      <Carousel
        className="slides"
        ref={carouselRef}
        {...props}
        dots={false}
        swipe={false}
        adaptiveHeight={true}
        infinite={false}
        beforeChange={(current, next) => {
          console.log(current, next, carouselRef.current?.innerSlider);
        }}
      >
        {props.children}
      </Carousel>
    );
  }
);
Slides.displayName = 'Slides';
