const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const { response } = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
admin.initializeApp();
const db = admin.firestore();

const printError = (error) => {
  console.log("\x1b[31m", error);
  console.log("\x1b[0m");
};

//getMapData
app.get("/mapData", async (request, response) => {
  try {
    const queryParams = request.query;
    const lowerDate = queryParams["lowerDate"].replaceAll("-", "/");
    const upperDate = queryParams["upperDate"].replaceAll("-", "/");
    const reportType = queryParams["reportType"];

    const lowerDateObject = new Date(lowerDate);
    const upperDateObject = new Date(upperDate);

    let docs = undefined;
    (reportType != "TODOS") ?
      (docs = await db.collection("reports").where("tipo_reporte", "==", reportType).get()) :
      (docs = await db.collection("reports").get());
    
    const mapData = [];
    docs.forEach((doc, i) => {
      report = doc.data();
      reportDate = report["fecha_hora"].split(" | ")[0];
      reportDateObject = new Date(reportDate);

      if (reportDateObject >= lowerDateObject && reportDateObject <= upperDateObject) {
        mapData.push({ "lat": report["latitude"], "lng": report["longitude"], "reportType": report["tipo_reporte"] });
      }
    });

    return response.status(200).json(mapData);
  }
  catch (error) {
    printError(error);
    return response.status(500).send(error);
  }
});

//getTypeChartsData
app.get("/typeChartsData", async (request, response) => {
  try {
    const queryParams = request.query;
    const lowerDate = queryParams["lowerDate"].replaceAll("-", "/"); 
    const upperDate = queryParams["upperDate"].replaceAll("-", "/");

    const lowerDateObject = new Date(lowerDate);
    const upperDateObject = new Date(upperDate);

    const docs = await db.collection("reports").get();

    const reportsOnDateRange = [];
    docs.forEach((doc, i) => {
      report = doc.data();
      reportDate = report["fecha_hora"].split(" | ")[0];
      reportDateObject = new Date(reportDate);

      if (reportDateObject >= lowerDateObject && reportDateObject <= upperDateObject) {
        reportsOnDateRange.push(report["tipo_reporte"]);
      }
    });

    const typeChartsData = {
      hurtoViviendaNum: reportsOnDateRange.filter((val) => val === "HURTO_VIVIENDA").length,
      hurtoPersonaNum: reportsOnDateRange.filter((val) => val === "HURTO_PERSONA").length,
      hurtoVehiculoNum: reportsOnDateRange.filter((val) => val === "HURTO_VEHICULO").length,
      vandalismoNum: reportsOnDateRange.filter((val) => val === "VANDALISMO").length,
      violacionNum: reportsOnDateRange.filter((val) => val === "VIOLACION").length,
      homicidioNum: reportsOnDateRange.filter((val) => val === "HOMICIDIO").length,
      agresionNum: reportsOnDateRange.filter((val) => val === "AGRESION").length,
      otroNum: reportsOnDateRange.filter((val) => val === "OTRO").length
    };

    return response.status(200).json(typeChartsData);
  }
  catch(error) {
    printError(error);
    return response.status(500).send(error);
  }
});

//getReportById
app.get("/report/:reportId", async (request, response) => {
  try {
    const doc = await db.collection("reports").doc(request.params.reportId).get();
    const report = doc.data();

    return response.status(200).json(report);
  }
  catch (error) {
    return response.status(500).send(error);
  }
});

exports.app = functions.https.onRequest(app);

exports.getAllReports = functions.https.onRequest((request, response) => {
  const events = admin.firestore().collection("reports");
  events.get().then((querySnapshot) => {
    const tempDoc = [];
    querySnapshot.forEach((doc) => {
      tempDoc.push(doc);
    });
    response.set("Access-Control-Allow-Origin", "*");
    response.send(tempDoc);
  });
});