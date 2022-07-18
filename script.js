let ayurveda;

let body = document.querySelector("body");
let form = document.querySelector("form");

let survey = Papa.parse(
  "https://comatrix-1.github.io/ayurveda-questionnaire/ayurveda.csv",
  {
    header: true,
    download: true,
    complete: function (survey) {
      ayurveda = survey;
      ayurveda.data = ayurveda.data.slice(0, ayurveda.data.length - 1);
      displayForm();
    },
  }
);

const displayForm = function () {
  ayurveda.data.forEach((item) => {
    let label = document.createElement("label");
    label.classList.add("left-4");
    label.innerText =
      item.Question[0].toUpperCase() +
      item.Question.slice(1, item.Question.length);

    let options = `
        <option value="0"></option>
        <option value="Vata">${item.Vata}</option>
        <option value="Pitta">${item.Pitta}</option>
        <option value="Kapha">${item.Kapha}</option>
        `;
    let selectVikruti = document.createElement("select");
    selectVikruti.classList.add("mid-4");
    selectVikruti.innerHTML = options;
    let selectPrakriti = document.createElement("select");
    selectPrakriti.classList.add("right-4");
    selectPrakriti.innerHTML = options;

    form.append(label, selectVikruti, selectPrakriti);
  });

  let calculateBtn = document.createElement("input");
  calculateBtn.setAttribute("type", "button");
  calculateBtn.setAttribute("value", "Discover dosha");
  calculateBtn.classList.add("right-8", "button");
  calculateBtn.addEventListener("click", () => {
    result = generateResult();
    displayResult(result);
  });

  form.append(calculateBtn);
};

const calculate = function () {
  let sum = {
    vikruti: {
      vata: 0,
      pitta: 0,
      kapha: 0,
    },
    prakriti: {
      vata: 0,
      pitta: 0,
      kapha: 0,
    },
  };
  let unfilled = 0;
  selectionsVikruti = document.querySelectorAll("select.mid-4");
  selectionsVikruti.forEach((selection) => {
    if (selection.value == "Vata") {
      sum.vikruti.vata += 1;
    } else if (selection.value == "Pitta") {
      sum.vikruti.pitta += 1;
    } else if (selection.value == "Kapha") {
      sum.vikruti.kapha += 1;
    } else {
      unfilled += 1;
    }
  });
  selectionsPrakriti = document.querySelectorAll("select.right-4");
  selectionsPrakriti.forEach((selection) => {
    if (selection.value == "Vata") {
      sum.prakriti.vata += 1;
    } else if (selection.value == "Pitta") {
      sum.prakriti.pitta += 1;
    } else if (selection.value == "Kapha") {
      sum.prakriti.kapha += 1;
    } else {
      unfilled += 1;
    }
  });
  return [sum, unfilled];
};

const evaluate = function (sum) {
  let evaluation = {
    vikruti: "",
    prakriti: "",
  };

  for (const item in evaluation) {
    switch (true) {
      case sum[item].vata == sum[item].pitta &&
        sum[item].pitta == sum[item].kapha:
        evaluation[item] = `VATA/PITTA/KAPHA`;
        break;
      case sum[item].pitta > sum[item].vata &&
        sum[item].pitta > sum[item].kapha:
        evaluation[item] = `PITTA`;
        break;
      case sum[item].kapha > sum[item].vata &&
        sum[item].kapha > sum[item].pitta:
        evaluation[item] = `KAPHA`;
        break;
      case sum[item].vata > sum[item].pitta && sum[item].vata > sum[item].kapha:
        evaluation[item] = `VATA`;
        break;
      case sum[item].vata == sum[item].pitta:
        evaluation[item] = `VATA/PITTA`;
        break;
      case sum[item].pitta == sum[item].kapha:
        evaluation[item] = `PITTA/KAPHA`;
        break;
      case sum[item].vata == sum[item].kapha:
        evaluation[item] = `VATA/KAPHA`;
        break;
    }
  }

  return evaluation;
};

