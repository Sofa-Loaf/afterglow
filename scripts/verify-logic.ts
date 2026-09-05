import assert from 'node:assert/strict';

import { CAPTURE, PRODUCT, RESIDUE } from '../src/doctrine';
import { distanceMeters, isOutsideGeofence, offsetMeters } from '../src/geo';
import { reduceLeaveState, resetLeaveState } from '../src/location/leaveDetection';
import { expiresAt, isExpired } from '../src/ttl';

assert.equal(PRODUCT.freeForever, true);
assert.equal(PRODUCT.payments, 'none');
assert.equal(CAPTURE.voiceMinSeconds, 8);
assert.equal(CAPTURE.voiceMaxSeconds, 12);

const origin = { latitude: 40.7359, longitude: -73.9911 };
const nearby = offsetMeters(origin, 30, 0);
const far = offsetMeters(origin, 200, 0);

assert.ok(distanceMeters(origin, nearby) < 40);
assert.equal(isOutsideGeofence(origin, nearby, RESIDUE.geofenceRadiusMeters), false);
assert.equal(isOutsideGeofence(origin, far, RESIDUE.geofenceRadiusMeters), true);

const created = Date.UTC(2026, 0, 1);
assert.equal(isExpired(expiresAt(created, 14), created + 13 * 24 * 60 * 60 * 1000), false);
assert.equal(isExpired(expiresAt(created, 14), created + 15 * 24 * 60 * 60 * 1000), true);

let leave = resetLeaveState();
leave = reduceLeaveState(leave, origin);
assert.equal(leave.phase, 'dwelling');
leave = reduceLeaveState(leave, far);
assert.equal(leave.phase, 'left');

leave = reduceLeaveState(resetLeaveState(), origin);
leave = reduceLeaveState(leave, origin, { simulateLeave: true });
assert.equal(leave.phase, 'left');

console.log('verify-logic: ok');
