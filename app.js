var workouts =
  JSON.parse(localStorage.getItem("myWorkouts")) || [];


var saveButton =
  document.getElementById("saveButton");

var clearButton =
  document.getElementById("clearButton");

var workoutList =
  document.getElementById("workoutList");

var totalVolume =
  document.getElementById("totalVolume");

var historyList =
  document.getElementById("historyList");

var analysis =
  document.getElementById("analysis");

var todayPlan =
  document.getElementById("todayPlan");

var lastWorkout =
  document.getElementById("lastWorkout");

var weightAdvice =
  document.getElementById("weightAdvice");

var completion =
  document.getElementById("completion");

var difficulty =
  document.getElementById("difficulty");



/* =========================
   儲存訓練
========================= */

saveButton.addEventListener("click", function() {

  var exercise =
    document.getElementById("exercise").value.trim();

  var weight =
    Number(document.getElementById("weight").value);

  var reps =
    Number(document.getElementById("reps").value);

  var sets =
    Number(document.getElementById("sets").value);


  if (
    exercise === "" ||
    weight <= 0 ||
    reps <= 0 ||
    sets <= 0
  ) {

    alert("請把資料填完整！");

    return;
  }


  var workout = {

    id: Date.now(),

    date:
      new Date()
      .toISOString()
      .slice(0, 10),

    exercise: exercise,

    weight: weight,

    reps: reps,

    sets: sets,

    completion:
      completion.value,

    difficulty:
      difficulty.value

  };


  workouts.push(workout);


  localStorage.setItem(
    "myWorkouts",
    JSON.stringify(workouts)
  );


  document.getElementById("exercise").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("reps").value = "";
  document.getElementById("sets").value = "";


  displayWorkouts();
  displayHistory();
  displayAnalysis();

});



/* =========================
   今日訓練
========================= */

function displayWorkouts() {

  var today =
    new Date()
    .toISOString()
    .slice(0, 10);


  var todayWorkouts =
    workouts.filter(function(workout) {

      return workout.date === today;

    });


  workoutList.innerHTML = "";

  var total = 0;


  if (todayWorkouts.length === 0) {

    workoutList.textContent =
      "還沒有訓練紀錄。";

  }

  else {

    todayWorkouts.forEach(function(workout) {

      var volume =
        workout.weight *
        workout.reps *
        workout.sets;


      total =
        total + volume;


      var div =
        document.createElement("div");

      div.className =
        "workout";


      var name =
        document.createElement("div");

      name.className =
        "workout-name";

      name.textContent =
        "🏋️ " + workout.exercise;


      var detail =
        document.createElement("div");

      detail.className =
        "workout-detail";

      detail.textContent =
        workout.weight +
        " kg × " +
        workout.reps +
        " 次 × " +
        workout.sets +
        " 組" +
        "｜訓練量：" +
        volume +
        " kg";


      var deleteButton =
        document.createElement("button");

      deleteButton.className =
        "deleteButton";

      deleteButton.textContent =
        "🗑️ 刪除這筆";


      deleteButton.addEventListener(
        "click",
        function() {

          deleteWorkout(workout.id);

        }
      );


      div.appendChild(name);
      div.appendChild(detail);
      div.appendChild(deleteButton);

      workoutList.appendChild(div);

    });

  }


  totalVolume.textContent =
    total + " kg";

}



/* =========================
   刪除單筆
========================= */

function deleteWorkout(id) {

  workouts =
    workouts.filter(function(workout) {

      return workout.id !== id;

    });


  localStorage.setItem(
    "myWorkouts",
    JSON.stringify(workouts)
  );


  displayWorkouts();
  displayHistory();
  displayAnalysis();

}



/* =========================
   清除今天
========================= */

clearButton.addEventListener(
  "click",
  function() {

    var today =
      new Date()
      .toISOString()
      .slice(0, 10);


    var hasWorkout =
      workouts.some(function(workout) {

        return workout.date === today;

      });


    if (!hasWorkout) {

      alert(
        "今天沒有可以清除的紀錄！"
      );

      return;

    }


    var confirmed =
      confirm(
        "確定要清除今天全部的訓練紀錄嗎？"
      );


    if (!confirmed) {

      return;

    }


    workouts =
      workouts.filter(function(workout) {

        return workout.date !== today;

      });


    localStorage.setItem(
      "myWorkouts",
      JSON.stringify(workouts)
    );


    displayWorkouts();
    displayHistory();
    displayAnalysis();

  }
);



