let employees;
let xs = [];
let ys = [];
let dataDump;
let charP = [];
let label;
let myChart = null;

// Loading of datatables
$(document).ready(function () {
  $("#selectedColumn").DataTable({
    paging: false,
    aaSorting: [],
    bFilter: false,
    columnDefs: [
      {
        orderable: false,
        targets: 7,
      },
    ],
  });
  $(".dataTables_length").addClass("bs-select");
});

// Event listener
$(document).on("click", "#buttonMore", function (e) {
  getEmpDet(
    JSON.stringify(this.value.split(" ")[1]),
    JSON.stringify(this.value.split(" ")[0])
  );
  $("#empModal").modal("show");
});

$("#graphDep").click(function () {
  graphDepartment();
  getDepartments();
});

$("#graphLoc").click(function () {
  graphLocation();
});

$("#editProfile").click(function () {
  $("input[name='Edit']").removeAttr("readonly");
});

$("#saveProfile").click(function () {
  $("input[name='Edit']").attr("readonly", "readonly");
  saveProfile();
});

$("#searchText").keyup(function () {
  let txt = $(this).val();
  searchBar(txt);
});

$("#navbarDashboard").click(function () {
  graphLocation();
  getAll();
  $("#topMain").show();
});

$("#navbarLeftDashboard").click(function () {
  graphLocation();
  getAll();
  $("#topMain").show();
});

$("#navbarEmployees").click(function () {
  graphLocation();
  getAll();
});

$("#navbarLeftEmployees").click(function () {
  graphLocation();
  getAll();
});

$("#navbarDepartments").click(function () {
  graphDepartment();
  getDepartments();
});

$("#navbarLeftDepartments").click(function () {
  graphDepartment();
  getDepartments();
});

$("#navbarLocations").click(function () {
  graphLocation();
});

// Functions for populating data

function getAll() {
  $.ajax({
    url: "libs/php/read/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        employees = result;
        graphDepartment();
        $("#trHeader").html("");
        $("#mainList").html("");
        $("#headerMain").html("Employees");
        $("#trHeader").append(`
        <th class="th-sm" scope="col">#</th>
              <th class="th-sm" scope="col">First name</th>
              <th class="th-sm" scope="col">Last name</th>
              <th class="th-sm mobileHidden" scope="col">Email</th>
              <th class="th-sm mobileHidden" scope="col">Department</th>
              <th class="th-sm mobileHidden" scope="col">Location</th>
              <th class="th-sm mobileHidden" scope="col">Job title</th>
              <th scope="col">Actions</th>`);
        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $("#mainList").append(`
        <tr>
        <th scope="row">${i + 1}</th>
        <td>${result.data[i].firstName}</td>
        <td>${result.data[i].lastName}</td>
        <td class="mobileHidden">${result.data[i].email}</td>
        <td class="mobileHidden">${result.data[i].department}</td>
         <td class="mobileHidden">${result.data[i].location}</td>
        <td class="mobileHidden">${result.data[i].jobTitle}</td>
        <td>
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect" id="buttonMore" value="${
          result.data[i].lastName
        } ${result.data[i].firstName}">
         More
        </button>
          </td>
</tr>`);
        }
      }
    },
  });
}

function getDepartments() {
  $.ajax({
    url: "libs/php/read/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        employees = result;
        $("#trHeader").html("");
        $("#headerMain").html("Departments");
        $("#trHeader").append(`
        <th class="th-sm" scope="col">#</th>
              <th class="th-sm" scope="col">Department Name</th>
              <th class="th-sm" scope="col">Location</th>

              <th scope="col">Actions</th>`);
        graphDepartment();

        $("#mainList").html("");
        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $("#mainList").append(`
                <tr>
                <th scope="row">${i + 1}</th>
                <td>${result.data[i].name}</td>
                <td>${result.data[i].location}</td>
                
                <td>
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect" id="buttonMore" value="${
          result.data[i].id
        }">
         More
        </button>
          </td>
        </tr>`);
        }
      }
    },
  });
}

