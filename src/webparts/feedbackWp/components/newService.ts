import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IFeedbackPrompt {
  Id: number;
  Title: string;
  Active: boolean;
  WeekNumber: number;
}

export interface IFeedbackResponse {
  Title: string;
  Comments: string;
  Like: boolean;
  HashCode_FeedbackStatus: string;
  PromptId: number;
}

const PROMPTS_LIST = 'FeedbackPrompts';
const RESPONSES_LIST = 'EmployeeFeedbackTest';

export class FeedbackService {
  private readonly siteUrl: string;

  constructor(private context: WebPartContext) {
    this.siteUrl = context.pageContext.web.absoluteUrl;
  }

  /**
   * Returns the active prompt. If more than one row has Active = true,
   * the most recently created one wins ($orderby=Created desc, $top=1).
   * Returns undefined if no prompt is currently active.
   */
  public async getActivePrompt(): Promise<IFeedbackPrompt | undefined> {
    const url =
      `${this.siteUrl}/_api/web/lists/getByTitle('${PROMPTS_LIST}')/items` +
      `?$select=Id,Title,Active,WeekNumber,Created` +
      `&$filter=Active eq 1` +
      `&$orderby=Created desc` +
      `&$top=1`;

    const response: SPHttpClientResponse = await this.context.spHttpClient.get(
      url,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`getActivePrompt failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const items = data.value;

    if (!items || items.length === 0) {
      return undefined;
    }

    const item = items[0];
    return {
      Id: item.Id,
      Title: item.Title,
      Active: item.Active,
      WeekNumber: item.WeekNumber
    };
  }

  /** SHA-256 hash of a string, hex-encoded manually (Array.from and padStart are avoided for older TS libs). */
  public async hashUserIdentity(identity: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(identity);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);

    let hex = '';
    for (let i = 0; i < hashArray.length; i++) {
      const byteHex = hashArray[i].toString(16);
      hex += byteHex.length === 1 ? '0' + byteHex : byteHex;
    }
    return hex;
  }

  /** Writes every submission — no duplicate blocking, resubmission is allowed by design. */
  public async addResponse(payload: IFeedbackResponse): Promise<void> {
    const url = `${this.siteUrl}/_api/web/lists/getByTitle('${RESPONSES_LIST}')/items`;

    const digest = await this.getRequestDigest();

    const response: SPHttpClientResponse = await this.context.spHttpClient.post(
      url,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=nometadata',
          'odata-version': '',
          'X-RequestDigest': digest
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`addResponse failed (${response.status}): ${errorText}`);
    }
  }

  private async getRequestDigest(): Promise<string> {
    const url = `${this.siteUrl}/_api/contextinfo`;
    const response: SPHttpClientResponse = await this.context.spHttpClient.post(
      url,
      SPHttpClient.configurations.v1,
      { headers: { Accept: 'application/json;odata=nometadata' } }
    );
    const data = await response.json();
    return data.FormDigestValue;
  }
}
