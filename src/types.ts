export type CaptureKind = 'voice' | 'still' | 'line';

export type Coord = {
  latitude: number;
  longitude: number;
};

export type Afterglow = {
  id: string;
  kind: CaptureKind;
  createdAt: number;
  expiresAt: number;
  coord: Coord;
  /** Present for line captures. */
  line?: string;
  /** Local file or sample URI for voice / still. */
  mediaUri?: string;
  origin: 'local' | 'sample';
  placeHint: string;
  /**
   * Play count. Stub for later ranking at a landmark pin cluster.
   * Rank the residue, never rate the place. No stars.
   */
  plays: number;
};

export type PermissionState = 'unknown' | 'granted' | 'denied';
