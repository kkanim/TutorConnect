const calender = null;
document.addEventListener("DOMContentLoaded", function () {
  InitCalender();
  fetch("/pages/home/cleanersprofile.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("profilebody").outerHTML = data;
    });

  //populate profit an hour select element
  var select = document.getElementById("profit-an-hour");
  var cedi = "&#8373;";
  for (var i = 5; i <= 50; i += 5) {
    option = document.createElement("option");
    option.value = i;
    option.innerHTML = `${cedi} ${i}`;
    select.options.add(option);
  }
});

function InitCalender() {
  var Calendar = tui.Calendar;
  var newcalendar = new Calendar("#calendar", {
    defaultView: "month",
    useCreationPopup: true,
    useDetailPopup: true,
    calendars: [
      {
        id: "1",
        name: "My Calendar",
        color: "#ffffff",
        bgColor: "#03bd9e",
        dragBgColor: "#03bd9e",
        borderColor: "#03bd9e",
      },
    ],
  });

  newcalendar.createEvents([
    {
      id: "event1",
      calendarId: "cal2",
      title: "Weekly meeting",
      start: new Date(2025, 2, 19, 9, 0, 0), // March is month 2 (0-indexed)
      end: new Date(2025, 2, 30, 10, 0, 0),
    },
    {
      id: "event2",
      calendarId: "cal3",
      title: "Weekly meeting",
      start: new Date(2025, 2, 19, 10, 0, 0), // March is month 2 (0-indexed)
      end: new Date(2025, 2, 19, 10, 0, 0),
    },
    {
      id: "event3",
      calendarId: "cal4",
      title: "Lunch appointment",
      start: new Date(2025, 2, 8, 12, 0, 0), // June is month 5 (0-indexed)
      end: new Date(2025, 2, 8, 13, 0, 0),
    },
    {
      id: "event4",
      calendarId: "cal5",
      title: "Vacation",
      start: new Date(2025, 5, 8), // June is month 5 (0-indexed)
      end: new Date(2025, 5, 10),
      isAllday: true,
      category: "allday",
    },
  ]);
}
