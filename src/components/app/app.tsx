import React, { useState } from 'react';

import { PageContainer } from '@/components/page-container';
import { PageTitle } from '@/components/page-title';

import styles from "./styles.module.scss";
import { historyData } from './data';
import { Slider } from '@/components/slider';

export const App = () => {
  const [history, setHistory] = useState(historyData[0]);

  return (
    <main className={styles.page}>
      <PageContainer>
        <div className={styles.content}>
          <PageTitle className={styles.content__title}>Исторические даты</PageTitle>

          <div className={styles.content__controller}>

          </div>

          <Slider slides={history.events}>
            {(slide) => (
              <div className={styles.event} key={slide.text}>
                <h3 className={styles.event__heading}>{slide.year}</h3>
                <p className={styles.event__text}>{slide.text}</p>
              </div>
            )}
          </Slider>
        </div>
      </PageContainer>
    </main>
  );
}
