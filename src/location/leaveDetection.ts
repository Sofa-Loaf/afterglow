import { RESIDUE } from '../doctrine';
import { isOutsideGeofence } from '../geo';
import type { Coord } from '../types';

export type LeavePhase = 'idle' | 'dwelling' | 'left';

export type LeaveState = {
  phase: LeavePhase;
  dwell: Coord | null;
};

export const GEOFENCE_RADIUS_M = RESIDUE.geofenceRadiusMeters;

/**
 * Foreground leave-detection stub.
 * Background geofencing is not enabled (Play background-location policy).
 */
export function reduceLeaveState(
  state: LeaveState,
  current: Coord | null,
  options: { simulateLeave?: boolean; radiusM?: number } = {},
): LeaveState {
  if (options.simulateLeave && state.dwell) {
    return { phase: 'left', dwell: state.dwell };
  }
  if (!current) return state;
  if (!state.dwell) {
    return { phase: 'dwelling', dwell: current };
  }
  if (isOutsideGeofence(state.dwell, current, options.radiusM ?? GEOFENCE_RADIUS_M)) {
    return { phase: 'left', dwell: state.dwell };
  }
  return { phase: 'dwelling', dwell: state.dwell };
}

export function resetLeaveState(): LeaveState {
  return { phase: 'idle', dwell: null };
}
