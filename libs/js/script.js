let xs = [];
let ys = [];
let dataDump;
let label;
let myChart = null;

// Event listener

$(".nav a").on("click", function () {
  $(".navbar-toggler").click();
});

$(".close").click(function () {
  $("input[name='Edit']").attr("readonly", "readonly");
});

$(".editProfile").click(function () {
  $("input[name='Edit']").removeAttr("readonly");
  $(".department").prop("disabled", false);
  $(".location").prop("disabled", false);
});

// Event handler for buttons
$(document).on("click", "#buttonEmp", function (e) {
  getEmpDet(
    JSON.stringify(this.value.split(" ")[1]),
    JSON.stringify(this.value.split(" ")[0])
  );
  $(".department").prop("disabled", true);
  $(".location").prop("disabled", true);
  $("#empModal").modal("show");
});

$(document).on("click", "#buttonDept", function (e) {
  getDeptDet(JSON.stringify(this.value));
  $(".department").prop("disabled", true);
  $(".location").prop("disabled", true);
  $("#deptModal").modal("show");
});

$(document).on("click", "#buttonLoc", function (e) {
  getLocDet(JSON.stringify(this.value));
  $(".department").prop("disabled", true);
  $(".location").prop("disabled", true);
  $("#locModal").modal("show");
});

$(document).on("click", "#buttonAdd", function (e) {
  if ($(this).val() == "employee") {
    $(".location").empty();
    $(".department").empty();
    $(".department").prop("disabled", false);
    $(".location").prop("disabled", false);
    getEmpDept();
    getLocation();
    $("#addEmpModal").modal("show");
  } else if ($(this).val() == "departments") {
    $(".location").empty();
    $(".location").prop("disabled", false);
    getLocation();
    $("#addDeptModal").modal("show");
  } else if ($(this).val() == "locations") {
    $("#addLocModal").modal("show");
  }
});

// Event handler for edit
$("#saveProfileDept").click(function () {
  $("input[name='Edit']").attr("readonly", "readonly");
  saveDeptartment();
  $("#deptModal").modal("hide");
});

$("#saveProfileLoc").click(function () {
  $("input[name='Edit']").attr("readonly", "readonly");
  saveLocation();
  $("#locModal").modal("hide");
});

$("#saveProfile").click(function () {
  $("input[name='Edit']").attr("readonly", "readonly");
  saveProfile();
  $("#empModal").modal("hide");
});

// Event handler for Add
$("#saveAddDept").click(function () {
  addDeptartment();
  $("#addDeptModal").modal("hide");
});

$("#saveAddLoc").click(function () {
  addLocation();
  $("#addLocModal").modal("hide");
});

$("#saveAddEmp").click(function () {
  addEmployee();
  $("#addEmpModal").modal("hide");
});

// Search bar
$("#buttonSearch").click(function () {
  let txt = $("#searchText").val();
  searchBar(txt);
});

// Event handler for delete
$("#deleteEmployee").click(function () {
  $("#modalConfirm").modal("show");
  $("#modal-btn-yes").on("click", function () {
    $("input[name='Edit']").attr("readonly", "readonly");
    deleteEmployee($("#id").val());
    $("#empModal").modal("hide");
  });
  $("#modal-btn-no").on("click", function () {
    $("#modalConfirm").modal("hide");
    console.log("no");
  });
  getAll();
});

$("#deleteDepartment").click(function () {
  $("#modalConfirm").modal("show");
  $("#modal-btn-yes").on("click", function () {
    $("input[name='Edit']").attr("readonly", "readonly");
    deleteDepartment($("#deptId").val());
    $("#deptModal").modal("hide");
    $("#modalConfirm").modal("hide");
  });
  $("#modal-btn-no").on("click", function () {
    $("#modalConfirm").modal("hide");
    console.log("no");
  });
  getDepartments();
});

$("#deleteLocation").click(function () {
  $("#modalConfirm").modal("show");
  $("#modal-btn-yes").on("click", function () {
    $("input[name='Edit']").attr("readonly", "readonly");
    deleteLocation($("#locId").val());
    $("#locModal").modal("hide");
    $("#modalConfirm").modal("hide");
    console.log("yes");
  });
  $("#modal-btn-no").on("click", function () {
    $("#modalConfirm").modal("hide");
    console.log("no");
  });
  getAllLocations();
});

