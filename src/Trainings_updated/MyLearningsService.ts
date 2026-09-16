import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFx } from '@pnp/sp';

import '@pnp/sp/profiles';

import { APIService } from '../../../adaptiveCardExtensions/training/Services/APIService';
import { ITrainings } from '../../../adaptiveCardExtensions/training/Utilities/Interfaces';

export class MyLearningsService {
  private readonly _context: WebPartContext;

  public constructor(context: WebPartContext) {
    this._context = context;
  }

  public async getUserId(): Promise<[string, boolean]> {
    const sp = spfi().using(SPFx(this._context));

    return APIService.getUserId(sp, this._context);
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
