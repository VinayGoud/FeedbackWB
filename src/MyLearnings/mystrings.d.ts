declare interface IMyLearningsWebPartStrings {
  Title: string;
  NoTrainingTitle: string;
  MandatoryTrainingDescription: string;
  NoMandatoryTrainingPrimaryText: string;
  SingleMandatoryTrainingPrimaryText: string;
  MultipleMandatoryTrainingPrimaryText: string;
  ViewCourseLabel: string;
  VisitButtonLabel: string;
  CardButtonTarget: string;
  ErrorMessage: string;
  ContactUsButtonText: string;
  ContactUsLink: string;
}

declare module 'MyLearningsWebPartStrings' {
  const strings: IMyLearningsWebPartStrings;
  export = strings;
}
