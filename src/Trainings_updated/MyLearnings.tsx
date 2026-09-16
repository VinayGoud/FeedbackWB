import * as React from 'react';
import styles from './MyLearnings.module.scss';
import type { IMyLearningsProps } from './IMyLearningsProps';

const MyLearnings: React.FC<IMyLearningsProps> = () => {
  return (
    <section className={styles.myLearnings}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>My Learning</span>
        </div>

        <div className={styles.content}>
          <div className={styles.trainingTitle}>
            Training
          </div>

          <div className={styles.description}>
            Explore 3M Learn to find assigned training and personalized
            learning for career development.
          </div>

          <a
            className={styles.link}
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            EXPLORE 3M LEARN
          </a>
        </div>
      </div>
    </section>
  );
};

export default MyLearnings;
