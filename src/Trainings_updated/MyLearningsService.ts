import { WebPartContext } from '@microsoft/sp-webpart-base';

import { APIService } from '../../../adaptiveCardExtensions/training/Services/APIService';
import { Constants } from '../../../adaptiveCardExtensions/training/Utilities/Constants';
import { ITrainings } from '../../../adaptiveCardExtensions/training/Utilities/Interfaces';

export class MyLearningsService {
  private readonly _context: WebPartContext;

  public constructor(context: WebPartContext) {
    this._context = context;
  }

  public async getTrainingDetails(
    userId: string,
    useStageConnection: boolean
  ): Promise<ITrainings> {

    const cachedTrainingDetails = this._getCachedTrainingDetails();

    if (cachedTrainingDetails) {
      return cachedTrainingDetails;
    }

    return APIService.getTrainingDetails(
      this._context,
      userId,
      useStageConnection
    );
  }

  private _getCachedTrainingDetails(): ITrainings | undefined {
    try {
      const trainingDetails = localStorage.getItem(
        Constants.localStorageTrainingKey
      );

      const expiryTime = localStorage.getItem(
        Constants.localStorageExpiryKey
      );

      if (!trainingDetails || !expiryTime) {
        return undefined;
      }

      const expiryDate = new Date(expiryTime);

      if (new Date() >= expiryDate) {
        return undefined;
      }

      return JSON.parse(trainingDetails) as ITrainings;
    } catch (error) {
      console.error(
        '[MyLearningsService] Failed to read cached training details.',
        error
      );

      return undefined;
    }
  }
}
