export namespace Package {
  namespace Downloads {
    export interface Client {
      sha1: string;
      size: number;
      url: string;
    }
  }

  export interface Downloads {
    client: Downloads.Client;
  }

  export interface AssetIndex {
    id: string;
    sha1: string;
    size: number;
    totalSize: number;
    url: string;
  }
}

export interface Package {
  downloads: Package.Downloads;
  assetIndex: Package.AssetIndex;
}
