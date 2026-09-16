import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart
} from '@microsoft/sp-webpart-base';

import MyLearnings from './components/MyLearnings';
import { IMyLearningsProps } from './components/IMyLearningsProps';

export interface IMyLearningsWebPartProps {
}

export default class MyLearningsWebPart
  extends BaseClientSideWebPart<IMyLearningsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMyLearningsProps> =
      React.createElement(MyLearnings, {
        context: this.context
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
