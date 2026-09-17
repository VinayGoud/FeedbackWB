import * as React from 'react';

import styles from './MyLearnings.module.scss';
import type { IMyLearningsProps } from './IMyLearningsProps';

import { ITrainings } from '../../../adaptiveCardExtensions/training/Utilities/Interfaces';
import { MyLearningsService } from '../services/MyLearningsService';

const trainingIcon: string = require('../assets/training-book.svg');

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
        setIsLoading(true);

        const service = new MyLearningsService(props.context);

        const details = await service.getTrainingDetails(
          '',
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

    loadTrainingDetails()
      .catch((error) => {
        console.error('Error loading training details:', error);
      });

  }, [props.context, props.useStageConnection]);

  if (isLoading) {
    return (
      <section className={styles.myLearnings}>
        <div className={styles.loading}>
          Loading...
        </div>
      </section>
    );
  }

  const mandatoryCourses =
    trainingDetails?.cardView?.mandatoryCourses ?? 0;

  const hasMandatoryCourses = mandatoryCourses > 0;

  return (
    <section className={styles.myLearnings}>

      <div className={styles.header}>
        <h2 className={styles.heading}>
          My Learning
        </h2>

        <span className={styles.headingLine} />
      </div>

      <div className={styles.learningCard}>

        <div className={styles.cardTitleRow}>

          <img
            src={trainingIcon}
            className={styles.trainingIcon}
            alt=""
            aria-hidden="true"
          />

          <div className={styles.cardTitle}>
            {hasMandatoryCourses
              ? mandatoryCourses === 1
                ? '1 mandatory course assigned'
                : `${mandatoryCourses} mandatory courses assigned`
              : 'Training'}
          </div>

        </div>

        <div className={styles.description}>
          {hasMandatoryCourses
            ? (
              <>
                Explore 'My Dashboard' in 3M Learn for all assigned
                learning, training, and certifications.
              </>
            )
            : (
              <>
                Explore 3M Learn to find assigned training and
                personalized learning for career development.
              </>
            )}
        </div>

        <div className={styles.linkRow}>

          {hasMandatoryCourses && (
            <button
              type="button"
              className={styles.actionLink}
              onClick={() => setShowQuickView(true)}
            >
              {mandatoryCourses === 1
                ? 'VIEW COURSE'
                : 'VIEW COURSES'}

              <span className={styles.arrow}>
                ↗
              </span>
            </button>
          )}

          <a
            className={styles.actionLink}
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            EXPLORE 3M LEARN

            <span className={styles.arrow}>
              ↗
            </span>
          </a>

        </div>

      </div>

      {showQuickView && trainingDetails && (
        <div className={styles.quickViewOverlay}>

          <div className={styles.quickView}>

            <div className={styles.quickViewHeader}>

              <div className={styles.quickViewTitle}>
                Training
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowQuickView(false)}
                aria-label="Close training details"
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

                  <div className={styles.courseTitleRow}>

                    <img
                      src={trainingIcon}
                      className={styles.courseIcon}
                      alt=""
                      aria-hidden="true"
                    />

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
                      className={styles.courseLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {training.openButtonLabel || 'OPEN'}

                      <span className={styles.arrow}>
                        ↗
                      </span>
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
