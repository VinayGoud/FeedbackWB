import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';

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
        <div className={styles.card}>
          <div className={styles.loading}>
            Loading...
          </div>
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
        <h2 className={styles.title}>
          My Learning
        </h2>
        <span className={styles.titleLine} />
      </div>

      <div className={styles.card}>

        <div className={styles.trainingHeader}>
          <Icon
            iconName="ReadingMode"
            className={styles.trainingIcon}
          />

          <div className={styles.trainingTitle}>
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
                Explore <strong>'My Dashboard'</strong> in 3M Learn for all
                assigned learning, training, and certifications.
              </>
            )
            : (
              <>
                Explore 3M Learn to find assigned training and personalized
                learning for career development.
              </>
            )}
        </div>

        <div className={styles.linkRow}>

          {hasMandatoryCourses && (
            <button
              type="button"
              className={styles.linkButton}
            >
              {mandatoryCourses === 1
                ? 'VIEW COURSE'
                : 'VIEW COURSES'}

              <Icon
                iconName="OpenInNewWindow"
                className={styles.linkIcon}
              />
            </button>
          )}

          <a
            className={styles.link}
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            EXPLORE 3M LEARN

            <Icon
              iconName="OpenInNewWindow"
              className={styles.linkIcon}
            />
          </a>

        </div>

      </div>

    </section>
  );
};

export default MyLearnings;
