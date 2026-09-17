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
