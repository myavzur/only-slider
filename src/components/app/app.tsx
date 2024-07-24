import React, { useCallback, useMemo, useRef, useState } from 'react';
import cn from "classnames";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { PageTitle } from '@/components/page-title';

import styles from "./styles.module.scss";
import { getTimelapseEventsRange, timelapseData, sortTimelapseEventsByDate } from './data';
import { Slider } from '@/components/slider';
import { PageLayout } from '../page-layout';
import { Icon } from '../icon';
import { padZero } from '@/helpers';

export const App = () => {
  const [timelapse, setTimelapse] = useState(timelapseData[0]);

  const [timelapsePosition, setTimelapsePosition] = useState(() => {
    const idx = timelapseData.findIndex(({ id }) => id === timelapse.id);
    return idx + 1;
  });

  // Нужно для корректной первичной отрисовки, иначе при первом рендере сработает анимация.
  const initialTimelapseRange = useRef(getTimelapseEventsRange(timelapse.events));

  const sortedTimelapseEvents = useMemo(() => {
    return sortTimelapseEventsByDate(timelapse.events);
  }, [timelapse]);

  const rangeMinEl = useRef<HTMLSpanElement | null>(null);
  const rangeMaxEl = useRef<HTMLSpanElement | null>(null);
  const sliderEl = useRef<HTMLDivElement | null>(null);

  const selectTimelapse = useCallback((id: number) => {
    if (timelapse.id === id) return;

    const idx = timelapseData.findIndex((timelapse) => timelapse.id === id);
    if (idx === -1) return;

    const newTimelapse = timelapseData[idx];
    const range = getTimelapseEventsRange(newTimelapse.events);
    setTimelapsePosition(idx + 1);

    const timeline = gsap.timeline();
    timeline
      .to(sliderEl.current, {
        opacity: 0,
        onComplete: () => setTimelapse(newTimelapse)
      }, "time-travel")
      .to(rangeMinEl.current, {
        innerText: range.min,
        snap: "innerText",
        ease: "power4.out",
        duration: 1
      }, "time-travel")
      .to(rangeMaxEl.current, {
        innerText: range.max,
        snap: "innerText",
        ease: "power4.out",
        duration: 1
      }, "time-travel");

    timeline
      .to(sliderEl.current, { opacity: 1 }, "finish")
      .from(sliderEl.current, { y: 0 }, "finish");
  }, [timelapse]);

  const prevTimelapse = () => {
    const currentIdx = timelapseData.findIndex((data) => data.id === timelapse.id);
    if (currentIdx === 0) return;

    const newTimelapse = timelapseData[currentIdx - 1];
    selectTimelapse(newTimelapse.id);
  };

  const nextTimelapse = () => {
    const currentIdx = timelapseData.findIndex((data) => data.id === timelapse.id);
    if (currentIdx === timelapseData.length - 1) return;

    const newTimelapse = timelapseData[currentIdx + 1];
    selectTimelapse(newTimelapse.id);
  };

  return (
    <PageLayout>
      <div className={styles.content}>
        <PageTitle className={styles.content__title}>Исторические даты</PageTitle>

        <div className={cn(styles.content__controller, styles.controller)}>
          <div className={cn(styles.controller__line, styles.controller__line_vertical)} />
          <div className={cn(styles.controller__line, styles.controller__line_horizontal)} />

          <div className={styles.range}>
            <span
              ref={rangeMinEl}
              className={cn(styles.range__value, styles.range__value_min)}
              onClick={() => selectTimelapse(1)}
            >
              {initialTimelapseRange.current.min}
            </span>

            <span
              ref={rangeMaxEl}
              className={cn(styles.range__value, styles.range__value_max)}
              onClick={() => selectTimelapse(2)}
            >
              {initialTimelapseRange.current.max}
            </span>
          </div>

          <div className={styles.controller__navigation}>
            <span className={styles.controller__progress}>
              {padZero(timelapsePosition)}/{padZero(timelapseData.length)}
            </span>

            <div className={styles.controller__controls}>
              <button
                className={styles.controller__control}
                onClick={prevTimelapse}
                disabled={timelapsePosition === 1}
              >
                <Icon icon="arrow-left" />
              </button>
              <button
                className={styles.controller__control}
                onClick={nextTimelapse}
                disabled={timelapsePosition === timelapseData.length}
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
                <h3 className={styles.event__date}>{slide.year}</h3>
                <p className={styles.event__text}>{slide.text}</p>
              </div>
            )}
          </Slider>
        </div>
      </div>
    </PageLayout>
  );
}
