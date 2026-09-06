import assert from 'node:assert/strict';

import {
  canHearResidue,
  isWithinAccessRadius,
  rankByPlays,
  residueInReach,
  withPlays,
} from '../src/access';
import { gateOrigin, rememberShown } from '../src/data/residueIndex';
import { sampleAfterglowsNear } from '../src/data/sampleAfterglows';
import { ACCESS_COPY, CAPTURE, PRODUCT, RESIDUE } from '../src/doctrine';
import { distanceMeters, isOutsideGeofence, offsetMeters } from '../src/geo';
import { reduceLeaveState, resetLeaveState } from '../src/location/leaveDetection';
import { expiresAt, isExpired } from '../src/ttl';

assert.equal(PRODUCT.freeForever, true);
assert.equal(PRODUCT.payments, 'none');
assert.equal(CAPTURE.voiceMinSeconds, 8);
assert.equal(CAPTURE.voiceMaxSeconds, 12);
assert.equal(RESIDUE.accessRadiusMeters, 15);
assert.equal(RESIDUE.accessRadiusFeetApprox, 50);
assert.match(ACCESS_COPY.radius, /fifty feet/);

const origin = { latitude: 40.7359, longitude: -73.9911 };
const inside = offsetMeters(origin, 8, 0);
const justOut = offsetMeters(origin, 20, 0);
const far = offsetMeters(origin, 200, 0);

assert.ok(distanceMeters(origin, inside) < RESIDUE.accessRadiusMeters);
assert.ok(distanceMeters(origin, justOut) > RESIDUE.accessRadiusMeters);
assert.equal(isWithinAccessRadius(origin, inside), true);
assert.equal(isWithinAccessRadius(origin, justOut), false);
assert.equal(isOutsideGeofence(origin, inside, RESIDUE.accessRadiusMeters), false);
assert.equal(isOutsideGeofence(origin, justOut, RESIDUE.accessRadiusMeters), true);
assert.equal(isOutsideGeofence(origin, far, RESIDUE.accessRadiusMeters), true);

const samples = sampleAfterglowsNear(origin);
assert.ok(samples.every((item) => Number.isFinite(item.plays)));
const nearby = residueInReach(samples, origin);
assert.ok(nearby.length >= 1);
assert.ok(nearby.length < samples.length);
assert.ok(nearby.every((item) => distanceMeters(origin, item.coord) <= RESIDUE.accessRadiusMeters));
assert.ok(
  samples.some((item) => distanceMeters(origin, item.coord) > RESIDUE.accessRadiusMeters),
);

const ranked = rankByPlays(samples);
assert.ok(ranked[0].plays >= ranked[1].plays);
assert.equal(ranked[0].id, 'sample-corner');
assert.equal(withPlays({ ...samples[0], plays: Number.NaN }).plays, 0);

rememberShown(nearby, origin);
assert.deepEqual(gateOrigin(null, far), origin);
assert.deepEqual(gateOrigin(justOut, far), justOut);
assert.equal(canHearResidue(origin, nearby[0].coord, origin), true);
assert.equal(canHearResidue(inside, nearby[0].coord, origin), true);
assert.equal(canHearResidue(far, nearby[0].coord, origin), false);

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

leave = reduceLeaveState(resetLeaveState(), origin);
leave = reduceLeaveState(leave, justOut);
assert.equal(leave.phase, 'left');

leave = reduceLeaveState(resetLeaveState(), origin);
leave = reduceLeaveState(leave, inside);
assert.equal(leave.phase, 'dwelling');

console.log('verify-logic: ok');