/* =========================
   訓練歷史
========================= */

function displayHistory() {

  historyList.innerHTML = "";


  if (workouts.length === 0) {

    historyList.textContent =
      "還沒有歷史紀錄。";

    return;

  }


  var sortedWorkouts =
    workouts.slice().sort(function(a, b) {

      return b.id - a.id;

    });


  sortedWorkouts.forEach(function(workout) {

    var div =
      document.createElement("div");

    div.className =
      "workout";


    var name =
      document.createElement("div");

    name.className =
      "workout-name";

    name.textContent =
      "🏋️ " + workout.exercise;


    var detail =
      document.createElement("div");

    detail.className =
      "workout-detail";


    var volume =
      workout.weight *
      workout.reps *
      workout.sets;


    var completionText =
      "";


    if (workout.completion === "completed") {

      completionText =
        "✅ 全部完成";

    }

    else if (workout.completion === "partial") {

      completionText =
        "🟡 部分完成";

    }

    else {

      completionText =
        "⏭️ 跳過";

    }


    var difficultyText =
      "";


    if (workout.difficulty === "easy") {

      difficultyText =
        "😎 太輕鬆";

    }

    else if (workout.difficulty === "normal") {

      difficultyText =
        "🙂 剛剛好";

    }

    else if (workout.difficulty === "hard") {

      difficultyText =
        "😮‍💨 有點重";

    }

    else {

      difficultyText =
        "🥵 太重";

    }


    detail.textContent =
      workout.date +
      "｜" +
      workout.weight +
      " kg × " +
      workout.reps +
      " 次 × " +
      workout.sets +
      " 組" +
      "｜訓練量：" +
      volume +
      " kg" +
      "｜" +
      completionText +
      "｜" +
      difficultyText;


    div.appendChild(name);
    div.appendChild(detail);

    historyList.appendChild(div);

  });

}



/* =========================
   個人分析
========================= */

function displayAnalysis() {

  if (workouts.length === 0) {

    analysis.textContent =
      "累積一些訓練紀錄後，我會開始分析你的進步。";

    return;

  }


  var bestVolume = 0;
  var bestWorkout = workouts[0];


  workouts.forEach(function(workout) {

    var volume =
      workout.weight *
      workout.reps *
      workout.sets;


    if (volume > bestVolume) {

      bestVolume = volume;
      bestWorkout = workout;

    }

  });


  var exerciseCount = {};


  workouts.forEach(function(workout) {

    if (!exerciseCount[workout.exercise]) {

      exerciseCount[workout.exercise] = 0;

    }

    exerciseCount[workout.exercise]++;

  });


  var mostTrainedExercise = "";
  var mostTrainedCount = 0;


  for (
    var exercise in exerciseCount
  ) {

    if (
      exerciseCount[exercise] >
      mostTrainedCount
    ) {

      mostTrainedExercise =
        exercise;

      mostTrainedCount =
        exerciseCount[exercise];

    }

  }


  analysis.innerHTML =

    "📚 累積訓練紀錄：" +
    workouts.length +
    " 筆<br><br>" +

    "🏆 目前最高單次訓練量：" +
    bestVolume +
    " kg<br>" +

    "　" +
    bestWorkout.exercise +
    "｜" +
    bestWorkout.weight +
    " kg × " +
    bestWorkout.reps +
    " × " +
    bestWorkout.sets +
    "<br><br>" +

    "🔁 最常訓練：" +
    mostTrainedExercise +
    "（" +
    mostTrainedCount +
    " 次）";

}



/* =========================
   上次紀錄
========================= */

document
  .getElementById("exercise")
  .addEventListener("input", function() {

    showLastWorkout(
      this.value.trim()
    );

  });



