import * as React from 'react';
import styles from './MyLearnings.module.scss';
import { IMyLearningsProps } from './IMyLearningsProps';
import * as strings from 'MyLearningsWebPartStrings';

export default class MyLearnings extends React.Component<IMyLearningsProps, {}> {
  public render(): React.ReactElement<IMyLearningsProps> {
    const { mandatoryCourseCount, errorOccuredStatus } = this.props;

    if (errorOccuredStatus) {
      return (
        <div className={styles.myLearnings}>
          <div className={styles.title}>{strings.Title}</div>
          <div className={styles.message}>{strings.ErrorMessage}</div>
          <a className={styles.link} href={strings.ContactUsLink}>
            {strings.ContactUsButtonText}
          </a>
        </div>
      );
    }

    if (mandatoryCourseCount === 0) {
      return (
        <div className={styles.myLearnings}>
          <div className={styles.title}>{strings.NoTrainingTitle}</div>
          <div className={styles.message}>{strings.NoMandatoryTrainingPrimaryText}</div>
          <a className={styles.link} href={strings.CardButtonTarget}>
            {strings.VisitButtonLabel}
          </a>
        </div>
      );
    }

    const cardDescription = mandatoryCourseCount === 1
      ? `${mandatoryCourseCount} ${strings.SingleMandatoryTrainingPrimaryText}`
      : `${mandatoryCourseCount} ${strings.MultipleMandatoryTrainingPrimaryText}`;

    return (
      <div className={styles.myLearnings}>
        <div className={styles.title}>{strings.Title}</div>
        <div className={styles.description}>{cardDescription}</div>
        <div className={styles.message}>{strings.MandatoryTrainingDescription}</div>
        <div className={styles.linkRow}>
          <a className={styles.link} href="#">
            {strings.ViewCourseLabel}
          </a>
          <a className={styles.link} href={strings.CardButtonTarget}>
            {strings.VisitButtonLabel}
          </a>
        </div>
      </div>
    );
  }
}