// Event handlers navbar

$("#navbarEmployees").click(function () {
  getAll();
  $("#buttonToggle").show();
});

$("#navbarDepartments").click(function () {
  getDepartments();
  $("#buttonToggle").hide();
});

$("#navbarLocations").click(function () {
  getAllLocations();
});

$("#navbarGraph").click(function () {
  graphDepartment();
  $("#graphsModal").modal("show");
});
$("#graphLocations").click(function () {
  graphLocation();
  $("#graphsModal").modal("show");
});
$("#graphDepartments").click(function () {
  graphDepartment();
});

// Functions for populating data

function getAll() {
  $.ajax({
    url: "libs/php/read/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        showEmp(result);
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
        $("#mainList").html("");
        $("#headerMain").html("Departments");
        $("#buttonAdd").val("departments");
        $("#showGraph").val("departments");
        $("#trHeader").append(`
        <th class="th-sm" scope="col">#</th>
        <th class="th-sm" scope="col">Department ID</th>      
        <th class="th-sm" scope="col">Department Name</th>
        <th class="th-sm mobileHidden" scope="col">Location</th>
        <th class="th-sm mobileHidden" scope="col">Employees</th>

              <th scope="col">Actions</th>`);

        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $("#mainList").append(`
                <tr>
                <th scope="row">${i + 1}</th>
                <td>${result.data[i].id}</td>
                <td>${result.data[i].name}</td>
                <td class="mobileHidden">${result.data[i].location}</td>
                <td class="mobileHidden">${result.data[i].employees}</td>
                
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
        $("#mainList").html("");
        $("#headerMain").html("Locations");
        $("#buttonAdd").val("locations");
        $("#showGraph").val("locations");
        $("#trHeader").append(`
        <th class="th-sm" scope="col">#</th>
        <th class="th-sm" scope="col">Location ID</th>      
        <th class="th-sm" scope="col">Location Name</th>
        <th class="th-sm mobileHidden" scope="col">Departments</th>
        <th class="th-sm mobileHidden" scope="col">Employees</th>
        <th scope="col">Actions</th>`);

        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $("#mainList").append(`
                <tr>
                <th scope="row">${i + 1}</th>
                <td>${result.data[i].id}</td>
                <td>${result.data[i].name}</td>
                <td class="mobileHidden">${result.data[i].departments}</td>
                <td class="mobileHidden">${result.data[i].employees}</td>
                 <td>
        <button type="button" class="btn btn-primary btn-sm m-0 waves-effect" id="buttonLoc" value="${
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
        $("#toggleDepartment").append(`
                  <a class="dropdown-item" href="#" onClick="getAll()">All</a>`);
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
      console.log(result);
      if (result.status.code == 200) {
        $("#toggleLocation").append(`
                  <a class="dropdown-item" href="#" onClick="getAll();">All</a>`);
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
        $(".department").empty();
        $(".location").empty();
        $("#fullName").html(
          `${result.data[0].firstName} ${result.data[0].lastName}`
        );
        $("#emailHeader").html(`${result.data[0].email}`);
        $("#locationHeader").html(`${result.data[0].location}`);
        $("#firstName").val(result.data[0].firstName);
        $("#lastName").val(result.data[0].lastName);
        $("#email").val(result.data[0].email);
        $("#id").val(result.data[0].id);
        $(".department").append(
          `<option value="${result.data[0].deptId}">${result.data[0].department}</option>`
        );
        $(".location").append(
          `<option value="${result.data[0].locId}">${result.data[0].location}</option>`
        );
        $("#jobtitle").val(result.data[0].jobTitle);
      }
      getEmpDept();
      getLocation();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${textStatus}`);
    },
  });
}

function getLocDet(id) {
  $.ajax({
    url: "libs/php/read/getLocationDetails.php",
    type: "POST",
    dataType: "json",
    data: {
      id: id,
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#locId").val(result.data[0].id);
        $("#locName").val(result.data[0].name);
      }
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
        dataDump = result;
        $(".location").empty();

        $("#deptId").val(`${result.data[0].id}`);
        $(".location").append(
          `<option value="${result.data[0].locationID}">${result.data[0].location}</option>`
        );
        $("#deptName").val(`${result.data[0].name}`);
      }
      getLocation();
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
      console.log(result);
      if (result.status.code == 200) {
        showEmp(result);
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
        showEmp(result);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error:  ${textStatus} ${errorThrown}`);
    },
  });
}

