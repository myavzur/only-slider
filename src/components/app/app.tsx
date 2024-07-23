import React, { useCallback, useState } from 'react';
import cn from "classnames";

import { PageTitle } from '@/components/page-title';

import styles from "./styles.module.scss";
import { historyData } from './data';
import { Slider } from '@/components/slider';
import { PageLayout } from '../page-layout';

export const App = () => {
  const [history, setHistory] = useState(historyData[0]);

  const handleSelectHistory = useCallback((id: number) => {
    const newHistory = historyData.find((history) => history.id === id);
    if (!newHistory) return;
    setHistory(newHistory);
  }, []);

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
                className={cn(styles.range__value, styles.range__value_min)}
                onClick={() => handleSelectHistory(1)}
              >
                2015
              </span>

              <span
                className={cn(styles.range__value, styles.range__value_max)}
                onClick={() => handleSelectHistory(2)}
              >
                2022
              </span>
            </div>
          </div>
        </div>

        <Slider slides={history.events}>
          {(slide) => (
            <div className={styles.event} key={slide.text}>
              <h3 className={styles.event__date}>{slide.year}</h3>
              <p className={styles.event__text}>{slide.text}</p>
            </div>
          )}
        </Slider>
      </div>
    </PageLayout>
  );
}
