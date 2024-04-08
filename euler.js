let myChart;
function solve() {
  var x0 = parseFloat(document.getElementById("inputX0").value);
  var y0 = parseFloat(document.getElementById("inputY0").value);
  var h = parseFloat(document.getElementById("inputH").value);
  var steps = parseInt(document.getElementById("inputSteps").value);

  // Llamada a la función de Euler con los valores obtenidos
  var numericalResult = eulerMethod(x0, y0, h, steps);
  var numericalResultImprovedEuler = improvedEulerMethod(x0, y0, h, steps);

  //Mandamos llamar a la función que construye y muestra la tabla
  // compareResults(
  //   numericalResult,
  //   numericalResultImprovedEuler,
  //   analyticalSolution
  // );

  //Mandamos llamar a la función que construye y muestra la tabla pero solo para Euler y Euler mejorado

  compareNumericalResults(
    numericalResult,
    numericalResultImprovedEuler,
    analyticalSolution
  );

  // Verificamos si existe ya una tabla para borrarla antes de crear una nueva en la misma referencia
  if (myChart) {
    myChart.destroy();
  }

  //mandamos a crear/actualizar la tabla pasando los resultados de los métodos y funciones necesarias
  // updateChart(
  //   numericalResult,
  //   numericalResultImprovedEuler,
  //   analyticalSolution
  // );

  //mandamos a crear/actualizar la tabla pasando los resultados de los métodos y funciones necesarias solo para Euler y Euler mejorado
  updateNumericalChart(numericalResult, numericalResultImprovedEuler);
}

// Definimos la función diferencial --> aqui obtenemos el valor del input y con ayuda de la librería se interpreta en terminos de "x" y "y"
function f(x, y) {
  var inputFunction = document.getElementById("inputFunction").value;
  return math.evaluate(inputFunction, { x: x, y: y }); // Ecuación diferencial: y' = x^2 + y x+y
}

// Implementación del método de Euler
function eulerMethod(x0, y0, h, steps) {
  var x = x0;
  var y = y0;
  var result = [{ x: x, y: y }];

  for (var i = 1; i <= steps; i++) {
    var slope = f(x, y);
    y = y + h * slope;
    x = x + h;
    result.push({ x: x, y: y });
  }

  return result;
}

// Implementación del método de Euler mejorado
function improvedEulerMethod(x0, y0, h, steps) {
  var x = x0;
  var y = y0;
  var result = [{ x: x, y: y }];

  for (var i = 1; i <= steps; i++) {
    var slope = f(x, y);
    var yPredicted = y + h * slope;
    var slopeImproved = f(x + h, yPredicted);
    y = y + (h * (slope + slopeImproved)) / 2;
    x = x + h;
    result.push({ x: x, y: y });
  }

  return result;
}

// Solución analítica de la ecuación diferencial
function analyticalSolution(x) {
  // Solución problema 1: x * x + y

  // return 3 * Math.exp(x) - x * x - 2 * x - 2;

  // Solución problema 2: 2 * x * y

  var K = Math.exp(1 - 1); // K = e^(1 - 1) = e^0 = 1
  return K * Math.exp(Math.pow(x, 2) - 1);
}

function compareResults(numericalEuler, numericalImprovedEuler, analytical) {
  var table =
    "<table class='table'><thead><tr><th>x</th><th>Euler</th><th>Improved Euler</th><th>Analytical</th><th>Error Absoluto (Euler mejorado)</th><th>Error Relativo (Euler mejorado)</th><th>Error Relativo Porcentual (Euler mejorado)</th></tr></thead><tbody>";

  for (var i = 0; i < numericalEuler.length; i++) {
    var x = numericalEuler[i].x;
    var numericalEulerY = numericalEuler[i].y;
    var numericalImprovedEulerY = numericalImprovedEuler[i].y;
    var analyticalY = analytical(x);

    var absoluteErrorEuler = Math.abs(analyticalY - numericalImprovedEulerY);
    var relativeErrorEuler = Math.abs(
      (analyticalY - numericalImprovedEulerY) / analyticalY
    );
    var relativeErrorPercentageEuler = relativeErrorEuler * 100;

    table +=
      "<tr><td>" +
      x.toFixed(2) +
      "</td><td>" +
      numericalEulerY.toFixed(5) +
      "</td><td>" +
      numericalImprovedEulerY.toFixed(5) +
      "</td><td>" +
      analyticalY.toFixed(5) +
      "</td><td>" +
      absoluteErrorEuler.toFixed(5) +
      "</td><td>" +
      relativeErrorEuler.toFixed(5) +
      "</td><td>" +
      relativeErrorPercentageEuler.toFixed(5) +
      "</td></tr>";
  }

  table += "</tbody></table>";

  document.getElementById("resultsTable").innerHTML = table;
}

//Solo muestra resultado númericos
function compareNumericalResults(numericalEuler, numericalImprovedEuler) {
  var table =
    "<table class='table'><thead><tr><th>x</th><th>Euler</th><th>Improved Euler</th></tr></thead><tbody>";

  for (var i = 0; i < numericalEuler.length; i++) {
    var x = numericalEuler[i].x;
    var numericalEulerY = numericalEuler[i].y;
    var numericalImprovedEulerY = numericalImprovedEuler[i].y;

    table +=
      "<tr><td>" +
      x.toFixed(2) +
      "</td><td>" +
      numericalEulerY.toFixed(5) +
      "</td><td>" +
      numericalImprovedEulerY.toFixed(5) +
      "</td></tr>";
  }

  table += "</tbody></table>";

  document.getElementById("resultsTable").innerHTML = table;
}

function updateChart(
  numericalEuler,
  numericalImprovedEuler,
  analyticalSolution
) {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Extraer los datos de x y y del resultado numérico y la solución analítica
  var xValues = numericalEuler.map((point) => point.x);
  var numericalValuesEuler = numericalEuler.map((point) => point.y);
  var numericalValuesImprovedEuler = numericalImprovedEuler.map(
    (point) => point.y
  );
  var analyticalValues = xValues.map((x) => analyticalSolution(x));

  // Configurar el gráfico de Chart.js con los datos actualizados
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Euler",
          data: numericalValuesEuler,
          borderWidth: 1,
          borderColor: "green",
        },
        {
          label: "Improved Euler",
          data: numericalValuesImprovedEuler,
          borderWidth: 1,
          borderColor: "blue",
        },
        {
          label: "Analytical",
          data: analyticalValues,
          borderWidth: 1,
          borderColor: "red",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function updateNumericalChart(numericalEuler, numericalImprovedEuler) {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Extraer los datos de x y y del resultado numérico y la solución analítica
  var xValues = numericalEuler.map((point) => point.x);
  var numericalValuesEuler = numericalEuler.map((point) => point.y);
  var numericalValuesImprovedEuler = numericalImprovedEuler.map(
    (point) => point.y
  );

  // Configurar el gráfico de Chart.js con los datos actualizados
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Euler",
          data: numericalValuesEuler,
          borderWidth: 1,
          borderColor: "green",
        },
        {
          label: "Improved Euler",
          data: numericalValuesImprovedEuler,
          borderWidth: 1,
          borderColor: "blue",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
