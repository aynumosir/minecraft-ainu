export namespace VersionManifest {
  export interface Version {
    id: string;
    type: string;
    url: string;
    time: string;
    releaseTime: string;
  }

  export interface Latest {
    release: string;
    snapshot: string;
  }
}

export interface VersionManifest {
  latest: VersionManifest.Latest;
  versions: VersionManifest.Version[];
}

