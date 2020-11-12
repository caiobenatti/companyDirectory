let employees;
let xs = [];
let ys = [];
let dataDump;
let charP = [];

$(document).ready(function () {
  $("#selectedColumn").DataTable({
    paging: false,
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

function getAll() {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.status.code == 200) {
        employees = result;
        mainChart();
        updateChart();
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

$(document).on("click", "#buttonMore", function (e) {
  getEmpDet(
    JSON.stringify(this.value.split(" ")[1]),
    JSON.stringify(this.value.split(" ")[0])
  );
  //   console.log(
  //     JSON.stringify(this.value.split(" ")[1]),
  //     JSON.stringify(this.value.split(" ")[0])
  //   );
});

function getEmpDet(firstName, lastName) {
  $.ajax({
    url: "libs/php/getEmpDetails.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: firstName,
      lastName: lastName,
    },
    success: function (result) {
      //console.log("employee details");
      if (result.status.code == 200) {
        console.log(result);
        // emptyTable("#table-details");
        // $("#table-details").append(
        //   '<tr><th align="left" scope="row">ID</th><td id="details-id">' +
        //     result["data"][0]["id"] +
        //     "</td></tr>"
        // );
        // $("#table-details").append(
        //   '<tr><th align="left" scope="row">First name</th><td id="details-first">' +
        //     result["data"][0]["firstName"] +
        //     "</td></tr>"
        // );
        // $("#table-details").append(
        //   '<tr><th align="left" scope="row">Last name</th><td id="details-last">' +
        //     result["data"][0]["lastName"] +
        //     "</td></tr>"
        // );
        // $("#table-details").append(
        //   '<tr><th align="left" scope="row">Email address</th><td id="details-email">' +
        //     result["data"][0]["email"] +
        //     "</td></tr>"
        // );
        // if (result["data"][0]["jobTitle"] == "") {
        //   $("#table-details").append(
        //     '<tr><th align="left" scope="row">Job title</th><td id="details-title">' +
        //       "Unspecified" +
        //       "</td></tr>"
        //   );
        // } else {
        //   $("#table-details").append(
        //     '<tr><th align="left" scope="row">Job title</th><td id="details-title">' +
        //       result["data"][0]["jobTitle"] +
        //       "</td></tr>"
        //   );
        // }
        // $("#table-details").append(
        //   '<tr><th align="left" scope="row">Department</th><td id="details-department">' +
        //     result["data"][0]["department"] +
        //     "</td></tr>"
        // );
        // $("#table-details").append(
        //   '<tr><th align="left" scope="row">Location</th><td id="details-location">' +
        //     result["data"][0]["location"] +
        //     "</td></tr>"
        // );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log("employee failure");
      console.log(`Database error: ${textStatus}`);
    },
  });
  $("#employeeModal").modal("show");
}

// Updates the chart with new information
function updateChart() {
  let myChart = null;
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
          label: `List of employees by branch`,
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
function mainChart() {
  const keyed = employees.data.map((o) => [JSON.stringify([o.department]), o]);
  const map = new Map(
    keyed.map(([key, { department }]) => [key, { department, count: 0 }])
  );
  keyed.forEach(([key, o]) => map.get(key).count++);
  chartP = Array.from(map.values());
  xs = [];
  ys = [];
  chartP.forEach((element) => xs.push(element.department));
  chartP.forEach((element) => ys.push(element.count));
}

getAll();

// $('mainContent').hide();
// $("#login").fadeOut();
// $("mainContent").fadeIn();
