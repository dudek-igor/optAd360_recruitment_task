import axios from "axios";
import { Chart, registerables } from "chart.js";
/**
 * @info Interfaces
 */
interface Name {
  title: string;
  first: string;
  last: string;
}
interface Dob {
  date: string;
  age: number;
}
interface User {
  name: Name;
  dob: Dob;
}
/**
 * @class ChartService
 * @info  Class responsible for handle data for charts
 */
export class ChartService {
  private users: User[] = [];
  private button;
  private buttonTxt;
  private loader;

  constructor(public window: Window) {
    this.button = <HTMLButtonElement>(
      window.document.getElementById("data-fetch")
    );
    this.buttonTxt = <HTMLElement>window.document.getElementById("button-txt");
    this.loader = <HTMLElement>window.document.getElementById("loader");
    this.setupButton();
  }
  /**
   * @info Add listener on click to fetch data
   */
  private setupButton() {
    this.window.document
      .getElementById("data-fetch")
      ?.addEventListener("click", this.handleButton);
  }
  /**
   * @info Listner for a button with all steps to setup chart and table
   */
  private handleButton = async () => {
    this.handleButtonBeforeRequest();
    await this.fetchFrench();
    this.createChart();
    this.createTable();
    this.handleButtonAfterRequest();
  };
  /**
   * @info Fetch frach users
   */
  private fetchFrench = async () => {
    const { data } = await axios.get(
      "https://randomuser.me/api/?results=1000&gender=male&nat=fr&inc=dob,name,email"
    );
    this.users = data?.results;
  };
  /**
   * @info Register and setup chart
   */
  private createChart() {
    Chart.register(...registerables);
    const canvas = <HTMLCanvasElement>document.getElementById("chart");
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["20-29", "30-39", "40-49", "50-59", "60-69", "70-79"],
          datasets: [
            {
              label: "The age of the 1000 French men",
              data: this.createDataForChart(),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
  /**
   * @info Group by users by age
   */
  private createDataForChart() {
    return this.users.reduce<number[]>((acc, { dob: { age } }) => {
      // @info Cannot use switch
      if (age < 30) {
        acc[0] ? ++acc[0] : (acc[0] = 1);
      } else if (age < 40) {
        acc[1] ? ++acc[1] : (acc[1] = 1);
      } else if (age < 50) {
        acc[2] ? ++acc[2] : (acc[2] = 1);
      } else if (age < 60) {
        acc[3] ? ++acc[3] : (acc[3] = 1);
      } else if (age < 70) {
        acc[4] ? ++acc[4] : (acc[4] = 1);
      } else {
        acc[5] ? ++acc[5] : (acc[5] = 1);
      }
      return acc;
    }, []);
  }
  /**
   * @info Create table
   */
  private createTable() {
    // 1. Get ten oldest man
    const tenOldestMen = this.users
      .sort(({ dob: { age: a } }, { dob: { age: b } }) => b - a)
      .slice(0, 10);
    // 2. Create table
    const table = <HTMLTableElement>document.getElementById("table");
    // 3. Create table header
    const tHeader = table.createTHead();
    const row = tHeader.insertRow(0);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    cell1.innerHTML = "Name";
    cell2.innerHTML = "Age";
    cell3.innerHTML = "Date of birth";
    // 4. Create table body
    const tBody = table.createTBody();
    tenOldestMen.forEach(
      ({ name: { first, last, title }, dob: { date, age } }, index) => {
        const row = tBody.insertRow(index);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = `${title}. ${first} ${last}`;
        cell2.innerHTML = age + "";
        cell3.innerHTML = new Date(date).toLocaleDateString();
      }
    );
  }
  /**
   * @info Turn on loader and delete and clean txt
   */
  private handleButtonBeforeRequest() {
    this.buttonTxt.innerText = "";
    this.loader.classList.add("on");
  }
  /**
   * @info Disable Fatch button
   */
  private handleButtonAfterRequest() {
    this.loader.classList.remove("on");
    this.buttonTxt.innerHTML = "Pobrano Dane";
    this.button.disabled = true;
  }
}
