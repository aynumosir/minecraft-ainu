export namespace AssetIndex {
  export interface Object {
    hash: string;
    size: number;
  }
}

export interface AssetIndex {
  objects: Record<string, AssetIndex.Object>;
}
