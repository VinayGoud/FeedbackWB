import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IFeedbackTestItem {
  Id: number;
  Title: string;
  Comments: string;
  Like: boolean;
  HashCode_FeedbackStatus: string;
  PromptId: number;
}

export interface IFeedbackPrompt {
  Id: number;
  Title: string;
  Active: boolean;
  WeekNumber: string;
}

export class FeedbackService {
  private sp;

  constructor(context: WebPartContext) {
    // This connects PnPjs to the current SharePoint site context (auth handled automatically)
    this.sp = spfi().using(SPFx(context));
  }

  // Get whichever prompt is currently marked Active — this is what resets
  // week to week / event to event, since a new prompt gets a new Id.
  public async getActivePrompt(): Promise<IFeedbackPrompt | null> {
    const prompts: IFeedbackPrompt[] = await this.sp.web.lists
      .getByTitle('FeedbackPrompts')
      .items
      .select('Id', 'Title', 'Active', 'WeekNumber')
      .filter('Active eq 1')
      .top(1)();

    return prompts.length > 0 ? prompts[0] : null;
  }

  // Write a new response into the list, tagged with which prompt it belongs to
  public async addResponse(
    like: boolean,
    comment: string,
    hashCode: string,
    promptId: number
  ): Promise<void> {
    await this.sp.web.lists
      .getByTitle('EmployeeFeedbackTest')
      .items
      .add({
        Title: like ? 'Positive feedback' : 'Negative feedback',
        Like: like,
        Comments: comment,
        HashCode_FeedbackStatus: hashCode,
        PromptId: promptId
      });

    console.log('Response submitted successfully.');
  }

  // One-way hash of the user's login name — identity isn't stored,
  // but the same user always produces the same hash, so duplicates are detectable.
  public async hashUserIdentity(loginName: string): Promise<string> {
    const encoded = new TextEncoder().encode(loginName);
    const digestBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const bytes = new Uint8Array(digestBuffer);

    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
      const byteHex = bytes[i].toString(16);
      hex += byteHex.length === 1 ? `0${byteHex}` : byteHex;
    }
    return hex;
  }

  // Check whether this hash has already responded to THIS SPECIFIC prompt.
  // Scoping by promptId is what makes the check reset for a new week/event.
  public async hasUserResponded(hashCode: string, promptId: number): Promise<boolean> {
    const existing: IFeedbackTestItem[] = await this.sp.web.lists
      .getByTitle('EmployeeFeedbackTest')
      .items
      .filter(`HashCode_FeedbackStatus eq '${hashCode}' and PromptId eq ${promptId}`)
      .top(1)();

    return existing.length > 0;
  }
}