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
    searching: false,
    aaSorting: [],
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
$("#graphDep").click(function () {
  graphDepartment();
});

$("#graphLoc").click(function () {
  graphLocation();
});

$("#editProfile").click(function () {
  $("input[name='Edit']").removeAttr("readonly");
});

$("#saveProfile").click(function () {
  $("input[name='Edit']").attr("readonly", "readonly");
});

$("#searchText").keyup(function () {
  let txt = $(this).val();
  searchBar(txt);
});

function searchBar(txt) {
  $.ajax({
    url: "libs/php/read/getSearchbar.php",
    type: "POST",
    data: { txt },
    dataType: "json",
    success: function (result) {
      console.log(result);
      $("#employeeList").html("");
      for (let i = 0; i < Object.keys(result.data).length; i++) {
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

$(document).on("click", "#buttonMore", function (e) {
  getEmpDet(
    JSON.stringify(this.value.split(" ")[1]),
    JSON.stringify(this.value.split(" ")[0])
  );
  $("#empModal").modal("show");
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

        $("#employeeList").html("");
        for (let i = 0; i < Object.keys(result.data).length; i++) {
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
        $("#fullName").html(
          `${result["data"][0]["firstName"]} ${result["data"][0]["lastName"]}`
        );
        $("#emailHeader").html(`${result["data"][0]["email"]}`);
        $("#locationHeader").html(`${result["data"][0]["location"]}`);
        $("#firstName").val(result["data"][0]["firstName"]);
        $("#lastName").val(result["data"][0]["lastName"]);
        $("#email").val(result["data"][0]["email"]);
        $("#id").val(result["data"][0]["id"]);
        $("#department").val(result["data"][0]["department"]);
        $("#location").val(result["data"][0]["location"]);
        $("#jobtitle").val(result["data"][0]["jobTitle"]);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log("employee failure");
      console.log(`Database error: ${textStatus}`);
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
