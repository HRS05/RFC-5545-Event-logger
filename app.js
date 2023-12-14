const fs = require("fs");
const readLine = require("readline");

// defined template
const template = [
  "BEGIN",
  "UID",
  "DTSTAMP",
  "DTSTART",
  "DTEND",
  "SUMMARY",
  "END",
];

//rappers for input
const ioInterface = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function Question(q) {
  const promise = new Promise((resolve, reject) => {
    ioInterface.question(q, (ans) => {
      resolve(ans);
    });
  });
  return promise;
}

//Parsing class
class Parser {
  async getParsedEvents() {
    const result = [];

    const data = fs.readFileSync("./cal.txt", "utf-8");
    const lines = data.split("<END>\n");
    for (const line of lines) {
      const rawEvent = line.split("\n");
      const eventObj = {};
      let count = 0;
      for (const eve of rawEvent) {
        const [key, value] = eve.split(":");
        if (template.includes(key)) {
          eventObj[key] = value;
          count++;
        }
      }
      if (count != template.length) {
        throw new Error("Template keys are missing");
      }
      result.push(eventObj);
    }

    return result;
  }

  async addEventData(data) {
    // Read the content of the file
    const filePath = "./cal.txt";
    let fileContent = fs.readFileSync(filePath, "utf-8");
    let newEventString = "";

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        newEventString += `${key}:${data[key]}\n`;
      }
    }

    fileContent += `\n${newEventString}<END>`;

    fs.writeFileSync(filePath, fileContent, "utf-8");
  }
}

async function main() {
  console.log("Calander events");
  console.log("1. Add event");
  console.log("2. List all event");
  console.log("3. Exit");

  while (true) {
    try {
      const option = await Question("Please select option : ");
      if (option == 3) break;
      const p = new Parser();
      if (option == 2) {
        const r = await p.getParsedEvents();
        console.log(r);
      } else if (option == 1) {
        const BEGIN = "VEVENT";
        const UID = await Question("Please enter UID : ");
        const DTSTAMP = await Question("Please enter DTSTAMP : ");
        const DTSTART = await Question("Please enter DTSTART : ");
        const DTEND = await Question("Please enter DTEND : ");
        const SUMMARY = await Question("Please enter SUMMARY : ");
        const CLASS = await Question("Please enter CLASS : ");
        const CATEGORIES = await Question("Please enter CATEGORIES : ");
        const END = await Question("Please enter END : ");
        const obj = {
          BEGIN,
          UID,
          DTSTAMP,
          DTSTART,
          DTEND,
          SUMMARY,
          CLASS,
          CATEGORIES,
          END,
        };
        await p.addEventData(obj);
        console.log("Data added successfully");
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
      console.log(`-------App terminated--------`);
      break;
    }
  }

  ioInterface.close();
}

main()
  .catch((error) => {
    console.error("Error:", error.message);
  });
