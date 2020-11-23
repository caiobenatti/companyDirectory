let employees;
let xs = [];
let ys = [];
let dataDump;
let charP = [];
let label;
let myChart = null;

// Event listener
$(document).on("click", "#buttonEmp", function (e) {
  getEmpDet(
    JSON.stringify(this.value.split(" ")[1]),
    JSON.stringify(this.value.split(" ")[0])
  );
  $("#empModal").modal("show");
});

$(document).on("click", "#buttonDept", function (e) {
  getDeptDet(JSON.stringify(this.value));
  $("#deptModal").modal("show");
});

$(".editProfile").click(function () {
  $("input[name='Edit']").removeAttr("readonly");
  $("#department").prop("disabled", false);
});

$("#saveProfileDept").click(function () {
  $("input[name='Edit']").attr("readonly", "readonly");
  saveDept();
});

$("#saveProfile").click(function () {
  $("input[name='Edit']").attr("readonly", "readonly");
  saveProfile();
});

$("#closeEmp").click(function () {
  getAll();
  $("input[name='Edit']").attr("readonly", "readonly");
});

$("#searchText").keyup(function () {
  let txt = $(this).val();
  searchBar(txt);
});

$("#navbarDashboard").click(function () {
  graphLocation();
  getAll();
  $("#buttonToggle").show();
});

$("#navbarEmployees").click(function () {
  graphLocation();
  getAll();
  $("#buttonToggle").show();
});

$("#navbarDepartments").click(function () {
  graphDepartment();
  getDepartments();
  $("#buttonToggle").hide();
});

$("#navbarLocations").click(function () {
  getAllLocations();
});

// Functions for populating data

function getAll() {
  $.ajax({
    url: "libs/php/read/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        graphDepartment();
        populateEmp(result);
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
        $("#trHeader").html("");
        $("#headerMain").html("Departments");
        $("#trHeader").append(`
        <th class="th-sm" scope="col">#</th>
        <th class="th-sm" scope="col">Department ID</th>      
        <th class="th-sm" scope="col">Department Name</th>
        <th class="th-sm" scope="col">Location</th>
        <th class="th-sm" scope="col">Employees</th>

              <th scope="col">Actions</th>`);
        graphDepartment();

        $("#mainList").html("");
        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $("#mainList").append(`
                <tr>
                <th scope="row">${i + 1}</th>
                <td>${result.data[i].id}</td>
                <td>${result.data[i].name}</td>
                <td>${result.data[i].location}</td>
                <td>${result.data[i].employees}</td>
                
                <td>
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect" id="buttonDept" value="${
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

function getAllLocations() {
  $.ajax({
    url: "libs/php/read/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        $("#trHeader").html("");
        $("#headerMain").html("Locations");
        $("#trHeader").append(`
        <th class="th-sm" scope="col">#</th>
        <th class="th-sm" scope="col">Location ID</th>      
        <th class="th-sm" scope="col">Location Name</th>
        <th class="th-sm" scope="col">Departments</th>
        <th class="th-sm" scope="col">Employees</th>
        <th scope="col">Actions</th>`);
        graphLocation();
        $("#mainList").html("");
        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $("#mainList").append(`
                <tr>
                <th scope="row">${i + 1}</th>
                <td>${result.data[i].id}</td>
                <td>${result.data[i].name}</td>
                <td>${result.data[i].departments}</td>
                <td>${result.data[i].employees}</td>
                 <td>
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect" id="buttonDept" value="${
          result.data[i].id
        }">
         More
        </button>
          </td>
        </tr>
        `);
        }
      }
    },
  });
}

function getToggleDep() {
  $.ajax({
    url: "libs/php/read/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $("#toggleDepartment").append(`
                  <a class="dropdown-item" href="#" value="${result.data[i].id}" onClick="getEmpByDept(${result.data[i].id});">${result.data[i].name}</a>`);
        }
      }
    },
  });
}

function getToggleLocs() {
  $.ajax({
    url: "libs/php/read/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        dataDump = result;
        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $("#toggleLocation").append(`
                  <a class="dropdown-item" href="#" value="${result.data[i].id}" onClick="getEmpByLoc(${result.data[i].id});">${result.data[i].name}</a>`);
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
        $("#department").append(
          `<option value="${result.data[0].deptId}">${result.data[0].department}</option>`
        );
        $("#location").val(result.data[0].location);
        $("#jobtitle").val(result.data[0].jobTitle);
      }
      empDept();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${textStatus}`);
    },
  });
}

function getDeptDet(id) {
  $.ajax({
    url: "libs/php/read/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        $("#deptId").val(`${result.data[0].id}`);
        $("#deptLocation").val(`${result.data[0].location}`);
        $("#deptName").val(`${result.data[0].name}`);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${jqXHR} ${textStatus} ${errorThrown}`);
    },
  });
}

function getEmpByLoc(id) {
  $.ajax({
    url: "libs/php/read/getEmpByLoc.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        populateEmp(result);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error:  ${textStatus} ${errorThrown}`);
    },
  });
}

function getEmpByDept(id) {
  $.ajax({
    url: "libs/php/read/getEmpByDept.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        populateEmp(result);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error:  ${textStatus} ${errorThrown}`);
    },
  });
}

function populateEmp(result) {
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
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect" id="buttonEmp" value="${
          result.data[i].lastName
        } ${result.data[i].firstName}">
         More
        </button>
          </td>
</tr>`);
  }
}

function empDept() {
  $.ajax({
    url: "libs/php/read/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      console.log(result);
      if (result.status.code == 200) {
        // $("#department").empty();
        for (let i = 0; i < Object.keys(result["data"]).length; i++) {
          $("#department").append(
            "<option value=" +
              result["data"][i]["id"] +
              ">" +
              result["data"][i]["name"] +
              "</option>"
          );
          if (result["data"][i]["name"] == $("#department").val()) {
            $("#department").val(result["data"][i]["id"]);
          }
        }
        $("#department").prop("disabled", true);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(`Database error: ${textStatus}`);
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
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect" id="buttonEmp" value="${
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
      jobTitle: JSON.stringify($("#jobtitle").val()),
      depID: JSON.stringify($("#department").val()),
      id: JSON.parse($("#id").val()),
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log("Success");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${jqXHR} ${textStatus} ${errorThrown}`);
    },
  });
}

function saveDept() {
  $.ajax({
    url: "libs/php/update/updateDeptDetails.php",
    type: "POST",
    dataType: "json",
    data: {
      deptName: JSON.stringify($("#deptName").val()),
      deptLocation: JSON.parse($("#deptLocation").html()),
      id: JSON.parse($("#deptId").html()),
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log(result);
        console.log("Success");
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
getToggleDep();
getToggleLocs();

// $('mainContent').hide();
// $("#login").fadeOut();
// $("mainContent").fadeIn();
