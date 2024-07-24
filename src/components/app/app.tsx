import React, { useCallback, useMemo, useRef, useState } from 'react';
import cn from "classnames";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { PageTitle } from '@/components/page-title';

import styles from "./styles.module.scss";
import { getEventsDateRange, historyData, sortEventsByDate } from './data';
import { Slider } from '@/components/slider';
import { PageLayout } from '../page-layout';

const nowYear = new Date().getFullYear();

export const App = () => {
  const [history, setHistory] = useState(historyData[0]);
  const initialRange = useRef(getEventsDateRange(history.events));

  const sortedHistoryEvents = useMemo(() => {
    return sortEventsByDate(history.events);
  }, [history]);

  const rangeMinEl = useRef<HTMLSpanElement | null>(null);
  const rangeMaxEl = useRef<HTMLSpanElement | null>(null);
  const sliderEl = useRef<HTMLDivElement | null>(null);

  const handleSelectHistory = useCallback((id: number) => {
    if (history.id === id) return;

    const newHistory = historyData.find((history) => history.id === id);
    if (!newHistory) return;

    const timeline = gsap.timeline();
    const range = getEventsDateRange(newHistory.events);

    timeline
      .to(sliderEl.current, {
        opacity: 0,
        onComplete: () => setHistory(newHistory)
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
  }, [history]);

  return (
    <PageLayout>
      <div className={styles.content}>
        <PageTitle className={styles.content__title}>Исторические даты</PageTitle>

        <div className={styles.content__controller}>
          <div className={styles.controller}>
            <div className={cn(styles.controller__line, styles.controller__line_vertical)} />
            <div className={cn(styles.controller__line, styles.controller__line_horizontal)} />

            <div className={styles.range}>
              <span
                ref={rangeMinEl}
                className={cn(styles.range__value, styles.range__value_min)}
                onClick={() => handleSelectHistory(1)}
              >
                {initialRange.current.min}
              </span>

              <span
                ref={rangeMaxEl}
                className={cn(styles.range__value, styles.range__value_max)}
                onClick={() => handleSelectHistory(2)}
              >
                {initialRange.current.max}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.content__slider} ref={sliderEl}>
          <Slider slides={sortedHistoryEvents}>
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
