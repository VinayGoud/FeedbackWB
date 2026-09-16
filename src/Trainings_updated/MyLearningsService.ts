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

    console.log(
      '[MyLearningsService] Training key:',
      Constants.localStorageTrainingKey
    );

    console.log(
      '[MyLearningsService] Expiry key:',
      Constants.localStorageExpiryKey
    );

    console.log(
      '[MyLearningsService] Cached training details:',
      trainingDetails
    );

    console.log(
      '[MyLearningsService] Cached expiry time:',
      expiryTime
    );

    if (!trainingDetails || !expiryTime) {
      console.log('[MyLearningsService] Cache not found.');
      return undefined;
    }

    const expiryDate = new Date(expiryTime);
    const currentDate = new Date();

    console.log(
      '[MyLearningsService] Expiry date:',
      expiryDate
    );

    console.log(
      '[MyLearningsService] Current date:',
      currentDate
    );

    if (currentDate >= expiryDate) {
      console.log('[MyLearningsService] Cache expired.');
      return undefined;
    }

    const cachedData = JSON.parse(trainingDetails) as ITrainings;

    console.log(
      '[MyLearningsService] Using cached training details:',
      cachedData
    );

    return cachedData;
  } catch (error) {
    console.error(
      '[MyLearningsService] Failed to read cached training details.',
      error
    );

    return undefined;
  }
}
}
