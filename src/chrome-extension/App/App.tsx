import React, { useState, useEffect, useContext } from 'react';
import 'primereact/resources/themes/mira/theme.css';
import { UIStateContext, UIStateDispatch } from '../AppState';
import './App.css';
import { MessageFilter } from '../components/MessageFilter';
import { ApiKeyContainer } from '../pages/Content/ApiKeyContainer';
import { LogicFieldSelect } from '../pages/Content/LogicFieldSelect';
import { PrimeReactProvider } from 'primereact/api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { ExpandedExpressionTreeView } from '../components/ExpandedExpressionTreeView';

import { FormView } from '../pages/Content/FormView/FormView';
import { InputText } from 'primereact/inputtext';
import { Config } from '../../config';

import { AppController } from './AppController';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';

const formView = new FormView();

type AppLayoutType = {
  position: 'left' | 'right';
  isRight: boolean;
};

const getDefaultAppLayout = (): AppLayoutType => {
  return {
    position: 'left',
    isRight: false,
  };
};

type apiParametersType = {
  apiKey: string | null;
  formId: string | null;
  submissionId?: string | null;
};
const App: React.FC = () => {
  const [appLayout, setAppLayout] = useState(getDefaultAppLayout());
  const dispatcher = useContext(UIStateDispatch);
  const uiStateContext = useContext(UIStateContext);

  const [apiParameters, setApiParameters] = useState({
    apiKey: Config.get('apiKey'),
    formId: Config.get('formId'),
    submissionId: Config.get('submissionId'),
  } as apiParametersType);

  useEffect(() => {
    apiParameters.apiKey &&
      AppController.getInstance().setApiKey(apiParameters.apiKey);

    formView.initialize();

    apiParameters.formId &&
      AppController.getInstance().fetchFormAndSetState(
        apiParameters.formId,
        uiStateContext,
        dispatcher
      );
  }, []);

  const handleFetchSubmissionClick = () => {
    apiParameters.submissionId &&
      AppController.getInstance().fetchSubmissionAndSetState(
        apiParameters.submissionId,
        uiStateContext,
        dispatcher
      );
  };

  const handleApiGetFormRequestClick = async () => {
    apiParameters.formId &&
      AppController.getInstance().fetchFormAndSetState(
        apiParameters.formId,
        uiStateContext,
        dispatcher
      );
  };

  const handleApiParameterChange = (apiParameters: apiParametersType) => {
    console.log({ handleApiParameterChange: { apiParameters } });
    setApiParameters(apiParameters);
  };

  const handleSubmissionTextChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const submissionId = evt.target.value;
    setApiParameters({ ...apiParameters, ...{ submissionId } });
  };

  const setLeft = (leftRight: 'left' | 'right') => {
    const fsBuddyControlPanels = document.querySelectorAll(
      '.fsBodyControlPanel'
    );
    fsBuddyControlPanels.forEach((panel) => {
      if (leftRight === 'left') {
        // @ts-ignore 'style' not a property
        panel.style.setProperty('left', '0px');
        // @ts-ignore 'style' not a property
        panel.style.setProperty('right', 'unset');
        // @ts-ignore 'style' not a property
        panel.style.setProperty(
          'animation',
          `2s ease-in-out alternate swingViewportRight`
        );
      } else {
        // @ts-ignore 'style' not a property
        panel.style.setProperty(
          'animation',
          `2s ease-in-out swingViewportLeft`
        );
        // @ts-ignore 'style' not a property
        panel.style.setProperty('left', 'unset');
        // @ts-ignore 'style' not a property
        panel.style.setProperty('right', '0px');
      }
    });
  };

  const handleMoveLeftRightToggle = (evt: InputSwitchChangeEvent) => {
    evt.stopPropagation();
    const newAppLayout: AppLayoutType = {
      ...appLayout,
      ...{
        position: appLayout.position === 'left' ? 'right' : 'left',
        isRight: appLayout.position === 'left',
      },
    };
    setLeft(newAppLayout.position);
    setAppLayout(newAppLayout);
    console.log({ handleMoveLeftRightToggle: { newAppLayout } });
  };

  const LeftRightToggle = () => {
    return (
      <>
        <div
          style={{
            float: 'left',
            width: '80%',
            display: 'inline',
            // border: '1px solid black',
          }}
        >
          Fs Buddy
        </div>
        <div>
          <InputSwitch
            // tooltip="Left/Right"
            checked={appLayout.isRight}
            onChange={handleMoveLeftRightToggle}
          />
        </div>
      </>
    );
  };

  return (
    <PrimeReactProvider>
      <div className="ContentContainer">
        <Accordion
          // onTabOpen={handleMainTabOpen}
          // onTabClose={handleMainTabClose}
          multiple
          activeIndex={[0]}
        >
          <AccordionTab headerTemplate={LeftRightToggle}>
            {/* <p className="m-0"> */}
            <Accordion multiple activeIndex={[5]}>
              <AccordionTab header="API">
                <p className="m-0">
                  <ApiKeyContainer
                    {...apiParameters}
                    onChange={handleApiParameterChange}
                  />
                  <Button onClick={handleApiGetFormRequestClick}>
                    API Request Form{' '}
                  </Button>
                </p>
              </AccordionTab>
              <AccordionTab
                header={`Logic (root field count: ${
                  (uiStateContext.offFormLogic.allOffFormLogic || []).length
                })`}
              >
                <p
                  className="m-0"
                  style={{
                    paddingLeft: '20px',
                    minHeight: '500px',
                    minWidth: '600px',
                  }}
                >
                  <LogicFieldSelect />
                  <ExpandedExpressionTreeView />
                </p>
              </AccordionTab>
              <AccordionTab header="Status Messages">
                <p className="m-0">
                  {uiStateContext.apiResponse.formStatusMessages.length > 0 && (
                    <MessageFilter />
                  )}
                </p>
              </AccordionTab>
              <AccordionTab header="Submissions">
                <p className="m-0">
                  <InputText
                    placeholder="Submission Id"
                    value={apiParameters.submissionId || ''}
                    onChange={handleSubmissionTextChange}
                  />{' '}
                  <br />
                  <Button onClick={handleFetchSubmissionClick}>
                    Load Submission
                  </Button>
                </p>
              </AccordionTab>
              <AccordionTab header="Form View">
                <p className="m-0">
                  <formView.component />
                </p>
              </AccordionTab>
            </Accordion>
            {/* </p> */}
          </AccordionTab>
        </Accordion>
      </div>
    </PrimeReactProvider>
  );
};

export { App };
