/**
 * @info Created FixedPerformanceEntry interface cuz PerformanceEntry from ts is outdated
 */
interface FixedPerformanceEntry extends PerformanceEntry {
  type: string;
}
/**
 * @class ToggleBackground
 * @info  Class responsible for changing background on footer, which depends on the browser reload
 */
export class ToggleBackground {
  private reload = "RELOAD";
  public reloads;

  constructor(public window: Window) {
    this.reloads = this.countReloads();
    this.toggleBackground();
  }
  /**
   * @info Get count of reloads from local storage
   */
  private getReloadsCountFromLocalStorage(): number {
    const value = this.window.localStorage.getItem(this.reload);
    return typeof value === "string" ? JSON.parse(value) : 0;
  }
  /**
   * @info Set reloads to local storage
   */
  private setReloadsCountToLocalStorage(reloadCount: number): void {
    this.window.localStorage.setItem(this.reload, JSON.stringify(reloadCount));
  }
  /**
   * @info Detect type of performance and check if is a reload
   */
  private detectReload(): boolean {
    const performance = <FixedPerformanceEntry[]>(
      this.window.performance.getEntriesByType("navigation")
    );
    return performance
      .map(({ type }) => type)
      .includes(this.reload.toLowerCase());
  }
  /**
   * @info Count Reloads
   */
  private countReloads() {
    const acctualReloads = this.getReloadsCountFromLocalStorage();
    if (this.detectReload()) {
      this.setReloadsCountToLocalStorage(acctualReloads + 1);
      return acctualReloads + 1;
    }
    return acctualReloads;
  }
  /**
   * @info Toggle background for footer
   */
  private toggleBackground() {
    if (this.reloads && this.reloads % 5 === 0)
      this.window.document.getElementById("footer")?.classList.add("greyBg");
  }
}
