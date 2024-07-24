import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cn from "classnames";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { PageTitle } from '@/components/page-title';

import styles from "./styles.module.scss";
import { timelapseData, sortTimelapseEventsByDate, getTimelapseRange } from './data';
import { Slider } from '@/components/slider';
import { PageLayout } from '../page-layout';
import { Icon } from '../icon';
import { padZero } from '@/helpers';
import { Carousel } from '../carousel';

export const App = () => {
  const [timelapse, setTimelapse] = useState(timelapseData[0]);
  const [timelapseIndex, setTimelapseIndex] = useState(() => {
    const index = timelapseData.findIndex(({ id }) => id === timelapse.id);
    return index;
  });

  const sortedTimelapseEvents = useMemo(() => {
    return sortTimelapseEventsByDate(timelapse.events);
  }, [timelapse]);

  const timelapseRangeMinEl = useRef<HTMLSpanElement | null>(null);
  const timelapseRangeMaxEl = useRef<HTMLSpanElement | null>(null);
  const sliderEl = useRef<HTMLDivElement | null>(null);

  const selectTimelapse = useCallback((id: number) => {
    if (timelapse.id === id) return;

    const index = timelapseData.findIndex((timelapse) => timelapse.id === id);
    if (index === -1) return;

    const newTimelapse = timelapseData[index];
    const timelapseRange = getTimelapseRange(newTimelapse);
    setTimelapseIndex(index);

    const timeline = gsap.timeline();
    timeline
      .to(sliderEl.current, {
        opacity: 0,
        onComplete: () => setTimelapse(newTimelapse)
      }, "time-travel")
      .to(timelapseRangeMinEl.current, {
        innerText: timelapseRange.min,
        snap: "innerText",
        ease: "power4.out",
        duration: 1
      }, "time-travel")
      .to(timelapseRangeMaxEl.current, {
        innerText: timelapseRange.max,
        snap: "innerText",
        ease: "power4.out",
        duration: 1
      }, "time-travel");

    timeline
      .to(sliderEl.current, { opacity: 1 }, "finish")
      .from(sliderEl.current, { y: 0 }, "finish");
  }, [timelapse]);

  const prevTimelapse = () => {
    const currentIndex = timelapseData.findIndex((data) => data.id === timelapse.id);
    if (currentIndex === 0) return;

    const newTimelapse = timelapseData[currentIndex - 1];
    selectTimelapse(newTimelapse.id);
  };

  const nextTimelapse = () => {
    const currentIndex = timelapseData.findIndex((data) => data.id === timelapse.id);
    if (currentIndex === timelapseData.length - 1) return;

    const newTimelapse = timelapseData[currentIndex + 1];
    selectTimelapse(newTimelapse.id);
  };

  // Render initial timelapse range values
  useEffect(() => {
    const timelapseRange = getTimelapseRange(timelapse);

    if (!timelapseRangeMinEl.current || !timelapseRangeMaxEl.current) return;
    timelapseRangeMinEl.current.innerText = String(timelapseRange.min);
    timelapseRangeMaxEl.current.innerText = String(timelapseRange.max);
  }, []);

  return (
    <PageLayout>
      <div className={styles.content}>
        <PageTitle className={styles.content__title}>Исторические даты</PageTitle>

        <div className={cn(styles.content__controller, styles.controller)}>
          <div className={cn(styles.controller__line, styles.controller__line_vertical)} />
          <div className={cn(styles.controller__line, styles.controller__line_horizontal)} />

          <div className={styles.range}>
            <span
              ref={timelapseRangeMinEl}
              className={cn(styles.range__value, styles.range__value_min)}
            >
              2024
            </span>

            <span
              ref={timelapseRangeMaxEl}
              className={cn(styles.range__value, styles.range__value_max)}
            >
              2024
            </span>
          </div>

          <div className={styles.controller__carousel}>
            <Carousel
              items={timelapseData}
              selectedItemIndex={timelapseIndex}
              onSelectItem={selectTimelapse}
              renderItemLabel={(timelapse) => timelapse.name}
            />
          </div>

          <div className={styles.controller__navigation}>
            <span className={styles.controller__progress}>
              {padZero(timelapseIndex + 1)}/{padZero(timelapseData.length)}
            </span>

            <div className={styles.controller__controls}>
              <button
                className={styles.controller__control}
                onClick={prevTimelapse}
                disabled={timelapseIndex === 0}
              >
                <Icon icon="arrow-left" />
              </button>
              <button
                className={styles.controller__control}
                onClick={nextTimelapse}
                disabled={timelapseIndex === timelapseData.length - 1}
              >
                <Icon icon="arrow-left" isMirrored={true} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.content__slider} ref={sliderEl}>
          <Slider slides={sortedTimelapseEvents}>
            {(slide) => (
              <div className={styles.event} key={slide.text}>
                <h3 className={styles.event__date}>{slide.date}</h3>
                <p className={styles.event__text}>{slide.text}</p>
              </div>
            )}
          </Slider>
        </div>
      </div>
    </PageLayout>
  );
}
