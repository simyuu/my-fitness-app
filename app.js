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

    sets: sets

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
});


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

    workoutList.innerHTML =
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

}


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

  }
);


displayWorkouts();
displayHistory();
displayAnalysis();
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
      " kg";


    div.appendChild(name);

    div.appendChild(detail);

    historyList.appendChild(div);

  });

}
function displayAnalysis() {

  if (workouts.length === 0) {

    analysis.textContent =
      "累積一些訓練紀錄後，我會開始分析你的進步。";

    return;
  }


  var totalSessions =
    workouts.length;


  var bestVolume = 0;

  var bestWorkout = null;


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
    totalSessions +
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
    " 次）<br><br>" +

    "💡 建議：繼續記錄訓練，之後我可以根據你的歷史表現計算更個人化的訓練建議。";

}