function showEmp(result) {
  $("#trHeader").html("");
  $("#mainList").html("");
  $("#headerMain").html("Employees");
  $("#buttonAdd").val("employee");
  $("#showGraph").val("employee");
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

function getEmpDept() {
  $.ajax({
    url: "libs/php/read/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $(".department").append(
            "<option value=" +
              result.data[i].id +
              ">" +
              result.data[i].name +
              "</option>"
          );
          if (result["data"][i]["name"] == $(".department").val()) {
            $(".department").val(result.data[i].id);
          }
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(`Database error: ${textStatus}`);
    },
  });
}

function getLocation() {
  $.ajax({
    url: "libs/php/read/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        for (let i = 0; i < Object.keys(result.data).length; i++) {
          $(".location").append(
            "<option value=" +
              result.data[i].id +
              ">" +
              result.data[i].name +
              "</option>"
          );
          if (result["data"][i]["name"] == $(".location").val()) {
            $(".location").val(result.data[i].id);
          }
        }
        // $(".location").prop("disabled", true);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(`Database error: ${textStatus}`);
    },
  });
}

// Function for search bar
function searchBar(txt) {
  $.ajax({
    url: "libs/php/read/getSearchbar.php",
    type: "POST",
    data: { txt: txt },
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

// Functions to update Database
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

function saveDeptartment() {
  $.ajax({
    url: "libs/php/update/updateDeptDetails.php",
    type: "POST",
    dataType: "json",
    data: {
      deptName: JSON.stringify($("#deptName").val()),
      deptLocation: JSON.stringify($("#deptLocation").val()),
      id: JSON.parse($("#deptId").val()),
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

function saveLocation() {
  $.ajax({
    url: "libs/php/update/updateLocDetails.php",
    type: "POST",
    dataType: "json",
    data: {
      locName: JSON.stringify($("#locName").val()),
      id: JSON.parse($("#locId").val()),
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

//Functions to add new Employee record, Department and Location
function addEmployee() {
  $.ajax({
    url: "libs/php/create/insertEmployee.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: JSON.stringify($("#addFirstName").val()),
      lastName: JSON.stringify($("#addLastName").val()),
      email: JSON.stringify($("#addEmail").val()),
      department: JSON.stringify($("#addDeptEmp").val()),
      jobTitle: JSON.stringify($("#addJobTitle").val()),
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log("Success");
        getAll();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${jqXHR} ${textStatus} ${errorThrown}`);
    },
  });
}

function addDeptartment() {
  $.ajax({
    url: "libs/php/create/insertDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      name: JSON.stringify($("#addDeptName").val()),
      locID: JSON.stringify($("#addDeptLocation").val()),
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log("Success");
        getDepartments();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${jqXHR} ${textStatus} ${errorThrown}`);
    },
  });
}

function addLocation() {
  $.ajax({
    url: "libs/php/create/insertLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      name: JSON.stringify($("#addLocName").val()),
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log("Success");
        getAllLocations();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${jqXHR} ${textStatus} ${errorThrown}`);
    },
  });
}

// Functions to delete Employee, Department and Location
function deleteEmployee(empId) {
  $.ajax({
    url: "libs/php/delete/deleteEmployeeByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: empId,
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log("Deleted");
        getAll();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(`Database error: ${textStatus}`);
    },
  });
}

function deleteDepartment(deptId) {
  $.ajax({
    url: "libs/php/read/getConfirmDelete.php",
    type: "POST",
    dataType: "json",
    data: {
      id: deptId,
    },
    success: function (result) {
      if (result.data[0].deptCount >= 1) {
        alert("You can't delete a Department with Employees linked to it");
      } else {
        $.ajax({
          url: "libs/php/delete/deleteDepartmentByID.php",
          type: "POST",
          dataType: "json",
          data: {
            id: deptId,
          },
          success: function (result) {
            if (result.status.code == 200) {
              console.log("Deleted");
              getDepartments();
            }
          },
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`Database error: ${textStatus}`);
    },
  });
}

function deleteLocation(locId) {
  $.ajax({
    url: "libs/php/delete/deleteLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: locId,
    },
    success: function (result) {
      if (result.status.code == 200) {
        console.log("Deleted");
        getAllLocations();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert(`Database error: ${textStatus}`);
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