function getEmpDet(firstName, lastName) {
  $.ajax({
    url: "libs/php/read/getEmpDetails.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: firstName,
      lastName: lastName,
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        $("#fullName").html(
          `${result.data[0].firstName} ${result.data[0].lastName}`
        );
        $("#emailHeader").html(`${result.data[0].email}`);
        $("#locationHeader").html(`${result.data[0].location}`);
        $("#firstName").val(result.data[0].firstName);
        $("#lastName").val(result.data[0].lastName);
        $("#email").val(result.data[0].email);
        $("#id").val(result.data[0].id);
        $("#department").val(result.data[0].department);
        $("#location").val(result.data[0].location);
        $("#jobtitle").val(result.data[0].jobTitle);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log("employee failure");
      console.log(`Database error: ${textStatus}`);
    },
  });
}

function searchBar(txt) {
  $.ajax({
    url: "libs/php/read/getSearchbar.php",
    type: "POST",
    data: { txt },
    dataType: "json",
    success: function (result) {
      $("#mainList").html("");
      $("#headerMain").html("Search Result");
      for (let i = 0; i < Object.keys(result.data).length; i++) {
        $("#mainList").append(`
        <tr>
        <th scope="row">${i + 1}</th>
        <td>${result.data[i].firstName}</td>
        <td>${result.data[i].lastName}</td>
        <td class="mobileHidden">${result.data[i].email}</td>
        <td class="mobileHidden">${result.data[i].department}</td>
         <td class="mobileHidden">${result.data[i].location}</td>
        <td class="mobileHidden">${result.data[i].jobTitle}</td>
        <td>
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect" id="buttonMore" value="${
          result.data[i].lastName
        } ${result.data[i].firstName}">
         More
        </button>
          </td>
</tr>`);
      }
    },
  });
}

function saveProfile() {
  $.ajax({
    url: "libs/php/update/updateEmpDetails.php",
    type: "POST",
    dataType: "json",
    data: {
      first: JSON.stringify($("#firstName").val()),
      last: JSON.stringify($("#lastName").val()),
      email: JSON.stringify($("#email").val()),
      // jobTitle: JSON.stringify($("jobtitle").val()),
      // depID: JSON.stringify($("department").val()),
      // id: JSON.parse($("#id").val()),
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        console.log("Success");
        // displayAllEmployees();
        // getEmployeeDetails(
        //   JSON.stringify(capitalize($("#input-first-edit").val())),
        //   JSON.stringify(capitalize($("#input-last-edit").val()))
        // );
        // $("#empModal").modal({ refresh: true });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${jqXHR} ${textStatus} ${errorThrown}`);
    },
  });
}

// Updates the chart with new information
function updateChart() {
  if (myChart != null) {
    myChart.destroy();
  }
  const ctx = document.getElementById("myChart");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: xs,
      datasets: [
        {
          label: label,
          data: ys,
          fill: false,
          backgroundColor: "#5c6e91",
          borderColor: "blue",
          borderWidth: 1,
          pointBackgroundColor: "#5c6e91",
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

// Gets the information for both graphs
function graphDepartment() {
  $.ajax({
    url: "libs/php/read/getDeptGraph.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        xs = [];
        ys = [];
        result.data.forEach((element) => xs.push(element.name));
        result.data.forEach((element) => ys.push(element["COUNT(*)"]));
        label = "Employees on each Department";
        updateChart();
      }
    },
  });
}

function graphLocation() {
  //   const keyed = employees.data.map((o) => [JSON.stringify([o.location]), o]);
  //   const map = new Map(
  //     keyed.map(([key, { location }]) => [key, { location, count: 0 }])
  //   );
  //   keyed.forEach(([key, o]) => map.get(key).count++);
  //   chartP = Array.from(map.values());
  //   xs = [];
  //   ys = [];
  //   chartP.forEach((element) => xs.push(element.location));
  //   chartP.forEach((element) => ys.push(element.count));
  //   label = "Employees per Location";
  $.ajax({
    url: "libs/php/read/getLocGraph.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        xs = [];
        ys = [];
        result.data.forEach((element) => xs.push(element.name));
        result.data.forEach((element) => ys.push(element["COUNT(*)"]));
        label = "Employees on each Branch";
        updateChart();
      }
    },
  });
}

getAll();

// $('mainContent').hide();
// $("#login").fadeOut();
// $("mainContent").fadeIn();
