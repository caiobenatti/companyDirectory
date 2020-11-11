$(document).ready(function () {
  //   $("#mainContent").hide();
  //   $("#login").show();
  getAll();
  getAllDepartments();
  getAllDepartmentsId();
});

let employees;
let xs = [];
let ys = [];
let dataDump;

function getAll() {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        employees = result;
        $("#employeeList").html("");
        for (let i = 0; i <= result.data.length; i++) {
          $("#employeeList").append(`
        <tr>
        <th scope="row">${i + 1}</th>
        <td>${result.data[i].firstName}</td>
        <td>${result.data[i].lastName}</td>
        <td class="mobileHidden">${result.data[i].email}</td>
        <td class="mobileHidden">${result.data[i].department}</td>
         <td class="mobileHidden">${result.data[i].location}</td>
        <td class="mobileHidden">${result.data[i].jobTitle}</td>
        <td>
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect">
         More
        </button>
  </td>
</tr>`);
        }
      }
    },
  });
}

function getAllDepartments() {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        xs = [];
        // ys = [];
        result.data.forEach((element) => xs.push(element.name));
        // ys.reverse();
        // updateChart();
      }
    },
  });
}

function getAllDepartmentsId() {
  $.ajax({
    url: "libs/php/getDepartmentById.php",
    type: "POST",
    dataType: "json",
    data: {
      id: 10,
    },
    success: function (result) {
      if (result.status.code == 200) {
        dataDump = result;
        // xs = [];
        // ys = [];
        // result.data.forEach((element) => xs.push(element.name));
        // ys.reverse();
        // updateChart();
      }
    },
  });
}
// Updates the chart with new information
function updateChart() {
  let myChart = null;
  if (myChart != null) {
    myChart.destroy();
  }
  const ctx = document.getElementById("myChart");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xs,
      datasets: [
        {
          label: `List of employees by branch`,
          data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
          fill: false,
          backgroundColor: "transparent",
          borderColor: "blue",
          borderWidth: 1,
          pointBackgroundColor: "#007bff",
        },
      ],
    },
  });
}
