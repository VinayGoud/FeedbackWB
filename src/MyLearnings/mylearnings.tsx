import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { spfi, SPFx as SPFx } from '@pnp/sp';
import "@pnp/sp/profiles";
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";

import * as strings from 'MyLearningsWebPartStrings';
import MyLearnings from './components/MyLearnings';
import { IMyLearningsProps } from './components/IMyLearningsProps';
import { APIService } from '../../adaptiveCardExtensions/training/Services/APIService';
import { Constants } from '../../adaptiveCardExtensions/training/Utilities/Constants';
import { ITrainings } from '../../adaptiveCardExtensions/training/Utilities/Interfaces';

export interface IMyLearningsWebPartProps {
  description: string;
  stageConnection: boolean;
  userID: string;
}

export default class MyLearningsWebPart extends BaseClientSideWebPart<IMyLearningsWebPartProps> {

  private mandatoryCourseCount: number = 0;
  private errorOccuredStatus: boolean = false;

  protected async onInit(): Promise<void> {

    let trainingDetails: ITrainings = {
      apiErrorOccuredStatus: true,
      success: false,
      errorMessage: '',
      errorCode: 0,
      openButtonLabel: "",
      cardView: {
        title: "",
        mandatoryCourses: 0,
        messageText: "",
        topActivities: []
      },
      quickView: [],
      cachingTime: '',
      dueDatePassedCount: 0,
      isDateisWithin7Days: false,
      dueSoonCount: 0
    };

    try {
      const sp = spfi().using(SPFx(this.context));

      const stageConnection: boolean = this.properties.stageConnection ? true : false;

      let userId: string = "";
      let userIdAPIStatus: boolean = false;

      if (this.properties.stageConnection) {
        [userId, userIdAPIStatus] = await APIService.getUserId(sp, this.context as any);
      } else {
        userId = this.properties.userID;
      }

      if (!userIdAPIStatus) {
        trainingDetails = await APIService.getTrainingDetails(
          this.context as any,
          userId,
          stageConnection
        );
      }

      this.mandatoryCourseCount = !trainingDetails.apiErrorOccuredStatus && trainingDetails.cardView
        ? trainingDetails.cardView.mandatoryCourses
        : 0;

      this.errorOccuredStatus = trainingDetails.apiErrorOccuredStatus;

    } catch (error) {
      this.errorOccuredStatus = true;
      this.mandatoryCourseCount = 0;
    }

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IMyLearningsProps> = React.createElement(
      MyLearnings,
      {
        mandatoryCourseCount: this.mandatoryCourseCount,
        errorOccuredStatus: this.errorOccuredStatus
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
