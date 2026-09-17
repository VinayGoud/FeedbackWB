import * as React from 'react';
import {
  Callout,
  DirectionalHint
} from '@fluentui/react';

import styles from './MyLearnings.module.scss';

import {
  IQuickViewItem
} from '../../../adaptiveCardExtensions/training/Utilities/Interfaces';

export interface ITrainingQuickViewProps {
  target: HTMLElement | null;
  items: IQuickViewItem[];
  mandatoryCourseCount: number;
  title: string;
  description: string;
  onDismiss: () => void;
}

const TrainingQuickView: React.FC<ITrainingQuickViewProps> = (props) => {

  return (
    <Callout
      target={props.target}
      directionalHint={DirectionalHint.leftCenter}
      onDismiss={props.onDismiss}
      setInitialFocus={false}
      gapSpace={8}
      className={styles.trainingQuickView}
    >
      <div className={styles.quickViewContent}>

        <div className={styles.quickViewHeading}>
          {props.title} ({props.mandatoryCourseCount})
        </div>

        <div className={styles.quickViewDescription}>
          {props.description}
        </div>

        <div className={styles.quickViewItems}>

          {props.items.map((item, index) => (
            <div
              key={`${item.trainingTitle}-${index}`}
              className={styles.quickViewItem}
            >

              <div className={styles.quickViewTrainingTitle}>
                {item.trainingTitle}
              </div>

              <div className={styles.quickViewMessage}>
                {item.message}
              </div>

              <div className={styles.quickViewFooter}>

                <div className={styles.quickViewDate}>

                  <span
                    className={
                      item.dueDatePassed && !item.isDateWithin7Days
                        ? styles.quickViewDateAttention
                        : ''
                    }
                  >
                    {item.trainingDateDisplayFormat}
                  </span>

                  {(item.dueDatePassed || item.isDateWithin7Days) &&
                    item.dueDateErrorIcon && (
                      <img
                        src={item.dueDateErrorIcon}
                        className={styles.quickViewDateIcon}
                        alt=""
                        aria-hidden="true"
                      />
                    )}

                </div>

                <a
                  href={item.button}
                  className={styles.quickViewOpenButton}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.openButtonLabel}
                </a>

              </div>

            </div>
          ))}

        </div>

      </div>
    </Callout>
  );
};

export default TrainingQuickView;