const recommend = function (sum) {
  let recommendList = new Array();

  if (sum.vikruti.vata !== sum.prakriti.vata) {
    if (sum.vikruti.vata > sum.prakriti.vata) {
      recommendList[0] = "Decrease vata ";
    } else {
      recommendList[0] = "Increase vata ";
    }
  }
  if (sum.vikruti.pitta !== sum.prakriti.pitta) {
    if (sum.vikruti.pitta > sum.prakriti.pitta) {
      recommendList[1] = "Decrease pitta ";
    } else {
      recommendList[1] = "Increase pitta ";
    }
  }
  if (sum.vikruti.kapha !== sum.prakriti.kapha) {
    if (sum.vikruti.kapha > sum.prakriti.kapha) {
      recommendList[2] = "Decrease kapha ";
    } else {
      recommendList[2] = "Increase kapha ";
    }
  }
  return recommendList;
};

const generateResult = function () {
  let [sum, unfilled] = calculate();
  let result = document.createElement("div");
  result.setAttribute("id", "result");

  let evaluation = evaluate(sum);
  let recommendList = recommend(sum);

  // unfilled, if any

  errorText = document.createElement("p");
  errorText.classList.add("text-center");
  if (unfilled == 1) {
    errorText.innerText += ` There is ${unfilled} empty field. Are you sure you've completed the questionnaire?`;
  } else if (unfilled > 1) {
    errorText.innerText += ` There are ${unfilled} empty fields. Are you sure you've completed the questionnaire?`;
  }
  result.append(errorText);

  // result items vikruti and prakriti divs

  for (const item in sum) {
    resultItem = document.createElement("div");
    resultItem.classList.add("result-item");

    resultScore = document.createElement("div");
    resultScore.classList.add("left-4");
    resultScore.innerHTML = `
        <h2>${item[0].toUpperCase() + item.slice(1, item.length)} result</h2>
        <p class="score">Vata: ${sum[item].vata}, Pitta: ${
      sum[item].pitta
    }, Kapha: ${sum[item].kapha}</p>
        `;

    resultEvaluation = document.createElement("div");
    resultEvaluation.classList.add("right-8");
    resultEvaluation.innerHTML = `
        <p class="evaluation">${evaluation[item]}</p>
        `;

    resultItem.append(resultScore, resultEvaluation);
    result.append(resultItem);
  }

  // recommendation portion

  recommendationDiv = document.createElement("div");
  recommendationDiv.innerHTML = `
            <h2>Recommended action</h2>
            `;
  recommendationDiv.classList.add("text-center");

  recommendationList = document.createElement("ul");
  recommendList.forEach((item) => {
    if (item !== null) {
      let listItem = document.createElement("li");
      listItem.innerText = item;
      recommendationList.append(listItem);
    }
  });

  if (recommendationList.innerText == "") {
    recommendationList = document.createElement("p");
    recommendationList.innerText = `
        Your doshas are balanced.
        `;
  }

  recommendationDiv.append(recommendationList);

  result.append(recommendationDiv);

  return result;
};

const displayResult = function (result) {
  document.querySelector("#result").replaceWith(result);
};

// const displayScores = function() {
//     vikrutiScore = document.querySelector("#vikruti-result .score");
//     vikrutiScore.innerText = `Vata: ${sum.vikruti.vata}, Pitta: ${sum.vikruti.pitta}, Kapha: ${sum.vikruti.kapha}`;
//     prakritiScore = document.querySelector("#prakriti-result .score");
//     prakritiScore.innerText = `Vata: ${sum.prakriti.vata}, Pitta: ${sum.prakriti.pitta}, Kapha: ${sum.prakriti.kapha}`;
// };

// const selectedFile = document.getElementById("input");

// const ayurveda = Papa.parse(selectedFile.files[0]);
