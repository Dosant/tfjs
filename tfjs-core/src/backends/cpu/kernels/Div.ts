/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {Div, DivInputs} from '../../../kernel_names';
import {KernelConfig} from '../../../kernel_registry';
import {TypedArray} from '../../../types';
import {MathBackendCPU} from '../backend_cpu';
import {assertNotComplex} from '../cpu_util';

import {div} from './div_impl';

export const divConfig: KernelConfig = {
  kernelName: Div,
  backendName: 'cpu',
  kernelFunc: ({inputs, backend}) => {
    const {a, b} = inputs as DivInputs;
    const cpuBackend = backend as MathBackendCPU;
    assertNotComplex([a, b], Div);

    const aVals = cpuBackend.data.get(a.dataId).values as TypedArray;
    const bVals = cpuBackend.data.get(b.dataId).values as TypedArray;

    const [resultData, resultShape] =
        div(a.shape, b.shape, aVals, bVals, a.dtype);

    const dataId = cpuBackend.write(resultData, resultShape, a.dtype);
    return {dataId, shape: resultShape, dtype: a.dtype};
  }
};
