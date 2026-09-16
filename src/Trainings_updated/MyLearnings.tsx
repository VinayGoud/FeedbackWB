import * as React from 'react';
import styles from './MyLearnings.module.scss';
import type { IMyLearningsProps } from './IMyLearningsProps';

import { ITrainings } from '../../../adaptiveCardExtensions/training/Utilities/Interfaces';
import { MyLearningsService } from '../services/MyLearningsService';

const MyLearnings: React.FC<IMyLearningsProps> = (props) => {

  const [trainingDetails, setTrainingDetails] =
    React.useState<ITrainings | null>(null);

  const [isLoading, setIsLoading] =
    React.useState<boolean>(true);

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
        console.error(
          'Error loading training details:',
          error
        );
      }
      finally {
        setIsLoading(false);
      }
    };

    loadTrainingDetails()
      .catch((error) => {
        console.error(
          'Error loading training details:',
          error
        );
      });

  }, [props.context, props.useStageConnection]);

  if (isLoading) {
    return (
      <section className={styles.myLearnings}>
        <div className={styles.card}>
          Loading...
        </div>
      </section>
    );
  }

  const mandatoryCourses =
    trainingDetails?.cardView?.mandatoryCourses ?? 0;

  return (
    <section className={styles.myLearnings}>
      <div className={styles.card}>

        <div className={styles.header}>
          <span className={styles.title}>
            My Learning
          </span>
        </div>

        <div className={styles.content}>

          {mandatoryCourses > 0 ? (
            <>
              <div className={styles.trainingTitle}>
                {mandatoryCourses === 1
                  ? '1 mandatory course assigned'
                  : `${mandatoryCourses} mandatory courses assigned`}
              </div>

              <div className={styles.description}>
                Explore 'My Dashboard' in 3M Learn for all assigned
                learning, training, and certifications.
              </div>
            </>
          ) : (
            <>
              <div className={styles.trainingTitle}>
                Training
              </div>

              <div className={styles.description}>
                Explore 3M Learn to find assigned training and
                personalized learning for career development.
              </div>
            </>
          )}

        </div>

      </div>
    </section>
  );
};

export default MyLearnings;
