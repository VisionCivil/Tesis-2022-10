import 'dart:io';

import 'package:bloc/bloc.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:equatable/equatable.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:vision_civil/src/models/report.dart';
import 'package:vision_civil/src/repository/crimeReportRepository/crimeReportsRepository.dart';

part 'reports_event.dart';
part 'reports_state.dart';

class ReportBloc extends Bloc<ReportblocEvent, ReportblocState> {
  ReportBloc()
      : super(ReportblocState(
            reports: [],
            report: new Report("", "", "", "", "", "", "", "", ""),
            imagesIDs: [],
            videoId: "")) {
    on<ReportblocEvent>((event, emit) async {
      if (event is CreateRepotEvent) {
        reportdb.createReport(
            event.tipoReporte,
            event.asunto,
            event.descripcion,
            event.fechaHora,
            event.lat,
            event.lon,
            event.images,
            event.video,
            event.userPhone);
      } else if (event is GetReportsEvent) {
        List<Report> reports = [];
        Future<QuerySnapshot> getReports = reportdb.getReports();
        await getReports.then((QuerySnapshot querySnapshot) {
          querySnapshot.docs.forEach((doc) {
            reports.add(Report(
                doc.id,
                doc["asunto"],
                doc["descripcion"],
                doc["estado"],
                doc["fecha_hora"],
                doc["latitude"],
                doc["longitude"],
                doc["tipo_reporte"],
                doc["user_phone"].toString()));
          });
        });
        emit(ReportblocState(
            reports: reports,
            report: new Report(" ", " ", " ", " ", " ", " ", " ", " ", " "),
            imagesIDs: [],
            videoId: ""));
      } else if (event is GetReportInfoEvent) {
        List<Report> reports = [];
        List<String> arrayIds = [];
        String videoId = " ";
        Report reportSave = new Report("", "", "", "", "", "", "", "", "");
        Future<QuerySnapshot> getreports = reportdb.getReports();
        await getreports.then((QuerySnapshot querySnapshot) {
          querySnapshot.docs.forEach((doc) {
            reports.add(Report(
                doc.id,
                doc["asunto"],
                doc["descripcion"],
                doc["estado"],
                doc["fecha_hora"],
                doc["latitude"],
                doc["longitude"],
                doc["tipo_reporte"],
                doc["user_phone"].toString()));
            if (doc.id == event.idReport) {
              reportSave.setId(doc.id);
              reportSave.setAsunto(doc["asunto"]);
              reportSave.setDescripcion(doc["descripcion"]);
              reportSave.setEstado(doc["estado"]);
              reportSave.setFechaHora(doc["fecha_hora"]);
              reportSave.setLatitude(doc["latitude"]);
              reportSave.setLongitude(doc["longitude"]);
              reportSave.setTipoReporte(doc["tipo_reporte"]);
              reportSave.setUserphone(doc["user_phone"].toString());

              try {
                String imagesids = doc["images_ids"];
                arrayIds = imagesids.split(",");
              } catch (e) {
                print("No tiene imagenes");
              }
              try {
                videoId = doc["video_id"];
              } catch (e) {
                print("No tiene video");
              }
            }
          });
        });

        emit(ReportblocState(
            reports: reports,
            report: reportSave,
            imagesIDs: arrayIds,
            videoId: videoId));
      } else if (event is AsignPoliceReport) {
        reportdb.asignReport(event.idPoliceUser, event.idReport);
      } else if (event is GetPoliceProcessReport) {
        String idReport = "";
        List<Report> reports = [];
        List<String> arrayIds = [];
        String videoId = " ";
        Report reportSave = new Report("", "", "", "", "", "", "", "", "");
        Future<QuerySnapshot> users = reportdb.getUsers();
        await users.then((QuerySnapshot querySnapshot) {
          querySnapshot.docs.forEach((doc) {
            try {
              if (doc.id == event.idPoliceUser) {
                idReport = doc["id_report"];
              }
            } catch (e) {}
          });
        });
        print("encontro el reporte con id: " + idReport);
        Future<QuerySnapshot> getreports = reportdb.getReports();
        await getreports.then((QuerySnapshot querySnapshot) {
          querySnapshot.docs.forEach((doc) {
            reports.add(Report(
                doc.id,
                doc["asunto"],
                doc["descripcion"],
                doc["estado"],
                doc["fecha_hora"],
                doc["latitude"],
                doc["longitude"],
                doc["tipo_reporte"],
                doc["user_phone"].toString()));
            if (doc.id == idReport) {
              reportSave.setId(doc.id);
              reportSave.setAsunto(doc["asunto"]);
              reportSave.setDescripcion(doc["descripcion"]);
              reportSave.setEstado(doc["estado"]);
              reportSave.setFechaHora(doc["fecha_hora"]);
              reportSave.setLatitude(doc["latitude"]);
              reportSave.setLongitude(doc["longitude"]);
              reportSave.setTipoReporte(doc["tipo_reporte"]);
              reportSave.setUserphone(doc["user_phone"].toString());

              try {
                String imagesids = doc["images_ids"];
                arrayIds = imagesids.split(",");
              } catch (e) {
                print("No tiene imagenes");
              }
              try {
                videoId = doc["video_id"];
              } catch (e) {
                print("No tiene video");
              }
            }
          });
        });
        if (idReport != "") {
          emit(ReportblocState(
              reports: reports,
              report: reportSave,
              imagesIDs: arrayIds,
              videoId: videoId));
        } else {
          emit(ReportblocState(
              reports: reports,
              report: new Report(" ", " ", " ", " ", " ", " ", " ", " ", " "),
              imagesIDs: [],
              videoId: ""));
        }
      } else if (event is FinishReportEvent) {
        reportdb.finishReport(event.idPoliceUser, event.idReport);
      } else if (event is DeleteReportEvent) {
        reportdb.deleteReport(event.idReport);
        print("Se elimino el reporte: " + event.idReport);
      } else if (event is FilterReportsEvent) {
        print("Evento: quiere filtrar por estado: " +
            event.estadoReporteFiltro +
            " y tipo: " +
            event.tipoReporteFiltro);
        List<Report> reports = [];
        Future<QuerySnapshot> getReports = reportdb.getReports();
        await getReports.then((QuerySnapshot querySnapshot) {
          querySnapshot.docs.forEach((doc) {
            if (event.estadoReporteFiltro == "Todos" &&
                event.tipoReporteFiltro != "") {
              if (event.tipoReporteFiltro == doc["tipo_reporte"]) {
                reports.add(Report(
                    doc.id,
                    doc["asunto"],
                    doc["descripcion"],
                    doc["estado"],
                    doc["fecha_hora"],
                    doc["latitude"],
                    doc["longitude"],
                    doc["tipo_reporte"],
                    doc["user_phone"].toString()));
              }
            }
            if (event.estadoReporteFiltro != "" &&
                event.tipoReporteFiltro == "Todos") {
              if (event.estadoReporteFiltro == doc["estado"]) {
                reports.add(Report(
                    doc.id,
                    doc["asunto"],
                    doc["descripcion"],
                    doc["estado"],
                    doc["fecha_hora"],
                    doc["latitude"],
                    doc["longitude"],
                    doc["tipo_reporte"],
                    doc["user_phone"].toString()));
              }
            }
            if (event.estadoReporteFiltro != "Todos" &&
                event.tipoReporteFiltro != "Todos") {
              if (event.tipoReporteFiltro == doc["tipo_reporte"] &&
                  event.estadoReporteFiltro == doc["estado"]) {
                reports.add(Report(
                    doc.id,
                    doc["asunto"],
                    doc["descripcion"],
                    doc["estado"],
                    doc["fecha_hora"],
                    doc["latitude"],
                    doc["longitude"],
                    doc["tipo_reporte"],
                    doc["user_phone"].toString()));
              }
            }
            if (event.estadoReporteFiltro == "Todos" &&
                event.tipoReporteFiltro == "Todos") {
              reports.add(Report(
                  doc.id,
                  doc["asunto"],
                  doc["descripcion"],
                  doc["estado"],
                  doc["fecha_hora"],
                  doc["latitude"],
                  doc["longitude"],
                  doc["tipo_reporte"],
                  doc["user_phone"].toString()));
            }
          });
        });

        print(reports);
        emit(ReportblocState(
            reports: reports,
            report: new Report(" ", " ", " ", " ", " ", " ", " ", " ", " "),
            imagesIDs: [],
            videoId: ""));
      }
    });
  }
}