function showLastWorkout(exerciseName) {

  if (exerciseName === "") {

    lastWorkout.textContent =
      "輸入運動名稱後，會顯示上次紀錄。";

    weightAdvice.textContent =
      "等待運動資料……";

    return;

  }


  var previous =
    workouts
      .filter(function(workout) {

        return (
          workout.exercise.toLowerCase() ===
          exerciseName.toLowerCase()
        );

      })
      .sort(function(a, b) {

        return b.id - a.id;

      });


  if (previous.length === 0) {

    lastWorkout.textContent =
      "🆕 還沒有這個運動的紀錄。";

    weightAdvice.textContent =
      "💡 建議：第一次做這個動作，先使用自己能穩定控制的保守重量。";

    return;

  }


  var last =
    previous[0];


  lastWorkout.textContent =
    "📌 上次紀錄：" +
    last.weight +
    " kg × " +
    last.reps +
    " 次 × " +
    last.sets +
    " 組" +
    "（" +
    last.date +
    "）";


  if (last.completion === "skipped") {

  weightAdvice.textContent =
    "⏭️ 上次跳過這個動作，今天先依照目前狀態決定是否需要訓練。";

}

else if (last.completion === "partial") {

  weightAdvice.textContent =
    "🟡 上次沒有全部完成，今天先不要增加重量。";

}

else if (last.difficulty === "tooHard") {

  weightAdvice.textContent =
    "🥵 上次覺得太重，今天可以考慮降低重量，優先維持動作品質。";

}

else if (
    last.difficulty === "hard"
) {

    weightAdvice.textContent =
      "😮‍💨 上次覺得有點重，今天先不要加重量。可以維持 " +
      last.weight +
      " kg；如果今天狀態不好，可以適度降低重量。";

}

else if (
  last.difficulty === "normal"
) {

  weightAdvice.textContent =
    "🙂 上次剛剛好，今天可以先維持 " +
    last.weight +
    " kg。";

}

else if (
  last.difficulty === "easy" &&
  last.reps >= 12
) {

  var suggestedWeight =
    last.weight + 1;

  weightAdvice.textContent =
    "📈 上次全部完成而且覺得輕鬆，可以考慮嘗試 " +
    suggestedWeight +
    " kg。";

}

else {

  weightAdvice.textContent =
    "💡 上次表現不錯，今天先維持 " +
    last.weight +
    " kg。";

}

}



/* =========================
   今日任務
========================= */

function displayTodayPlan() {

  var day =
    new Date().getDay();


  var plans = {

    0: {
      title: "🛌 休息日",
      exercises: [
        "輕鬆伸展 5～10 分鐘",
        "散步或自由活動"
      ]
    },

    1: {
      title: "🦵 下肢日",
      exercises: [
        "深蹲 3 組 × 10 次",
        "臀推 3 組 × 12 次",
        "羅馬尼亞硬舉 3 組 × 10 次"
      ]
    },

    2: {
      title: "💪 上肢日",
      exercises: [
        "啞鈴划船 3 組 × 10 次",
        "啞鈴肩推 3 組 × 10 次",
        "二頭彎舉 3 組 × 12 次"
      ]
    },

    3: {
      title: "🧘 恢復日",
      exercises: [
        "輕鬆伸展 5～10 分鐘",
        "散步 10～20 分鐘"
      ]
    },

    4: {
      title: "🍑 下肢＋臀",
      exercises: [
        "深蹲 3 組 × 10 次",
        "臀推 3 組 × 12 次",
        "側抬腿 3 組 × 12 次"
      ]
    },

    5: {
      title: "💪 全身訓練",
      exercises: [
        "深蹲 3 組 × 10 次",
        "啞鈴划船 3 組 × 10 次",
        "臀推 3 組 × 12 次"
      ]
    },

    6: {
      title: "🚶 自由活動日",
      exercises: [
        "散步 15～30 分鐘",
        "自由選擇喜歡的運動"
      ]
    }

  };


  var plan =
    plans[day];


  var html =
    "<h3>" +
    plan.title +
    "</h3>";


  html +=
    "<p>今天不用想太多，照著完成就好。</p>";


  html += "<ol>";


  plan.exercises.forEach(
    function(exercise) {

      html +=
        "<li>" +
        exercise +
        "</li>";

    }
  );


  html += "</ol>";


  html +=
    "<p>⏱️ 預估時間：20～30 分鐘</p>";


  todayPlan.innerHTML =
    html;

}



/* =========================
   啟動 App
========================= */

displayWorkouts();
displayHistory();
displayAnalysis();
displayTodayPlan();
