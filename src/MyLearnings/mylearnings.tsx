import * as React from 'react';
import styles from './MyLearnings.module.scss';
import type { IMyLearningsProps } from './IMyLearningsProps';

import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/profiles';

import { APIService } from '../../../adaptiveCardExtensions/training/Services/APIService';
import { ITrainings } from '../../../adaptiveCardExtensions/training/Utilities/Interfaces';
import { Constants } from '../../../adaptiveCardExtensions/training/Utilities/Constants';

const TrainingIcon: React.FC = () => (
  <svg
    className={styles.trainingIcon}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M3.5 5.5c2.8 0 5.4.7 8.5 2.5v11c-3.1-1.8-5.7-2.5-8.5-2.5v-11z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M20.5 5.5c-2.8 0-5.4.7-8.5 2.5v11c3.1-1.8 5.7-2.5 8.5-2.5v-11z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M6 9c1.7.2 3.2.7 4.5 1.4M6 12c1.7.2 3.2.7 4.5 1.4M18 9c-1.7.2-3.2.7-4.5 1.4M18 12c-1.7.2-3.2.7-4.5 1.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </svg>
);

const MyLearnings: React.FC<IMyLearningsProps> = (props) => {
  const [trainingDetails, setTrainingDetails] =
    React.useState<ITrainings | null>(null);

  const [isLoading, setIsLoading] =
    React.useState<boolean>(true);

  const [showQuickView, setShowQuickView] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const loadTrainingDetails = async (): Promise<void> => {
      try {
        const cachedTraining =
          localStorage.getItem(Constants.localStorageTrainingKey);

        if (cachedTraining) {
          const cachedDetails = JSON.parse(cachedTraining) as ITrainings;
          setTrainingDetails(cachedDetails);
          setIsLoading(false);
          return;
        }

        const sp = spfi().using(SPFx(props.context));

        const [userId, userIdAPIStatus] =
          await APIService.getUserId(sp, props.context);

        if (userIdAPIStatus) {
          setIsLoading(false);
          return;
        }

        const details =
          await APIService.getTrainingDetails(
            props.context,
            userId,
            props.useStageConnection
          );

        setTrainingDetails(details);
      }
      catch (error) {
        console.error('Error loading training details:', error);
      }
      finally {
        setIsLoading(false);
      }
    };

    loadTrainingDetails().catch((error) => {
      console.error('Error loading training details:', error);
    });
  }, [props.context, props.useStageConnection]);

  if (isLoading) {
    return (
      <section className={styles.myLearnings}>
        <div className={styles.loading}>Loading...</div>
      </section>
    );
  }

  const mandatoryCourses =
    trainingDetails?.cardView?.mandatoryCourses ?? 0;

  return (
    <section className={styles.myLearnings}>

      <div className={styles.header}>
        <h2 className={styles.heading}>My Learning</h2>
        <span className={styles.headingLine} />
      </div>

      {mandatoryCourses > 0 && (
        <div className={styles.learningCard}>

          <div className={styles.cardTitleRow}>
            <TrainingIcon />

            <div className={styles.cardTitle}>
              {mandatoryCourses === 1
                ? '1 mandatory course assigned'
                : `${mandatoryCourses} mandatory courses assigned`}
            </div>
          </div>

          <div className={styles.description}>
            Explore 'My Dashboard' in 3M Learn for all assigned
            learning, training, and certifications.
          </div>

          <div className={styles.linkRow}>
            <button
              type="button"
              className={styles.actionLink}
              onClick={() => setShowQuickView(true)}
            >
              {mandatoryCourses === 1
                ? 'VIEW COURSE'
                : 'VIEW COURSES'}
              <span className={styles.arrow}>↗</span>
            </button>

            <a
              className={styles.actionLink}
              href={Constants.cardButtonTarget}
              target="_blank"
              rel="noreferrer"
            >
              EXPLORE 3M LEARN
              <span className={styles.arrow}>↗</span>
            </a>
          </div>

        </div>
      )}

      <div className={styles.learningCard}>

        <div className={styles.cardTitleRow}>
          <TrainingIcon />

          <div className={styles.cardTitle}>
            Training
          </div>
        </div>

        <div className={styles.description}>
          Explore 3M Learn to find assigned training and personalized
          learning for career development.
        </div>

        <div className={styles.linkRow}>
          <a
            className={styles.actionLink}
            href={Constants.cardButtonTarget}
            target="_blank"
            rel="noreferrer"
          >
            EXPLORE 3M LEARN
            <span className={styles.arrow}>↗</span>
          </a>
        </div>

      </div>

      {showQuickView && trainingDetails && (
        <div className={styles.quickViewOverlay}>

          <div className={styles.quickView}>

            <div className={styles.quickViewHeader}>
              <span className={styles.quickViewTitle}>
                Training
              </span>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowQuickView(false)}
                aria-label="Close training"
              >
                ×
              </button>
            </div>

            <div className={styles.quickViewContent}>

              {trainingDetails.quickView.map((training, index) => (
                <div
                  className={styles.trainingItem}
                  key={`${training.trainingTitle}-${index}`}
                >
                  <div className={styles.cardTitleRow}>
                    <TrainingIcon />

                    <div className={styles.courseTitle}>
                      {training.trainingTitle}
                    </div>
                  </div>

                  {training.systemMessage && (
                    <div className={styles.courseMessage}>
                      {training.systemMessage}
                    </div>
                  )}

                  {training.message && (
                    <div className={styles.courseMessage}>
                      {training.message}
                    </div>
                  )}

                  {training.trainingDateDisplayFormat && (
                    <div
                      className={
                        training.dueDatePassed
                          ? styles.dueDatePassed
                          : styles.dueDate
                      }
                    >
                      {training.trainingDateDisplayFormat}
                    </div>
                  )}

                  {training.button && (
                    <a
                      href={training.button}
                      className={styles.actionLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {training.openButtonLabel || 'OPEN'}
                      <span className={styles.arrow}>↗</span>
                    </a>
                  )}
                </div>
              ))}

            </div>

          </div>

        </div>
      )}

    </section>
  );
};

export default MyLearnings;
