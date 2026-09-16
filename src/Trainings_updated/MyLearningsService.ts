import { WebPartContext } from '@microsoft/sp-webpart-base';

import { APIService } from '../../../adaptiveCardExtensions/training/Services/APIService';
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
    return APIService.getTrainingDetails(
      this._context,
      userId,
      useStageConnection
    );
  }
}
