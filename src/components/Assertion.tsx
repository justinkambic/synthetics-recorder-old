/*
MIT License

Copyright (c) 2021-present, Elastic NV

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import React from "react";
import {
  EuiBadge,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiToolTip,
  useEuiTheme,
} from "@elastic/eui";
import { COMMAND_SELECTOR_OPTIONS } from "../common/shared";
import type { Action, ActionContext } from "../common/types";
import { AssertionDrawerHandler } from "../contexts/AssertionContext";

interface IAssertion {
  action: Action;
  actionContext: ActionContext;
  actionIndex: number;
  assertionCount: number;
  onDeleteAction: (stepIndex: number, actionIndex: number) => void;
  onShowAssertionDrawer: AssertionDrawerHandler;
  stepIndex: number;
}

export function Assertion({
  action,
  actionContext,
  actionIndex,
  assertionCount,
  onDeleteAction,
  onShowAssertionDrawer,
  stepIndex,
}: IAssertion) {
  const {
    euiTheme: {
      border: {
        thin,
        radius: { medium },
      },
    },
  } = useEuiTheme();

  const commandOption = COMMAND_SELECTOR_OPTIONS.find(
    ({ value: v }) => v === action.command
  );
  const commandText = commandOption ? commandOption.text : action.command;

  return (
    <EuiFlexGroup
      alignItems="center"
      style={{
        border: thin,
        borderRadius: medium,
        marginTop: 0,
        marginLeft: 0,
        marginBottom: 0,
        marginRight: 36,
        maxHeight: 40,
        minWidth: 310,
      }}
    >
      <EuiFlexItem>
        <EuiFlexGroup alignItems="center" gutterSize="none">
          <EuiFlexItem>Assertion {assertionCount}&nbsp;</EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiToolTip
              content={`${action.selector}${
                action.value ? `: "${action.value}"` : ""
              }`}
            >
              <EuiBadge>{commandText}</EuiBadge>
            </EuiToolTip>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          aria-label="Open a dialogue to edit this assertion."
          color="text"
          iconType="pencil"
          onClick={() => {
            onShowAssertionDrawer({
              previousAction: actionContext,
              actionIndex,
              stepIndex,
              mode: "edit",
            });
          }}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          aria-label="Delete this assertion."
          color="text"
          iconType="trash"
          onClick={() => onDeleteAction(stepIndex, actionIndex)}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
