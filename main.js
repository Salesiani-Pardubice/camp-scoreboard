const spreadsheetsID = "spreadsheetsID";
const listName = "listName";
const googleAPIsheetKEY = "googleAPIsheetKEY";

let teams = new Array();

const colors = [
  "bg-red-500",
  "bg-yellow-400",
  "bg-green-600",
  "bg-sky-600",
  "bg-emerald-600",
  "bg-orange-600",
  "bg-amber-600",
  "bg-slate-600",
  "bg-lime-600",
  "bg-zinc-600",
  "bg-teal-600",
  "bg-cyan-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-pink-600",
  "bg-rose-600",
];

class Team {
  constructor(name, data, id) {
    this.id = id;
    this.name = name;
    this.score = 0;

    data.forEach((value) => {
      this.score += value[0];
    });

    this.data = data;
  }
}

function getMaxScore(data) {
  let maxScore = 0;
  let maxDeep = data.values.length;

  for (let col = 0; col < data.values[0].length; col += 2) {
    let row = 1;
    let tmp_score = 0;

    while (row < maxDeep && data.values[row][col] != undefined) {
      tmp_score += parseInt(data.values[row][col]);
      ++row;
    }
    if (tmp_score > maxScore) maxScore = tmp_score;
  }
  return maxScore;
}

function displayDetails(teamID) {
  console.log(teamID);
  const graph = document.getElementById(`graph-${teamID}`);
  graph.classList.add("z-100");
  graph.classList.add("absolute");
  graph.classList.remove("w-auto");
  graph.classList.add("w-screen");
  graph.classList.add("inset-y-0");
  graph.classList.add("left-0");
}

function printTeam(team, maxScore) {
  let viewHeight = window.innerHeight * 0.7;
  let outHtml = `
    <div class="flex flex-col justify-end">
      <h2 class="text-xl">${team.name}</h2>
      <div id="graph-${team.id}" onClick="displayDetails(${team.id})" class="${
        colors[team.id]
      } w-auto text-white cursor-pointer hover:scale-x-105 transition-all flex justify-center items-end text-xl font-mono font-bold" style="height: ${
    viewHeight * (team.score / maxScore)
  }px; min-height: 2rem;">${team.score} b</div>
    </div>
  `;
  // console.log(team.score/maxScore);
  return outHtml;
}

async function render() {
  /* Fetch data */
  const data = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetsID}/values/${listName}?key=${googleAPIsheetKEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.warn("Fetch warning", err));

  // console.log(data);

  const maxScore = getMaxScore(data);

  let outHtml = ""; // output html string

  for (let col = 0; col < data.values[0].length; col += 2) {
    let log = new Array();
    for (let row = 1; row < data.values.length; ++row) {
      if (data.values[row][col] === undefined) break;
      log.push([parseInt(data.values[row][col]), data.values[row][col + 1]]);
    }
    /* Create a team */
    const team = new Team(data.values[0][col], log, col / 2);
    teams.push(team);

    /* Add team's html string */
    outHtml += printTeam(team, maxScore);
  }

  /* Render data */
  const app = document.getElementById("app");
  app.innerHTML = outHtml;
}

render();
