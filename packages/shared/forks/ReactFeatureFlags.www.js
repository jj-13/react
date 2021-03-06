/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import typeof * as FeatureFlagsType from 'shared/ReactFeatureFlags';
import typeof * as ExportsType from './ReactFeatureFlags.www';
import typeof * as DynamicFeatureFlags from './ReactFeatureFlags.www-dynamic';

// Re-export dynamic flags from the www version.
const dynamicFeatureFlags: DynamicFeatureFlags = require('ReactFeatureFlags');

export const {
  debugRenderPhaseSideEffectsForStrictMode,
  deferPassiveEffectCleanupDuringUnmount,
  disableInputAttributeSyncing,
  enableTrustedTypesIntegration,
  runAllPassiveEffectDestroysBeforeCreates,
  warnAboutShorthandPropertyCollision,
  disableSchedulerTimeoutBasedOnReactExpirationTime,
  warnAboutSpreadingKeyToJSX,
  replayFailedUnitOfWorkWithInvokeGuardedCallback,
  enableModernEventSystem,
} = dynamicFeatureFlags;

// On WWW, __EXPERIMENTAL__ is used for a new modern build.
// It's not used anywhere in production yet.

// In www, we have experimental support for gathering data
// from User Timing API calls in production. By default, we
// only emit performance.mark/measure calls in __DEV__. But if
// somebody calls addUserTimingListener() which is exposed as an
// experimental FB-only export, we call performance.mark/measure
// as long as there is more than a single listener.
export let enableUserTimingAPI = __DEV__ && !__EXPERIMENTAL__;

export const enableProfilerTimer = __PROFILE__;
export const enableProfilerCommitHooks = __PROFILE__;

// Note: we'll want to remove this when we to userland implementation.
// For now, we'll turn it on for everyone because it's *already* on for everyone in practice.
// At least this will let us stop shipping <Profiler> implementation to all users.
export const enableSchedulerTracing = true;
export const enableSchedulerDebugging = true;

export const warnAboutDeprecatedLifecycles = true;
export const disableLegacyContext = __EXPERIMENTAL__;
export const warnAboutStringRefs = false;
export const warnAboutDefaultPropsOnFunctionComponents = false;

export const enableSuspenseServerRenderer = true;
export const enableSelectiveHydration = true;

export const enableBlocksAPI = true;

export const disableJavaScriptURLs = true;

let refCount = 0;
export function addUserTimingListener() {
  if (__DEV__) {
    // Noop.
    return () => {};
  }
  refCount++;
  updateFlagOutsideOfReactCallStack();
  return () => {
    refCount--;
    updateFlagOutsideOfReactCallStack();
  };
}

// The flag is intentionally updated in a timeout.
// We don't support toggling it during reconciliation or
// commit since that would cause mismatching user timing API calls.
let timeout = null;
function updateFlagOutsideOfReactCallStack() {
  if (!timeout) {
    timeout = setTimeout(() => {
      timeout = null;
      enableUserTimingAPI = refCount > 0;
    });
  }
}

export const enableDeprecatedFlareAPI = true;

export const enableFundamentalAPI = false;

export const enableScopeAPI = true;

export const enableUseEventAPI = true;

export const warnAboutUnmockedScheduler = true;

export const enableSuspenseCallback = true;

export const flushSuspenseFallbacksInTests = true;

export const disableTextareaChildren = __EXPERIMENTAL__;

export const disableMapsAsChildren = __EXPERIMENTAL__;

export const disableModulePatternComponents = __EXPERIMENTAL__;

export const warnUnstableRenderSubtreeIntoContainer = false;

export const enableLegacyFBSupport = !__EXPERIMENTAL__;

// Internal-only attempt to debug a React Native issue. See D20130868.
export const throwEarlyForMysteriousError = false;

// Enable forked reconciler. Piggy-backing on the "variant" global so that we
// don't have to add another test dimension. The build system will compile this
// to the correct value.
export const enableNewReconciler = __VARIANT__;

// Flow magic to verify the exports of this file match the original version.
// eslint-disable-next-line no-unused-vars
type Check<_X, Y: _X, X: Y = _X> = null;
// eslint-disable-next-line no-unused-expressions
(null: Check<ExportsType, FeatureFlagsType>);
