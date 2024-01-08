import IDataFetcher from "./../../models/interfaces/IDataFetcher.js";

export default class AbstractDataFetcher extends IDataFetcher {
  async fetchData() {
    throw new Error("Method 'fetchData(year)' must be implemented.");
  }
}
